import * as constantsApp from '../../../configs/constant';
class CRMCallData {
  constructor() {
    this.profileMap = {};
    this.staffOnlineList = [];
    this.purposes = [];
    this.categories = [];
    this.phoneTypes = null;
    this.products = [];
    this.userTree = [];
    this.userCached = {};
    this.statuses = [];
    this.labels = [];
  }

  toMap() {
    return {
      profileMap: this.profileMap,
      staffOnlineList: this.staffOnlineList,
      purposes: this.purposes,
      categories: this.categories,
      phoneTypes: this.phoneTypes,
      products: this.products,
      userTree: this.userTree,
      statuses: this.statuses,
      labels: this.labels,
      userCached: this.userCached
    };
  }

  handleEventData(data) {
    // console.log('handleEventData', data);
    const callid = data.callid;
    const eventId = data.eventId;

    if (eventId == constantsApp.EVENT_ID_USER_INFO) {
      if (callid) {
        this.profileMap[callid] = data.data;
        this.trimProfileData();
      }
    } else if (eventId == constantsApp.EVENT_ID_EXTEND_ONLINE) {
      this.staffOnlineList = data.data;
    } else if (eventId == constantsApp.EVENT_ID_ALl_GLOBAL_CONFIG) {
      if (data.purposes) {
        this.purposes = data.purposes;
      }
      if (data.categories) {
        this.categories = data.categories;
      }

      if (data.phoneTypes) {
        this.phoneTypes = data.phoneTypes;
      }

      if (data.products) {
        this.products = data.products;
      }

      if (data.userTree) {
        this.userTree = data.userTree;
      }

      if (data.userCached) {
        this.userCached = data.userCached;
      }

      if (data.statuses) {
        this.statuses = data.statuses;
      }

      if (data.labels) {
        this.labels = data.labels;
      }
    }
  }

  removeProfile(callId) {
    if (callId) {
      delete this.profileMap[callId];
    }
  }

  trimProfileData() {
    var size = Object.keys(this.profileMap).length;
    if (size >= 100) {
      var i = 0;
      for (var key in this.profileMap) {
        delete this.profileMap[key];
        i++;
        if (i >= 50) {
          break;
        }
      }
    }
  }

  clearAllData() {
    this.profileMap = {};
    this.staffOnlineList = [];
    this.purposes = [];
    this.categories = [];
    this.phoneTypes = null;
    this.products = [];
    this.userTree = [];
    this.statuses = [];
    this.labels = [];
    this.userCached = {};
  }
}

const _crmCallData = new CRMCallData();
export default _crmCallData;
