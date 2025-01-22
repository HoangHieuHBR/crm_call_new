import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useStyles } from './styles';
import _ from 'lodash';

export { default as HanRangeDatePicker } from './HanRangeDatePicker';
const HanDatePicker = props => {
  const [selectedDate, setSelectedDate] = React.useState(
    props.defaultValue ? new Date(props.defaultValue) : new Date()
  );
  const classes = useStyles();
  const handleDateChange = date => {
    setSelectedDate(date);
    if (props.onChangeDate && _.isFunction(props.onChangeDate))
      props.onChangeDate(date);
  };
  const propsCustom = {};
  if (props.maxDate) propsCustom.maxDate = props.maxDate;
  if (props.minDate) propsCustom.minDate = props.minDate;
  return (
    <KeyboardDatePicker
      {...propsCustom}
      style={{ flex: 1, width: '100%', margin: 0 }}
      margin="normal"
      format="dd/MM/yyyy"
      value={selectedDate}
      inputVariant="outlined"
      InputLabelProps={{ shrink: true }}
      InputProps={{ className: classes.textField }}
      onChange={handleDateChange}
      KeyboardButtonProps={{
        'aria-label': 'change date'
      }}
    />
  );
};

HanDatePicker.propTypes = {
  source: PropTypes.array,
  scrollable: PropTypes.bool,
  vertical: PropTypes.bool,
  widthDefaultTab: PropTypes.number
};
HanDatePicker.defaultProps = {
  source: [],
  scrollable: true,
  vertical: false,
  widthDefaultTab: 150
};

export default HanDatePicker;
