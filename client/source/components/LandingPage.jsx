import React from 'react';
import { Grid, Row, Col, FormGroup, FormControl, Button, Jumbotron, Carousel, Container, ControlLabel } from 'react-bootstrap';

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

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username', 
      password: 'Password',
      firstname: 'First Name',
      lastname: 'Last Name',
      email: 'email'
    }; 
  }

  handleSubmit (event) {
    debugger;
    console.log(event); 
    console.log(this.state.username, this.state.password);
    this.signUpUser(event);
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

  /************************************************************
  ***************    AUTHENTICATION HELPER    *****************
  ************************************************************/
  // authenticateUser (cognitoUser, authDeets, callback) {
    // cognitoUser.authenticateUser(authDeets, {
    //   onSuccess: function (result) {
    //     var token = result.getAccessToken().getJwtToken();
    //     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //       IdentityPoolId : COGNITO_IDENTITY_POOL_ID,
    //       Logins : { 'cognito-idp.us-west-2.amazonaws.com/us-west-2_P8tGz1Tx6': token }
    //     });
    //     callback(null, result);
    //   },
    //   onFailure: function(error) {
    //     console.log('Error in authenticateUser helper: ', error);
    //     callback(err);
    //   }
    // });
  // }

  /************************************************************
  *****************    SIGN UP A NEW USER    ******************
  ************************************************************/
  signUpUser (event) {
    event.preventDefault();
    debugger;
    console.log('signing up user');
    console.log('username: ', this.state.username);
    console.log('username: ', this.state.password);
    console.log('firstname: ', this.state.firstname);
    console.log('lastname: ', this.state.lastname);
    console.log('email: ', this.state.email);
    var poolConfig = {
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_APP_CLIENT_ID
    };

    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
    var attList = [];
    var currentTime = Date.now().toString();

    var prefusername = {Name: 'preferred_username', Value: this.state.username};
    var firstname = {Name: 'given_name', Value: this.state.firstname};
    var lastname = {Name: 'family_name', Value: this.state.lastname};
    var email = {Name: 'email', Value: this.state.email};
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

    var un = this.state.username;
    var pw = this.state.password;

    userPool.signUp(un, pw, attList, null, function(error, result) {
      if (error) {
        console.log('Error signing up user: ', error);
      }
      var cognitoUser = result.user;
      var authData = {
        Username: un,
        Password: pw
      };
      var authDeets = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
      cognitoUser.authenticateUser(authDeets, {
        onSuccess: function (result) {
          var token = result.getAccessToken().getJwtToken();
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : COGNITO_IDENTITY_POOL_ID,
            Logins : { 'cognito-idp.us-west-2.amazonaws.com/us-west-2_P8tGz1Tx6': token }
          });
          console.log('auth success result: ', result);
          // console.log('token?: ', token);
          var user_id = ''
          var userDeets = cognitoUser.getUserAttributes(function(error, result) {
            if (error) { 
              console.log('error in deets: ', userDeets); 
            }
            else { 
              console.log('userDeets result: ', result); 
              user_id = result[0].Value;
              console.log('user_id: ', user_id);
            }
          });
        },
        onFailure: function(error) {
          console.log('Error authenticating user: ', error);
        }
      });
      // this.authenticateUser(cognitoUser, authDeets, function(err, result) {
      //   if (err) {
      //     console.log('error authenticating: ', err);
      //   }
      //   console.log('auth result: ', result);
      // });

      console.log('sign up successful: ', cognitoUser);

      // cognitoUser.getUserAttributes(function(err, result) {
      //   if (err) {
      //     // alert(err);
      //     console.log('error getting attributes');
      //   }
      //   for (i = 0; i < result.length; i++) {
      //     console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
      //   }
      // });
      // res.status(200).json(cognitoUser);
    });
  }

  /************************************************************
  /**************    LOG IN EXISTING USER    ******************
  ************************************************************/
  loginUser (event) {
    var authData = {
      Username: this.state.username,
      Password: this.state.password
    }
    var authDeets = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
    var poolConfig = {
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_APP_CLIENT_ID
    }
    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
    var userData = {
        Username: this.state.username,
        Pool: userPool
    };
    var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);
    this.authenticateUser(cognitoUser, authDeets, function(err, result) {
      if (err) {
        console.log('error authenticating: ', cognitoUser);
      }
      console.log('auth successful for: ', cognitoUser);
      console.log('auth result: ', result);
    });
    // console.log('logged in user: ', cognitoUser);
  };

  /************************************************************
  /******************    LOG OUT USER    **********************
  ************************************************************/
  logout (event) {
    var poolData = { 
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_APP_CLIENT_ID
    };
    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
      Username : this.state.username,
      Pool : userPool
    };
    var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.signOut();

    console.log('logged out user: ', cognitoUser);
  };




  // TODO: Modify render() to display image (half/whole) similar to Github/Facebook with the sign up form. 

  render() {
    return (
        <Jumbotron style={{
         'backgroundImage': 'url(\"http://67.media.tumblr.com/426d4abee7ca7c24c0414edbe35f8ddb/tumblr_nlwab73eK91s4468do1_1280.jpg\")',
         'backgroundSize': 'cover',
         'height': 900
        }}> 
          <Row className="show-grid">
            <Col xs={4} xsOffset={7} md={4} mdOffset={7}> 
            <form className="signupForm" onSubmit={this.handleSubmit.bind(this)} style={{'background':'white', 'height': 200, 'borderRadius': 10}}>
              <FormGroup controlId="formBasicText" style={{padding: 10}}>
                <ControlLabel> Sign Up For SkilletHub </ControlLabel>
                <FormControl type="text" id="username" onChange={this.handleChange.bind(this)} value={this.state.username} name="username" style={{margin: 5}}/>
                <FormControl type="password" id="password" onChange={this.handleChange.bind(this)} value={this.state.password} name="password" style={{margin: 5}}/>
                <FormControl type="text" id="firstname" onChange={this.handleChange.bind(this)} value={this.state.firstname} name="firstname" style={{margin: 5}}/>
                <FormControl type="text" id="lastname" onChange={this.handleChange.bind(this)} value={this.state.lastname} name="lastname" style={{margin: 5}}/>
                <FormControl type="text" id="email" onChange={this.handleChange.bind(this)} value={this.state.email} name="email" style={{margin: 5}}/>
                <Button type="submit" style={{margin: 5}}>Sign Up</Button>  
              </FormGroup>
            </form>
            </Col>
          </Row>
        </Jumbotron>
    );
  }
}













































