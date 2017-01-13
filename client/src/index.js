import React from 'react';  
import ReactDOM from 'react-dom';  
import { Provider } from 'react-redux';  
import { createStore, applyMiddleware } from 'redux';  
import { Router, browserHistory } from 'react-router';  
import reduxThunk from 'redux-thunk';  
import routes from './routes';  
import reducers from './reducers/index';  
import { AUTH_USER } from './actions/types';
import cookie from 'react-cookie';  

// Import stylesheets like this, if you choose: import './public/stylesheets/base.scss';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);  
const store = createStoreWithMiddleware(reducers);
const token = cookie.load('token');

if (token) {  
  store.dispatch({ type: AUTH_USER });
}


ReactDOM.render(  
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
    {/** browserHistory, which listens for changes in the address bar, parses the URL, and renders the appropriate component.**/}
  </Provider>,
  document.querySelector('.wrapper'));