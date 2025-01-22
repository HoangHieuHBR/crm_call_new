import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomSelect from './CustomSelect';
import MenuItem from '@material-ui/core/MenuItem';
import HanTextField from '../HanTextField';
import { isFunction } from 'lodash';
import Select from '@material-ui/core/Select';

const HanSelect = props => {
  const {
    disabled,
    source,
    value: defaultValue,
    onChange,
    fieldTitle,
    fieldValue,
    t
  } = props;

  if (source.length == 0) return <div style={{ height: 41 }}>Loading...</div>;

  const [crrValue, setCrrValue] = React.useState(defaultValue ?? '');

  const handleChange = event => {
    event.stopPropagation();
    setCrrValue(event.target.value);
    if (onChange && isFunction(onChange)) onChange(event.target.value);
  };

  useEffect(() => {
    setCrrValue(defaultValue);
  }, [defaultValue]);

  return (
    <Select
      disabled={disabled}
      value={crrValue}
      style={{ width: '100%', flex: 1 }}
      onChange={handleChange}
      input={<HanTextField />}
    >
      {source.map((e, index) => {
        return (
          <MenuItem key={`select-${index}`} value={e[fieldValue]}>
            {t(e[fieldTitle])}
          </MenuItem>
        );
      })}
    </Select>
  );
};

HanSelect.propTypes = {
  source: PropTypes.array,
  default: PropTypes.bool,
  fieldTitle: PropTypes.string,
  fieldValue: PropTypes.string,
  t: PropTypes.func
};
HanSelect.defaultProps = {
  source: [],
  default: null,
  fieldTitle: 'title',
  fieldValue: 'value',
  t: v => v
};

export default HanSelect;
