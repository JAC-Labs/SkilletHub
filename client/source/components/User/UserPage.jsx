import React from 'react';
import { browserHistory, Router, Route, IndexRoute, Link} from 'react-router';
import RecipeListEntry from './RecipeListEntry'; 
import UserStats from './UserStats'; 
import FollowingListEntry from './FollowingListEntry';
import NotificationsListEntry from './NotificationsListEntry';  
import PullRequestEntry from './PullRequestEntry';  

//Bootstrap 
import { Image, Grid, Row, Col, Form, FormGroup, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem, Nav, NavItem, Badge, Glyphicon } from 'react-bootstrap';

// Server Requests
var axios = require('axios');
var _ = require('underscore'); 

const month = [];
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

// Placeholder recipe data 
import placeholders from '../../../../placeholders'

var userProfileTemplate = {
  firstname: '',
  lastname: '',
  email: '',
  createdAt: '',
  bio: ''
}

var pullRequestsTemplate = {
  received: [],
  sent: []
}

class UserProfile extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      userID: null,
      username: '',
      userProfile: userProfileTemplate, 
      image: 'http://www.trbimg.com/img-53c59dde/turbine/la-dd-jacques-pepin-gordon-ramsay-20140715',
      loggedInUserProfile: true,
      followUser: false,    
      activeKey: 1,
      recipeList: [],
      recipeCount: 0, 
      notificationsList: [], 
      followingListProfile: [],
      pullRequests: pullRequestsTemplate,
      openPullRequests: 0
    }; 
  }

  componentWillMount() {
    var usernameParameter = this.props.params.username; 
    var userImage = placeholders.images[usernameParameter] || 'https://cdn4.iconfinder.com/data/icons/kitchenware-2/100/04-512.png';  

    axios.all([this.getUser(usernameParameter), this.getNotifications(usernameParameter), this.getFollowing(usernameParameter), this.getPullRequests(usernameParameter)])
    .then(axios.spread((user, notifications, following, pullRequests) => {

      var recipes = user.data.recipes || []; 
      var pullRequests = pullRequests.data || {received: []};  
      
      pullRequests.received.forEach((pullRequest) => {
        var pullRequestMatch = _.findWhere(recipes, {rootRecipeId: pullRequest.targetRootVersion}); 
        pullRequest.originalName = pullRequestMatch.name; 
      }); 

      var openPullRequests = pullRequests.received.filter((pullRequest) => {
        if (pullRequest.status === 'open') {
          return pullRequest; 
        }
      }); 

      var recipeCount = recipes.length || 0; 

      this.setState({
        username: usernameParameter, 
        userID: this.props.userID,
        userProfile: user.data,
        image: userImage, 
        recipeList: recipes,
        recipeCount: recipeCount, 
        notificationsList: notifications, 
        followingListProfile: following.data, 
        pullRequests: pullRequests,
        openPullRequests: openPullRequests.length, 
        followers: user.data.followers
      }); 

      console.log('LOGGED IN USER PROFILE: ', this.props.loggedInUserProfile );

      if (this.props.loggedInUserProfile) {
        this.props.handleSetFollowingListMaster(following.data); 
      }

    }))
    .catch((error) => {
      console.log(error); 
    }); 
  }

  componentWillReceiveProps(nextProps) {
    console.log('USER PROFILE COMPONENT RECEIVING PROPS!'); 
    var usernameParameter = nextProps.params.username; 
    var userImage = placeholders.images[usernameParameter] || 'https://cdn4.iconfinder.com/data/icons/kitchenware-2/100/04-512.png';  

    axios.all([this.getUser(usernameParameter), this.getNotifications(usernameParameter), this.getFollowing(usernameParameter), this.getPullRequests(usernameParameter)])
    .then(axios.spread((user, notifications, following, pullRequests) => {

      var recipes = user.data.recipes || []; 
      var recipeCount = recipes.length || 0; 
      
      var pullRequests = pullRequests.data || {received: []};  
      pullRequests.received.forEach((pullRequest) => {
        var pullRequestMatch = _.findWhere(recipes, {rootRecipeId: pullRequest.targetRootVersion}); 
        pullRequest.originalName = pullRequestMatch.name; 
      }); 
      var openPullRequests = pullRequests.received.filter((pullRequest) => {
        if (pullRequest.status === 'open') {
          return pullRequest; 
        }
      }); 

      var notifications = notifications.data.reverse(); 

      this.setState({
        username: usernameParameter, 
        userID: this.props.userID,
        userProfile: user.data,
        image: userImage, 
        recipeList: recipes,
        recipeCount: recipeCount, 
        loggedInUserProfile: this.props.loggedInUserProfile,
        activeKey: 1,
        notificationsList: notifications, 
        followingListProfile: following.data, 
        pullRequests: pullRequests,
        openPullRequests: openPullRequests.length, 
        followers: user.data.followers
      }); 

      var followingCount = following.data.length; 
      if (this.props.loggedInUserProfile && this.props.followingListMaster.length < followingCount) {
        this.props.handleSetFollowingListMaster(following.data); 
      }

    }))
    .catch((error) => {
      console.log(error); 
    }); 
  }

  getUser(usernameParameter) {
    return axios.get(`/${usernameParameter}/profile`); 
  }

  getPullRequests(usernameParameter) {
    return axios.get(`/${usernameParameter}/get-pulls`); 
  }

  getNotifications(usernameParameter) {
    return axios.get(`/${usernameParameter}/get-notifications`); 
  }

  getFollowing(usernameParameter) {
    return axios.get(`/${usernameParameter}/get-followed-users`); 
  }

  handleTabSelect(eventKey) {
    event.preventDefault(); 
    this.setState({activeKey: eventKey}); 
  }

  requestPullRequests(event) {
    event.preventDefault(); 
    console.log('requesting pull request data!'); 
    var usernameParameter = this.props.params.username; 
    axios.get(`/${usernameParameter}/get-pulls`)
    .then((result) => {
      console.log('successful request pull'); 
      console.log(result); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  _renderNavigationBar(){
    if (this.state.loggedInUserProfile) {
      return (
        <Nav bsStyle="tabs" justified activeKey={this.state.activeKey} onSelect={this.handleTabSelect.bind(this)} style={{marginTop: 20}}>
          <NavItem eventKey={1} title="Recipes">Recipes</NavItem>
          <NavItem eventKey={2} title="Notifications">Notifications</NavItem>
          <NavItem eventKey={3} title="Following">Following</NavItem>
          <NavItem eventKey={4} title="PullRequests">Pull Requests <Badge>{this.state.openPullRequests}</Badge></NavItem>
        </Nav>
      )
    } else {
      return (
        <Nav bsStyle="tabs" justified activeKey={this.state.activeKey} onSelect={this.handleTabSelect.bind(this)} style={{marginTop: 20}}>
          <NavItem eventKey={1} title="Recipes">Recipes</NavItem>
          <NavItem eventKey={2} title="Notifications" disabled>Notifications</NavItem>
          <NavItem eventKey={3} title="Following">Following</NavItem>
          <NavItem eventKey={4} title="PullRequests" disabled>Pull Requests</NavItem>
        </Nav>
      )
    }
  }

  _renderActiveComponent(){
      if (this.state.loggedInUserProfile) {
        var buttonText = 'edit'; 
        var handleButtonClick = this.props.handleRecipeEditClick; 
      } else {
        var buttonText = 'fork'; 
        var handleButtonClick = this.props.handleRecipeForkClick; 
      }
      if (this.state.activeKey === 1 && this.state.recipeList !== undefined) {
        return (
          this.state.recipeList.map((recipe, i) => (
            <RecipeListEntry 
              key={i + '' +recipe.rootRecipeId} 
              recipe={recipe} 
              username={this.state.username}
              branches={recipe.branches || []}
              buttonText={buttonText}
              handleForkedFromUserClick={this.props.handleUserClick} 
              handleRecipeViewClick={this.props.handleRecipeViewClick}
              handleButtonClick={handleButtonClick}
            />
          ))
        )
      } else if (this.state.activeKey === 2 && this.state.notificationsList !== undefined) {
        return (
          this.state.notificationsList.map((notification, i) => (
             <NotificationsListEntry
              key={'notification' + i} 
              user={notification.username} 
              text={notification.text.split(' ').slice(1).join(' ')} 
              notification={notification}
              handleUserClick={this.props.handleUserClick}
              handleViewIssuesClick={this.props.handleViewIssuesClick}
            />
          ))
        )
      } else if (this.state.activeKey === 3 && this.state.followingListProfile !== undefined) {
        return (
          this.state.followingListProfile.map((user, i) => (
             <FollowingListEntry 
              key={'following' + i} 
              user={user} 
              skillLevel={Math.floor(Math.random() * 100)}
              handleUserClick={this.props.handleUserClick}
            />
          ))
        )
      } else if (this.state.activeKey === 4 && this.state.pullRequests !== undefined) {
        return (
          this.state.pullRequests.received.map((pullRequest, i) => (
             <PullRequestEntry 
              key={'pullRequest' + i} 
              pullRequest={pullRequest}
              month={month}
              username={this.props.params.username}
              handleUserClick={this.props.handleUserClick}
              handlePullRequestClick={this.props.handlePullRequestClick}
            />
          ))
        )
      }
    }

  _renderJoinDate(createdAt) {
    if (createdAt) {
      var parseDate = createdAt.split('T')[0].split('-'); 
      return (
        <p><Glyphicon glyph="time" style={{marginRight: 5}}/>{`Joined on ${month[parseDate[1] - 1]} ${parseDate[2]}, ${parseDate[0]}`}</p>
      )
    }
  }

  render() {
    return (
      <Grid> 
        <Row> 
          <Col xs={4} md={4}>
            <img src={this.state.image} width={250} height={250} style={{borderRadius: 10, marginTop: 15}} />
            <h3 style={{color: 'gray'}}> {this.state.username} </h3>
            <p style={{color: 'blue', borderBottom: "1px solid rgba(128,128,128, 0.2)"}}> {this.state.userProfile.bio || 'Add a bio'} </p> 
            <p style={{color: 'blue'}}><Glyphicon glyph="envelope" style={{marginRight: 5}}/>{this.state.userProfile.email}</p>
            {this._renderJoinDate(this.state.userProfile.createdAt)}
          </Col> 
          <Col xs={8} md={8}>
            <UserStats 
              loggedInUserProfile={this.props.loggedInUserProfile} 
              followUser={this.state.followUser}
              recipeCount={this.state.recipeCount} 
              followers={this.state.followers} 
              handleFollowUserClick={this.props.handleFollowUserClick}
              followingListMaster={this.props.followingListMaster}
              profileUsername={this.props.params.username}
            />
            {this._renderNavigationBar()}
            {this._renderActiveComponent()}
          </Col>
        </Row> 
      </Grid> 
    );
  }
}

export default UserProfile;


