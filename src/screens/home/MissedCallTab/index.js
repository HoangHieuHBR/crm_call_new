import React, { Component, useEffect, Fragment } from 'react';
import { useStyles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { CssSelectStyleDL } from './component.styles';
import { AutoSizer, List } from 'react-virtualized';
import SimpleBarHanbiro from '../../../components/SimpleBarHanbiro';
import Cell from './MissedCallLogCell';
import CRMApi from '../../../core/service/vn/server.api';
import { useTranslation } from 'react-i18next';
import {
  countMissedCallRequest,
  cancelCountMissedCallRequest
} from '../../controller';

import {
  MenuItem,
  CircularProgress,
  Checkbox,
  Typography,
  Button,
  Grid,
  Snackbar
} from '@material-ui/core';

const ROOM_HEIGHT = 70;

let uniqueKeyMissedCallList;
let requesting = false;
export default function MissedCallTab() {
  const requireReload = useSelector(state => state.appUI.requiredReload);

  const dispatch = useDispatch();
  const classes = useStyles();
  const [filterConfirm, setFilterConfirm] = React.useState('-1');
  const [filterType, setFilterType] = React.useState('all');
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [openType, setOpenType] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [refresh, setRefresh] = React.useState(0);
  const [maxPageList, setMaxPage] = React.useState(1);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [listMissedCall, setListMissedCall] = React.useState([]);
  const [checkedList, setCheckedList] = React.useState([]);
  const [checkedAll, setCheckedAll] = React.useState(false);
  const [showButtonConfirm, setShowButtonConfirm] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errorSnackbar, setErrorSnackbar] = React.useState('');

  const { t, i18n } = useTranslation();

  const handleClosed = () => {
    setOpenSnackbar(false);
  };

  const showAlert = msg => {
    setErrorSnackbar(msg);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    requesting = false;
    countMissedCallRequest(dispatch);
    return () => {
      requesting = false;
      cancelCountMissedCallRequest();
      CRMApi.cancelRequest(uniqueKeyMissedCallList);
    };
  }, []);

  useEffect(() => {
    onReloadList();
    countMissedCallRequest();
  }, [requireReload]);

  useEffect(() => {
    onReloadList();
  }, [filterConfirm, filterType]);

  async function loadList(page) {
    let isRequesting = requesting;
    if (page == 0) {
      isRequesting = false;
    }

    if (isRequesting) {
      return;
    }

    let list = null;
    requesting = true;
    setPage(page);
    setRefresh(Date.now());

    CRMApi.cancelRequest(uniqueKeyMissedCallList);
    try {
      const direction = filterType != 'all' ? filterType : null;
      const status = filterConfirm != -1 ? filterConfirm : null;
      uniqueKeyMissedCallList = `Missed_Call_${Date.now()}`;

      list = await CRMApi.apiGetMissedCallList({
        cancelToken: uniqueKeyMissedCallList,
        offset: page,
        direction: direction,
        status: status
      });
      requesting = false;
      // setRefresh(Date.now());
      setLoadingMore(false);
    } catch (err) {
      console.log('WTF', err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
      requesting = false;
      // setRefresh(Date.now());
      setLoadingMore(false);
    }

    if (list?.rows) {
      let temp = listMissedCall;
      if (page == 0) {
        temp = [];
      }
      setListMissedCall(temp.concat(list?.rows));
    }
    if (list?.attr) {
      let total = list?.attr?.total ?? 0;
      let maxPage = 1;
      if (total > 30) {
        if (total % 30 == 0) {
          maxPage = total / 30;
        } else {
          maxPage = total / 30 + 1;
        }
      }
      setMaxPage(maxPage);
    }
  }

  /**
   * postMissedCallConfirm
   */

  async function postMissedCallConfirm() {
    let data = false;
    setConfirming(true);
    try {
      uniqueKeyMissedCallList = `Confirm_Missed_Call_${Date.now()}`;
      data = await CRMApi.apiPostConfirmMissedCall({
        cancelToken: uniqueKeyMissedCallList,
        missedCallList: checkedList
      });
      setConfirming(false);
    } catch (err) {
      console.log(err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
      setConfirming(false);
    }

    if (data?.success) {
      countMissedCallRequest(dispatch);

      onReloadList();
      setCheckedList([]);
      setShowButtonConfirm(false);
      setCheckedAll(false);
      showAlert(t('Confirmed Success'));
    } else {
      showAlert(t('Confirmed Fail'));
    }
  }

  /**
   * Action Reload Whisper page
   * @param {*} page
   */
  async function onReloadList() {
    loadList(0);
  }

  const onScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight && scrollHeight - scrollTop == clientHeight) {
      if (page < maxPageList) {
        if (!requesting) {
          const newPage = page + 1;
          setLoadingMore(true);
          loadList(newPage);
        }
      }
    }
  };

  const handleCheckAll = event => {
    let tempCheckedList = [];
    if (event.target.checked) {
      listMissedCall.forEach(item => {
        if (!item.status) {
          tempCheckedList.push(item);
        }
      });
    }
    setCheckedAll(event.target.checked);
    setCheckedList(tempCheckedList);
    setShowButtonConfirm(tempCheckedList.length > 0);
  };

  const handleChangeConfirm = event => {
    setFilterConfirm(event.target.value);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleChangeType = event => {
    setFilterType(event.target.value);
  };
  const handleCloseType = () => {
    setOpenType(false);
  };
  const handleOpenType = () => {
    setOpenType(true);
  };

  const renderRow = ({ index, key, style }) => {
    const loadMore = index == listMissedCall.length;
    if (loadMore) {
      return (
        <div style={style} key={key} className={classes.contentLoadingMore}>
          <CircularProgress size={24} />
        </div>
      );
    }
    const item = listMissedCall[index];
    return (
      <Cell
        style={style}
        key={key}
        data={item}
        userInfo={listMissedCall}
        checkedList={checkedList}
        onClick={() => {
          handleSelectedItem(item);
        }}
      />
    );
  };

  const handleSelectedItem = item => {
    let temp = [...checkedList];
    if (temp) {
      const index = temp?.findIndex(element => element.id == item.id);
      if (index > -1) {
        temp.splice(index, 1);
      } else {
        temp.push(item);
      }
    } else {
      temp.push(item);
    }

    setCheckedList(temp);
    setShowButtonConfirm(temp.length > 0);
  };

  const loading = page <= 0 && requesting;

  return (
    <div className={classes.mainContainer}>
      <div className={classes.rowFilterSelectContainer}>
        <Checkbox
          checked={checkedAll}
          onChange={handleCheckAll}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        <Typography variant="caption" className={classes.textMessage}>
          {t('All')}
        </Typography>
        {showButtonConfirm ? (
          <Button
            variant="contained"
            color="primary"
            onClick={postMissedCallConfirm}
          >
            {confirming ? (
              <Fragment>
                {t('Confirming')}
                <Grid container justify="center" style={{ width: 26 }}>
                  <CircularProgress color="inherit" size={16} />
                </Grid>
              </Fragment>
            ) : (
              t('Confirmed')
            )}
          </Button>
        ) : (
          <div className={classes.dropdownContainer}>
            <CssSelectStyleDL
              id="type_missed_call"
              open={openConfirm}
              variant="outlined"
              onClose={handleCloseConfirm}
              onOpen={handleOpenConfirm}
              value={filterConfirm}
              onChange={handleChangeConfirm}
              style={{
                height: '38px',
                minWidth: 150
              }}
            >
              <MenuItem value={'-1'}>{t('All')}</MenuItem>
              <MenuItem value={'0'}>{t('UnConfirmed')}</MenuItem>
              <MenuItem value={'1'}>{t('Confirmed')}</MenuItem>
            </CssSelectStyleDL>
            <CssSelectStyleDL
              id="demo-controlled-open-select"
              open={openType}
              variant="outlined"
              onClose={handleCloseType}
              onOpen={handleOpenType}
              value={filterType}
              onChange={handleChangeType}
              style={{
                height: '38px',
                minWidth: 150
              }}
            >
              <MenuItem value={'all'}>{t('All')}</MenuItem>
              <MenuItem value={'in'}>{t('Incoming')}</MenuItem>
              <MenuItem value={'out'}>{t('Outgoing')}</MenuItem>
            </CssSelectStyleDL>
          </div>
        )}
      </div>

      {loading ? (
        <div className={classes.center}>
          <CircularProgress size={24} />
        </div>
      ) : (
        <div className={classes.mainList}>
          <ListWrapper
            Row={renderRow}
            onScroll={onScroll}
            itemSize={ROOM_HEIGHT}
            callLogList={listMissedCall}
            loadingMore={loadingMore}
          ></ListWrapper>
        </div>
      )}
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        onClose={() => handleClosed()}
        message={errorSnackbar}
      />
    </div>
  );
}

class ListWrapper extends Component {
  constructor(props) {
    super(props);

    this.parentRef = React.createRef();
    this.listRef = React.createRef();
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.simpleBar = new SimpleBarHanbiro(this.parentRef.current);
  }

  onScroll(e) {
    const { onScroll } = this.props;
    const { scrollTop, scrollLeft } = e.target;
    const { Grid: grid } = this.listRef.current;
    grid.handleScrollEvent({ scrollTop, scrollLeft });
    if (onScroll) {
      onScroll(e);
    }
  }

  render() {
    const { Row, itemSize, callLogList, loadingMore } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => {
          return (
            <div
              ref={this.parentRef}
              onScroll={this.onScroll}
              style={{
                position: 'relative',
                width: width,
                height: height
              }}
            >
              <List
                style={{ overflowX: false, overflowY: false, outline: 'none' }}
                ref={this.listRef}
                height={height}
                rowCount={callLogList.length + (loadingMore ? 1 : 0)}
                rowHeight={itemSize}
                width={width}
                rowRenderer={Row}
              ></List>
            </div>
          );
        }}
      </AutoSizer>
    );
  }
}
