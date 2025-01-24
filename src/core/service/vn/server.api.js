import * as remote from '@electron/remote';
import Requestor from '../requestor';
import { encryptRsa } from '../../utils/rsa.utils.renderer';
import moment from 'moment';
const scheme = 'http://';

const CATE_ID_CUSTOMER = 400; //customer
const CATE_ID_ACCOUNT = 310; //account // not used

class CRMAPI {
  constructor() {
    this.userKey = '';
    this.jwt = '';
    this.cookies = '';
    this.extendPhone = '';
    this.domain = '';
    this.branches = 'ngw';
    this.cn = '';
    this.userNo = '';
    this.extraInfo = {};
  }

  cancelRequest(token) {
    Requestor.cancelRequest(token);
  }

  isCanceled(error) {
    return Requestor.isCancel(error);
  }

  setupLogger(domain) {
    console.log('setupLogger domain >>>', domain);
    if (window.crmcallRenderLog != null) {
      window.currentDomainLog = `${domain}_render`;
      window.crmcallRenderLog.transports.file.level = 'info';
      window.crmcallRenderLog.transports.file.fileName = `${window.currentDomainLog}.log`;
      window.crmcallRenderLog.transports.file.maxSize = 5242880;
      window.isFileLogger = remote.getGlobal('ShareGlobalObject').isFileLogger;
    }
  }

  updateData(domain, data) {
    if (domain) {
      this.domain = domain;
      this.setupLogger(this.domain);
    }

    this.extraInfo = data ?? {};
    if (data) {
      this.jwt = data.jwt;
      this.cookies = data.cookies;
      this.cn = data.cn;
      this.extendPhone = data.extend;
      this.userNo = data.userno;
    } else {
      this.jwt = '';
      this.cookies = '';
      this.cn = '';
      this.extendPhone = '';
      this.userNo = '';
    }

    remote.getGlobal('ShareGlobalObject').loginGlobal = {
      domain: domain,
      data: data,
    };
  }

  updateDataV2(domain, data) {
    if (domain) {
      this.domain = domain;
      this.setupLogger(this.domain);
    }

    this.extraInfo = data ?? {};

    if (data) {
      this.userKey = data.userkey;
      this.jwt = data.jwt;
      this.cookies = data.session_gw;
      this.cn = this.userKey?.substring(0, 3);
      this.extendPhone = data.localphone;
      this.userNo = this.userKey?.substring(3);
    } else {
      this.jwt = '';
      this.cookies = '';
      this.cn = '';
      this.extendPhone = '';
      this.userNo = '';
      this.userKey = '';
    }

    console.log('updateDataV2', data);

    remote.getGlobal('ShareGlobalObject').loginGlobal = {
      domain: domain,
      data: data,
    };
  }

  updateDataFromRemote() {
    const loginGlobal = remote.getGlobal('ShareGlobalObject').loginGlobal;
    if (loginGlobal?.domain) {
      this.domain = loginGlobal?.domain;
      this.setupLogger(this.domain);
    }

    const data = loginGlobal?.data;

    this.extraInfo = data ?? {};
    if (data) {
      this.jwt = data.jwt;
      this.cookies = data.cookies;
      this.cn = data.cn;
      this.extendPhone = data.extend;
      this.userNo = data.userno;
    } else {
      this.jwt = '';
      this.cookies = '';
      this.cn = '';
      this.extendPhone = '';
      this.userNo = '';
    }
  }

  updateDataFromRemoteV2() {
    const loginGlobal = remote.getGlobal('ShareGlobalObject').loginGlobal;
    if (loginGlobal?.domain) {
      this.domain = loginGlobal?.domain;
      this.setupLogger(this.domain);
    }

    const data = loginGlobal?.data;

    this.extraInfo = data ?? {};
    if (data) {
      this.userKey = data.userkey;
      this.jwt = data.jwt;
      this.cookies = data.cookies;
      this.cn = this.userKey?.substring(0, 3);
      this.extendPhone = data.localphone;
      this.userNo = this.userKey?.substring(3);
    } else {
      this.jwt = '';
      this.cookies = '';
      this.cn = '';
      this.extendPhone = '';
      this.userNo = '';
      this.userKey = '';
    }
  }

