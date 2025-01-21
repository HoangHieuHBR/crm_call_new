import moment from 'moment';
import { ACTIVITIES } from '../configs/constant';

export function getItemFromArr(arr, field, value) {
  const result = arr.find(e => e[field] === value);
  return result;
}

export function getPhoneFromArr(
  arr,
  field,
  charJoin = '-',
  defaultvalue = '...'
) {
  if (arr && arr.length === 0) return defaultvalue;
  const rsArr = [];
  arr.forEach(e => {
    rsArr.push(e[field]);
  });
  return rsArr.join(charJoin);
}

export function getOriginPhoneFromArr(
  arr,
  field1,
  field2,
  charJoin = ', ',
  defaultvalue = '...'
) {
  if (arr && arr.length === 0) return defaultvalue;
  const rsArr = [];
  arr.forEach(e => {
    rsArr.push(`${e[field1]}${e[field2]}`);
  });
  return rsArr.join(charJoin);
}

const formatDate = 'YYYY-MM-DD';

export function getParamsSearch(
  from = null,
  to = null,
  priority = null,
  activity = null,
  nameStaff = null,
  ext = null,
  history = null,
  content = null,
  nameContact = null,
  phone = null,
  code = null,
  company = null
) {
  const searchParams = {};
  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  if (from) searchParams.since = moment(from).format(formatDate);
  else searchParams.since = moment(firstDay).format(formatDate);
  if (to) searchParams.until = moment(to).format(formatDate);
  else searchParams.until = moment(lastDay).format(formatDate);

  if (priority) searchParams.priority = priority == '0' ? '' : priority;
  else searchParams.priority = '';
  if (activity) searchParams.type = activity;
  else searchParams.type = ACTIVITIES.default;
  if (nameStaff) searchParams.staff_name = nameStaff;
  if (ext) searchParams.staff_phone = ext;
  if (history) searchParams.subject = history;
  if (content) searchParams.context = content;

  if (nameContact) searchParams.customer_name = nameContact;
  if (phone) searchParams.customer_phone = phone;
  if (code) searchParams.customer_code = code;
  if (company) searchParams.parent_name = company;

  return searchParams;
}
