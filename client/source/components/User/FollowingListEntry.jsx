import React, {Component} from 'react';
import { Image, Grid, Row, Col, Form, FormGroup, Badge, ProgressBar, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem, Nav, NavItem } from 'react-bootstrap';

export default ({user, skillLevel, handleUserClick}) => {

  return (
        <Row height={50}> 
          <Col xs={4} md={4}> 
            <h2 id={user} onClick={handleUserClick.bind(this)}> {user} </h2> 
          </Col> 
          <Col xs={4} md={4} style={{marginTop: 20}}> 
            <h4> skilletHub skill level: </h4>  
          </Col>
          <Col xs={4} md={4} style={{marginTop: 20}}> 
            <ProgressBar bsStyle={'success'} now={skillLevel} label={`${skillLevel}%`}/>
          </Col>
        </Row>
    )
}