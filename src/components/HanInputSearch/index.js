import React, { useState, useEffect } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

import InputBase from '@material-ui/core/InputBase';
import ClearIcon from '@material-ui/icons/Clear';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%'
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clearIcon: {
    cursor: 'pointer',
    right: 0,
    top: 0,
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%'
  }
}));

export default function HanInputSearch(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { defaultValue } = props;
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {}, [value]);

  function keyPress(e) {
    if (e.keyCode == 13) {
      props.onEnter(e.target.value);
    }
  }

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder={t('Search')}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        value={value}
        onKeyDown={keyPress}
        onChange={e => setValue(e.target.value)}
        inputProps={{ 'aria-label': 'search' }}
      />
      {value.length > 0 && (
        <div
          className={classes.clearIcon}
          onClick={() => {
            setValue('');
            if (props?.onClear) props.onClear();
          }}
        >
          <ClearIcon />
        </div>
      )}
    </div>
  );
}

HanInputSearch.propTypes = {
  defaultValue: PropTypes.string
};
HanInputSearch.defaultProps = {
  defaultValue: ''
};
