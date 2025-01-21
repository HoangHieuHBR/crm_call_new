// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import auth from './auth';
import setting from './setting';
import staff from './staff';
import call from './call';
import appUI from './app.ui.state';

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    auth,
    setting,
    staff,
    call,
    appUI
  });
}
