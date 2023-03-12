import { applyMiddleware, compose, createStore } from 'redux';
import reducers from '../reducers/index';
import thunkMiddleware from 'redux-thunk';
import { startNotificationListener } from '../actions/counts';

const middlewares = [thunkMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	reducers,
	composeEnhancers(applyMiddleware(...middlewares))
);
startNotificationListener.start(store.dispatch);

export default store;