export default LandingPage;

      //   <div className='signUpPage'>
      //   <h1 className='signUpPage'>Welcome to SkilletHub</h1>
      //   <h1 className='signUpPage'> Sign Up </h1>
      //   <form className="signupForm" onSubmit={this.handleSubmit.bind(this)} method="post">
      //     <input type="text" onChange={this.handleChange.bind(this)} value={this.state.username} className="usernameInput" name="username"/>
      //     <input type="password" onChange={this.handleChange.bind(this)} value={this.state.password} className="passwordInput" name="password"/>
      //     <button type="submit">Sign Up</button>
      //   </form>
      // </div>

      // <Carousel>
      //     <Carousel.Item>
      //       <img width={900} height={500} alt="900x500" src="http://www.gourmetfoodshop.co.za/wp-includes/backgrounds/bg2.jpg"/>
      //       <Carousel.Caption>
      //         <h3>First slide label</h3>
      //         <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      //       </Carousel.Caption>
      //     </Carousel.Item>
      //     <Carousel.Item>
      //       <img width={900} height={500} alt="900x500" src="http://stanforddaily.wpengine.netdna-cdn.com/wp-content/uploads/2013/10/Filet-Mignon-1.jpg"/>
      //       <Carousel.Caption>
      //         <h3>Second slide label</h3>
      //         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      //       </Carousel.Caption>
      //     </Carousel.Item>
      //     <Carousel.Item>
      //       <img width={900} height={500} alt="900x500" src="http://67.media.tumblr.com/426d4abee7ca7c24c0414edbe35f8ddb/tumblr_nlwab73eK91s4468do1_1280.jpg"/>
      //       <Carousel.Caption>
      //         <h3>Third slide label</h3>
      //         <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
      //       </Carousel.Caption>
      //     </Carousel.Item>
      //   </Carousel>
