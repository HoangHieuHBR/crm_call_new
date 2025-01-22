import React, {useEffect} from "react";
import HanDatePicker from "./";
import _ from "lodash";
import moment from "moment";

const formatDate = 'YYYY-MM-DD';
export default function HanRangeDatePicker(props) {

  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const [fromDate, setFromDate] = React.useState(firstDay);
  const [toDate, setToDate] = React.useState(lastDay);
  useEffect(() => {
    if (props.onChange && _.isFunction(props.onChange)) props.onChange({
      fromDate: moment(fromDate).format(formatDate),
      toDate: moment(toDate).format(formatDate)
    });
  }, [fromDate, toDate])

  function handleChangeDate(date, isFromDate) {
    if (isFromDate) setFromDate(date);
    else setToDate(date);


  }

  return <div style={{display: 'flex', justifyContent: 'center'}}>
    <HanDatePicker defaultValue={fromDate} maxDate={toDate} onChangeDate={date => handleChangeDate(date, true)}/>
    <div style={{width: 50, textAlign: 'center', display: 'block'}}>~</div>
    <HanDatePicker minDate={fromDate} defaultValue={toDate} onChangeDate={date => handleChangeDate(date, false)}/>
  </div>
}