  _buildHost() {
    return `${scheme}${this.domain}`;
  }

  _buildParamList(
    limit,
    offset,
    sort,
    order,
    since,
    until,
    date_range,
    type,
    priority,
    customer_name,
    customer_phone,
    staff_name,
    customer_code,
    staff_phone,
    subject,
    context,
    duration,
    status,
    parent_name,
    website,
    direction,
  ) {
    let values = [];
    values.push(`limit=${limit}`);
    values.push(`offset=${offset}`);
    if (sort) {
      values.push(`sort=${sort}`);
    }
    if (order) {
      values.push(`order=${order}`);
    }

    values.push(`since=${since}`);
    values.push(`until=${until}`);

    if (date_range) {
      values.push(`date_range=${date_range}`);
    }

    if (type) {
      values.push(`type=${type}`);
    }

    if (priority) {
      values.push(`priority=${priority}`);
    }

    if (customer_name) {
      values.push(`customer_name=${customer_name}`);
    }

    if (customer_phone) {
      let number = parseInt(customer_phone);
      if (number != null && !isNaN(number)) {
        values.push(`customer_phone=${number}`);
      }
    }

    if (staff_name) {
      values.push(`staff_name=${staff_name}`);
    }

    if (customer_code) {
      values.push(`customer_code=${customer_code}`);
    }

    if (staff_phone) {
      values.push(`staff_phone=${staff_phone}`);
    }

    if (subject) {
      values.push(`subject=${subject}`);
    }

    if (context) {
      values.push(`context=${context}`);
    }

    if (duration) {
      values.push(`duration=${duration}`);
      if (duration == 0 && status) {
        values.push(`status=${status}`);
      }
    }

    if (parent_name) {
      values.push(`parent_name=${parent_name}`);
    }

    if (website) {
      values.push(`website=${website}`);
    }

    if (direction) {
      values.push(`direction=${direction}`);
    }
    return values.join('&');
  }

