import React from 'react';

//Bootstrap 
import { Grid, Row, Col, Form, FormGroup, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';
import UnitDropdown from './UnitDropdown'; 

const units = ['select unit', 'tsp.', 'tbsp.', 'fl.oz.', 'cup', 'pt.', 'qt.', 'gal.', 'g', 'kg', 'oz.', 'lbs', 'whole']; 

import meatloafRecipe from '../../../../meatloafRecipe'

// Promises
import Promise from 'bluebird';

class EditIngredientEntry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			changed: false,
			disabled: true, 
			ingredient: null,
			name: null,
			amount: null,
			unit: null, 
			prep: null, 
			optional: null,
			position: null   
		}; 
	}

	componentWillMount(){
		// var meatloafIngredients = meatloafRecipe.ingredients; 
		// Configure the units dropdown to demonstrate the selected unit first. 
		var unitsMenu = units.slice(0);
		unitsMenu[0] = this.props.ingredient.unit;  
		this.setState({
			ingredient: this.props.ingredient,
			name: this.props.ingredient.name,
			amount: this.props.ingredient.amount,
			unit: this.props.ingredient.unit,
			unitsMenu: unitsMenu, 
			prep: this.props.ingredient.prep,
			optional: this.props.ingredient.optional,
			position: this.props.ingredient.position,
			display: "display"
		}); 
	}

	componentWillReceiveProps(){
		// console.log('INDIVIDUAL COMPONENT RECEIVING PROPS!'); 
		// console.log(this.props.ingredient.name); 
		var unitsMenu = units.slice(0);
		unitsMenu[0] = this.props.ingredient.unit;  
		this.setState({
			ingredient: this.props.ingredient,
			name: this.props.ingredient.name,
			amount: this.props.ingredient.amount,
			unit: this.props.ingredient.unit,
			unitsMenu: unitsMenu, 
			prep: this.props.ingredient.prep,
			optional: this.props.ingredient.optional,
			position: this.props.ingredient.position,
			display: this.props.ingredient.display
		}); 
	}

	handleClick (event) {
		event.preventDefault(); 
		
		this.setState({
			changed: true, 
			disabled: false
		}); 
	}

	handleDelete (event) {
		event.preventDefault(); 

		var ingredient = this.state;
		ingredient.display = 'none'; 
		// console.log('DELETING FROM ENTRY: ');
		// console.log(ingredient); 
		this.props.handleDeleteIngredient(ingredient); 
		this.setState({display: 'none'}); 
	}

	handleEdit(event){
		event.preventDefault(); 
		console.log('EDITING INGREDIENT'); 
		var ingredient = this.state;
		this.props.handleEditIngredient(ingredient); 
	}

	handleChange (event) {
	  var inputType = event.target.id; 
	  if (inputType === 'name') {
	  	this.setState({name: event.target.value}); 
	  } else if (inputType === 'amount') {
	  	this.setState({amount: event.target.value}); 
	  } else if (inputType === 'unit') {
	  	this.setState({unit: event.target.value}); 
	  } else if (inputType === 'prep') {
	  	this.setState({prep: event.target.value}); 
	  } else if (inputType === 'optional') {
	  	this.setState({optional: event.target.value}); 
	  } 
	}

	render() {
		return (
			<Row style={{marginBottom: 15}}> 
				<Form inline style={{display: this.state.display}} onSubmit={this.handleEdit.bind(this)}>
				<Col xs={2} md={2}>
				  <FormGroup controlId="name">
				    <FormControl type="text" disabled={this.state.disabled} value={this.state.name} onChange={this.handleChange.bind(this)} />
				  </FormGroup>
				</Col>
				<Col xs={2} md={2}>
				  <FormGroup controlId="amount">
				    <FormControl type="number" disabled={this.state.disabled} value={this.state.amount} onChange={this.handleChange.bind(this)} />
				  </FormGroup>
				</Col>
				<Col xs={2} md={2}>
          <FormGroup controlId="unit">
            <FormControl componentClass="select" style={{width: '100%'}}  onChange={this.handleChange.bind(this)} disabled={this.state.disabled}>
              {this.state.unitsMenu.map((unit, i)=> (
              	<option key={'unit' + i} value={unit}>{unit}</option>
              ))}
            </FormControl>
          </FormGroup>
				</Col>
				<Col xs={2} md={2}>
				  <FormGroup controlId="prep">
				    <FormControl type="text" disabled={this.state.disabled} value={this.state.prep} onChange={this.handleChange.bind(this)}/>
				  </FormGroup>
				</Col>
				<Col xs={2} md={2}>
				  <FormGroup controlId="optional">
				    <FormControl type="text" disabled={this.state.disabled} value={this.state.optional} onChange={this.handleChange.bind(this)}/>
				  </FormGroup>
				</Col> 
				<Col xs={2} md={2}>
				  <Button type="button" onClick={this.handleClick.bind(this)}>
				    Edit
				  </Button>
				  <Button type="button" style={{marginLeft: 15}} onClick={this.handleDelete.bind(this)} disabled={this.state.disabled}>
				    Delete
				  </Button>
				  <Button type="submit" style={{margin: 5, display: 'none'}} disabled={this.state.disabled}>
				    Commit
				  </Button>
				  </Col> 
				</Form>
			</Row>
		)
	}
}

export default EditIngredientEntry;
