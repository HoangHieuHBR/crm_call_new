// // @flow
// import configureStoreDev from './configureStore.dev';
// import configureStoreProd from './configureStore.prod';

// const selectedConfigureStore =
//   process.env.NODE_ENV === 'production'
//     ? configureStoreProd
//     : configureStoreDev;

// export const {
//   configureStore,
//   history,
//   sagaMiddleware
// } = selectedConfigureStore;


import { configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers';
import rootSaga from '../sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export default store;
