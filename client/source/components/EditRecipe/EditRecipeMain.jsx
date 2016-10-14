import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import EditIngredients from './EditIngredientsMain';
import EditSteps from './EditSteps';
import InvalidStepsModal from './invalidStepsModal'; 

//Bootstrap 
import { Grid, Row, Col, Form, FormGroup, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';

// Server Requests
var axios = require('axios');
var _ = require('underscore'); 

// Placeholder recipe data 
import placeholders from '../../../../placeholders';
import meatloafRecipe from '../../../../meatloafRecipe'


class EditRecipeMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      servings: '',
      servingsMin: '',
      servingsMax: '', 
      skillLevel: '', 
      description: '', 
      cookTime: '',
      picture: '',
      ingredients: [],
      availableIngredients: [], 
      deletedIngredients: [],
      steps: [],
      editRecipe: {},
      invalidSteps: [],
      showModal: false,
      originalRecipeObject: {}
    }; 
  }

  componentWillMount() {

    var usernameParameter = this.props.params.username; 
    var recipeParameter = this.props.params.recipe;

    axios.get(`/${usernameParameter}/${recipeParameter}`)
    .then((result)=> {
      // Parse result object to get relevant recipe data
      var recipe = result.data; 
      var servings = recipe.servings.value.split(' '); 
      var availableIngredients = recipe.ingredients.map((ingredient) => { return ingredient.name}); 

      // Set all ingredient and step changed values to false
      var steps = recipe.steps.map((step) => {
        step.changed = false; 
        return step; 
      }); 

      var ingredients = recipe.ingredients.map((ingredient) => {
        ingredient.changed = false; 
        return ingredient; 
      }); 

      this.setState({
        name: recipe.name.value,
        servings: recipe.servings.value,
        servingsMin: servings[1],
        servingsMax: servings[3], 
        skillLevel: recipe.skillLevel.value, 
        description: recipe.description.value, 
        cookTime: recipe.cookTime.value,
        picture: recipe.picture.value,
        ingredients: ingredients,
        availableIngredients: availableIngredients,
        editRecipe: {},  
        steps: steps,
        originalRecipeObject: recipe
      }); 

    })
    .catch((error)=> {
      console.log(error); 
    }); 
  }

  // _renderIngredientsTest() {
  //   var testIngredients = this.state.ingredients; 
  //   var testString = testIngredients.map((ingredient) => {
  //     return `Position: ${ingredient.position} Name: ${ingredient.name} Changed: ${ingredient.changed} Added: ${ingredient.added || 'NA'} Deleted: ${ingredient.deleted || 'NA'}`; 
  //   }); 
  //   return (
  //     testString.map((ingredient) => (
  //       <h4> {ingredient} </h4>
  //     ))
  //   )
  // }

  // _renderIngredientsTest2() {
  //   var testIngredients = this.state.testIngredients; 
  //   var display = this.state.displayOutput; 

  //   if (display) {
  //     var testString = testIngredients.map((ingredient) => {
  //       return `Position: ${ingredient.position} Name: ${ingredient.name} Changed: ${ingredient.changed} Added: ${ingredient.added || 'NA'} Deleted: ${ingredient.deleted || 'NA'}`; 
  //     }); 
  //     return (
  //        testString.map((ingredient) => (
  //          <h4> {ingredient} </h4>
  //        ))
  //     ) 
  //   }
  // }

  // _renderObjectTest() {
  //   var testObject = this.state.editRecipeObject; 
  //   var display = this.state.displayOutput; 

  //   if (display) {
  //     var testObjectKeys = Object.keys(testObject); 
  //     return (
  //       testObjectKeys.map((key) => (
  //         <h4> {key} : {JSON.stringify(testObject[key])} </h4>
  //       ))
  //     ) 
  //   }
  // }

  closeModal() {
    // console.log('FIRING CLOSE MODAL IN APP!'); 
    this.setState({showModal: false}); 
  }

  _renderInvalidStepModal() {
    var display = this.state.showModal; 
    var invalidSteps = this.state.invalidSteps; 
    if (display) {
      return (
        <InvalidStepsModal invalidSteps={invalidSteps} closeModal={this.closeModal.bind(this)}/>
      )
    } else {
      return; 
    }
  }

  handleChange (event) {
    var editRecipe = this.state.editRecipe; 
    var inputType = event.target.id;
    if (inputType === 'name'){
      editRecipe['name'] = true; 
      this.setState({ name: event.target.value, editRecipe: editRecipe });
    } 
    if (inputType === 'servingsMin'){
      editRecipe['servings'] = true; 
      this.setState({servingsMin: event.target.value, editRecipe: editRecipe }); 
    } 
    if (inputType === 'servingsMax'){
      this.setState({servingsMax: event.target.value}); 
    } 
    if (inputType === 'description'){
      editRecipe['description'] = true; 
      this.setState({description: event.target.value, editRecipe: editRecipe}); 
    } 
    if (inputType === 'skill'){
      editRecipe['skillLevel'] = true; 
      this.setState({skillLevel: event.target.value, editRecipe: editRecipe}); 
    } 
  }

  handleAddIngredient(ingredient) {
    // Determine current state of ingredients 
    var ingredients = this.state.ingredients;
    var ingredient = ingredient; 
    ingredient.added = true; 
    ingredients.push(ingredient); 
    var availableIngredients = this.state.availableIngredients; 
    availableIngredients.push(ingredient.name); 

    // Set the new state 
    this.setState({
      ingredients: ingredients, 
      availableIngredients: availableIngredients
    }); 
  }

  handleEditIngredient(ingredient) {
    // Determine current state of ingredients
    var ingredients = this.state.ingredients;
    var editIngredient = ingredient;
    var name = editIngredient.name; 

    ingredients.forEach((ingredient) => {
      if (ingredient.name === name) {
        ingredient.changed = editIngredient.changed; 
        ingredient.amount = editIngredient.amount; 
        ingredient.unit = editIngredient.unit; 
        ingredient.prep = editIngredient.prep; 
        ingredient.optional = editIngredient.optional;
      }
    }); 

    // Set the new state 
    this.setState({
      ingredients: ingredients
    }); 
  }

  handleDeleteIngredient(ingredient) {
    // Determine current state of ingredients 
    var deletedIngredient = ingredient.name; 
    var ingredients = this.state.ingredients;
    var deletedIngredients = this.state.deletedIngredients; 

    // Search based on ingredient name and modify properties as necessary
    ingredients.forEach((ingredient, i) => {
      if (ingredient.name === deletedIngredient) {
        deletedIngredients.push(ingredient.name); 
        ingredient.display = 'none'; 
        ingredient.deleted = true; 
        ingredient.changed = true; 
        console.log('DELETED INGREDIENT OBJECT: '); 
        console.log(ingredient);
      }
    });

    // Modify availableIngredients by filtering out deleted ingredients
    var availableIngredients = ingredients
    .filter((ingredient) => { 
      if (!ingredient.changed || !ingredient.deleted || ingredient.added) {
        return ingredient; 
      }
    })
    .map((ingredient) => {return ingredient.name});

    this.setState({
      ingredients: ingredients,
      availableIngredients: availableIngredients,
      deletedIngredients: deletedIngredients
    }); 
  }

  handleAddStep(step) {
    // Determine current state of steps 
    var steps = this.state.steps;
    var step = step; 
    step.added = true; 
    step.changed = true; 
    steps.push(step); 

    // Set the new state 
    this.setState({
      steps: steps
    }); 
  }

  handleEditStep(step) {
    // Determine current state of steps 
    var steps = this.state.steps;
    var editStep = step;
    var position = editStep.position; 

    steps.forEach((step) => {
      if (step.position === position) {
        step.changed = editStep.changed; 
        step.description = editStep.description; 
        step.ingredients = editStep.ingredients; 
        step.time = editStep.time; 
      }
    }); 

    // Set the new state 
    this.setState({
      steps: steps
    }); 
  }

  handleDeleteStep(step) {
    // Determine current state of ingredients 
    var deletedStep = step; 
    var steps = this.state.steps;
    var index = 0; 

    // Search based on ingredient name and modify properties as necessary
    steps.forEach((step, i) => {
      if (step.position === deletedStep.position) {
        step.deleted = true; 
        step.changed = true; 
        index = i; 
      }
    });

    this.setState({
      steps: steps
    }); 
  }

  reconcileSteps(steps) {
    var deletedSteps = []; 
    var steps = steps.filter((step) => {
      if (!step.deleted) {
        return step; 
      } else {
        step.position = null; 
        step.changed = false; 
        deletedSteps.push(step); 
      }
    })
    .map((step, i) => {
      if (step.position !== i + 1) {
        step.changed = true; 
        step.position = i + 1; 
      }
      return step; 
    })
    .filter((step) => {
      if (step.changed) {
        return step; 
      }
    }); 
    return steps.concat(deletedSteps); 
  }

  reconcileIngredients(ingredients) {
    var deletedIngredients = []; 
    var ingredients = ingredients.filter((ingredient) => {
      if (!ingredient.deleted) {
        return ingredient; 
      } else {
        // console.log('Adding deleted ingredient!'); 
        ingredient.position = null; 
        ingredient.changed = false; 
        deletedIngredients.push(ingredient); 
      }
    })
    .map((ingredient, i) => {
      if (ingredient.position !== i + 1) {
        ingredient.changed = true; 
        ingredient.position = i + 1; 
      }
      return ingredient; 
    })
    .filter((ingredient) => {
      if (ingredient.changed) {
        return ingredient; 
      }
    }); 
    // return ingredients.concat(deletedIngredients); 
    var ingredientsObject = {}; 
    ingredientsObject.deletedIngredients = deletedIngredients; 
    ingredientsObject.ingredients = ingredients; 
    return ingredientsObject; 
  }

  //// TEST FOR OUTPUT
  ////////// 

  handleRecipeEditSubmit(event) {
    event.preventDefault(); 

    // Define our request object -> editRecipeObject
    var editRecipe = this.state.editRecipe; 
    var editRecipeObject = {}; 

    // Assign the values to object properties the database expects 
    var edits = Object.keys(editRecipe);
    edits.forEach((edit) => {
      if (edit === 'servings') {
        editRecipeObject[edit] = {changed: true, value: `serves ${this.state.servingsMin} to ${this.state.servingsMax}`};
      } else {
        editRecipeObject[edit] = {changed: true, value: this.state[edit]};
      }
    }); 

    var editSteps = this.reconcileSteps(this.state.steps); 
    var editIngredients = this.reconcileIngredients(this.state.ingredients); 

    editRecipeObject.steps = editSteps; 
    editRecipeObject.ingredients = editIngredients.ingredients.concat(editIngredients.deletedIngredients); 

    var deletedIngredients = editIngredients.deletedIngredients.map((ingredient => { return ingredient.name; })); 
    // console.log('DELETE INGREDIENTS'); 
    // console.log(deletedIngredients); 

    var steps = this.state.steps; 
    var invalidSteps = []; 
    steps.forEach((step, i) => {
      deletedIngredients.forEach((ingredient) => {
        var regEx = RegExp(ingredient, 'i');
        var parsedIngredient = regEx.exec(step.description); 
        if (parsedIngredient) {
          invalidSteps.push(i); 
        }
      });
    }); 

    if (invalidSteps.length > 0) {
      // Set state of invalid steps and display warning modal 
      this.state.invalidSteps = invalidSteps; 
      this.state.showModal = true;
      this.forceUpdate();        
    } else {
      // editRecipeObject is valid, execute the 'POST' request
      var usernameParameter = this.props.params.username; 
      var recipeParameter = this.props.params.recipe; 
      var originalRecipeObject = this.state.originalRecipeObject; 
      var branchParameter = originalRecipeObject.branch; 

      // console.log('EDIT RECIPE OBJECT'); 
      // console.log(editRecipeObject); 

      editRecipeObject.steps.forEach((step) => {
        delete step.added; 
        delete step.deleted; 
        delete step.edited;
        delete step.unitsMenu; 
        delete step.validationState;  
      }); 

      editRecipeObject.ingredients.forEach((ingredient) => {
        delete ingredient.added; 
        delete ingredient.deleted; 
        delete ingredient.edited; 
      }); 

      // console.log('EDIT CLEANED RECIPE OBJECT'); 
      // console.log(editRecipeObject); 

      axios.post(`/${usernameParameter}/${recipeParameter}/${branchParameter}/create-version`, {
        previous: originalRecipeObject, 
        changes: editRecipeObject
      })
      .then((result) => {
        console.log(result); 
        browserHistory.push(`/User/${usernameParameter}`);
      })
      .catch((error) => {
        console.log(error); 
      }) 
    }
  }

  render() {
    return (
      <Grid> 
      <h3 style={{display: 'inline'}}> Edit Recipe </h3> <Button style={{display: 'inline'}} onClick={this.handleRecipeEditSubmit.bind(this)}> Commit Edit </Button> 
      {this._renderInvalidStepModal()}
      <Row className="show-grid">
        <Col xs={4} md={4}> 
            <form>
              <FormGroup style={{padding: 5}}>
              <ControlLabel> Recipe Name </ControlLabel>
              <FormControl type="text" id="name" onChange={this.handleChange.bind(this)} value={this.state.name} required/>
              </FormGroup>
            </form>
        </Col>
        <Col xs={2} md={2}> 
            <form>
              <FormGroup style={{padding: 5}}>
              <ControlLabel> Servings Min </ControlLabel>
              <FormControl type="number" id="servingsMin" onChange={this.handleChange.bind(this)} value={this.state.servingsMin} />
              </FormGroup>
            </form>
        </Col>
        <Col xs={2} md={2}> 
            <form>
              <FormGroup style={{padding: 5}}>
              <ControlLabel> Servings Max </ControlLabel>
              <FormControl type="number" id="servingsMax" onChange={this.handleChange.bind(this)} value={this.state.servingsMax} />
              </FormGroup>
            </form>
        </Col>
        <Col xs={4} md={4}> 
          <form> 
          <FormGroup style={{padding: 5}}>
            <ControlLabel>Recipe Skill Level</ControlLabel>
            <FormControl componentClass="select" onChange={this.handleChange.bind(this)} id="skill">
              <option value="previous">{this.state.skillLevel}</option>
              <option value="Junior Dev">Junior Dev</option>
              <option value="Kitchen Team Lead">Kitchen Team Lead</option>
              <option value="Scrum Master">Scrum Master</option>
            </FormControl>
          </FormGroup>
          </form>
        </Col>
      </Row>
      <Row className="show-grid">
        <Col xs={12} md={12}> 
            <form>
              <FormGroup style={{padding: 5}}>
              <ControlLabel> Recipe Description </ControlLabel>
              <FormControl componentClass="textarea" id="description" style={{height: 85}} onChange={this.handleChange.bind(this)} value={this.state.description} />
              </FormGroup>
            </form>
        </Col>
      </Row>
      <EditIngredients 
        ingredients={this.state.ingredients} 
        handleAddIngredient={this.handleAddIngredient.bind(this)} 
        handleEditIngredient={this.handleEditIngredient.bind(this)}
        handleDeleteIngredient={this.handleDeleteIngredient.bind(this)} 
      />
      <EditSteps 
        steps={this.state.steps} 
        invalidSteps={this.state.invalidSteps} 
        availableIngredients={this.state.availableIngredients} 
        deletedIngredients={this.state.deletedIngredients}
        handleAddStep={this.handleAddStep.bind(this)} 
        handleDeleteStep={this.handleDeleteStep.bind(this)} 
        handleEditStep={this.handleEditStep.bind(this)}
      />
      </Grid> 
    );
  }
}

export default EditRecipeMain;
