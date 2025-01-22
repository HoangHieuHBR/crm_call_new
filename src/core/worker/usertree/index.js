import PromiseWorker from 'promise-worker';
import Worker from './usertree.worker.js';
const worker = new Worker();
const promiseWorker = new PromiseWorker(worker);

const getTreeOrg = data =>
  promiseWorker.postMessage({
    type: 'getTreeOrg',
    data
  });

const getTreeCached = data =>
  promiseWorker.postMessage({
    type: 'getTreeCached',
    data
  });
export default { getTreeOrg, getTreeCached };
