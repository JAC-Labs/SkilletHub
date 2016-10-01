import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Nav from './NavigationBar'; 

/************************************************************
*****************    AWS COGNITO CONFIG    ******************
************************************************************/
var AWS = require('aws-sdk');
// var passport = require('passport');
// var session = require('express-session');
// var GoogleStrategy = require('passport-google-oauth2').Strategy;
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var USER_POOL_APP_CLIENT_ID = '3998t3ftof3q7k5f0cqn260smk';
var USER_POOL_ID = 'us-west-2_P8tGz1Tx6';
var COGNITO_IDENTITY_POOL_ID = 'us-west-2:ea2abcb1-10a0-4964-8c13-97067e5b50bb';

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: COGNITO_IDENTITY_POOL_ID
});

/************************************************************
*******************     APP COMPONENT    ********************
************************************************************/

class App extends React.Component {
  constructor(props) {
  	super(props); 
  	this.state = {
      siteName: 'SkilletHub',
      userID: null,
      username: 'Username', 
      password: 'Password',
      firstname: 'First Name',
      lastname: 'Last Name',
      email: 'email'
  	}; 
  }

  handleChange (event) {
    var inputType = event.target.id; 
    if (inputType === 'username') {
      this.setState({username: event.target.value}); 
    } else if (inputType === 'password') {
      this.setState({password: event.target.value}); 
    } else if (inputType === 'firstname') {
      this.setState({firstname: event.target.value}); 
    } else if (inputType === 'lastname') {
      this.setState({lastname: event.target.value}); 
    } else if (inputType === 'email') {
      this.setState({email: event.target.value}); 
    }
  }

  handleSignUp(user){
    console.log('Attempting sign up!'); 
    console.log('User info: ', user.username); 
    this.setState({
      username: user.username,
      password: user.password,
      firstname: user.firstname,
      lastname:user.lastname,
      email: user.email
    }); 
    this.signUpUser(user).bind(this); 
  }

  handleLoginUser(user){
    console.log('In App.jsx, attempting login!'); 
    console.log('User info: ', user.username); 
    this.loginUser(user); 
  }

  handleLogOutUser(user){
    console.log('In App.jsx, attempting logout!'); 
    console.log('User info: ', user.username); 
    this.logOutUser(user); 
  }

  handleUserClick(event) {
    event.preventDefault(); 
    console.log('Clicked on username!'); 
    console.log(event.target); 
    var username = event.target.id;
    browserHistory.push(`/User/${username}`);
  }

  handleRecipeClick(event) {
    event.preventDefault(); 
    console.log('Clicked on username!'); 
    console.log(event.target); 
    var recipe = event.target.id;
    browserHistory.push(`/${recipe}`);
  }

