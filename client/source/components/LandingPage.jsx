import React from 'react';
import { Grid, Row, Col, FormGroup, FormControl, Button, Jumbotron, Carousel, Container, ControlLabel } from 'react-bootstrap';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username', 
      password: 'Password',
      firstname: 'First Name',
      lastname: 'Last Name',
      email: 'email'
    }; 
  }

  handleSubmit (event) {
    debugger;
    console.log(event); 
    console.log(this.state.username, this.state.password);
    this.props.signUpUser(event);
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

  // TODO: Modify render() to display image (half/whole) similar to Github/Facebook with the sign up form. 

  render() {
    return (
        <Jumbotron style={{
         'backgroundImage': 'url(\"http://67.media.tumblr.com/426d4abee7ca7c24c0414edbe35f8ddb/tumblr_nlwab73eK91s4468do1_1280.jpg\")',
         'backgroundSize': 'cover',
         'height': 900
        }}> 
          <Row className="show-grid">
            <Col xs={4} xsOffset={7} md={4} mdOffset={7}> 
<<<<<<< 4702e5730ead709659b7586bb5a8cc20305c4b98
            <form className="signupForm" onSubmit={this.handleSubmit.bind(this)} style={{'background':'white', 'height': 200, 'borderRadius': 10}}>
              <FormGroup controlId="formBasicText" style={{padding: 10}}>
                <ControlLabel> Sign Up For SkilletHub </ControlLabel>
                <FormControl type="text" id="username" onChange={this.handleChange.bind(this)} value={this.state.username} name="username" style={{margin: 5}}/>
                <FormControl type="password" id="password" onChange={this.handleChange.bind(this)} value={this.state.password} name="password" style={{margin: 5}}/>
                <FormControl type="text" id="firstname" onChange={this.handleChange.bind(this)} value={this.state.firstname} name="firstname" style={{margin: 5}}/>
                <FormControl type="text" id="lastname" onChange={this.handleChange.bind(this)} value={this.state.lastname} name="lastname" style={{margin: 5}}/>
                <FormControl type="text" id="email" onChange={this.handleChange.bind(this)} value={this.state.email} name="email" style={{margin: 5}}/>
                <Button type="submit" style={{margin: 5}}>Sign Up</Button>  
=======
            <form className="signupForm" onSubmit={this.handleSubmit.bind(this)} method="post" style={{'background':'white', 'height': 200, 'borderRadius': 10}}>
              <FormGroup style={{padding: 10}}>
              <ControlLabel> Sign Up For SkilletHub </ControlLabel>
              <FormControl type="text" id="username" onChange={this.handleChange.bind(this)} value={this.state.username} name="username" style={{margin: 5}}/>
              <FormControl type="password" id="password" onChange={this.handleChange.bind(this)} value={this.state.password} name="password" style={{margin: 5}}/>
              <Button type="submit" style={{margin: 5}} bsSize="large" block>Sign Up</Button>
>>>>>>> Implement features on the User facing components in preparation for integrating logging in
              </FormGroup>
            </form>
            </Col>
          </Row>
        </Jumbotron>
    );
  }
}



export default LandingPage;

      //   <div className='signUpPage'>
      //   <h1 className='signUpPage'>Welcome to SkilletHub</h1>
      //   <h1 className='signUpPage'> Sign Up </h1>
      //   <form className="signupForm" onSubmit={this.handleSubmit.bind(this)} method="post">
      //     <input type="text" onChange={this.handleChange.bind(this)} value={this.state.username} className="usernameInput" name="username"/>
      //     <input type="password" onChange={this.handleChange.bind(this)} value={this.state.password} className="passwordInput" name="password"/>
      //     <button type="submit">Sign Up</button>
      //   </form>
      // </div>

      // <Carousel>
      //     <Carousel.Item>
      //       <img width={900} height={500} alt="900x500" src="http://www.gourmetfoodshop.co.za/wp-includes/backgrounds/bg2.jpg"/>
      //       <Carousel.Caption>
      //         <h3>First slide label</h3>
      //         <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      //       </Carousel.Caption>
      //     </Carousel.Item>
      //     <Carousel.Item>
      //       <img width={900} height={500} alt="900x500" src="http://stanforddaily.wpengine.netdna-cdn.com/wp-content/uploads/2013/10/Filet-Mignon-1.jpg"/>
      //       <Carousel.Caption>
      //         <h3>Second slide label</h3>
      //         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      //       </Carousel.Caption>
      //     </Carousel.Item>
      //     <Carousel.Item>
      //       <img width={900} height={500} alt="900x500" src="http://67.media.tumblr.com/426d4abee7ca7c24c0414edbe35f8ddb/tumblr_nlwab73eK91s4468do1_1280.jpg"/>
      //       <Carousel.Caption>
      //         <h3>Third slide label</h3>
      //         <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
      //       </Carousel.Caption>
      //     </Carousel.Item>
      //   </Carousel>
