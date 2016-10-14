import React, {Component} from 'react';
import { Grid, Row, Col, Badge, Glyphicon, FormControl, Button } from 'react-bootstrap';
const types = ['issue', 'forked', 'following', 'pull']; 

// export default ({user, text, handleUserClick}) => {

//   return (
//         <Row height={50} style={{borderBottom: "1px solid rgba(128,128,128, 0.2)"}}> 
//           <Col xs={2} md={2}> 
//             <h2 > <Glyphicon glyph="certificate" bsSize="large"/> </h2> 
//           </Col> 
//           <Col xs={10} md={10} > 
//             <h4 id={user} style={{marginTop: 25}} onClick={handleUserClick.bind(this)}> <span id={user} style={{color: 'blue'}} onClick={handleUserClick.bind(this)}>{user}</span> {text} </h4>  
//           </Col>
//         </Row>
//     )
// }

class NotificationsEntry extends React.Component {

  constructor(props) {
    super(props);
  }

  handleIssueClick(event) {
    event.preventDefault(); 
    console.log('CLICKED ON AN ISSUE!'); 
    var notification = this.props.notification; 
    var usernameParameter = notification.notificationOwner; 
    var recipeParameter = notification.recipeId; 
    this.props.handleViewIssuesClick(usernameParameter, recipeParameter); 
  }

  _renderNotification(notification) {
    var notificationType = ''; 
    types.forEach((type) => {
      var regEx = RegExp(type, 'i');
      var parsedType = regEx.exec(notification.text); 
      if (parsedType) {
        console.log(parsedType); 
        notificationType = type; 
      } 
    });

    if (notificationType === 'issue') {
      return (
        <Row height={50} style={{borderBottom: "1px solid rgba(128,128,128, 0.2)"}}> 
          <Col xs={2} md={2}> 
            <h2 > <Glyphicon glyph="certificate" bsSize="large"/> </h2> 
          </Col> 
          <Col xs={10} md={10} > 
            <h4 id={notification.username} style={{marginTop: 25}} onClick={this.handleIssueClick.bind(this)}> <span id={notification.username} style={{color: 'blue'}} onClick={this.props.handleUserClick.bind(this)}>{notification.username}</span> {this.props.text} </h4>  
          </Col>
        </Row>
      )
    } else {
      return (
        <Row height={50} style={{borderBottom: "1px solid rgba(128,128,128, 0.2)"}}> 
          <Col xs={2} md={2}> 
            <h2 > <Glyphicon glyph="certificate" bsSize="large"/> </h2> 
          </Col> 
          <Col xs={10} md={10} > 
            <h4 id={notification.username} style={{marginTop: 25}} onClick={this.props.handleUserClick.bind(this)}> <span id={notification.username} style={{color: 'blue'}} onClick={this.props.handleUserClick.bind(this)}>{notification.username}</span> {this.props.text} </h4>  
          </Col>
        </Row>
      )
    }
  }

  render() {
    return (
      <Grid>
        {this._renderNotification(this.props.notification)}
      </Grid>
    )
  }
}

export default NotificationsEntry;