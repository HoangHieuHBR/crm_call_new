import React, { useState, Component } from 'react';
import { useSelector } from 'react-redux';
import HanModal from '../../../../components/HanModal';
import { useStyles } from '../styles';
import { Button, ListItem, ListItemText } from '@material-ui/core';
import { AutoSizer, List } from 'react-virtualized';
import SimpleBarHanbiro from '../../../../components/SimpleBarHanbiro';
import CRMApi from '../../../../core/service/vn/server.api';
import * as ipc from '../../../../utils/ipc';
import { useTranslation } from 'react-i18next';

export default function Transfer(props) {
  const { t } = useTranslation();
  const onlineStaffList = useSelector(state => state.staff.onlineStaffList);
  const userCached = useSelector(state => state.staff.userCached);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const { onClose, open, phone } = props;
  const classes = useStyles();
  const handleClose = () => {
    onClose(false);
  };

  function renderModalFooter() {
    return (
      <div>
        <Button variant="outlined" onClick={handleClose}>
          {t('Close')}
        </Button>
        {selectedStaff && (
          <Button
            variant="outlined"
            onClick={() => {
              const data = {
                from: CRMApi.extendPhone,
                to: selectedStaff.extend,
                phone: phone,
                callid: window.callID
              };
              ipc.requestTransferCall(data);
            }}
          >
            {t('Transfer')}
          </Button>
        )}
      </div>
    );
  }

  const renderRow = ({ index, key, style }) => {
    const item = onlineStaffList[index];

    let groupName = item.group_name;
    let nameUser = item.name_user;
    if (!groupName && !nameUser && item.staff_no) {
      let user = userCached?.mapUser[item.staff_no];
      const groupID = user?.group_id;
      let group = groupID ? userCached?.mapGroup[groupID] : null;
      groupName = group?.title ?? '';
      nameUser = user?.title ?? '';
    }

    return (
      <ListItem
        button
        onClick={() => {
          setSelectedStaff(item);
        }}
        divider={true}
        selected={selectedStaff?.extend == item.extend}
        key={key}
        style={style}
        disabled={item.extend == CRMApi.extendPhone}
      >
        <ListItemText
          primary={`${nameUser} (${item.extend})`}
          secondary={groupName}
        ></ListItemText>
      </ListItem>
    );
  };

  return (
    <HanModal
      label={'Tranfer'}
      open={open}
      size={'md'}
      onClose={handleClose}
      modalFooter={renderModalFooter}
      static
    >
      <div className={classes.wrapperAddTaskTicket}>
        <ListWrapper
          Row={renderRow}
          itemSize={70}
          onlineStaffList={onlineStaffList}
        />
      </div>
    </HanModal>
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
    const { Row, itemSize, onlineStaffList } = this.props;
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
                rowCount={onlineStaffList?.length}
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
