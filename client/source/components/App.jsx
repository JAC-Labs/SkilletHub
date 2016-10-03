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
      email: 'email',
      currentProfile: null 
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
    this.setState({currentProfile: username}); 
    browserHistory.push(`/User/Profile/${username}`);
  }

  handleRecipeViewClick(event) {
    event.preventDefault(); 
    console.log('Clicked on username!'); 
    console.log(event.target); 
    console.log('USERNAME: ', event.target.dataset.username); 
    var recipe = event.target.id;
    var username = event.target.dataset.username; 
    browserHistory.push(`/Recipe/${username}/${recipe}`);
  }

  handleRecipeEditClick(event) {
    event.preventDefault(); 
    console.log('CLICKED EDIT IN APP!'); 
    console.log(event.target); 
    var recipe = event.target.dataset.recipe;
    var username = event.target.dataset.username; 
    browserHistory.push(`/Edit/${username}/${recipe}`);
  }

  handleNavigation(event) {
    event.preventDefault();
    var route = event.target.title; 
    console.log('NAVIGATING TO:', route); 
    browserHistory.push(`${route}`);
  }

  /************************************************************
  *****************    SIGN UP A NEW USER    ******************
  ************************************************************/
  signUpUser (user) {
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
          console.log('Error authenticating user: ' + error);
          alert(error);
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
          if (error) {console.log('error in getUserAttributes: ', error);}
          else { 
            var userID = result[0].Value;
            setUserState(userID, token); 
          }
        });

      },
      onFailure: function(error) {
        console.log('Error authenticating user: ', error);
        alert(error);
      }
    });
    this.getListOfAllUsers();
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
  /******************    GET ALL USERS    *********************
  ************************************************************/
  // getListOfAllUsers() {
  //   var poolData = { 
  //     UserPoolId: USER_POOL_ID,
  //     ClientId: USER_POOL_APP_CLIENT_ID
  //   };
  //   var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  //   var options = {
  //     "AttributesToGet": [ "username" ],
  //     "UserPoolId": USER_POOL_ID
  //   };
  //   userPool.listUsers(options, {
  //     onSuccess: function(result) {
  //       console.log('result in getListUsers: ', result);
  //     },
  //     onError: function(error) {
  //       console.log('error in getListUsers: ', error);
  //     }
  //   });
  // };


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
      handleRecipeViewClick: this.handleRecipeViewClick.bind(this), 
      handleRecipeEditClick: this.handleRecipeEditClick.bind(this)
	  })
	}.bind(this))
    return (
    	<div> 
    		<Nav handleLoginUser={this.handleLoginUser.bind(this)} handleLogOutUser={this.handleLogOutUser.bind(this)} userID={this.state.userID} username={this.state.username} handleNavigation={this.handleNavigation.bind(this)} />
    		{ children }
    	</div>
    ); 
  }
}; 

export default App; 




