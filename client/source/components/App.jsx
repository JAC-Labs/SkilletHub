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
      username: null, 
      password: '',
      token: null,
      // currentProfile: null,
      loggedInUserProfile: true,
      pullRequestObject: {},
      issueObject: {},
      followingListMaster: [] 
  	}; 
  }

  /************************************************************
  /****************     AUTHENTICATION      *******************
  ************************************************************/

  handleSignUp(user) { 
    Auth.signUpUser(user, this);
  }

  handleLoginUser(user) {
    Auth.loginUser(user, this);
  }

  handleLogOutUser(user) { 
    Auth.logOutUser(user, this); 
  }

  /************************************************************
  /****************     USERS HANDLERS      *******************
  ************************************************************/
  
  // Navigates to the clicked on username's profile 
  handleUserClick(event) {
    event.preventDefault(); 
    var selectedUser = event.target.id;
    var loggedInUserProfile = this.state.username === selectedUser ? true : false; 
    this.setState({loggedInUserProfile: loggedInUserProfile}); 
    browserHistory.push(`/User/${selectedUser}`);
  }

  // Follows the clicked on username, storing it in the the logged in user's profile under list of followed users. 
  handleFollowUserClick(event) {
    event.preventDefault();
    var usernameParameter = this.state.username; 
    var followUsernameParameter = this.props.params.username; 
    axios.post(`/${usernameParameter}/follow/${followUsernameParameter}`)
    .then((result) => {
      console.log('Followed new user'); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  // Sets the list of followed users in App, used to determine if a given user is followed by the logged in user. 
  handleSetFollowingListMaster(following){
    this.setState({
      followingListMaster: following 
    }); 
  }

  /************************************************************
  /****************   BASIC RECIPE HANDLERS      ***************
  ************************************************************/

  // Navigates to the clicked on recipe's view page  
  // NOTE: This is used to access the most recent recipe of the root recipe's master branch 
  handleRecipeViewClick(event) {
    event.preventDefault(); 
    var usernameParameter = event.target.dataset.username; 
    var recipeParameter = event.target.dataset.recipe; 
    browserHistory.push(`/Recipe/${usernameParameter}/${recipeParameter}`);
  }

  // Navigates to the clicked on recipe's edit page  
  // NOTE: This is used to access the most recent recipe of the root recipe's master branch 
  handleRecipeEditClick(event) {
    event.preventDefault(); 
    var usernameParameter = event.target.dataset.username; 
    var recipeParameter = event.target.dataset.recipe;
    browserHistory.push(`/Edit/${usernameParameter}/${recipeParameter}`);
  }

  // Navigates to the clicked on recipe's edit page  
  // NOTE: This is used to access a specified version of the selected recipe 
  handleRecipeVersionEdit(recipeObject) {
    event.preventDefault(); 
    var usernameParameter = recipeObject.username; 
    var recipeParameter = recipeObject.recipe;
    var branchParameter = recipeObject.branch;
    var versionParameter = recipeObject.version; 
    browserHistory.push(`/Edit/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParameter}`);
  }

  // Navigates to the CookME view for a selected recipe
  // NOTE: Event is sometimes passed an event as parameter, sometimes passed an object. This function includes error handling for that
  handleRecipeCookClick(event) {
    if (typeof event.preventDefault === 'function') {
      var usernameParameter = event.target.dataset.username; 
      var recipeParameter = event.target.dataset.version;
    } else {
      var usernameParameter = event.username; 
      var recipeParameter = event.version;
    }
    browserHistory.push(`/CookMe/${usernameParameter}/${recipeParameter}`); 
  }

  // Forks a selected recipe, storing it in the logged in users profile within the database. 
  // NOTE: This accesses a specified version of the selected recipe 
  handleRecipeForkClick(event) {
    event.preventDefault(); 
    var usernameParameter = event.target.dataset.username; 
    var recipeParameter = event.target.dataset.recipe;
    var branchParameter = event.target.dataset.branch;
    var versionParameter = event.target.dataset.version; 
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

  // Forks a selected recipe, storing it in the logged in users profile within the database. 
  // NOTE: This accesses a specified version of the selected recipe 
  // NOTE: This function expects a recipeObject rather than an event as a parameter 
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

  /************************************************************
  /****************   PULL REQUEST HANDLERS      **************
  ************************************************************/

  // Initializes a pull request for a specified version of a recipe
  // NOTE: This page displays the differences between the logged in user's recipe and the recipe they will be submitting the pull request to. 
  // NOTE: This handler does not actually create the pull request, that occurs when handleCreatePullRequest is triggered
  handleRecipeVersionPull(recipeObject) {
    var usernameParameter = recipeObject.username; 
    var recipeParameter = recipeObject.recipe;
    var branchParameter = recipeObject.branch;
    var versionParameter = recipeObject.version; 
    var sourceUserParameter = recipeObject.sourceUser;
    var sourceRecipeParameter = recipeObject.sourceRecipe;  
    browserHistory.push(`/Pull/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParameter}/${sourceUserParameter}/${sourceRecipeParameter}`);
  }

  // Creates the pull request and submits the pull request to the owner of the root recipe for review. 
  handleCreatePullRequest(pullRequestObject) {
    var usernameParameter = this.state.username; 
    axios.post(`/${usernameParameter}/create-pull`, {
      targetUsername: pullRequestObject.targetUsername,
      sourceVersionId: pullRequestObject.sourceVersionId,
      targetVersionId: pullRequestObject.targetVersionId
    })
    .then((result) => {
      browserHistory.push(`/User/${usernameParameter}`);
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  // Navigates to the Pull Request Manage component, where owner of the root recipe can approve, deny or edit a selected Pull Request 
  // NOTE: This sets the pullRequestObject within App to track the currently worked on pullRequest across components
  handlePullRequestClick(event){
    event.preventDefault(); 
    var pullRequestObject = JSON.parse(event.target.dataset.pullrequest);
    var usernameParameter = pullRequestObject.targetUser; 
    var pullIdParameter = pullRequestObject._id;     
    this.setState({
      pullRequestObject: pullRequestObject
    }); 
    browserHistory.push(`/Manage/${usernameParameter}/${pullIdParameter}`);
  }

  // Handles the response from the owner of the root recipe. Recipe owners can respond with: 
  // approve -> Pull request status changed to merged. 
  // deny -> Pull request status changed to closed. 
  // NOTE: The current pullRequestObject state in App is reset to nothing once current Pull Request is resolved. 
  handlePullRequestResponse(event) {
    event.preventDefault(); 
    var response = event.target.id; 
    if (response === 'approve') {
      var status = 'merged'; 
    } else if (response === 'deny') {
      var status = 'closed'; 
    }
    var pullRequestObject = this.state.pullRequestObject; 
    var usernameParameter = pullRequestObject.targetUser; 
    var pullIdParameter = pullRequestObject._id; 
    axios.put(`/${usernameParameter}/${pullIdParameter}/update-pull`, {
      status: status
    })
    .then((result) => {
      this.setState({ pullRequestObject: {} }); 
      browserHistory.push(`/User/${usernameParameter}`); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  // Navigates the pull request to edit page
  handlePullRequestEdit(event) {
    event.preventDefault(); 
    var pullRequestObject = this.state.pullRequestObject; 
    var usernameParameter = pullRequestObject.sendingUser; 
    var recipeParameter = pullRequestObject.sentRootVersion;
    var branchParameter = pullRequestObject.sentBranch;
    var versionParameter = pullRequestObject.sentVersion; 
    var pullIdParameter = pullRequestObject._id; 
    var targetUserParameter = pullRequestObject.targetUser; 

    browserHistory.push(`/EditPull/${targetUserParameter}/${pullIdParameter}/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParameter}`);
  }

  // Handles the submission of the editted Pull Request
  // NOTE: The original Pull Request will be approved once edits are submitted. 
  // NOTE: The current pullRequestObject state in App is reset to nothing once current Pull Request is resolved. 
  handlePullRequestEditSubmit(editPullRequestObject) {
    var status = 'merged'; 
    var changes = editPullRequestObject; 
    var usernameParameter = this.props.params.targetUser; 
    var pullIdParameter = this.props.params.pullId; 
    axios.put(`/${usernameParameter}/${pullIdParameter}/update-pull`, {
      status: status,
      changes: changes
    })
    .then((result) => {
      this.setState({ pullRequestObject: {} }); 
      browserHistory.push(`/User/${usernameParameter}`); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  /************************************************************
  /****************       ISSUES HANDLERS       ***************
  ************************************************************/

  // Navigates to the list of issues for a selected recipe. 
  // NOTE: This list is accessible to all users. 
  handleViewIssuesClick(usernameParameter, recipeParameter) {
    browserHistory.push(`/Issues/List/${usernameParameter}/${recipeParameter}`); 
  }

  // Navigates to a specfic issue thread for a selected issue. 
  // NOTE: This sets the issueObject within App to track the currently worked on issueObject across components
  // NOTE: This thread is accessible to all users, however, only the root recipe owner may resolve or close a given issue. 
  // NOTE: Other users may comment on the issue. 
  handleViewSingleIssueClick(issueObject) {
    this.setState({
      issueObject: issueObject
    }); 
    var usernameParameter = this.props.params.username; 
    var recipeParameter = this.props.params.recipe; 
    browserHistory.push(`/Issues/Manage/${usernameParameter}/${recipeParameter}`); 
  }

  // Navigates to a form that allows users to enter a new issue. 
  handleNewIssueClick(recipeObject) {
    var usernameParameter = recipeObject.usernameParameter; 
    var recipeParameter = recipeObject.recipeParameter; 
    browserHistory.push(`/Issues/${usernameParameter}/${recipeParameter}`); 
  }

  // Handles the submission of a new issue for a given recipe. 
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
      browserHistory.push(`/User/${username}`); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  // Handles the submission of a response to a given issue. 
  // NOTE: The root recipe owner may close or resolve the issue. 
  // NOTE: All users may comment on a given issue.
  // NOTE: The current pullRequestObject state in App is reset to nothing once current Pull Request is resolved. 
  handleIssueResponseSubmit(issueResponseObject) {
    var commentUsernameParameter = this.state.username; 
    var recipeParameter = this.props.params.recipe; 
    var recipeUsernameParameter = this.props.params.username; 
    var issueParameter = this.state.issueObject._id; 

    if (issueResponseObject.type === 'comment') {
      axios.post(`/${commentUsernameParameter}/${issueParameter}/create-comment`, {
        data: issueResponseObject.data
      })
      .then((result) => {
        this.setState({
          issueObject: {}
        }); 
        browserHistory.push(`/Issues/List/${recipeUsernameParameter}/${recipeParameter}`); 
      })
      .catch((error) => {
        console.log(error); 
      }); 
    } else {
      axios.put(`/${recipeUsernameParameter}/${recipeParameter}/update-status`, {
        status: issueResponseObject.type
      })
      .then((result) => {
        this.setState({
          issueObject: {}
        }); 
        browserHistory.push(`/Issues/List/${recipeUsernameParameter}/${recipeParameter}`); 
      })
      .catch((error) => {
        console.log(error); 
      }); 
    }
  }

  /************************************************************
  /***************    NAVIGATION / SEARCH    ******************
  ************************************************************/

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

  handleRecipeSearch(searchTerms) {
    searchTerms = searchTerms.toString();
    browserHistory.push(`/Search/${searchTerms}`);
  }

  /************************************************************
  /****************    RENDER COMPONENTS    *******************
  ************************************************************/
  render () {

	const children = React.Children.map(this.props.children, function (child) {
	  return React.cloneElement(child, {
      username: this.state.username, 
      issueObject: this.state.issueObject, 
      pullRequestObject: this.state.pullRequestObject, 
      loggedInUserProfile: this.state.loggedInUserProfile, 
      followingListMaster: this.state.followingListMaster, 

      handleSignUp: this.handleSignUp.bind(this),
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
      handleFollowUserClick: this.handleFollowUserClick.bind(this),
      handleSetFollowingListMaster: this.handleSetFollowingListMaster.bind(this)
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