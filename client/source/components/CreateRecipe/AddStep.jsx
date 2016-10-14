import React from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

//Bootstrap 
import { Grid, Row, Col, Form, FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';

const timesRegEx = [/\d+\s?sec/, /\d+\s?min/, /\d+\s?hr/, /\d+\s?hour/]; 

class AddStep extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			changed: true, 
			description: '',
			ingredients: [],
			parsedIngredients: [], 
			position: null,
			time: '',
			stepTime: null
		}; 
	}

	componentWillMount(){
		this.setState({
			position: this.props.stepNumber
		}); 
	}

	handleClick (event) {
		event.preventDefault(); 
		var newStep = this.state
		this.props.handleAddStep(this.state);
	}

	timeParse (string) {
		var match = []; 
		timesRegEx.forEach((timeRegEx) => {
			var time = timeRegEx.exec(string); 
			if (time) {
				match.push(time[0]);
			} 
		});
		console.log('MATCH IS:', match); 
		console.log(match[0]); 
		if (match[0]) {
			var time = match[0].split(' '); 
			if (time[1] === 'min' || time[1] === 'minute') {
				return time[0]; 
			} else if (time[1] === 'hour' || time[1] === 'hr') {
				return parseInt(time[0]) * 60; 
			}
		} 
	}

	handleChange (event) {
	  var inputType = event.target.id; 
	  if (inputType === 'description') {
	  	var availableIngredients = this.props.availableIngredients; 
	  	var parsedIngredients = this.state.parsedIngredients; 
	  	var description = event.target.value; 

	  	// Iterate through available ingredients to check for matches in step description
	  	availableIngredients.forEach((ingredient) => {
	  		var regEx = RegExp(ingredient, 'i');
	  		var parsedIngredient = regEx.exec(description); 
	  		// console.log(parsedIngredient); 
	  		if (parsedIngredient && parsedIngredients.indexOf(parsedIngredient[0]) === -1) {
	  			console.log('Matched an ingredient: ', parsedIngredient); 
	  			parsedIngredients.push(parsedIngredient[0])
	  		}
	  	});

	  	var time = this.timeParse(description); 
	  	var stepTime = this.state.stepTime; 
	  	if (time && !stepTime) {
	  		console.log('SETTING TIME: ', time); 
	  		this.setState({
	  			time: time, 
	  			stepTime: time, 
	  			description: event.target.value,
	  			parsedIngredients: parsedIngredients
	  		}); 
	  	} else {
	  		this.setState({
	  			description: event.target.value,
	  			parsedIngredients: parsedIngredients
	  		}); 
	  	}
	  } 
	}

	render () {
		return (
			<Grid>
				<Form onSubmit={this.handleClick.bind(this)}>
					<Row>
					  <Col xs={12} md={12}> 
				      <FormGroup style={{padding: 5}}>
					      <ControlLabel> Step Description </ControlLabel>
					      <FormControl type="text" id="description" style={{height: 40}} onChange={this.handleChange.bind(this)} value={this.state.description} />
				      </FormGroup>
					  </Col>
					</Row>
					<Button type="submit" style={{display: "none"}} onClick={this.handleClick.bind(this)} onSubmit={this.handleClick.bind(this)}> Next Step </Button> 
				</Form>
			</Grid>
		); 
	}
}

export default AddStep;