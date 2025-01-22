import React, { Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from './styles';
import { CssSelectStyleDL } from './component.styles';
import { AutoSizer, List } from 'react-virtualized';
import SimpleBarHanbiro from '../../../../components/SimpleBarHanbiro';
import CallLogCell from './CallLogCell';
import * as Actions from '../../../../actions';

import { MenuItem, CircularProgress } from '@material-ui/core';

const ROOM_HEIGHT = 70;
export default function HomeLeft() {
  const classes = useStyles();
  const [filter, setFilter] = React.useState('all');
  const [open, setOpen] = React.useState(false);
  const selectedCallLog = useSelector(state => state.appUI.selectedCallLog);
  const [page, setPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState(1);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [requesting, setRequesting] = React.useState(false);

  const dispatch = useDispatch();
  const listRef = React.createRef();
  const containerRef = React.createRef();
  const parentRef = React.createRef();

  const onScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight && scrollHeight - scrollTop == clientHeight) {
      // if (page < maxPage) {
      //   const newPage = page + 1;
      //   setLoadingMore(true);
      //   setPage(newPage);
      //   loadList(newPage, keyword);
      // }
    }
  };

  const list = Array(1000)
    .fill()
    .map((val, idx) => {
      // tạo data mẫu
      return {
        id: idx,
        name: 'Michael',
        type_call: idx % 2 == 0,
        company: 'QT Company',
        image: '',
        number: '0648568254'
      };
    });

  const handleChange = event => {
    setFilter(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const renderRow = ({ index, key, style }) => {
    const item = list[index];
    const selected = item.id == selectedCallLog?.id;
    // if (selected) {
    //   readWhisper[item.unique_id] = true;
    // }
    return (
      <CallLogCell
        style={style}
        key={key}
        data={item}
        selected={selected}
        onClick={() => {
          dispatch(Actions.openCallLogByName(item));
        }}
      />
    );
  };

  return (
    <div className={classes.homeLeftContainer}>
      <div className={classes.dropdownContainer}>
        <CssSelectStyleDL
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={filter}
          onChange={handleChange}
        >
          <MenuItem value={'all'}>All</MenuItem>
          <MenuItem value={'incoming'}>Incoming</MenuItem>
          <MenuItem value={'outgoing'}>Outgoing</MenuItem>
        </CssSelectStyleDL>
      </div>
      {false ? (
        <div className={classes.center}>
          <CircularProgress size={24} />
        </div>
      ) : (
        <div className={classes.mainList}>
          <ListWrapper
            Row={renderRow}
            onScroll={onScroll}
            itemSize={ROOM_HEIGHT}
            callLogList={list}
            loadingMore={false}
          ></ListWrapper>
        </div>
      )}
      {/* <div className={classes.content}>
        <div className={classes.layout}>
          <div className={classes.mainList} ref={containerRef}>
            <AutoSizer>
              {({ width, height }) => {
                return (
                  <div
                    ref={parentRef}
                    onScroll={onScroll}
                    style={{
                      position: 'relative',
                      width: width,
                      height: height
                    }}
                  >
                    <List
                      style={{
                        overflowX: false,
                        overflowY: false,
                        outline: 'none'
                      }}
                      ref={listRef}
                      width={width}
                      height={height}
                      rowHeight={ROOM_HEIGHT}
                      rowRenderer={renderRow}
                      rowCount={list.length}
                    />
                  </div>
                );
              }}
            </AutoSizer>
          </div>
        </div>
      </div> */}
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
