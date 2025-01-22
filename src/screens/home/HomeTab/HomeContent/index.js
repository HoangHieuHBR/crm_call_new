import React, { Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from './styles';
import { CompanyTextTypography } from './component.styles';
import { AutoSizer, List } from 'react-virtualized';
import CallLogCell from '../HomeLeft/CallLogCell';
import {
  Avatar,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress
} from '@material-ui/core';
import SimpleBarHanbiro from '../../../../components/SimpleBarHanbiro';

const ROOM_HEIGHT = 70;
export default function HomeContent(props) {
  const classes = useStyles();
  const data = useSelector(state => state.appUI.selectedCallLog);

  const dispatch = useDispatch();

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

  const list = Array(100)
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

  const renderRow = ({ index, key, style }) => {
    const item = list[index];
    // if (selected) {
    //   readWhisper[item.unique_id] = true;
    // }
    return (
      <CallLogCell
        style={style}
        key={key}
        data={item}
        selected={false}
        onClick={() => {}}
      />
    );
  };

  const renderEmptySelected = () => {
    return <div className={classes.center}>Comming soon</div>;
  };

  return (
    <div className={classes.container}>
      {data?.id == null ? (
        renderEmptySelected()
      ) : data?.name ? (
        <CallLogByNameList
          data={data}
          onScroll={onScroll}
          list={list}
          renderRow={renderRow}
          classes={classes}
        />
      ) : (
        <div className={classes.center}>
          <CircularProgress size={24} />
        </div>
      )}
    </div>
  );
}
class CallLogByNameList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, onScroll, list, renderRow, classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <ListItem className={classes.item}>
            <ListItemIcon>
              <Avatar alt={data?.name} />
            </ListItemIcon>
            <ListItemText
              primary={
                <span className={classes.textUser}>
                  {data?.name}
                  <CompanyTextTypography
                    variant="subtitle2"
                    className={classes.textCompany}
                  >
                    <span>&#8226;</span>
                  </CompanyTextTypography>
                  <CompanyTextTypography
                    variant="subtitle2"
                    className={classes.textCompany}
                  >
                    {data?.company}
                  </CompanyTextTypography>
                </span>
              }
              secondary={
                <React.Fragment>
                  <Typography variant="caption" className={classes.textMessage}>
                    {data?.number}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
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
      </div>
    );
  }
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
