import React from 'react';
import { Grid, Row, Col, FormGroup, FormControl, Button, Jumbotron, Carousel, Container, ControlLabel } from 'react-bootstrap';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '', 
      password: '',
      firstname: '',
      lastname: '',
      email: ''
    }; 
  }

  handleSubmit (event) {
    event.preventDefault();
    var user = this.state;
    this.props.handleSignUp(user);
  }

  handleChange (event) {
    var inputType = event.target.id; 
    if (inputType === 'username') {
      this.setState({username: event.target.value}); 
    } else if (inputType === 'password') {
      this.setState({password: event.target.value}); 
    } else if (inputType === 'firstname') {
      this.setState({firstname: event.target.value}); 
    } else if (inputType === 'lastname') {
      this.setState({lastname: event.target.value}); 
    } else if (inputType === 'email') {
      this.setState({email: event.target.value}); 
    }
  }

  render() {
    return (
      <Jumbotron style={{
       'backgroundImage': 'url(\"http://67.media.tumblr.com/426d4abee7ca7c24c0414edbe35f8ddb/tumblr_nlwab73eK91s4468do1_1280.jpg\")',
       'backgroundSize': 'cover',
       'height': 940
      }}> 
        <Row className="show-grid">
          <Col xs={4} xsOffset={7} md={4} mdOffset={8}> 
          <form onSubmit={this.handleSubmit.bind(this)} style={{height: '280px', width: '280px', borderRadius: '10px', backgroundColor: '#fff'}}>
            <FormGroup style={{padding: '10px', height: '280px', textAlign: 'center'}}>
              <ControlLabel style={{marginBottom: '10px', fontSize: '20px'}}> Sign Up For SkilletHub </ControlLabel>
              <FormControl type="text" id="username" placeholder='Username' onChange={this.handleChange.bind(this)} value={this.state.username} style={{margin: '0 auto', width: '210px', textAlign: 'center', marginBottom: '5px'}}/>
              <FormControl type="password" id="password" placeholder='Password' onChange={this.handleChange.bind(this)} value={this.state.password} style={{margin: '0 auto', width: '210px', textAlign: 'center', marginBottom: '5px'}}/>
              <FormControl type="text" id="firstname" placeholder='First Name' onChange={this.handleChange.bind(this)} value={this.state.firstname} style={{margin: '0 auto', width: '100px', textAlign: 'center', display: 'inline-block', marginBottom: '5px', marginRight: '10px'}}/>
              <FormControl type="text" id="lastname" placeholder='Last Name' onChange={this.handleChange.bind(this)} value={this.state.lastname} style={{margin: '0 auto', width: '100px', textAlign: 'center', display: 'inline-block', marginBottom: '5px'}}/>
              <FormControl type="text" id="email" placeholder='Email Address' onChange={this.handleChange.bind(this)} value={this.state.email} style={{margin: '0 auto', width: '210px', textAlign: 'center', marginBottom: '5px'}}/>
              <Button type="submit" style={{width: '210px', margin: '0 auto', marginTop: '10px'}} bsSize="large" block>Sign Up</Button>  
            </FormGroup>
          </form>
          </Col>
        </Row>
      </Jumbotron>
    );
  }
}

export default LandingPage;
