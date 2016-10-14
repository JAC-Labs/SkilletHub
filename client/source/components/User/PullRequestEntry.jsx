import React, {Component} from 'react';
import { Image, Grid, Row, Col, Form, FormGroup, Badge, ProgressBar, FormControl, Button, Container, ControlLabel, DropdownButton, MenuItem, Nav, NavItem } from 'react-bootstrap';

class PullRequestEntry extends React.Component {

  constructor(props) {
    super(props);
  }

  _renderDate(createdAt){
    if (createdAt) {
      var parseDate = createdAt.split('T')[0].split('-'); 
      return (
        <h6 style={{textAlign: 'center'}}> {`${this.props.month[parseDate[1] - 1]} ${parseDate[2]}, ${parseDate[0]}`}</h6> 
      )
    }
  }

  _renderStatus(status) {
    if (status === 'open') {
      return (
       <p style={{textAlign: 'center'}}> <Badge style={{backgroundColor: 'green', color: 'white'}}>{this.props.pullRequest.status}</Badge></p>
      )
    } else {
      return (
        <p style={{textAlign: 'center'}}><Badge>{this.props.pullRequest.status}</Badge></p>
      )
    }
  }

  _renderPullRequestButton(status) {
    if (status === 'open') {
      return (
        <Button 
          bsStyle="success" 
          data-pullrequest={JSON.stringify(this.props.pullRequest)} 
          onClick={this.props.handlePullRequestClick.bind(this)}> 
          Manage  
        </Button> 
      )
    }
  }

  render() {
    return (
      <Row height={50} style={{borderBottom: "1px solid rgba(128,128,128, 0.2)"}}> 
        <Col xs={6} md={6}> 
          <h2 id={this.props.pullRequest.originalName}> {this.props.pullRequest.originalName} </h2> 
          <h4 id={this.props.pullRequest.sendingUser} onClick={this.props.handleUserClick.bind(this)}>> sent by <span style={{color: 'blue'}}>{this.props.pullRequest.sendingUser} </span></h4>
        </Col> 
        <Col xs={2} md={2} style={{marginTop: 20}}> 
          <h4 style={{textAlign: 'center'}}> created </h4> 
          {this._renderDate(this.props.pullRequest.createdAt)}
        </Col>
        <Col xs={2} md={2} style={{marginTop: 20}}> 
          <h4 style={{textAlign: 'center'}}> status </h4> 
          {this._renderStatus(this.props.pullRequest.status)}
        </Col>
        <Col xs={2} md={2} style={{marginTop: 30}}> 
          {this._renderPullRequestButton(this.props.pullRequest.status)}
        </Col>
      </Row>
    )
  }
}

export default PullRequestEntry;