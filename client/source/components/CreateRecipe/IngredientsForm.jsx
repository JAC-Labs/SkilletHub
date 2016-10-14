import React from 'react';
import AddIngredient from './AddIngredient'; 
import RecipeIngredients from '../Recipe/RecipeIngredients'; 

//Bootstrap 
import { Grid, Row, Col, Well } from 'react-bootstrap';

class IngredientsForm extends React.Component {
	constructor(props) {
		super(props);
	}

	_renderIngredientsTable() {
	  if (this.props.ingredients.length > 0) {
	    return (
	      <Row> 
	        <Well> 
	          <RecipeIngredients ingredientList={this.props.ingredients}/>
	        </Well>
	      </Row>
	    )
	  }
	}

	render () {
		return (
			<div> 
				<Row>
					<h3> Recipe Ingredients </h3>
					<h5> Input new ingredients for your recipe here. Simply hit enter when you have filled out all relevant details for an ingredient. </h5> 
				</Row> 
				<Row> 
					<AddIngredient number={this.props.ingredientsCount} handleAddIngredient={this.props.handleAddIngredient.bind(this)} />
				</Row> 
				{this._renderIngredientsTable()}
			</div>
		); 
	}
}

export default IngredientsForm;

