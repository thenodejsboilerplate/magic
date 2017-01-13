import axios from 'axios';  
import { browserHistory } from 'react-router';  
import cookie from 'react-cookie';  
import { AUTH_USER,  
         AUTH_ERROR,
         UNAUTH_USER,
         PROTECTED_TEST } from './types';

const SERVER_URL = 'http://localhost:8000/api';
const API_URL = 'http://localhost:8080'

export function errorHandler(dispatch, error, type) {  
  let errorMessage = '';

  if(error.data.error) {
    errorMessage = error.data.error;
  } else if(error.data){
    errorMessage = error.data;
  } else {
    errorMessage = error;
  }

  if(error.status === 401) {
    dispatch({
      type: type,
      payload: 'You are not authorized to do this. Please login and try again.'
    });
    logoutUser();
  } else {
    dispatch({
      type: type,
      payload: errorMessage
    });
  }
}

export function loginUser({ email, password }) {  
  return function(dispatch) {
    axios.post(`${SERVER_URL}/auth/login`, { email, password })
    .then(response => {
      cookie.save('token', response.data.token, { path: '/'});
      dispatch({ type: AUTH_USER });
      window.location.href = API_URL + '/dashboard';
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
  };
}

export function registerUser({ email, username, password }) {  
  return function(dispatch) {
    axios.post(`${SERVER_URL}/auth/register`, { email, username, password })
    .then(response => {
      cookie.save('token', response.data.token, { path: '/' });
      dispatch({ type: AUTH_USER });
      window.location.href = API_URL + '/dashboard';
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR)
    });
  };
}

export function logoutUser() {  
  return function (dispatch) {
    dispatch({ type: UNAUTH_USER });
    cookie.remove('token', { path: '/' });

    window.location.href = API_URL + '/login';
  };
}

export function protectedTest() {  
  return function(dispatch) {
    axios.get(`${SERVER_URL}/auth/protected`, {
      headers: { 'Authorization': cookie.load('token') }
    })
    .then(response => {
      dispatch({
        type: PROTECTED_TEST,
        payload: response.data.content
      });
    })
    .catch((error) => {
      errorHandler(dispatch, error.response, AUTH_ERROR);
    });
  };
}





//We set up an error handler, which will dispatch our authentication error messages to our store and even log our user out on a 401 response (unauthorized). 
//We are using axios to send a POST request to our API, with the request body being the form inputs (in object form). 

//we save the JSON Web Token response we get from our API in a cookie in the event that we have a successful request and reach our .then(). We also dispatch an action with the type AUTH_USER, which will tell our reducer to update our state, saying the user is now authenticated. Then we redirect the user to the dashboard.

//Our protectedTest() action creator is sending a GET request to our API's /protected endpoint, which requires a valid JWT to be sent in the authorization header in order to send back a response. Note how we send the authorization header with this request. Additionally, the response is being dispatched in the payload. Keep in mind, our protected route is sending a JSON response. The key we set it up to send was content. You will be able to access your API responses in other requests in the same way (response.data.yourKeyName).