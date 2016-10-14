import React from 'react';
import EditIngredientEntry from './EditIngredientEntry'; 
import AddIngredientEntry from './AddIngredientEntry'; 

//Bootstrap 
import { Grid, Row, Col, Form, FormGroup, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';

const units = ['select unit', 'tsp.', 'tbsp.', 'fl.oz.', 'cup', 'pt.', 'qt.', 'gal.', 'g', 'kg', 'oz.', 'lbs', 'whole']; 
const headers = [['Ingredient', 2], ['Quantity', 2], ['Unit', 2], ['Preparation', 2], ['Notes', 2]]; 

import meatloafRecipe from '../../../../meatloafRecipe'

class EditIngredientsMain extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<Grid>
				<Row> 
					{headers.map((header) => (
						<Col xs={header[1]} md={header[1]} style={{marginTop: 5}}>
							<h4> {header[0]} </h4> 
						</Col> 
					))}
				</Row>
					{this.props.ingredients.map((ingredient, i) => (
						<EditIngredientEntry 
							key={i} 
							ingredient={ingredient} 
							handleEditIngredient={this.props.handleEditIngredient}
							handleDeleteIngredient={this.props.handleDeleteIngredient} 
						/>
					))}
					<AddIngredientEntry handleAddIngredient={this.props.handleAddIngredient.bind(this)} />
			</Grid>
		); 	
	}
}

export default EditIngredientsMain;
