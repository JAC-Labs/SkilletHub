// React + React-Router Dependencies
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

// Importing the React components from components folder
import App from './components/App';
import Auth from './components/Auth/Auth';
import LandingPage from './components/LandingPage';
import User from './components/User/UserPage';
import RecipeMain from './components/Recipe/RecipeMain'; 
import CreateRecipeMain from './components/CreateRecipe/CreateRecipeMain'; 
import EditRecipeMain from './components/EditRecipe/EditRecipeMain';
import EditRecipeVersionMain from './components/EditRecipe/EditRecipeVersionMain';
import PullRequest from './components/PullRequest/PullRequestMain';
import ManagePullRequest from './components/PullRequest/ManagePullRequest';
import CookMeMain from './components/CookRecipe/CookMeMain'; 
import ExploreMain from './components/Explore/ExploreMain'; 
import SearchResultsMain from './components/SearchExplore/SearchResultsMain'; 
import IssuesMain from './components/Issues/IssuesMain'; 
import IssuesList from './components/Issues/IssuesList'; 
import IssuesManage from './components/Issues/IssuesManage'; 

//TODO: Enter authentication 

render((
	<Router history={browserHistory}> 
	  <Route path="/" component={App}>
	  	<IndexRoute component={LandingPage} />
	  	<Route path="/User" component={User} />
      <Route path="/User/:username" component={User} />
	  	<Route path="/Recipe" component={RecipeMain} />
	  	<Route path="/Recipe/:username/:recipe" component={RecipeMain} />
	  	<Route path="/Cookme/:username/:recipe" component={CookMeMain} />
	  	<Route path="/Search/:search" component={SearchResultsMain} />
	  	<Route path="/Create" component={CreateRecipeMain} />
	  	<Route path="/Edit" component={EditRecipeMain} />
	  	<Route path="/Edit/:username/:recipe" component={EditRecipeMain} />
	  	<Route path="/Edit/:username/:recipe/:branch/:version" component={EditRecipeVersionMain} />
	  	<Route path="/Pull/:username/:recipe/:branch/:version/:sourceUser/:sourceRecipe" component={PullRequest} />
	  	<Route path="/EditPull/:targetUser/:pullId/:username/:recipe/:branch/:version" component={EditRecipeVersionMain} />
	  	<Route path="/Manage/:username/:pullId" component={ManagePullRequest} />
	  	<Route path="/Manage/:username/:recipe/:branch/:version/:pullUser/:pullRecipe" component={ManagePullRequest} />
	  	<Route path="/Explore" component={ExploreMain} />
	  	<Route path="/Issues/:username/:recipe" component={IssuesMain} /> 
	  	<Route path="/Issues/List/:username/:recipe" component={IssuesList} /> 
	  	<Route path="/Issues/Manage/:username/:recipe" component={IssuesManage} /> 
	  </Route>
	</Router>
), document.getElementById('app'));
