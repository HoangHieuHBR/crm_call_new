import React, { useEffect, useState, Component } from 'react';
import PropTypes from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';
import HanTextField from '../HanTextField';
import HanModal from '../HanModal';
import Button from '@material-ui/core/Button';
import _, { isFunction } from 'lodash';
import ListItem from '@material-ui/core/ListItem';
import { AutoSizer, List } from 'react-virtualized';
import SimpleBarHanbiro from '../SimpleBarHanbiro';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { useStyles } from './styles';

const HanAutoCompleted = props => {
  const classes = useStyles();
  const { source, fieldValue, fieldTitle, onChange, value, label, t } = props;
  const [data, setData] = React.useState(source ?? []);
  const [dataSearch, setDataSearch] = React.useState(source ?? []);
  const [selectedItems, setSelectedItems] = React.useState(value ?? []);
  const [selectedItemsTemp, setSelectedItemsTemp] = React.useState(value ?? []);
  const [open, setOpen] = React.useState(false);
  const [valueAdd, setValueAdd] = React.useState('');

  const valueAddRef = React.createRef();

  const handleDelete = chipToDelete => () => {
    setSelectedItemsTemp(selectedItemsTemp =>
      selectedItemsTemp.filter(chip => chip.key !== chipToDelete.key)
    );
  };

  useEffect(() => {
    if (valueAdd) {
      let listSearch = data.filter(value =>
        value[fieldTitle].toLowerCase().includes(valueAdd.toLowerCase())
      );
      setDataSearch([...listSearch]);
    } else {
      setDataSearch(data);
    }
  }, [valueAdd]);

  useEffect(() => {
    setData(source);
    setDataSearch(source);
    setSelectedItems(value ?? []);
  }, [source]);

  useEffect(() => {
    if (onChange && _.isFunction(onChange)) onChange(selectedItems);
  }, [selectedItems]);

  function handleListItemClick(item) {
    const exist = selectedItemsTemp.filter(
      e =>
        (e.value[fieldValue] ? e.value[fieldValue] : e.value) ==
        item[fieldValue]
    );

    if (exist.length == 0) {
      let chipItem = { key: selectedItemsTemp.length, value: item };
      setSelectedItemsTemp(selectedItemsTemp.concat(chipItem));
    }
  }

  const handleClose = () => {
    setSelectedItemsTemp(selectedItems);
    setOpen(false);
  };
  const handleOk = () => {
    console.log('setSelectedItems', selectedItemsTemp);
    setSelectedItems(selectedItemsTemp);
    setOpen(false);
  };
  const handleAddClick = () => {
    let chipItem = { key: selectedItemsTemp.length, value: valueAdd };

    setSelectedItemsTemp(selectedItemsTemp.concat(chipItem));

    setValueAdd('');
    valueAddRef.current.focus();
  };
  const handleAutoCompleted = () => {
    setValueAdd('');
    valueAddRef.current.focus();
  };

  const onScroll = e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
  };

  function renderModalFooter() {
    return (
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button variant="outlined" onClick={handleOk}>
          {t('Ok')}
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
    const item = dataSearch[index];
    return (
      <ListItem
        button
        style={style}
        key={key}
        selected={false}
        onClick={event => handleListItemClick(item)}
      >
        <ListItemText primary={item[fieldTitle]} />
      </ListItem>
    );
  };

  let display =
    selectedItems.length > 0
      ? selectedItems.map(e => e.value[fieldTitle] ?? e.value).join(', ')
      : null;

  return (
    <div>
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
        <div
          style={{
            width: '100%',
            height: 400,
            padding: 10,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {selectedItemsTemp.length > 0 ? (
            <Paper component="ul" className={classes.root}>
              {selectedItemsTemp.map(data => {
                return (
                  <li key={data.key}>
                    <Chip
                      label={
                        data.value[fieldTitle]
                          ? data.value[fieldTitle]
                          : data.value
                      }
                      onDelete={handleDelete(data)}
                      className={classes.chip}
                    />
                  </li>
                );
              })}
            </Paper>
          ) : (
            <div>
              <HanTextField
                disabled={true}
                placeholder={t('Please select items')}
              />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 10
            }}
          >
            <HanTextField
              inputRef={valueAddRef}
              value={valueAdd}
              endAdornment={
                <IconButton
                  disabled={!valueAdd}
                  onClick={valueAdd ? handleAddClick : null}
                >
                  <AddIcon />
                </IconButton>
              }
              onChange={event => {
                setValueAdd(event.target.value);
              }}
            />
          </div>
          <div
            style={{
              height: '100%',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 10
            }}
          >
            <ListWrapper
              Row={renderRow}
              onScroll={onScroll}
              itemSize={50}
              list={dataSearch}
              loadingMore={false}
            />
          </div>

          {}
        </div>
      </HanModal>
    </div>
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

HanAutoCompleted.propTypes = {
  source: PropTypes.array,
  default: PropTypes.bool,
  fieldTitle: PropTypes.string,
  fieldValue: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.array,
  label: PropTypes.string,
  t: PropTypes.func
};
HanAutoCompleted.defaultProps = {
  source: [],
  default: null,
  fieldTitle: 'title',
  fieldValue: 'value',
  onChange: null,
  label: '',
  value: [],
  t: v => v
};

export default HanAutoCompleted;
