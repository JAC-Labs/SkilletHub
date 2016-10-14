import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import RecipeDescription from '../Recipe/RecipeDescription'; 

//Bootstrap 
import { Grid, Row, Col, Table, Button, Form, FormGroup, FormControl, ControlLabel, Well, Panel, Label } from 'react-bootstrap';

// Placeholder recipe data 
import placeholders from '../../../../placeholders'

// Axios 
var axios = require('axios'); 

const issueObjectTemplate = {
  _id: '5b7adkfd',
  issueCreator: '', 
  status: '',
  comments: []
}

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

class IssuesManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: placeholders.recipeTemplate, 
      issueObject: issueObjectTemplate,
      ownRecipe: false,  
      title: 'Title', 
      issueType: 'general comment',   
      text: '',
      selectDisabled: true,
      buttonDisabled: true, 
      clearedTitle: false, 
      clearedResponse: false, 
      response: 'Leave a comment',
      position: ''
    }
  }

  componentWillMount() {
    var usernameParameter = this.props.params.username; 
    var recipeParameter = this.props.params.recipe; 
    var issueObject = this.props.issueObject; 

    axios.get(`/${usernameParameter}/${recipeParameter}`)
    .then((result)=> {
      var recipe = result.data; 
      console.log('RECIPE: ', recipe);
      console.log(issueObject);
      var ownRecipe = this.props.username === this.props.params.username;    
      console.log(ownRecipe);      
      this.setState({
        recipe: recipe,
        issueObject: issueObject,
        ownRecipe: ownRecipe
      }); 
    })
    .catch((error) => {
      console.log(error); 
    }); 
  }

  handleChange (event) {
    var inputType = event.target.id; 
    if (inputType === 'response') {
      this.setState({response: event.target.value}); 
    } 
  }

  handleClick (event) {
    event.preventDefault(); 
    console.log('Clicked on: ', event.target.id); 
    var responseType = event.target.id; 
    var issueResponseObject = {}; 
    issueResponseObject.type = responseType; 
    if (responseType === 'comment') {
      issueResponseObject.data = this.state.response; 
    }
    // issueResponseObject.usernameParameter = this.props.params.username; 
    // issueResponseObject.recipeParameter = this.props.params.recipe; 
    this.props.handleIssueResponseSubmit(issueResponseObject); 
  }

  handleFocus(event) {
    event.preventDefault(); 
    var focus = event.target.id; 
    if (focus === 'response' && !this.state.clearedResponse) {
      this.setState({
        response: '',
        clearedResponse: true
      }); 
    }
  }

  _renderAdditionalDetails() {
    if (this.state.issueObject.type === 'ingredient' || this.state.issueObject.type === 'step') {
      return (
        <Row> 
          <Col xs={6} md={6}> 
            <FormGroup style={{margin: 5}}>
              <ControlLabel>Issue Type</ControlLabel>
              <FormControl componentClass="text" id="issueType" value={this.state.issueObject.type} disabled/>
            </FormGroup>
          </Col>
          <Col xs={6} md={6}> 
            <FormGroup style={{margin: 5}}>
              <ControlLabel>Issue Position</ControlLabel>
              <FormControl componentClass="text" id="position" value={this.state.issueObject.position} disabled/>
            </FormGroup>
          </Col>
        </Row> 
      )
    } 
  }

  _renderSubmitButton(){
    if (!this.state.ownRecipe) {
      return (
        <Row> 
          <Button id="comment" bsStyle="success" style={{margin: 15 }} onClick={this.handleClick.bind(this)}>Comment</Button> 
        </Row> 
      )
    }
    if ( this.state.response !== 'Leave a comment' && this.state.response !== '') {
      return (
        <Row> 
          <Button id="comment" bsStyle="success" style={{margin: 15 }} onClick={this.handleClick.bind(this)}>Comment</Button> 
          <Button id="resolve" style={{margin: 15 }} onClick={this.handleClick.bind(this)}>Resolve Issue</Button> 
          <Button id="close" style={{margin: 15 }} onClick={this.handleClick.bind(this)}>Close Issue</Button> 
        </Row> 
      )
    } else {
      return (
        <Row> 
          <Button id="comment" disabled bsStyle="success" style={{margin: 15 }} onClick={this.handleClick.bind(this)}>Comment</Button>
          <Button id="resolve" style={{margin: 15 }} onClick={this.handleClick.bind(this)}>Resolve Issue</Button>  
          <Button id="close" style={{margin: 15 }} onClick={this.handleClick.bind(this)}>Close Issue</Button> 
        </Row> 
      )
    }
  }

  _renderCommentDate(comment) {
    var createdAt = comment.createdAt; 
    console.log('CREATED AT: ', createdAt); 
    createdAt = createdAt.split('T')[0].split('-'); 
    var currentDate = new Date(); 
    currentDate = currentDate.toISOString(); 
    currentDate = currentDate.split('T')[0].split('-');
    console.log('CURRENT DATE: ',currentDate);  
    var dateString = ''; 
    if (createdAt[1] === currentDate[1]) {
      if (createdAt[2] === currentDate[2]) {
        dateString = 'today'; 
      } else {
        var days = parseInt(currentDate[2]) - parseInt(createdAt[2]);  
        dateString = `${days} days ago`; 
      }
    } else {
      var months = parseInt(currentDate[1]) - parseInt(createdAt[1]); 
      if (months === 1) {
        dateString = `${months} month ago`; 
      } else {
        dateString = `${months} months ago`; 
      }
    }
    console.log('dateString'); 
    console.log(dateString); 
    return (
      <h4 style={{marginLeft: 10}}> {`${comment.username} commented ${dateString}`} </h4> 
    )
  } 

  render() {
    return (
      <Grid>
        <h3> Issues </h3>
        <Row style={{margin: 10}}> 
          <h3 className="recipeHeader"> {this.state.recipe.username} / {this.state.recipe.name.value}</h3>
        </Row> 
        <Row>
          <Col xs={6} md={6}>
            <Well>
              <img style={{maxWidth: '350px', maxHeight: '350px', display: 'block', margin: 'auto'}} src={this.state.recipe.picture.value} alt={'picture of food'}/>
            </Well>
          </Col>
          <Col xs={6} md={6}>
              <RecipeDescription style={{height: '350px'}} recipeDescription={this.state.recipe} handleClick={this.handleClick.bind(this)}/>
          </Col> 
        </Row> 
        <Row> 
          <h2> {this.state.issueObject.title} </h2>
          <h4> Issue #{this.state.issueObject._id.slice(0,6)} </h4>
          <Label>{this.state.issueObject.status}</Label>
        </Row> 
        {this.state.issueObject.comments.map((comment, i) => (
          <Row key={'comment' + i}> 
            <Col xs={10} md={10} xsOffset={1} mdOffset={1}>
              <Panel style={{paddingTop: 0}}> 
                <Row style={{background: 'rgba(128,128,128, 0.2)', marginTop: 0, paddingTop: 0}}> 
                {this._renderCommentDate(comment)}
                </Row> 
                {this._renderAdditionalDetails(comment)}
                <Row style={{marginLeft: 10, marginRight: 10}}> 
                  <h5> Issue Details </h5>  
                  <Well style={{marginTop: 10}}> 
                    <p> {comment.data} </p> 
                  </Well> 
                </Row> 
              </Panel> 
            </Col>
          </Row> 
        ))}
        <Row> 
          <Col xs={10} md={10} xsOffset={1} mdOffset={1}>
            <Panel> 
              <Row> 
                <FormGroup style={{margin: 15}}>
                  <ControlLabel>Respond to Issue</ControlLabel>
                  <FormControl componentClass="textarea" id="response" value={this.state.response} onChange={this.handleChange.bind(this)} onFocus={this.handleFocus.bind(this)} style={{minHeight: 100}}/>
                </FormGroup>
              </Row>
              {this._renderSubmitButton()}
            </Panel> 
          </Col>
        </Row> 
      </Grid> 
    )
  }
}

export default IssuesManage; 