  async apiGetActivityHistory({
    cancelToken,
    limit,
    offset,
    sort,
    order,
    since,
    until,
    date_range,
    type,
    priority,
    customer_name,
    customer_phone,
    staff_name,
    customer_code,
    staff_phone,
    subject,
    context,
    duration,
    status,
    parent_name,
    website,
    direction,
  }) {
    let paramString = this._buildParamList(
      limit,
      offset,
      sort,
      order,
      since,
      until,
      date_range,
      type,
      priority,
      customer_name,
      customer_phone,
      staff_name,
      customer_code,
      staff_phone,
      subject,
      context,
      duration,
      status,
      parent_name,
      website,
      direction,
    );

    const url = `${this._buildHost()}/${this.branches}/_cti/activity/history/${
      this.cn
    }?${paramString}`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiGetActivitySearch({
    cancelToken,
    limit,
    offset,
    sort,
    order,
    since,
    until,
    date_range,
    type,
    priority,
    customer_name,
    customer_phone,
    staff_name,
    customer_code,
    staff_phone,
    subject,
    context,
    duration,
    status,
    parent_name,
    website,
    direction,
  }) {
    let paramString = this._buildParamList(
      limit,
      offset,
      sort,
      order,
      since,
      until,
      date_range,
      type,
      priority,
      customer_name,
      customer_phone,
      staff_name,
      customer_code,
      staff_phone,
      subject,
      context,
      duration,
      status,
      parent_name,
      website,
      direction,
    );

    const url = `${this._buildHost()}/${this.branches}/_cti/activity/search/${
      this.cn
    }?${paramString}`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiPostConfirmMissedCall({ cancelToken, missedCallList = [] }) {
    let body = new FormData();
    for (let i = 0; i < missedCallList.length; i++) {
      let missedCall = missedCallList[i];
      body.append(`params[${i}][id]`, missedCall.id);
      body.append(`params[${i}][index_number]`, missedCall.index_number);
      body.append(`params[${i}][action]`, 'update');
      body.append(`data[status]`, 1);
    }

    const url = `${this._buildHost()}/${
      this.branches
    }/_cti/activity/call/bulk/${this.cn}`;

    return await Requestor.post(url, body, null, cancelToken);
  }

  async apiGetCountMissedCall({ cancelToken }) {
    let extPhone = this.extendPhone;
    const hasUnderScore = this.extendPhone.includes('_');
    if (hasUnderScore) {
      // 07048049623_702
      const extPhoneArray = this.extendPhone.split('_');
      extPhone = extPhoneArray[extPhoneArray.length - 1];
    } else {
      extPhone = this.extendPhone;
    }
    const url = `${this._buildHost()}/${
      this.branches
    }/_cti/cli/crm_call_app/missed_call2/${
      this.cn
    }?type=call&order=desc&sort=regdate&duration=0&direction=in&status=0&staff_phone=${extPhone}`;

    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiGetPhoneTypes({ cancelToken, language }) {
    const url = `${this._buildHost()}/${
      this.branches
    }/_cti/customer/management/get_cti_contact_label?lang=${language}`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiGetActivityPurposes({ cancelToken, language }) {
    const url = `${this._buildHost()}/${
      this.branches
    }/_cti/customization/options/options_by_category_langcode/${
      this.cn
    }/activity_purposes/${language}`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiGetProducts({ cancelToken }) {
    const url = `${this._buildHost()}/${
      this.branches
    }/_cti/product/management/list_prod/${this.cn}`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiGetContacts({
    cancelToken,
    type,
    keyword,
    limit = 20,
    page = 1,
    sort = 'name',
    order = 'desc',
    assignToMe = false,
  }) {
    let values = [];
    values.push(`type=${type ?? ''}`);
    values.push(`keyword=${keyword}`);
    values.push(`paging=${page},${limit}`);
    values.push(`order=${order}`);
    values.push(`sort=${sort}`);
    if (assignToMe) {
      values.push(`staff_cn=${this.cn}`);
      values.push(`staff_id=${this.userNo}`);
    }
    const paramStrings = values.join('&');
    const url = `${this._buildHost()}/${
      this.branches
    }/_cti/customer/management/search_by/${this.cn}/all?${paramStrings}`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  // customerType : employee , company, contact
  async apiPutRegisterPhone({
    cancelToken,
    customerid,
    customerCode,
    phoneNumber,
    customerType = 'employee',
    phoneType = '1',
    phoneExt = '',
    customerName = '',
  }) {
    const kCountryCode = window.isKoreaMode ? '82' : '84';

    let method = 'put';
    let url = `${this._buildHost()}/${
      this.branches
    }/_cti/customer/management/customer_field/${this.cn}/${
      customerCode ?? ''
    }/phone`;

    let body = new FormData();
    body.append('id', customerid);
    if (customerType == 'employee') {
      body.append('data[label]', phoneType);
      body.append('data[country_code]', kCountryCode);
      body.append('data[phone_number]', phoneNumber);
      body.append('data[cate_id]', CATE_ID_CUSTOMER);
      body.append('data[cn]', this.cn);

      if (phoneType == 1) {
        body.append('data[label_value]', 'Input Manually');
      } else if (phoneType == 3) {
        body.append('data[extension]', phoneExt);
      }
    } else if (customerType == 'company') {
      if (phoneType != '-1') {
        if (customerName != '') {
          // register employee
          method = 'post';
          body.append('name', customerName);
          body.append('phone_data[0][label]', phoneType);
          body.append('phone_data[0][country_code]', kCountryCode);
          body.append('phone_data[0][phone_number]', phoneNumber);
          if (phoneType == 1) {
            body.append('phone_data[0][label_value]', 'Input Manually');
          } else if (phoneType == 3) {
            body.append('phone_data[0][extension]', phoneExt);
          }

          url = `${this._buildHost()}/${
            this.branches
          }/_cti/customer/employee/add/${
            this.cn
          }/${customerCode}/${CATE_ID_CUSTOMER}`;
        } else {
          // register company no name
          body.append('data[label]', phoneType);
          body.append('data[country_code]', kCountryCode);
          body.append('data[phone_number]', phoneNumber);
          body.append('data[cate_id]', CATE_ID_CUSTOMER);
          body.append('data[cn]', this.cn);
          if (phoneType == 1) {
            body.append('data[label_value]', 'Input Manually');
          } else if (phoneType == 3) {
            body.append('data[extension]', phoneExt);
          }
        }
      } else {
        // register company label
        body.append('data[label]', phoneType);
        body.append('data[country_code]', kCountryCode);
        body.append('data[phone_number]', phoneNumber);
        body.append('data[cate_id]', CATE_ID_CUSTOMER);
        body.append('data[cn]', this.cn);
        if (phoneType == 1) {
          body.append('data[label_value]', 'Input Manually');
        } else if (phoneType == 3) {
          body.append('data[extension]', phoneExt);
        }
      }
    } else if (customerType == 'contact') {
      body.append('data[label]', phoneType);
      body.append('data[country_code]', kCountryCode);
      body.append('data[phone_number]', phoneNumber);
      body.append('data[cate_id]', CATE_ID_CUSTOMER);
      body.append('data[cn]', this.cn);
      if (phoneType == 1) {
        body.append('data[label_value]', 'Input Manually');
      } else if (phoneType == 3) {
        body.append('data[extension]', phoneExt);
      }
    } else {
      return null;
    }

    const data = [...body.entries()];
    const asString = data
      .map((x) => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
      .join('&');

    if (method == 'post') {
      return await Requestor.post(
        url,
        asString,
        { 'Content-Type': 'application/x-www-form-urlencoded' },
        cancelToken,
      );
    }

    return await Requestor.put(
      url,
      asString,
      { 'Content-Type': 'application/x-www-form-urlencoded' },
      cancelToken,
    );
  }

  async apiGetUserTree({ cancelToken }) {
    const url = `${this._buildHost()}/${
      this.branches
    }/_cti/account/crm_user/user_tree/user?cn=${this.cn}`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiPostTask({
    cancelToken,
    subject = '',
    staffList = [],
    priority,
    customers = [],
    purposes = [],
    products = [],
    content = '',
    due_date,
  }) {
    const url = `${this._buildHost()}/${this.branches}/_cti/activity/task/${
      this.cn
    }`;
    let body = new FormData();

    if (staffList) {
      for (let i = 0; i < staffList.length; i++) {
        let staff = staffList[i];
        body.append(`staff[${i}][staff_no]`, staff.user_no);
        body.append(`staff[${i}][staff_cn]`, this.cn);
      }
    }

    if (customers) {
      for (let i = 0; i < customers.length; i++) {
        let customer = customers[i];
        let parentname = customer.companyName ?? customer.parentname;
        body.append(`customer[${i}][customer_cn]`, customer.cn);
        body.append(`customer[${i}][customer_code]`, customer.code);
        body.append(`customer[${i}][customer_phone_type]`, 1);
        body.append(`customer[${i}][customer_phone]`, customer.phone);
        body.append(`customer[${i}][parent_name]`, parentname ?? '');
        body.append(`customer[${i}][parent_code]`, customer.parentcode);
        body.append(`customer[${i}][parent_cn]`, customer.parentcn);
        body.append(`customer[${i}][customer_name]`, customer.name ?? 'GUEST');
      }
    }

    if (purposes) {
      for (let i = 0; i < purposes.length; i++) {
        let purpose = purposes[i];
        body.append(`purpose[${i}][id]`, purpose.id);
        body.append(`purpose[${i}][id2]`, purpose.id2 ?? '');
      }
    }

    if (products) {
      for (let i = 0; i < products.length; i++) {
        let product = products[i];
        body.append(`product[${i}][product_cn]`, product.cn);
        body.append(`product[${i}][product_id]`, product.product_id);
        body.append(`product[${i}][product_code]`, product.prod_code);
        body.append(`product[${i}][product_name]`, product.name);
        body.append(`product[${i}][is_group]`, 0);
      }
    }

    body.append('due_date', moment(due_date).format('YYYY-MM-DDT[00:00:00Z]'));
    body.append('priority', priority);
    body.append('subject', subject);
    body.append('content', content);
    body.append('status', 111);

    return await Requestor.post(url, body, null, cancelToken);
  }

  async apiGetStatuses({ cancelToken }) {
    const url = `${this._buildHost()}/${this.branches}/_cti/helpdesk/tickets/${
      this.cn
    }/statuses`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiGetLabel({ cancelToken }) {
    const url = `${this._buildHost()}/${this.branches}/_cti/helpdesk/tickets/${
      this.cn
    }/labels`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  // category: 1
  // status: 3
  // priority: 3
  // subject: 212
  // content: <div class="annie-editor" title="raworigin" checkbox-data="%7B%7D" uniq="1598348892338" style="font-family: 'times new roman', times; font-size: 11pt;"><p style="margin:0;"><span id="_mce_caret" data-mce-bogus="1" data-mce-type="format-caret"><strong>4424324324</strong></span><br data-mce-bogus="1"></p></div>
  // customers: ACCT-6484-17767
  // assignees: 102484
  // due_date: 2020-08-25T00:00:00+07:00
  // label_names: 11+112
  // channels: email:trongnhan136@gmail.com
  // custom_fields: {}

  async apiPostTicket({
    cancelToken,
    category,
    status,
    priority,
    subject,
    content,
    customer,
    assignees,
    label_names,
    phone,
  }) {
    const url = `${this._buildHost()}/${this.branches}/_cti/helpdesk/tickets/${
      this.cn
    }`;
    let body = new FormData();
    body.append('category', category);
    body.append('status', status);
    body.append('priority', priority);
    if (label_names) {
      body.append('label_names', label_names);
    }
    body.append('subject', subject);
    body.append('content', content);
    if (phone) {
      body.append('channels', `phone:${phone}`);
    }

    if (assignees) {
      body.append('assignees', assignees);
    }

    if (customer.type == 'employee') {
      body.append('customers', customer.parentcode);
    } else {
      body.append('customers', customer.code);
    }

    return await Requestor.post(url, body, null, cancelToken);
  }

  async apiPostNewCustomer({
    cancelToken,
    category,
    type,
    state,
    mode = 'create',
    name,
    phone,
    email = '',
    phonetype = '1',
    phoneext = '',
    withoutPhone = true,
  }) {
    const kCountryCode = window.isKoreaMode ? '82' : '84';

    const url = `${this._buildHost()}/${
      this.branches
    }/_cti/customer/management/customer`;
    let body = new FormData();
    body.append('type', type);
    body.append('category', category);
    body.append('state', state);
    body.append('mode', mode);
    body.append('name', name);

    if (!withoutPhone) {
      body.append('phone_data[0][label]', phonetype);
      body.append('phone_data[0][country_code]', kCountryCode);
      body.append('phone_data[0][phone_number]', phone);
      if (phonetype == 1) {
        body.append('phone_data[0][label_value]', 'Input Manually');
      } else if (phonetype == 3) {
        body.append('phone_data[0][extension]', phoneext);
      }
    }

    body.append('extra_data[email][0][label]', 3);
    body.append('extra_data[email][0][value]', email);

    return await Requestor.post(url, body, null, cancelToken);
  }

  async apiPostLanguage({ cancelToken, language }) {
    const url = `${this._buildHost()}/${this.branches}/org/user/setting`;
    let body = new FormData();
    body.append('_slidebar_data[template_language]', language);
    return await Requestor.post(url, body, null, cancelToken);
  }

  async apiGetMissedCallList({
    cancelToken,
    offset,
    limit = 30,
    status,
    direction,
  }) {
    let values = [];
    values.push(`offset=${offset}`);
    values.push(`limit=${limit}`);
    values.push(`order=desc`);
    values.push(`sort=regdate`);
    values.push(`duration=0`);
    const hasUnderScore = this.extendPhone.includes('_');
    if (hasUnderScore) {
      // 07048049623_702
      const extPhoneArray = this.extendPhone.split('_');
      const extPhone = extPhoneArray[extPhoneArray.length - 1];
      values.push(`staff_phone=${extPhone}`);
    } else {
      values.push(`staff_phone=${this.extendPhone}`);
    }
    if (status) {
      values.push(`status=${status}`);
    }
    if (direction) {
      values.push(`direction=${direction}`);
    }
    const paramStrings = values.join('&');

    const url = `${this._buildHost()}/${this.branches}/_cti/activity/history/${
      this.cn
    }?type=call&${paramStrings}`;

    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiGetHistoryDetail({ cancelToken, type, selectedId }) {
    let url = '';
    if (type == 'email') {
      // url = `${this._buildHost()}/cgi-bin/NEW/mailTohtml5.do?act=crmmailview&timeuuid=${selectedId}`;
      url = `${this._buildHost()}/email/crm/getmail/${selectedId}?auth_key=${
        this.jwt
      }`;
    } else {
      url = `${this._buildHost()}/${this.branches}/activity/${type}/${
        this.cn
      }/${selectedId}`;
    }
    return await Requestor.get(url, null, null, cancelToken);
  }

  apiGetLinkDownloadFile({ url }) {
    const link = `${this._buildHost()}${url}&auth_key=${this.jwt}`;
    return link;
  }

  async apiPostHistoryCall({
    cancelToken,
    historyID,
    purposes = [],
    customer = {},
    products = [],
    content,
    subject,
    priority,
    duration = 10,
    createDate,
    callId,
    direction = 'INBOUND',
  }) {
    let url = `${this._buildHost()}/${this.branches}/_cti/activity/call/${
      this.cn
    }`;
    if (historyID) {
      url = `${url}?id=${historyID}`;
    }

    let body = new FormData();
    body.append(`staff[0][staff_no]`, this.userNo);
    body.append(`staff[0][staff_cn]`, this.cn);
    body.append(`staff[0][staff_name]`, this.extraInfo?.username);
    body.append(`staff[0][staff_phone]`, this.extendPhone);

    if (purposes) {
      for (let i = 0; i < purposes.length; i++) {
        let purpose = purposes[i];
        body.append(`purpose[${i}][id]`, purpose.id);
        body.append(`purpose[${i}][id2]`, purpose.id2 ?? '');
      }
    }

    if (customer) {
      let parentname = customer.companyName ?? customer.parentname;
      body.append(`customer[0][customer_cn]`, customer.cn ?? this.cn);
      body.append(`customer[0][customer_code]`, customer.code ?? '');
      body.append(`customer[0][customer_phone]`, customer.phone ?? '');
      body.append(`customer[0][customer_name]`, customer.name ?? 'GUEST');
      body.append(`customer[0][parent_name]`, parentname ?? '');
    }

    if (historyID) {
      body.append(`content`, content);
      body.append(`subject`, subject);
      body.append(`priority`, priority);
      body.append(`duration`, duration);
      body.append(`direction`, direction == 'INBOUND' ? 'in' : 'out');
      body.append(`group_call`, callId);
      // body.append(`group_call`, `_${this.extendPhone}_${customer?.phone}`);
      body.append(`callid`, callId);
    } else {
      body.append(`cn`, this.cn);
      body.append(`group_call`, callId);
      // body.append(`group_call`, `_${this.extendPhone}_${customer?.phone}`);
      body.append(`callid`, callId);
      // body.append(`regdate`, createDate);
      body.append(`date_time`, createDate);
      body.append(`priority`, priority);
      body.append(`category`, '');
      body.append(`duration`, duration);
      body.append(`direction`, direction == 'INBOUND' ? 'in' : 'out');
      body.append(`content`, content);
      body.append(`subject`, subject);
      if (products) {
        for (let i = 0; i < products.length; i++) {
          let product = products[i];
          body.append(`product[${i}][product_cn]`, product.cn);
          body.append(`product[${i}][product_id]`, product.product_id);
          body.append(`product[${i}][product_code]`, product.prod_code);
          body.append(`product[${i}][product_name]`, product.name);
          body.append(`product[${i}][is_group]`, 0);
        }
      }
    }

    return await Requestor.post(url, body, null, cancelToken);
  }

  async apiGetCustomerCalls({ cancelToken, page }) {
    let values = [];
    values.push(`page=${page}`);
    values.push(`page_size=30`);
    values.push(`sort_col=last_stage_date`);
    values.push(`sort_order=desc`);
    values.push(`staff_cn=${this.cn}`);
    values.push(`staff_no=${this.userNo}`);
    values.push(`stages[]=general`);
    values.push(`stages[]=potential`);
    values.push(`stages[]=lead`);
    values.push(`stages[]=general`);
    values.push(`types[]=company`);
    values.push(`types[]=contact`);
    const paramStrings = values.join('&');
    const url = `${this._buildHost()}/${
      this.branches
    }/_cti/customer/search/advanced?extra_opt=all&${paramStrings}`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  async apiGetCategories({ cancelToken }) {
    const url = `${this._buildHost()}/${this.branches}/_cti/helpdesk/tickets/${
      this.cn
    }/categories`;
    return await Requestor.get(url, null, null, cancelToken);
  }

  photoURL() {
    const date = moment().format('YYYY-MM-DD');

    const url = `${this._buildHost()}/${this.branches}/org/user/photo/no/${
      this.userNo
    }/cn/${this.cn}/thumb/1?t=${date}`;
    return url;
  }

  async postLoginAuth({ cancelToken, domain, userid, password, otpcode }) {
    let url = `${scheme}${domain}/${this.branches}/sign/auth`;
    console.log('postLoginAuth', url);
    if (otpcode) {
      url = url + '?step=2&is_checking_otp=1';
    }
    let body = new FormData();
    body.append(`gw_id`, encryptRsa(userid));
    body.append(`gw_pass`, encryptRsa(password));
    body.append(`method`, 'crmcall');
    body.append(`token`, '');
    body.append(`code`, otpcode ?? '');
    return await Requestor.post(url, body, null, cancelToken);
  }

  async checkServerXMLExist({ domain, callback, cancelToken }) {
    this._resolveDNSFromHost({
      scheme: 'http://',
      domain: domain,
      cancelToken: cancelToken,
      callback: (response, error) => {
        // console.log(response, error);
        if (error) {
          this._resolveDNSFromHost({
            scheme: 'https://',
            domain: domain,
            cancelToken: cancelToken,
            callback: (response, error) => {
              console.log(response, error);
              if (error || (error == null && response == null)) {
                callback(false);
              } else {
                callback(true);
              }
            },
          });
        } else {
          if (error || (error == null && response == null)) {
            callback(false);
          } else {
            callback(true);
          }
        }
      },
    });
  }

  async _resolveDNSFromHost({ scheme, domain, callback, cancelToken }) {
    var url =
      scheme +
      domain +
      '/winapp/hcsong/crmcall/' +
      domain +
      `/server.xml?t=${Date.now()}`;
    console.log('start request:' + url);
    try {
      const response = await Requestor.get(url, null, null, cancelToken, null);
      callback(response, null);
    } catch (error) {
      if (Requestor.isCancel(error)) {
        console.log('Request canncelled');
        return;
      }
      callback(null, error);
    }
  }
}

const crmAPI = new CRMAPI();
export default crmAPI;
