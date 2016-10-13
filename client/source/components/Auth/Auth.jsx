import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

// Axios 
var axios = require('axios'); 

/************************************************************
*****************    AWS COGNITO CONFIG    ******************
************************************************************/
var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var USER_POOL_APP_CLIENT_ID = '3998t3ftof3q7k5f0cqn260smk';
var USER_POOL_ID = 'us-west-2_P8tGz1Tx6';
var COGNITO_IDENTITY_POOL_ID = 'us-west-2:ea2abcb1-10a0-4964-8c13-97067e5b50bb';
AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: COGNITO_IDENTITY_POOL_ID
});


var Auth = {
  createUser(token, userAttributes) {
    console.log('sending create user request');

    axios.post(`/user/signup`, { 
      createdAt: userAttributes[2].Value,
      username: userAttributes[3].Value,
      firstname: userAttributes[4].Value,
      lastname: userAttributes[5].Value,
      email: userAttributes[6].Value,
      token: token
    })
    .then(function(response) {
      console.log('RESPONSE CREATE USER: ', response); 
    })
    .catch(function(error) {
      console.log(error); 
    });
  },

  setUserToken(token, userAttributes) {
    console.log('sending request to set user token');

    axios.post(`/user/login`, { 
      token: token,
      username: userAttributes[3].Value
    })
    .then(function(response) {
      console.log('RESPONSE LOG IN USER: ', response); 
      // browserHistory.push(`/User/${requestUsername}`);
    })
    .catch(function(error) {
      console.log(error); 
    }); 
  },

  /************************************************************
  *****************    SIGN UP A NEW USER    ******************
  ************************************************************/
  signUpUser (user, d) {
    var poolConfig = { UserPoolId: USER_POOL_ID, ClientId: USER_POOL_APP_CLIENT_ID };
    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
    var currentTime = Date.now().toString();

    var prefUsername = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute({Name: 'preferred_username', Value: user.username});
    var firstname = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute({Name: 'given_name', Value: user.firstname});
    var lastname = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute({Name: 'family_name', Value: user.lastname});
    var email = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute({Name: 'email', Value: user.email});
    var timeStamp = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute({Name: 'updated_at', Value: currentTime});

    var attList = [];
    attList.push(prefUsername, firstname, lastname, email, timeStamp);

    var setUserState = function(token, userAttributes) {
      d.setState({ userID: userAttributes[0].Value, username: userAttributes[3].Value, token: token, password: null });
      Auth.createUser(token, userAttributes);
      browserHistory.push(`/User/${userAttributes[3].Value}`);
    }.bind(d); 

    userPool.signUp(user.username, user.password, attList, null, function(error, result) {
      if (error) { console.log('Error signing up user: ', error); }

      var cognitoUser = result.user;
      var authData = { Username: user.username, Password: user.password };

      var authDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
      
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: function (authResult) {
          var token = authResult.getAccessToken().getJwtToken();

          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
            Logins: { 'token': token }
          });

          cognitoUser.getUserAttributes(function(error, userAttributes) {
            if (error) { console.log('error in getUserAttributes: ', error); } 
            setUserState(token, userAttributes);
          });

        },
        onFailure: function(error) {
          console.log('Error authenticating user: ' + error);
          alert(error);
        }
      });
    });
  },

  /************************************************************
  /**************    LOG IN EXISTING USER    ******************
  NOTE: After user has been authenticated, we need to remove 
        their password from the state! 
  ALSO: Need to add auth token to our user db on login
  ALSO: Need to set up error messages, input box highlighting
        on incorrect username/password or user non-existent
  ************************************************************/
  loginUser (user, d) {
    console.log('LOGGING USER IN FUNCTION: ');
    console.log('this: ', d);
    // console.log(user); 
    var authData = { Username: user.username, Password: user.password };
    var authDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
    var poolConfig = { UserPoolId: USER_POOL_ID, ClientId: USER_POOL_APP_CLIENT_ID };
    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
    var userData = { Username: user.username, Pool: userPool };
    var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);

    var setUserState = function(token, userAttributes) {
      // console.log(userAttributes); 
      // console.log('USERNAME: ', userAttributes[3].Value); 
      d.setState({ userID: userAttributes[0].Value, username: userAttributes[3].Value, token: token, password: null }); 
      Auth.setUserToken(token, userAttributes);
      browserHistory.push(`/User/${userAttributes[3].Value}`);
    }.bind(d); 
    
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function (authResult) {
        var token = authResult.getAccessToken().getJwtToken();

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
          Logins: {'token': token }
        });

        cognitoUser.getUserAttributes(function(error, userAttributes) {
          if (error) { console.log('error in getUserAttributes: ', error); } 
          setUserState(token, userAttributes);
        });
      },
      onFailure: function(error) {
        console.log('Error authenticating user: ', error);
        alert(error);
      }
    });
  },

  /************************************************************
  /******************    LOG OUT USER    **********************
  ************************************************************/
  logOutUser (user, d) {
    // console.log("before logout: ", window.AWS.config.credentials);

    var poolData = { UserPoolId: USER_POOL_ID, ClientId: USER_POOL_APP_CLIENT_ID };
    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = { Username: user.username, Pool: userPool };
    var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);

    axios.post(`/user/logout`, { 
      username: user.username
    }).then(function(response) {
      // console.log('RESPONSE LOG OUT USER: ', response); 
      // browserHistor  y.push(`/User/${requestUsername}`);
    }).catch(function(error) {
      console.log('error logging out: ', error); 
    });

    cognitoUser.signOut();
    console.log('logged out user: ', cognitoUser);

    d.setState({username: null, password: null, userID: null, token: null });

    window.AWS.config.credentials.params.IdentityPoolId = '';
    window.AWS.config.credentials.params.Logins.token = '';
    // console.log("after logout: ", window.AWS.config.credentials);

    //redirect to the landing page after logging out
    browserHistory.push('/');
  }
};



export default Auth;