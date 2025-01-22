import * as Actions from '../actions';
import CRMApi from '../core/service/vn/server.api';
import * as ipc from '../utils/ipc';
import * as constantApp from '../configs/constant';
import userTreeWorker from '../core/worker/usertree';

let homeTokenRequest;
let countMissedCallTokenRequest;
export async function startGetGlobalConfig(
  dispatch,
  language,
  callId,
  forceRefresh
) {
  cancelGetGlobalConfig();
  const allGlobalCallConfig = ipc.sendIPCSync(
    constantApp.ACTION_SYNC_GET_GLOBAL_CALL_CONFIG,
    null
  );

  let purposes = null;
  let categories = null;
  let phoneTypes = null;
  let products = null;
  let userTree = null;
  let statuses = null;
  let labels = null;
  let userCached = null;

  if (
    forceRefresh ||
    allGlobalCallConfig.purposes == null ||
    allGlobalCallConfig.purposes.length <= 0
  ) {
    try {
      homeTokenRequest = `startGetGlobalConfig_${Date.now()}`;
      purposes = await CRMApi.apiGetActivityPurposes({
        cancelToken: homeTokenRequest,
        language: language
      });
    } catch (err) {
      console.log(err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
    }
  }

  if (
    forceRefresh ||
    allGlobalCallConfig.categories == null ||
    allGlobalCallConfig.categories?.length <= 0
  ) {
    try {
      homeTokenRequest = `startGetGlobalConfig_${Date.now()}`;
      categories = await CRMApi.apiGetCategories({
        cancelToken: homeTokenRequest
      });
    } catch (err) {
      console.log(err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
    }
  }

  if (
    forceRefresh ||
    allGlobalCallConfig.phoneTypes == null ||
    allGlobalCallConfig.phoneTypes?.length <= 0
  ) {
    try {
      homeTokenRequest = `startGetGlobalConfig_${Date.now()}`;
      phoneTypes = await CRMApi.apiGetPhoneTypes({
        cancelToken: homeTokenRequest,
        language: language
      });
    } catch (err) {
      console.log(err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
    }
  }

  if (constantApp.DISABLE_PRODUCT_TICKET == false) {
    if (
      forceRefresh ||
      allGlobalCallConfig.products == null ||
      allGlobalCallConfig.products?.length <= 0
    ) {
      try {
        homeTokenRequest = `startGetGlobalConfig_${Date.now()}`;
        products = await CRMApi.apiGetProducts({
          cancelToken: homeTokenRequest
        });
      } catch (err) {
        console.log(err);
        if (CRMApi.isCanceled(err)) {
          return;
        }
      }
    }
  }

  if (
    forceRefresh ||
    allGlobalCallConfig.userTree == null ||
    allGlobalCallConfig.userTree?.length <= 0
  ) {
    try {
      homeTokenRequest = `startGetGlobalConfig_${Date.now()}`;
      userTree = await CRMApi.apiGetUserTree({
        cancelToken: homeTokenRequest
      });
    } catch (err) {
      console.log(err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
    }
  }

  if (
    forceRefresh ||
    allGlobalCallConfig.statuses == null ||
    allGlobalCallConfig.statuses?.length <= 0
  ) {
    try {
      homeTokenRequest = `startGetGlobalConfig_${Date.now()}`;
      statuses = await CRMApi.apiGetStatuses({
        cancelToken: homeTokenRequest
      });
    } catch (err) {
      console.log(err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
    }
  }

  if (
    forceRefresh ||
    allGlobalCallConfig.labels == null ||
    allGlobalCallConfig.labels?.length <= 0
  ) {
    try {
      homeTokenRequest = `startGetGlobalConfig_${Date.now()}`;
      labels = await CRMApi.apiGetLabel({
        cancelToken: homeTokenRequest
      });
    } catch (err) {
      console.log(err);
      if (CRMApi.isCanceled(err)) {
        return;
      }
    }
  }

  let data = {
    ...allGlobalCallConfig,
    eventId: constantApp.EVENT_ID_ALl_GLOBAL_CONFIG
  };

  if (purposes?.rows) {
    data.purposes = purposes.rows.filter(
      item => item.content != null && item.content != ''
    );
  }

  if (categories?.categories) {
    data.categories = categories?.categories;
  }

  if (products?.rows) {
    data.products = products?.rows;
  }

  if (statuses?.statuses) {
    data.statuses = statuses?.statuses;
  }

  if (userTree?.rows) {
    const tree = await userTreeWorker.getTreeOrg(userTree?.rows);
    const treeCached = await userTreeWorker.getTreeCached({
      data: userTree?.rows,
      userCached: userCached
    });
    data.userTree = tree;
    data.userCached = treeCached;
  }

  if (labels?.labels) {
    data.labels = labels?.labels;
  }

  if (phoneTypes?.address || phoneTypes?.website) {
    data.phoneTypes = {
      address: phoneTypes?.address ?? {},
      website: phoneTypes?.website ?? {}
    };
  }
  ipc.updateCRMCallData(data);

  let currentProfile = null;

  if (callId && data.profileMap) {
    currentProfile = data.profileMap[callId];
  }

  dispatch(Actions.requestGlobalCallDataUpdate(data, callId, currentProfile));
}

export function cancelGetGlobalConfig() {
  CRMApi.cancelRequest(homeTokenRequest);
}

export function cancelCountMissedCallRequest() {
  CRMApi.cancelRequest(countMissedCallTokenRequest);
}

export async function countMissedCallRequest(dispatch) {
  try {
    cancelCountMissedCallRequest();
    countMissedCallTokenRequest = `countmissedcall_${Date.now()}`;
    let countMissedCall = await CRMApi.apiGetCountMissedCall({
      cancelToken: countMissedCallTokenRequest
    });
    if (countMissedCall?.success) {
      dispatch(Actions.updateUnreadCount(countMissedCall?.count ?? 0));
    }
  } catch (err) {
    if (CRMApi.isCanceled(err)) {
      return;
    }
  }
}