  /************************************************************
  *****************    SIGN UP A NEW USER    ******************
  ************************************************************/
  signUpUser (user) {
    // event.preventDefault();
    // debugger;
    console.log('signing up user');
    console.log('username: ', user.username);
    console.log('username: ', user.password);
    console.log('firstname: ', user.firstname);
    console.log('lastname: ', user.lastname);
    console.log('email: ', user.email);
    var poolConfig = {
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_APP_CLIENT_ID
    };

    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
    var attList = [];
    var currentTime = Date.now().toString();

    var prefusername = {Name: 'preferred_username', Value: user.username};
    var firstname = {Name: 'given_name', Value: user.firstname};
    var lastname = {Name: 'family_name', Value: user.lastname};
    var email = {Name: 'email', Value: user.email};
    var timestamp = {Name: 'updated_at', Value: currentTime };

    var attPrefUsername = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(prefusername);
    var attFirstname = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(firstname);
    var attLastname = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(lastname);
    var attEmail = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(email);
    var attTimeStamp = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(timestamp);

    attList.push(attPrefUsername);
    attList.push(attFirstname);
    attList.push(attLastname);
    attList.push(attEmail);
    attList.push(attTimeStamp);

    var un = user.username;
    var pw = user.password;

    console.log('BEFORE USERPOOL THIS IS:', this); 

    var setUserState = function(userID, token) {
      this.setState({userID: userID, username: authData.Username}); 
      this.setState({token: token});
      browserHistory.push(`/User/${authData.Username}`);
    }.bind(this); 

    userPool.signUp(un, pw, attList, null, function(error, result) {
      if (error) {
        console.log('Error signing up user: ', error);
      }
      var cognitoUser = result.user;
      var authData = {
        Username: un,
        Password: pw
      };
      var authDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: function (result) {
          var token = result.getAccessToken().getJwtToken();
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : COGNITO_IDENTITY_POOL_ID,
            Logins : { 'token': token }
          });
          console.log('auth success result: ', result);

          cognitoUser.getUserAttributes(function(error, result) {
            if (error) { 
              console.log('error in deets: ', error); 
            }
            else { 
              var userID = result[0].Value;
              setUserState(userID, token); 
            }
          });
        },
        onFailure: function(error) {
          console.log('Error authenticating user: ', error);
        }
      });
      // console.log('sign up successful: ', cognitoUser);
    });
    // console.log('THIS AT THE END!', this); 
  }

  /************************************************************
  /**************    LOG IN EXISTING USER    ******************
  ************************************************************/
  loginUser (user) {
    var authData = {
      Username: user.username,
      Password: user.password
    }
    var authDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
    var poolConfig = {
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_APP_CLIENT_ID
    }
    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
    var userData = {
        Username: user.username,
        Pool: userPool
    };
    var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);
    console.log('cognitoUser is: ', cognitoUser);

    var setUserState = function(userID, token) {
      this.setState({userID: userID, username: authData.Username}); 
      this.setState({token: token});
      browserHistory.push(`/User/${authData.Username}`);
    }.bind(this); 
    
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function (result) {
        var token = result.getAccessToken().getJwtToken();
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId : COGNITO_IDENTITY_POOL_ID,
          Logins : { 'token': token }
        });
        console.log('auth success result: ', result);

        cognitoUser.getUserAttributes(function(error, result) {
          if (error) { 
            console.log('error in getUserAttributes: ', error); 
          }
          else { 
            var userID = result[0].Value;
            setUserState(userID, token); 
          }
        });
      },
      onFailure: function(error) {
        console.log('Error authenticating user: ', error);
      }
    });
  };

  /************************************************************
  /******************    LOG OUT USER    **********************
  ************************************************************/
  logOutUser (user) {
    // console.log("before logout: ", window.AWS.config.credentials);
    var poolData = { 
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_APP_CLIENT_ID
    };
    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
      Username : user.username,
      Pool : userPool
    };
    var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.signOut();
    console.log('logged out user: ', cognitoUser);

    this.setState({username: null});
    this.setState({password: null});
    this.setState({userID: null});
    this.setState({token: null});

    window.AWS.config.credentials.params.IdentityPoolId = '';
    window.AWS.config.credentials.params.Logins.token = '';
    // console.log("after logout: ", window.AWS.config.credentials);

    //redirect to the landing page after logging out
    browserHistory.push('/');
  };

  /************************************************************
  /****************    RENDER COMPONENTS    *******************
  ************************************************************/
  render () {
	const children = React.Children.map(this.props.children, function (child) {
	  return React.cloneElement(child, {
	    handleSignUp: this.handleSignUp.bind(this),
      userID: this.state.userID,
      username: this.state.username, 
      handleUserClick: this.handleUserClick.bind(this),
      handleRecipeClick: this.handleRecipeClick.bind(this)
	  })
	}.bind(this))
    return (
    	<div> 
    		<Nav handleLoginUser={this.handleLoginUser.bind(this)} handleLogOutUser={this.handleLogOutUser.bind(this)} userID={this.state.userID} username={this.state.username} />
    		{ children }
    	</div>
    ); 
  }
}; 

export default App; 




