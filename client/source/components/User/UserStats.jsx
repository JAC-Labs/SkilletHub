import React, {Component} from 'react';

//Bootstrap 
import { Grid, Row, Col, Button, Well, Glyphicon } from 'react-bootstrap';


class UserStats extends React.Component {

  constructor(props) {
    super(props);
  }

  _renderFollowUserButton(){ 
    var followedUserProfile = this.props.followingListMaster.indexOf(this.props.profileUsername) !== -1;  
    if (!this.props.loggedInUserProfile && !followedUserProfile) {
      return (
        <Row > 
          <Col xs={6} md={6} xsOffset={2} mdOffset={2} style={{marginBottom: 15}}>
            <h5> Follow this user to recieve notifications whenver they post new recipes! </h5>
          </Col> 
          <Col xs={4} md={4} style={{marginBottom: 15}}>
            <Button bsStyle="success" style={{marginTop: 5}} onClick={this.props.handleFollowUserClick.bind(this)}> Follow User </Button>
          </Col> 
        </Row>
      )
    } else if (!this.props.loggedInUserProfile) {
      return (
        <Row > 
          <Col xs={12} md={12} style={{marginBottom: 15}}>
            <h5> You already follow this user! You will receive notifications whenver they post a new recipe. </h5>
          </Col> 
        </Row>
      )
    } 
  } 

  render() {
    return (
      <Row style={{border: "1px solid rgba(128,128,128, 0.2)", borderRadius: 10, marginTop: 15, marginBottom: 15}}> 
        <div>
        <Well style={{margin: 15}}> 
          <Row> 
            <Col xs={3} md={3} >
              <h5 style={{fontWeight: 'bold', marginLeft: 10, textAlign: 'center'}}> <Glyphicon glyph="cutlery" /> {`${this.props.recipeCount}`} </h5>
              <h5 style={{fontWeight: 'bold', marginLeft: 10, textAlign: 'center'}}> recipes </h5>
            </Col> 
            <Col xs={3} md={3} >
              <h5 style={{fontWeight: 'bold', marginLeft: 10, textAlign: 'center'}}> <Glyphicon glyph="user" /> {`${this.props.followers}`} </h5>
              <h5 style={{fontWeight: 'bold', marginLeft: 10, textAlign: 'center'}}> {`followers`} </h5>
            </Col> 
            <Col xs={3} md={3} >
              <h5 style={{fontWeight: 'bold', marginLeft: 10, textAlign: 'center'}}> <Glyphicon glyph="star" /> {`${57}`} </h5>
              <h5 style={{fontWeight: 'bold', marginLeft: 10, textAlign: 'center'}}> stars </h5>
            </Col> 
            <Col xs={3} md={3} >
              <h5 style={{fontWeight: 'bold', marginLeft: 10, textAlign: 'center'}}> <Glyphicon glyph="fire" /> {`${3}`} </h5>
              <h5 style={{fontWeight: 'bold', marginLeft: 10, textAlign: 'center'}}> trending recipes </h5>
            </Col> 
          </Row>
        </Well> 
        {this._renderFollowUserButton()}
        </div>
      </Row> 
    ); 
  }
}

export default UserStats;