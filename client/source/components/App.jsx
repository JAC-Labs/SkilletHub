import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Nav from './NavigationBar'; 
import Auth from './Auth/Auth'

// Axios 
var axios = require('axios'); 

/************************************************************
*******************     APP COMPONENT    ********************
************************************************************/

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      userID: null,
      token: null,
      username: '', 
      password: '',
      currentProfile: null,
      loggedInUserProfile: true,
      pullRequestObject: {},
      issueObject: {} 
  	}; 
  }

  handleSignUp(user) { 
    Auth.signUpUser(user, this);
  }

  handleLoginUser(user) {
    Auth.loginUser(user, this);
  }

  handleLogOutUser(user) { 
    Auth.logOutUser(user, this); 
  }

  handleRecipeSearch(searchTerms) {
    console.log('In App handleRecipeSearch, routing to /Search with: ', searchTerms);
    searchTerms = searchTerms.toString();
    browserHistory.push(`/Search/${searchTerms}`);
  }
  
  handleUserClick(event) {
    event.preventDefault(); 
    // console.log('Clicked on username!'); 
    // console.log(event.target); 
    // console.log('USERNAME STATE');
    // console.log(this.state.username);
    var selectedUser = event.target.id;
    var loggedInUserProfile = this.state.username === selectedUser ? true : false; 
    this.setState({loggedInUserProfile: loggedInUserProfile}); 
    browserHistory.push(`/User/${selectedUser}`);
  }

  handleRecipeViewClick(event) {
    event.preventDefault(); 
    // console.log('Clicked on username!'); 
    // console.log(event.target); 
    // console.log('USERNAME: ', event.target.dataset.username); 
    var usernameParameter = event.target.dataset.username; 
    var recipeParameter = event.target.dataset.recipe; 
    browserHistory.push(`/Recipe/${usernameParameter}/${recipeParameter}`);
  }

  handleRecipeEditClick(event) {
    event.preventDefault(); 
    // console.log('CLICKED EDIT IN APP!'); 
    // console.log(event.target); 
    var usernameParameter = event.target.dataset.username; 
    var recipeParameter = event.target.dataset.recipe;
    browserHistory.push(`/Edit/${usernameParameter}/${recipeParameter}`);
  }

  // handler for editing a specific version of a recipe
  handleRecipeVersionEdit(recipeObject) {
    event.preventDefault(); 
    var usernameParameter = recipeObject.username; 
    var recipeParameter = recipeObject.recipe;
    var branchParameter = recipeObject.branch;
    var versionParameter = recipeObject.version; 
    browserHistory.push(`/Edit/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParameter}`);
  }

  handleRecipeCookClick(event) {
    // event.preventDefault();
    if (typeof event.preventDefault === 'function') {
      var usernameParameter = event.target.dataset.username; 
      var recipeParameter = event.target.dataset.version;
    } else {
      var usernameParameter = event.username; 
      var recipeParameter = event.version;
    }
    var route = '/CookMe/'+usernameParameter+'/'+recipeParameter;
    console.log('NAVIGATING TO:', route); 
    browserHistory.push(`${route}`); 
  }

  handleRecipeForkClick(event) {
    event.preventDefault(); 
    console.log('handleRecipeForkClick event: ', event);
    // console.log('CLICKED FORK IN APP!'); 
    // console.log(event.target.dataset); 
    var usernameParameter = event.target.dataset.username; 
    var recipeParameter = event.target.dataset.recipe;
    var branchParameter = event.target.dataset.branch;
    var versionParameter = event.target.dataset.version; 
    var loggedInUser = this.state.username; 
    console.log(loggedInUser); 
    // console.log('FORK USER: ', forkUser); 
    axios.post(`/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParameter}/fork`, {
      username: loggedInUser
    })
    .then((result) => {
      browserHistory.push(`/User/${loggedInUser}`);
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handleRecipeVersionFork(recipeObject) {
    var usernameParameter = recipeObject.username; 
    var recipeParameter = recipeObject.recipe;
    var branchParameter = recipeObject.branch;
    var versionParameter = recipeObject.version; 
    var loggedInUser = this.state.username; 

    axios.post(`/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParameter}/fork`, {
      username: loggedInUser
    })
    .then((result) => {
      browserHistory.push(`/User/${loggedInUser}`);
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handleRecipeVersionPull(recipeObject) {
    var usernameParameter = recipeObject.username; 
    var recipeParameter = recipeObject.recipe;
    var branchParameter = recipeObject.branch;
    var versionParameter = recipeObject.version; 
    var sourceUserParameter = recipeObject.sourceUser;
    var sourceRecipeParameter = recipeObject.sourceRecipe;  
    browserHistory.push(`/Pull/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParameter}/${sourceUserParameter}/${sourceRecipeParameter}`);
  }

  handleCreatePullRequest(pullRequestObject) {
    var usernameParameter = this.state.username; 
    axios.post(`/${usernameParameter}/create-pull`, {
      targetUsername: pullRequestObject.targetUsername,
      sourceVersionId: pullRequestObject.sourceVersionId,
      targetVersionId: pullRequestObject.targetVersionId
    })
    .then((result) => {
      console.log('SUCCESSFUL PULL REQUEST'); 
      console.log(result); 
      browserHistory.push(`/User/${usernameParameter}`);
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handlePullRequestClick(event){
    event.preventDefault(); 
    var pullRequestObject = JSON.parse(event.target.dataset.pullrequest);
    var usernameParameter = pullRequestObject.targetUser; 
    var pullIdParameter = pullRequestObject._id; 
    console.log(pullRequestObject);  
    
    this.setState({
      pullRequestObject: pullRequestObject
    }); 
    // browserHistory.push(`/Manage/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParameter}/${pullUserParameter}/${pullRecipeParameter}`);
    browserHistory.push(`/Manage/${usernameParameter}/${pullIdParameter}`);
  }

  handlePullRequestResponse(event) {
    event.preventDefault(); 
    var response = event.target.id; 
    if (response === 'approve') {
      var status = 'merged'; 
    } else if (response === 'deny') {
      var status = 'closed'; 
    }
    var pullRequestObject = this.state.pullRequestObject; 
    console.log(pullRequestObject); 
    var usernameParameter = pullRequestObject.targetUser; 
    var pullIdParameter = pullRequestObject._id; 
    axios.put(`/${usernameParameter}/${pullIdParameter}/update-pull`, {
      status: status
    })
    .then((result) => {
      console.log('SUCCESSFULLY RESOLVED PULL REQUEST'); 
      console.log(result); 
      browserHistory.push(`/User/${usernameParameter}`); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handlePullRequestEdit(event) {
    event.preventDefault(); 
    console.log('pull request edit'); 
    var pullRequestObject = this.state.pullRequestObject; 
    var usernameParameter = pullRequestObject.sendingUser; 
    var recipeParameter = pullRequestObject.sentRootVersion;
    var branchParameter = pullRequestObject.sentBranch;
    var versionParameter = pullRequestObject.sentVersion; 
    var pullIdParameter = pullRequestObject._id; 
    var targetUserParameter = pullRequestObject.targetUser; 

    browserHistory.push(`/EditPull/${targetUserParameter}/${pullIdParameter}/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParameter}`);
  }

  handlePullRequestEditSubmit(editPullRequestObject) {
    var status = 'merged'; 
    var changes = editPullRequestObject; 
    console.log(this.props.params);
    var usernameParameter = this.props.params.targetUser; 
    var pullIdParameter = this.props.params.pullId; 
    axios.put(`/${usernameParameter}/${pullIdParameter}/update-pull`, {
      status: status,
      changes: changes
    })
    .then((result) => {
      console.log('SUCCESSFULLY RESOLVED PULL REQUEST'); 
      console.log(result); 
      browserHistory.push(`/User/${usernameParameter}`); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handleViewIssuesClick(usernameParameter, recipeParameter) {
    browserHistory.push(`/Issues/List/${usernameParameter}/${recipeParameter}`); 
  }

  handleViewSingleIssueClick(issueObject) {
    this.setState({
      issueObject: issueObject
    }); 
    var usernameParameter = this.props.params.username; 
    var recipeParameter = this.props.params.recipe; 
    browserHistory.push(`/Issues/Manage/${usernameParameter}/${recipeParameter}`); 
  }

  handleNewIssueClick(recipeObject) {
    var usernameParameter = recipeObject.usernameParameter; 
    var recipeParameter = recipeObject.recipeParameter; 
    browserHistory.push(`/Issues/${usernameParameter}/${recipeParameter}`); 
  }

  handleNewIssueSubmit(issueObject) {
    var usernameParameter = issueObject.usernameParameter; 
    var recipeParameter = issueObject.recipeParameter; 
    var username = this.state.username; 
    var type = issueObject.type || null; 
    var position = issueObject.position || null; 
    axios.post(`/${usernameParameter}/${recipeParameter}/create-issue`, {
      username: username,
      title: issueObject.title, 
      data: issueObject.data, 
      type: type, 
      position: position
    })
    .then((result) => {
      console.log('Created new issue'); 
      console.log(result); 
      browserHistory.push(`/User/${username}`); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handleIssueResponseSubmit(issueResponseObject) {
    var usernameParameter = this.props.params.username; 
    var recipeParameter = this.props.params.recipe; 
    var issueParameter = this.state.issueObject._id; 

    if (issueResponseObject.type === 'comment') {
      axios.post(`/${usernameParameter}/${issueParameter}/create-comment`, {
        data: issueResponseObject.data
      })
      .then((result) => {
        console.log('Responded to issue'); 
        console.log(result); 
        this.setState({
          issueObject: {}
        }); 
        browserHistory.push(`/Issues/List/${usernameParameter}/${recipeParameter}`); 
      })
      .catch((error) => {
        console.log(error); 
      }); 
    } else {
      axios.put(`/${usernameParameter}/${recipeParameter}/update-status`, {
        status: issueResponseObject.type
      })
      .then((result) => {
        console.log('Responded to issue'); 
        console.log(result); 
        this.setState({
          issueObject: {}
        }); 
        browserHistory.push(`/Issues/List/${usernameParameter}/${recipeParameter}`); 
      })
      .catch((error) => {
        console.log(error); 
      }); 
    }
  }

  handleFollowUserClick(event) {
    event.preventDefault();
    var usernameParameter = this.state.username; 
    var followUsernameParameter = this.props.params.username; 
    axios.post(`/${usernameParameter}/follow/${followUsernameParameter}`)
    .then((result) => {
      console.log('Followed new user'); 
      console.log(result); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handleNavigation(event) {
    event.preventDefault();
    var route = event.target.title; 
    if (route === '/User' && this.state.token) {
      this.setState({loggedInUserProfile: true}); 
      route = `/User/${this.state.username}/`; 
    } else if (!this.state.token) {
      alert('Please log in or sign up!');
      route = '/';
    }
    browserHistory.push(`${route}`);
  }

  /************************************************************
  /****************    RENDER COMPONENTS    *******************
  ************************************************************/
  render () {

	const children = React.Children.map(this.props.children, function (child) {
	  return React.cloneElement(child, {
      userID: this.state.userID,
      username: this.state.username, 
      loggedInUserProfile: this.state.loggedInUserProfile, 
      handleSignUp: this.handleSignUp.bind(this),
      
      pullRequestObject: this.state.pullRequestObject, 
      issueObject: this.state.issueObject, 
      handleUserClick: this.handleUserClick.bind(this),
      handleRecipeViewClick: this.handleRecipeViewClick.bind(this), 
      handleRecipeEditClick: this.handleRecipeEditClick.bind(this),
      handleRecipeCookClick: this.handleRecipeCookClick.bind(this),
      handleRecipeForkClick: this.handleRecipeForkClick.bind(this),
      handleRecipeVersionFork: this.handleRecipeVersionFork.bind(this),
      handleRecipeVersionEdit: this.handleRecipeVersionEdit.bind(this),
      handleRecipeVersionPull: this.handleRecipeVersionPull.bind(this),
      handleCreatePullRequest: this.handleCreatePullRequest.bind(this),
      handlePullRequestClick: this.handlePullRequestClick.bind(this),
      handlePullRequestResponse: this.handlePullRequestResponse.bind(this), 
      handlePullRequestEdit: this.handlePullRequestEdit.bind(this),
      handlePullRequestEditSubmit: this.handlePullRequestEditSubmit.bind(this),
      handleNewIssueClick: this.handleNewIssueClick.bind(this),
      handleNewIssueSubmit: this.handleNewIssueSubmit.bind(this),
      handleViewIssuesClick: this.handleViewIssuesClick.bind(this),
      handleViewSingleIssueClick: this.handleViewSingleIssueClick.bind(this),
      handleIssueResponseSubmit: this.handleIssueResponseSubmit.bind(this),
      handleFollowUserClick: this.handleFollowUserClick.bind(this)
	  })
	}.bind(this))
    return (
    	<div> 
    		<Nav 
          userID={this.state.userID} 
          username={this.state.username} 
          handleLogOutUser={this.handleLogOutUser.bind(this)} 
          handleLoginUser={this.handleLoginUser.bind(this)} 
          handleNavigation={this.handleNavigation.bind(this)} 
          handleRecipeSearch={this.handleRecipeSearch.bind(this)} />
    		{ children }
    	</div>
    ); 
  }
}; 

export default App; 