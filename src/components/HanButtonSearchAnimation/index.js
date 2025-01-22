import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
  search: {
    cursor: 'pointer',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',

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
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    paddingRight: 7,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '0',
      '&:focus': {
        paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
        width: 'calc(100ch - 250px)'
      }
    }
  }
}));

export default function HanButtonSearchAnimation(props) {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [isFocus, setIsFocus] = useState(false);

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
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ 'aria-label': 'search' }}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onKeyDown={keyPress}
        onChange={e => setValue(e.target.value)}
      />
      {value.length > 0 && isFocus && (
        <div
          className={classes.clearIcon}
          onClick={() => {
            // setValue('');
            // if (props.onClear) props.onClear();
          }}
        >
          <ClearIcon />
        </div>
      )}
    </div>
  );
}

HanButtonSearchAnimation.propTypes = {
  type: PropTypes.string
};

HanButtonSearchAnimation.defaultProps = {
  type: 'contact'
};
