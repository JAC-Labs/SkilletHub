import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import RecipeDescription from './RecipeDescription';
import RecipeIngredients from './RecipeIngredients';
import ReadME from './ReadME';
import CookMe from '../CookRecipe/CookMeMain';
import RecipeStats from './RecipeStats'; 
import VersionControl from './RecipeVersionControl'; 

//Bootstrap 
import { Grid, Row, Col, Table, Button, Form, FormGroup, FormControl, ControlLabel, Well } from 'react-bootstrap';

// Placeholder recipe data 
import placeholders from '../../../../placeholders'
import meatloafRecipe from '../../../../meatloafRecipe'

// Axios 
var axios = require('axios'); 

class RecipeMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe: placeholders.recipeTemplate,
      // user: {},
      username: '', 
      recipeIngredients: [],
      recipeSteps: [],
      selectedBranch: '', 
      branchVersions: [],
      recipeBranches: [], 
      createBranch: '',
      ownRecipe: false
    }; 
  }

  componentWillMount() {
    // console.log('Main recipe page is mounting!'); 
    // console.log('PARAMS RECIPE PAGE: ', this.props.params); 
    // var usernameParameter = this.props.params.username; 
    var usernameParameter = this.props.params.username; 
    // console.log('USERNAME PARAMETER:', usernameParameter); 

    var recipeParameter = this.props.params.recipe; 
    // console.log('RECIPE PARAMETER:', recipeParameter); 

    axios.get(`/${usernameParameter}/${recipeParameter}`)
    .then((result)=> {
      // console.log(result.data); 
      // console.log(Object.keys(result.data)); 
      var recipe = result.data; 
      console.log('RECIPE: ', recipe); 
      // console.log('DESCRIPTION:', recipe.description.value); 
      if (this.props.username === recipe.forkedFrom || recipe.forkedFrom === undefined) {
        var ownRecipe = true; 
      } else {
        ownRecipe = false; 
      }
      console.log('OWN RECIPE: ', ownRecipe); 

      this.setState({
        recipe: recipe,
        username: usernameParameter, 
        recipeIngredients: recipe.ingredients, 
        recipeSteps: recipe.steps,
        recipeBranches: recipe.branches,
        selectedBranch: recipe.branch,
        selectedVersion: recipe._id, 
        ownRecipe: ownRecipe
      }); 

      var branch = recipe.branch; 
      this.requestVersionData(branch); 

    })
    .catch((error)=> {
      console.log('Axios error: ', error); 
    }); 
  }

  requestVersionData(branch) {
    var usernameParameter = this.props.params.username; 
    var recipeParameter = this.props.params.recipe; 
    axios.get(`/${usernameParameter}/${recipeParameter}/${branch}/versions`)
    .then((result) => {
      console.log('REQUESTED VERSIONS!'); 
      console.log(result.data); 
      var branchVersions = result.data; 
      console.log(branchVersions); 
      this.setState({
        branchVersions: branchVersions
      }); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  requestSelectedVersion(event) {
    var usernameParameter = this.props.params.username; 
    var recipeParameter = this.props.params.recipe; 
    var branchParameter = this.state.selectedBranch;
    var versionParemeter = event.target.value; 
    axios.get(`/${usernameParameter}/${recipeParameter}/${branchParameter}/${versionParemeter}`)
    .then((result) => {
      console.log(result.data); 
      console.log(Object.keys(result.data)); 
      var recipe = result.data; 

      console.log('NAME: ', recipe.name.value); 
      console.log('DESCRIPTION:', recipe.description.value); 
      
      this.setState({
        recipe: recipe,
        username: usernameParameter, 
        recipeIngredients: recipe.ingredients, 
        recipeSteps: recipe.steps,
        recipeBranches: recipe.branches,
        selectedVersion: recipe._id
      });

    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handleBranchSelect(event) {
    event.preventDefault(); 
    console.log('SELECTED BRANCH!'); 
    var branch = event.target.value; 
    console.log('BRANCH IS:', branch); 
    this.setState({
      selectedBranch: branch
    }); 
    this.requestVersionData(branch); 
  }

  handleVersionSelect(event) {
    event.preventDefault(); 
    console.log('SELECTED VERSION!'); 
    var version = event.target.value; 
    console.log('VERSION IS:', version); 
    this.requestSelectedVersion(event); 
  }

  // handleChange (event) {
  //   var inputType = event.target.id; 
  //   if (inputType === 'createBranch') {
  //     this.setState({createBranch: event.target.value}); 
  //   }
  // }

  handleCreateBranch(event) {
    event.preventDefault(); 
    var branch = this.state.createBranch;
    this.requestCreateBranch(branch); 
  }

  requestCreateBranch(branch) {
    var usernameParameter = this.props.params.username; 
    var recipeParameter = this.props.params.recipe; 
    var selectedVersion = this.state.selectedVersion
    console.log('ATTEMPTING TO CREATE BRANCH!'); 
    console.log(branch); 

    axios.post(`/${usernameParameter}/${recipeParameter}/${branch}`, {
      versionId: selectedVersion
    })
    .then((result) => {
      console.log('CREATED NEW BRANCH'); 
      console.log(result); 
      browserHistory.push(`/Recipe/${usernameParameter}/${recipeParameter}`); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handleClick(event) {
    event.preventDefault(); 
    var buttonType = event.target.id; 

    // Fork the selected recipe 
    if (buttonType === 'fork') {
      var recipeObject = {};
      recipeObject.username = this.props.params.username; 
      recipeObject.recipe = this.props.params.recipe; 
      recipeObject.branch = this.state.selectedBranch; 
      recipeObject.version = this.state.selectedVersion; 
      this.props.handleRecipeVersionFork(recipeObject); 
    }

    if (buttonType === 'cook') {
      console.log('Cooking recipe'); 
      // var route = '/CookMe/'+this.state.username+'/'+this.props.params.recipe;
      // console.log('NAVIGATING TO:', route); 
      // browserHistory.push(`${route}`);
      var recipeObject = {};
      recipeObject.username = this.props.params.username;
      recipeObject.recipe = this.props.params.recipe;
      recipeObject.branch = this.state.selectedBranch; 
      recipeObject.version = this.state.selectedVersion; 
      this.props.handleRecipeCookClick(recipeObject);
    }

    if (buttonType === 'edit') {
      var recipeObject = {};
      recipeObject.username = this.props.params.username; 
      recipeObject.recipe = this.props.params.recipe; 
      recipeObject.branch = this.state.selectedBranch; 
      recipeObject.version = this.state.selectedVersion; 
      this.props.handleRecipeVersionEdit(recipeObject); 
    }

    if (buttonType === 'pull') {
      var recipeObject = {};
      recipeObject.username = this.props.params.username; 
      recipeObject.recipe = this.props.params.recipe; 
      recipeObject.branch = this.state.selectedBranch; 
      recipeObject.version = this.state.selectedVersion;
      recipeObject.sourceUser = this.state.recipe.forkedFrom; 
      recipeObject.sourceRecipe = this.state.recipe.rootVersion;  
      this.props.handleRecipeVersionPull(recipeObject); 
    }

    if (buttonType === 'issue') {
      var recipeObject = {};
      if (this.state.ownRecipe) {
        recipeObject.usernameParameter = this.props.params.username; 
        recipeObject.recipeParameter = this.props.params.recipe;  
      } else {
        recipeObject.usernameParameter = this.state.recipe.forkedFrom; 
        recipeObject.recipeParameter = this.state.recipe.rootVersion;  
      }
      this.props.handleNewIssueClick(recipeObject); 
    }

    if (buttonType === 'issuesList') {
      var usernameParameter = this.props.params.username; 
      var recipeParameter = this.props.params.recipe; 
      this.props.handleViewIssuesClick(usernameParameter, recipeParameter); 
    }

    if (buttonType === 'viewIssues') {
      var usernameParameter = this.state.recipe.forkedFrom; 
      var recipeParameter = this.state.recipe.rootVersion; 
      this.props.handleViewIssuesClick(usernameParameter, recipeParameter); 
    }
  }

  _renderCreateBranch(){
    var branch = this.state.selectedBranch; 
    if (branch === 'create branch') {
      return (
        <form onSubmit={this.handleCreateBranch.bind(this)}> 
          <FormGroup>
            <ControlLabel>New Branch</ControlLabel>
              <FormControl type="text" id='createBranch' value={this.state.createBranch} onChange={this.handleChange.bind(this)} />
          </FormGroup>
          <Button type='submit' style={{display: 'none'}}>
            submit
          </Button>
        </form> 
      )
    } else {
      return (
        <FormGroup>
          <ControlLabel>Version</ControlLabel>
          <FormControl componentClass="select" id="unit" onChange={this.handleVersionSelect.bind(this)} >
            {this.state.branchVersions.map((version, i)=> (
              <option key={'version' + i} value={version._id}>{version._id} : version {i}</option>
            ))}
          </FormControl>
        </FormGroup>
      )
    }
  }

  render() {
    return (
      <Grid>
        <Row style={{margin: 10}}> 
          <h3> {this.state.username} / {this.state.recipe.name.value}</h3>
        </Row> 
        <Row>
          <Col xs={5} md={5}>
            <Well>
              <img style={{height: 300, maxWidth: 340, borderRadius: 10}} src={this.state.recipe.picture.value} alt={'picture of food'}/>
            </Well>
          </Col>
          <Col xs={7} md={7}>
              <RecipeDescription style={{height: 300}} recipeDescription={this.state.recipe} handleClick={this.handleClick.bind(this)}/>
          </Col> 
        </Row> 
        <Row>
          <RecipeStats branches={this.state.recipeBranches}/> 
        </Row>
        <Row> 
          <VersionControl 
            ownRecipe={this.state.ownRecipe}
            selectedBranch={this.state.selectedBranch}
            branchVersions={this.state.branchVersions}
            recipeBranches={this.state.recipeBranches}
            handleCreateBranch={this.handleCreateBranch.bind(this)}
            handleVersionSelect={this.handleVersionSelect.bind(this)}
            handleBranchSelect={this.handleBranchSelect.bind(this)}
            handleClick={this.handleClick.bind(this)}
            loggedInUserProfile={this.props.loggedInUserProfile}
          />
        </Row>
        <Row> 
          <Well> 
            <RecipeIngredients ingredientList={this.state.recipeIngredients}/>
          </Well>
        </Row>
        <Row> 
          <ReadME readME={this.state.recipeSteps}/>
        </Row>
      </Grid> 
    );
  }
}

export default RecipeMain;
