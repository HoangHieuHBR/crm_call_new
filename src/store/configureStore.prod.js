// import { createStore, applyMiddleware } from 'redux';
// import createSagaMiddleware from 'redux-saga';
// import { createHashHistory } from 'history';
// import { routerMiddleware } from 'connected-react-router';
// import createRootReducer from '../reducers';

// const sagaMiddleware = createSagaMiddleware();
// const history = createHashHistory();
// const rootReducer = createRootReducer(history);
// const router = routerMiddleware(history);
// const enhancer = applyMiddleware(sagaMiddleware, router);

// function configureStore(initialState = {}) {
//   return createStore(rootReducer, initialState, enhancer);
// }

// export default { configureStore, history, sagaMiddleware };

import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createHashHistory } from 'history';
import { createLogger } from 'redux-logger';
import createRootReducer from '../reducers';

const history = createHashHistory();
const sagaMiddleware = createSagaMiddleware();
const rootReducer = createRootReducer();

const configureStore = (initialState = {}) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Saga Middleware
  middleware.push(sagaMiddleware);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // Redux DevTools Configuration
  const actionCreators = {}; // Update if needed
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        actionCreators,
      })
    : compose;

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('../reducers').default),
    );
  }

  return store;
};

export default { configureStore, history, sagaMiddleware };
