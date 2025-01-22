import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CRMApi from '../../core/service/vn/server.api';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import _ from 'lodash';
import { useStyles } from './styles';
import moment from 'moment-timezone';
import HanAvatar from '../HanAvatar';
import HanTypeActivity from '../HanTypeActivity';
import { UserIcon } from '../HanSVGIcon';
import HanCallDetail from '../../components/HanCallDetail';
import clsx from 'clsx';
import { ACTIVITIES } from '../../configs/constant';
import { useTranslation } from 'react-i18next';
import 'simplebar';
import CircularProgress from '@material-ui/core/CircularProgress';

let historyRequest;
let requesting;
const defaultLimit = 20;
const defaultOffset = 0;
const configCol = {
  fix: {
    name: { width: 220 },
    activity: { width: 80 },
    staff: { width: 100 },
    subject: { flex: 1 }
  },
  auto: {
    name: { flex: 1, minWidth: 220 },
    activity: { flex: 1, minWidth: 80 },
    staff: { flex: 1, minWidth: 100 },
    subject: { flex: 1 }
  }
};

export default function HanHistory(props) {
  const { t, i18n } = useTranslation();
  const init = {
    limit: defaultLimit,
    offset: defaultOffset,
    sort: null,
    order: null,
    since: '',
    until: '',
    date_range: '',
    type: ACTIVITIES.defaultCall,
    priority: '',
    customer_name: '',
    customer_phone: '',
    staff_name: '',
    customer_code: '',
    staff_phone: '',
    subject: '',
    context: '',
    duration: '',
    status: '',
    parent_name: '',
    website: '',
    direction: ''
  };

  const requireReload = useSelector(state => state.appUI.requiredReload);

  const { isAutoSize, initParams } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [data, setData] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [dataCall, setDataCall] = useState(null);

  const [params, setParams] = useState(
    initParams ? { ...init, ...initParams } : init
  );
  const [attr, setAttr] = useState(null);
  const colWidth = configCol[isAutoSize ? 'auto' : 'fix'];
  useEffect(() => {
    requesting = false;
    loadData();
    props.onRef?.({ onSearch, onRefresh });
    return () => {
      CRMApi.cancelRequest(historyRequest);
      props.onRef?.(null);
    };
  }, []);

  useEffect(() => {
    onRefresh();
  }, [requireReload]);

  useEffect(() => {
    if (
      (params.isRefresh && params.isRefresh == true) ||
      (attr != null && attr.offset != params.offset)
    ) {
      loadData();
    }
  }, [params]);

  async function loadData() {
    if (requesting == false) {
      setParams({ ...params, isRefresh: false });
      CRMApi.cancelRequest(historyRequest);
      historyRequest = Date.now();
      requesting = true;
      setLoading(true);
      setLoadMore(params.offset > 0);
      try {
        const rs = await CRMApi.apiGetActivityHistory({
          cancelToken: historyRequest,
          ...params
        });

        setLoadMore(false);
        setLoading(false);
        requesting = false;
        if (rs.rows && rs.attr) {
          if (rs?.attr?.offset == '0') setData(rs.rows);
          else setData(data.concat(rs.rows));
          setAttr(rs.attr);
        }
      } catch (e) {
        requesting = false;
        if (CRMApi.isCanceled(e)) {
          return;
        }
        setLoadMore(false);
        setLoading(false);
        setReset();
      }
    }
  }

  function setReset(newParams = null) {
    if (newParams) setParams(newParams);
    else setParams(init);
    setData([]);
    setAttr(null);
  }

  function onSearch(paramsSearch) {
    if (paramsSearch) {
      setReset({
        ...params,
        ...paramsSearch,
        limit: defaultLimit,
        offset: defaultOffset,
        isRefresh: true
      });
    }
  }

  function onRefresh() {
    setReset({
      ...params,
      limit: defaultLimit,
      offset: defaultOffset,
      isRefresh: true
    });
  }

  function loadMoreItems(event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (attr && scrollHeight && scrollHeight - scrollTop == clientHeight) {
      if (requesting) {
        return;
      }
      if (attr && params && attr.total > params.offset) {
        let newOffset = params.offset + params.limit;
        if (newOffset < attr.total) {
          setParams({ ...params, offset: newOffset });
        }
      }
    }
  }

  //TO DO CALL DETAIL
  // GET API
  function handleListItemClick(e) {
    setOpenDetail(true);
    setDataCall(e);
  }

  function renderItemHistoryTitle() {
    return (
      <div className={clsx(classes.wrapperHistory, classes.trHistory)}>
        <div style={colWidth.name} className={classes.thHistory}>
          {t('Name')}
        </div>
        <div style={colWidth.activity} className={classes.thHistoryCenter}>
          {t('Activity')}
        </div>
        <div style={colWidth.staff} className={classes.thHistory}>
          {t('Staff')}
        </div>
        <div style={colWidth.subject} className={classes.thHistory}>
          {t('Subject')}
        </div>
      </div>
    );
  }

  const formatTimeWithTimeZone = (time, timezone) => {
    if (timezone) {
      return time && time != ''
        ? moment(time, 'YYYY-MM-DDTHH:mm:ssZ')
          .tz(timezone)
          .format('YYYY/MM/DD HH:mm')
        : '';
    }
    return time && time != '' ? moment(time).format('YYYY/MM/DD HH:mm') : '';
  };

  function renderItemHistory(item) {
    const listCustomer = item?.customer ?? [];
    let customer = null;
    if (_.isArray(listCustomer)) customer = listCustomer[0];
    else customer = listCustomer;

    const curTimezone = item.time_zone;

    return (
      <div className={classes.wrapperHistory}>
        <div style={colWidth.name}>
          {customer != null && (
            <HanAvatar
              iconPhone={false}
              user={{
                userAvatar: './images/icon-incoming.png',
                userName:
                  customer.customer_name && customer.customer_name != ''
                    ? customer.customer_name
                    : t('Unknown'),
                userCompany:
                  customer.parent_name && customer.parent_name != ''
                    ? customer.parent_name
                    : '',
                userPhone: formatTimeWithTimeZone(item.date_time, curTimezone)
              }}
            />
          )}
        </div>
        <div style={colWidth.activity} className={classes.sectionActivity}>
          <HanTypeActivity type={item.type} />
        </div>
        <div style={colWidth.staff} className={classes.sectionStaff}>
          <UserIcon />
          <span className={classes.sectionNameStaff}>{item.author_name}</span>
        </div>
        <div style={colWidth.subject} className={classes.sectionSubject}>
          <p className={classes.sectionContentSubject}>{item.subject}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 500
      }}
    >
      {renderItemHistoryTitle()}

      <List
        data-simplebar
        onScroll={loadMoreItems}
        style={{ width: '100%', height: 'calc(100% - 50px)', overflow: 'auto' }}
      >
        <div>
          {data.map((e, index) => {
            return (
              e.type == 'holiday' ? null : <ListItem
                button
                key={e.id ?? index}
                onClick={event => handleListItemClick(e)}
              >
                {renderItemHistory(e)}
              </ListItem>
            );
            // return (
            //   <ListItem
            //     button
            //     key={e.id ?? index}
            //     onClick={event => handleListItemClick(e)}
            //   >
            //     {renderItemHistory(e)}
            //   </ListItem>
            // );
          })}
        </div>
      </List>

      {loadMore && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress size={24} />
        </div>
      )}
      {openDetail && (
        <HanCallDetail
          data={dataCall}
          open={openDetail}
          handleClose={value => setOpenDetail(false)}
        />
      )}
      {loading && !attr && (
        <div className={classes.center}>
          <CircularProgress size={24} />
        </div>
      )}
    </div>
  );
}

HanHistory.propTypes = {
  onChoose: PropTypes.func,
  isAutoSize: PropTypes.bool
};
HanHistory.defaultProps = {
  onChoose: null,
  isAutoSize: false
};
