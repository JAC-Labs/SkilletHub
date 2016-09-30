// React + React-Router Dependencies
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

// Importing the React components from components folder
import App from './components/App';
import LandingPage from './components/LandingPage';
import User from './components/UserPage';
import RecipeMain from './components/Recipe/RecipeMain'; 
import CreateRecipeMain from './components/CreateRecipe/CreateRecipeMain'; 
import EditRecipeMain from './components/EditRecipe/EditRecipeMain'; 

render((
	<Router history={browserHistory}> 
	  <Route path="/" component={App}>
	  	<IndexRoute component={LandingPage} />
	  	<Route path="/User" component={User} />
	  	<Route path="/Recipe" component={RecipeMain} />
	  	<Route path="/Create" component={CreateRecipeMain} />
	  	<Route path="/Edit" component={EditRecipeMain} />
	  </Route>
	</Router>
), document.getElementById('app'));