import React, { useEffect, useState, Component } from 'react';
import PropTypes from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import HanModal from '../HanModal';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { AutoSizer, List } from 'react-virtualized';
import SimpleBarHanbiro from '../SimpleBarHanbiro';
import Tooltip from '@material-ui/core/Tooltip';

const HanMultiSelect = props => {
  const { source, fieldValue, fieldTitle, onChange, value, label, t } = props;
  const [data, setData] = React.useState(source ?? []);
  const [selectedItems, setSelectedItems] = React.useState(value ?? []);
  const [selectedItemsTemp, setSelectedItemsTemp] = React.useState(value ?? []);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setData(source);
    setSelectedItems(value ?? []);
  }, [source]);

  useEffect(() => {
    if (onChange && _.isFunction(onChange)) onChange(selectedItems);
  }, [selectedItems]);

  function handleListItemClick(item) {
    const filtered = _.filter(
      selectedItemsTemp,
      e => e[fieldValue] != item[fieldValue]
    );

    if (filtered.length == selectedItemsTemp.length) {
      setSelectedItemsTemp(selectedItemsTemp.concat(item));
    } else {
      setSelectedItemsTemp(filtered);
    }
  }

  const handleClose = () => {
    setSelectedItemsTemp(selectedItems);
    setOpen(false);
  };
  const handleOk = () => {
    setSelectedItems(selectedItemsTemp);
    setOpen(false);
  };

  const onScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
  };

  function renderModalFooter() {
    return (
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button variant="outlined" onClick={handleOk}>
          {t('OK')}
        </Button>
        <Button
          variant="outlined"
          onClick={handleClose}
          style={{ marginLeft: 20 }}
        >
          {t('Close')}
        </Button>
      </div>
    );
  }

  const renderRow = ({ index, key, style }) => {
    const item = data[index];
    return (
      <ListItem
        button
        style={style}
        key={key}
        selected={false}
        onClick={event => handleListItemClick(item)}
      >
        <ListItemIcon>
          <Checkbox
            checked={
              _.findIndex(
                selectedItemsTemp,
                o => o[fieldValue] == item[fieldValue]
              ) > -1
            }
          />
        </ListItemIcon>
        <ListItemText primary={item[fieldTitle]} />
      </ListItem>
    );
  };

  let display =
    selectedItems.length > 0
      ? selectedItems.map(e => e[fieldTitle]).join(', ')
      : null;

  return (
    <>
      <Button
        variant="outlined"
        style={{ width: '100%', height: 35 }}
        onClick={() => setOpen(true)}
      >
        <Tooltip
          disableHoverListener={display ? false : true}
          title={display ?? ''}
          aria-label={display ?? ''}
        >
          <span
            style={{
              display: 'block',
              textTransform: 'none',
              textAlign: 'left',
              width: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {display ?? t('Select items')}
          </span>
        </Tooltip>
      </Button>
      <HanModal
        label={label}
        open={open}
        size={'xs'}
        onClose={handleClose}
        modalFooter={renderModalFooter}
      >
        <div style={{ width: '100%', height: 350, padding: 10 }}>
          <ListWrapper
            Row={renderRow}
            onScroll={onScroll}
            itemSize={60}
            list={data}
            loadingMore={false}
          />
        </div>
      </HanModal>
    </>
  );
};

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
    const { Row, itemSize, list } = this.props;
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
                rowCount={list.length}
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

HanMultiSelect.propTypes = {
  source: PropTypes.array,
  default: PropTypes.bool,
  fieldTitle: PropTypes.string,
  fieldValue: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.array,
  label: PropTypes.string,
  t: PropTypes.func
};
HanMultiSelect.defaultProps = {
  source: [],
  default: null,
  fieldTitle: 'title',
  fieldValue: 'value',
  onChange: null,
  label: '',
  value: [],
  t: v => v
};

export default HanMultiSelect;
