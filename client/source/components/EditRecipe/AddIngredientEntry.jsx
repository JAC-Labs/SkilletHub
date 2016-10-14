import React from 'react';

//Bootstrap 
import { Grid, Row, Col, Form, FormGroup, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';

var units = ['unit', 'tsp.', 'tbsp.', 'fl.oz.', 'cup', 'pt.', 'qt.', 'gal.', 'g', 'kg', 'oz.', 'lbs', 'whole']; 

class AddIngredientEntry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: 'sour cream',
			amount: 2,
			unit: 'cup', 
			prep: null, 
			optional: null,
			validationState: ""   
		}; 
	} 

	componentWillMount(){
		this.setState({
			unitsMenu: units
		}); 
	}

	handleClick (event) {
		event.preventDefault(); 
		console.log('ADDINGREDIENT: Attempting to add ingredient!'); 
		if (this.state.name === null || this.state.amount === null || this.state.unit === null) {
			this.setState({
				validationState: "error"
			}); 
		} else {
			var ingredientObject = this.state; 
			this.props.handleAddIngredient(ingredientObject); 
			this.setState({
				name: "",
				amount: "",
				unit: "", 
				prep: "", 
				optional: "",
				validationState: ""   	
			}); 
		}
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
			<Row style={{marginBottom: 20}}> 
				<Form inline >
				<Col xs={2} md={2}>
				  <FormGroup controlId="name" validationState={this.state.validationState}>
				    <FormControl type="text" placeholder={'add ingredient here'} value={this.state.name} onChange={this.handleChange.bind(this)} required={'true'} />
				  </FormGroup>
				</Col>
				<Col xs={2} md={2}>
				  <FormGroup controlId="amount" validationState={this.state.validationState}>
				    <FormControl type="number" value={this.state.amount} onChange={this.handleChange.bind(this)} required={'true'} />
				  </FormGroup>
				</Col>
				<Col xs={2} md={2}>
          <FormGroup controlId="unit" validationState={this.state.validationState}>
            <FormControl componentClass="select" style={{width: '100%'}} onChange={this.handleChange.bind(this)} required={true}>
              {this.state.unitsMenu.map((unit, i)=> (
              	<option key={'unit' + i} value={unit}>{unit}</option>
              ))}
            </FormControl>
          </FormGroup>
				</Col>
				<Col xs={2} md={2}>
				  <FormGroup controlId="prep">
				    <FormControl type="text" value={this.state.prep} onChange={this.handleChange.bind(this)}/>
				  </FormGroup>
				</Col>
				<Col xs={2} md={2}>
				  <FormGroup controlId="optional">
				    <FormControl type="text" value={this.state.optional} onChange={this.handleChange.bind(this)}/>
				  </FormGroup>
				</Col> 
				<Col xs={2} md={2}> 
				  <Button type="submit" onClick={this.handleClick.bind(this)} onSubmit={this.handleClick.bind(this)} >
				    Add
				  </Button>
				</Col> 
				</Form>
			</Row>
		)
	}
}

export default AddIngredientEntry;