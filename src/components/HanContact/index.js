import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';
import { isFunction } from 'lodash';
import { CONTACT_TYPES } from '../../configs/constant';
import HanSelect from '../HanSelect';
import {
  getPhoneFromArr,
  getOriginPhoneFromArr
} from '../../utils/array.utils';
import CRMApi from '../../core/service/vn/server.api';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import HanTypeContact from '../HanTypeContact';

import HanAvatar from '../HanAvatar';
import HanInputSearch from '../HanInputSearch';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import 'simplebar';

let contactRequest;
let requesting;
const limit = 20;
export default function HanContact(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const requireReload = useSelector(state => state.appUI.requiredReload);

  const { type, search, onChoose, enableAssignToMe } = props;
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [assignToMe, setAssignToMe] = React.useState(
    (localStorage.getItem('assignToMe') ?? 'false') == 'true'
  );
  const [typeContact, setTypeContact] = useState(
    type == '' || type == null ? 'all' : type
  );
  const [phone, setSearchPhone] = useState(search ?? '');

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [attr, setAttr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foreRefresh, setForeRefresh] = useState(0);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    requesting = false;
    loadData(1);
    props.onRef?.({ setRefresh });
    return () => {
      CRMApi.cancelRequest(contactRequest);
    };
  }, []);

  const setRefresh = () => {
    setForeRefresh(Date.now());
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    loadData(1);
  }, [requireReload]);

  useEffect(() => {
    setData([]);
    setPage(1);
    loadData(1);
  }, [foreRefresh]);

  useEffect(() => {
    setData([]);
    if (page == 1) {
      loadData(page);
    } else {
      setPage(1);
    }
  }, [typeContact, phone, assignToMe]);

  useEffect(() => {
    if (page < 0) {
      return;
    }
    if (attr != null && attr.page != page) {
      loadData(page);
    }
  }, [page]);

  async function loadData(page) {
    if (requesting == false) {
      CRMApi.cancelRequest(contactRequest);
      contactRequest = Date.now();
      requesting = true;
      setLoading(true);
      setLoadMore(page > 1);

      try {
        const rs = await CRMApi.apiGetContacts({
          cancelToken: contactRequest,
          type: typeContact,
          keyword: phone,
          page: page,
          limit: limit,
          assignToMe: enableAssignToMe ? assignToMe : false
        });

        setLoadMore(false);
        setLoading(false);
        requesting = false;
        if (rs.success) {
          if (page == 1) setData(rs.rows);
          else setData(data.concat(rs.rows));
          setAttr(rs.attrs);
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

  function setReset() {
    setPage(1);
    setData([]);
    setAttr(null);
    setSelectedItem(null);
  }

  function loadMoreItems(event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (attr && scrollHeight && scrollHeight - scrollTop == clientHeight) {
      if (requesting) {
        return;
      }
      if (page < attr.total_page) {
        setPage(page + 1);
      }
    }
  }

  const handleListItemClick = item => {
    const newValue =
      selectedItem == null || item.id != selectedItem.id ? item : null;
    setSelectedItem(newValue);
    if (onChoose && isFunction(onChoose)) onChoose(newValue);
  };

  return (
    <div className={classes.wrapperContact}>
      <div className={classes.sectionFilter}>
        <div style={{ width: 160, marginRight: 10 }}>
          <HanSelect
            t={t}
            onChange={value => {
              setReset();
              setTypeContact(value);
            }}
            source={CONTACT_TYPES.source}
            value={typeContact}
            fieldTitle={'title'}
            fieldValue={'value'}
          />
        </div>
        {/*<HanButtonSearchAnimation onEnter={(value) => setSearchPhone(value)}/>*/}
        <HanInputSearch
          defaultValue={phone}
          onEnter={value => setSearchPhone(value)}
          onClear={() => setSearchPhone('')}
        />
        {enableAssignToMe && (
          <FormControlLabel
            style={{ marginLeft: 5, width: 160 }}
            control={
              <Checkbox
                checked={assignToMe}
                onChange={e => {
                  localStorage.setItem('assignToMe', e.target.checked);
                  setAssignToMe(e.target.checked);
                }}
              />
            }
            label={
              <Typography style={{ fontSize: 12 }}>
                {t('Assigned To Me')}
              </Typography>
            }
          />
        )}
      </div>
      <List
        data-simplebar
        className={classes.sectionContentContact}
        onScroll={loadMoreItems}
      >
        <div>
          {data.map((e, index) => {
            return (
              <ListItem
                button
                key={`list-${index}`}
                selected={selectedItem ? selectedItem.id === e.id : false}
                onClick={event => handleListItemClick(e)}
              >
                <HanAvatar
                  iconPhone={true}
                  user={{
                    userAvatar: './images/icon-incoming.png',
                    userName: e?.name ?? '',
                    userCompany: e.type != 'company' ? e.parent_name : '',
                    userPhone: getOriginPhoneFromArr(
                      e.phone_origin,
                      'country',
                      'value'
                    )
                  }}
                />
                <HanTypeContact type={e.type} />
              </ListItem>
            );
          })}
        </div>
      </List>
      {loadMore && loading && (
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

      {loading && page <= 1 && (
        <div className={classes.center}>
          <CircularProgress size={24} />
        </div>
      )}
    </div>
  );
}

HanContact.propTypes = {
  onChoose: PropTypes.func
};
HanContact.defaultProps = {
  onChoose: null
};
