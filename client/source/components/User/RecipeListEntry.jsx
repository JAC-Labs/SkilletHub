var axios = require('axios');
import React, {Component} from 'react';
import { Image, Grid, Row, Col, Form, FormGroup, Badge, ProgressBar, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem, Nav, NavItem } from 'react-bootstrap';

const progressBarStyles = ['success', 'warning', 'danger']; 

export default ({recipe, username, branches, handleForkedFromUserClick, handleRecipeViewClick, handleButtonClick, buttonText}) => {

  return (
        <Row height={50}> 
          <Col xs={5} md={5}> 
            <h2 data-recipe={recipe.rootRecipeId} data-username={username} onClick={handleRecipeViewClick.bind(this)}> {recipe.name || 'Master Recipe'} </h2> 
            <h5 data-recipe={recipe.rootRecipeId} data-username={username} onClick={handleRecipeViewClick.bind(this)}> recipe id: {recipe.rootRecipeId} </h5>
          </Col> 
          <Col xs={4} md={4} style={{marginTop: 35}}>  
            <ProgressBar bsStyle={progressBarStyles[(Math.floor(Math.random() * 4))]} now={(Math.floor(Math.random() * 100))} />
          </Col>
          <Col xs={3} md={3} style={{marginTop: 25}}> 
            <h4> branches <Badge>{branches.length}</Badge></h4> 
          </Col>
        </Row>
    )
}


// Element that would allow us to display the user we forked the recipe from if we add this information to the response object 
// <h6> forked from <Button data-={recipe.rootRecipeId} onClick={handleForkedFromUserClick.bind(this)} disabled>{recipe.sourceID} </Button></h6> 
// <Button data-username={username} data-recipe={recipe.rootRecipeId} data-branch={'master'} data-version={recipe.branches[0].mostRecentVersionId} onClick={handleButtonClick.bind(this)}> {buttonText} </Button> 
