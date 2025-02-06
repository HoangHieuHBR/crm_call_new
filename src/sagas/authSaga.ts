import { takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';

function* processBeforeNavigateHome() {
  try {
    console.log('Processing navigation to home page...');
    // Perform any logic before navigation (e.g., user authentication checks)
  } catch (error) {
    console.error('Error before navigation:', error);
  }
}

export default function* watchBeforeNavigateHome() {
  yield takeEvery(actionTypes.NAVIGATE_HOME_PAGE, processBeforeNavigateHome);
}

