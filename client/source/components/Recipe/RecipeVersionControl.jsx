import React, {Component} from 'react';
import { Grid, Row, Col, Table, Button, ButtonGroup, Form, FormGroup, FormControl, ControlLabel, Well } from 'react-bootstrap';

// TODO: Confirm ingredient object structure, ensure that key refers to the proper value 
// TODO: Add headers for the 'Ingredient', 'Quantity', 'Unit' and other fields. 

const month = [];
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

class RecipeVersionControl extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      createBranch: ''
    }
  }

  handleChange (event) {
    var inputType = event.target.id; 
    if (inputType === 'createBranch') {
      this.setState({createBranch: event.target.value}); 
    }
  }

  parseDate(createdAt){
    if (createdAt) {
      var parseDate = createdAt.split('T')[0].split('-'); 
      return `${month[parseDate[1] - 1]} ${parseDate[2]}, ${parseDate[0]}`; 
    }
  }

  _renderCreateBranch(){
    var branch = this.props.selectedBranch; 
    if (branch === 'create branch') {
      return (
        <form onSubmit={this.props.handleCreateBranch.bind(this)}> 
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
          <FormControl componentClass="select" id="unit" onChange={this.props.handleVersionSelect.bind(this)} >
            {this.props.branchVersions.map((version, i)=> (
              <option key={'version' + i} value={version._id}>v{this.props.branchVersions.length - 1 - i} : {this.parseDate(version.createdAt)}</option>
            ))}
          </FormControl>
        </FormGroup>
      )
    }
  }

  _renderButtonGroup(){
    if (this.props.loggedInUserProfile && this.props.ownRecipe) {
      return (
        <div style={{marginTop: 25, float: "right"}}> 
          <ButtonGroup style={{marginRight: 10}}>
            <Button id="issue" bsStyle="success" type="submit" onClick={this.props.handleClick.bind(this)}>new issue</Button>
            <Button id="issuesList" type="submit" onClick={this.props.handleClick.bind(this)}>view issues</Button>
            <Button id="edit" type="submit" onClick={this.props.handleClick.bind(this)}>edit recipe</Button>
            <Button id="pull" type="submit" onClick={this.props.handleClick.bind(this)}>create pull request</Button>
          </ButtonGroup>
          <Button id="cook" type="submit" bsStyle="success" onClick={this.props.handleClick.bind(this)}>cook recipe</Button>
        </div> 
      )
    } else if (this.props.loggedInUserProfile) {
      return (
        <div style={{marginTop: 25, float: "right"}}> 
          <ButtonGroup style={{marginRight: 10}}>
            <Button id="issue" bsStyle="success" type="submit" onClick={this.props.handleClick.bind(this)}>new issue</Button>
            <Button id="viewIssues" type="submit" onClick={this.props.handleClick.bind(this)}>view issues</Button>
            <Button id="edit" type="submit" onClick={this.props.handleClick.bind(this)}>edit recipe</Button>
            <Button id="pull" type="submit" onClick={this.props.handleClick.bind(this)}>create pull request</Button>
          </ButtonGroup>
          <Button id="cook" type="submit" bsStyle="success" onClick={this.props.handleClick.bind(this)}>cook recipe</Button>
        </div> 
      )
    } else {
      return (
        <ButtonGroup style={{marginTop: 25, float: "right"}}>
          <Button id="fork" type="submit" bsStyle="success" onClick={this.props.handleClick.bind(this)}>fork recipe</Button>
        </ButtonGroup>
      )
    }
  }

  render() {
    return (
      <Grid> 
        <Row> 
          <Col xs={3} md={3}> 
          <FormGroup>
            <ControlLabel>Branch</ControlLabel>
            <FormControl componentClass="select" id="unit" onChange={this.props.handleBranchSelect.bind(this)} value={this.props.selectedBranch}>
              <optgroup label='available branches'> 
              {this.props.recipeBranches.map((branch, i)=> (
                <option key={'branch' + i} value={branch.name}>{branch.name}</option>
              ))}
              </optgroup>
              <optgroup label='new branch'>
                <option key={'create branch'} value={'create branch'}> create branch </option> 
              </optgroup>
            </FormControl>
          </FormGroup>
          </Col> 
          <Col xs={3} md={3}>
            {this._renderCreateBranch()}
          </Col>
          <Col xs={6} md={6}>
            {this._renderButtonGroup()}
          </Col> 
        </Row> 
      </Grid> 
    )
  }
}
export default RecipeVersionControl;

