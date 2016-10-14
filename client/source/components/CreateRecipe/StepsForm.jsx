import React from 'react';
import AddStep from './AddStep'; 

//Bootstrap 
import { Grid, Row, Col } from 'react-bootstrap';

class StepsForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			steps: [],
			stepsCount: 1,
			newStep: [],
			availableIngredients: null
		}; 
	}

	handleAddStepForm (step) {
		event.preventDefault(); 

		// Add the ingredient to CreateRecipeMain state
		this.props.handleAddStep(step); 

		// Update the state within the Ingredients Form component 
		var steps = this.state.steps; 
		steps.push(step); 
		var stepsCount = this.state.stepsCount + 1; 
		this.setState({
			steps: steps,
			stepsCount: stepsCount
		}); 
	}

	render () {
		return (
			<Row>
				<h3> Recipe Steps </h3>
				<AddStep 
					key={'step' + this.state.stepsCount} 
					stepNumber={this.state.stepsCount} 
					handleAddStep={this.handleAddStepForm.bind(this)} 
					step={this.state.newStep}
					availableIngredients={this.props.availableIngredients}
				/>
				{this.state.steps.map((step) => (
					<Row key={'enteredStep' + step.position}>
					  <h4> Step {step.position} </h4>
					  <h5> {step.description} </h5>
					  <h5> {step.ingredients || ''} {step.parsedIngredients.join(', ') || ''} </h5>
					  <h5> {step.stepTime} </h5>
					</Row>
				))}
			</Row>
		); 
	}
}

export default StepsForm;