import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { useStyles } from './styles';
import _ from 'lodash';

const HanDateTimePicker = props => {
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
    <KeyboardDateTimePicker
      {...propsCustom}
      style={{ width: '100%', margin: 0 }}
      margin="normal"
      format="dd/MM/yyyy HH:mm"
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

HanDateTimePicker.propTypes = {
  source: PropTypes.array,
  scrollable: PropTypes.bool,
  vertical: PropTypes.bool,
  widthDefaultTab: PropTypes.number
};
HanDateTimePicker.defaultProps = {
  source: [],
  scrollable: true,
  vertical: false,
  widthDefaultTab: 150
};

export default HanDateTimePicker;
