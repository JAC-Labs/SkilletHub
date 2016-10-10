import React from 'react';

//Bootstrap 
import { Grid, Row, Col, Form, FormGroup, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';

var units = ['unit', 'tsp.', 'tbsp.', 'fl.oz.', 'cup', 'pt.', 'qt.', 'gal.', 'g', 'kg', 'oz.', 'lbs', 'whole']; 
const timesRegEx = [/\d+\s?sec/, /\d+\s?min/, /\d+\s?hr/, /\d+\s?hour/]; 

class AddStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      disabled: false, 
      description: null,
      lines: null,
      ingredients: null,
      parsedIngredients: [], 
      availableIngredients: null, 
      time: null
    }; 
  }

  handleClick (event) {
    event.preventDefault(); 
    console.log('Clicking in Add Step!'); 
    var step = this.state; 
    this.props.handleAddStep(step)

    this.setState({
      changed: false,
      disabled: false, 
      description: "",
      lines: "",
      ingredients: "",
      parsedIngredients: [], 
      time: ""
    }); 
  }

  timeParse (string) {
    var match = []; 
    timesRegEx.forEach((timeRegEx) => {
      var time = timeRegEx.exec(string); 
      if (time) {
        match.push(time); 
      } 
    });
    return match; 
  }

  handleChange (event) {
    var inputType = event.target.id; 
    if (inputType === 'description') {
      var description = event.target.value; 

      // Set height of the text box based on string length 
      var lines = Math.ceil(description.length / 100) * 30; 
      this.setState({
        changed: true, 
        description: description,
        line: lines
      }); 

      // Parse for ingredients 
      var availableIngredients = this.props.availableIngredients; 
      var parsedIngredients = this.state.parsedIngredients;

      availableIngredients.forEach((ingredient) => {
        var regEx = RegExp(ingredient, 'i');
        var parsedIngredient = regEx.exec(description); 
        if (parsedIngredient && parsedIngredients.indexOf(parsedIngredient[0]) === -1) {
          parsedIngredients.push(parsedIngredient[0])
        }
      });
      this.setState({
        parsedIngredients: parsedIngredients,
        ingredients: parsedIngredients
      }); 

      // Parse for time 
      var time = this.timeParse(description); 
      var stepTime = this.state.time; 
      if (time && !stepTime) {
        console.log('SETTING TIME: ', time); 
        this.setState({
          time: time[0]
        }); 
      }
    }
  }

  render() {
    return (
      <Grid>
      <Row> 
        <Col xs={8} md={8} style={{margin: 5}}>
          <FormGroup>
            <ControlLabel> Step Description </ControlLabel>
            <FormControl componentClass="textarea" type="text" style={{height: this.state.lines}} id="description" value={this.state.description} onChange={this.handleChange.bind(this)} disabled={this.state.disabled} />
          </FormGroup>
        </Col>
        <Col xs={2} md={2} style={{margin: 5}}>
          <Button type="submit" style={{margin: 5}} onClick={this.handleClick.bind(this)} onSubmit={this.handleClick.bind(this)} >
            Add
          </Button>
        </Col>
      </Row>
      <Row>
        <h4> {JSON.stringify(this.props.availableIngredients)} </h4>
      </Row>
      </Grid>
    )
  }
}

export default AddStep;