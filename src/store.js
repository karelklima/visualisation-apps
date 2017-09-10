import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerForBrowser } from 'redux-little-router';

import apps from './apps';
import Examples from './components/Examples';

const baseRoutes = {
  '/': {
    title: 'Visualization Apps',
    component: Examples
  }
};

const routes = Object.keys(apps).reduce((routes, key) => ({
  ...routes,
  [`/${key}`]: {
    title: apps[key].title,
    component: apps[key].component
  }
}), baseRoutes);

const router = routerForBrowser({ routes });

const baseReducerSpec = {
  router: router.reducer
};

const reducerSpec = Object.keys(apps).reduce((spec, key) => ({
  ...spec,
  [key]: apps[key].reducer
}), baseReducerSpec);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers(reducerSpec),
  composeEnhancers(
    router.enhancer,
    applyMiddleware(
      router.middleware,
      createSagaMiddleware()
    )
  )
);

export default store;