import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

//Stylesheet
// import '../../../deploy/styles.css'

//Bootstrap 
import { Grid, Row, Col, FormGroup, FormControl, Button, Jumbotron, Carousel, Container, ControlLabel, DropdownButton, MenuItem } from 'react-bootstrap';

// Axios 
var axios = require('axios'); 

class CookMeMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe: {
        name: {
          value: ''
        }
      },
      stepsArray: []
    };
  }

  componentWillMount() {
    console.log('Cook Me main page is componentWillMounting!');

    axios.get(`/${this.props.params.username}/${this.props.params.recipe}`)
    .then((result)=> {
      var recipe = result.data; 
      console.log("recipe: ", recipe);

      var stepsArray = [];
      for (var i = 0; i < recipe.steps.length; i++) {
        if (!recipe.steps[i].time) {
          recipe.steps[i].time = '-';
        }
        var joinedIngreds = recipe.steps[i].ingredients.join(', ') || recipe.steps[i].parsedIngredients.join(', ');
        stepsArray.push({
          stepDescription: recipe.steps[i].description,  //string
          ingredients: joinedIngreds,                    //joined array
          time: recipe.steps[i].time,                    //int
          position: recipe.steps[i].position             //int
        });
      }

      this.setState({
        recipe: recipe,
        stepsArray: stepsArray
      }); 
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <Grid className='cookMeMain' fluid={true} style={{padding: '0'}}>

        <div className='jumbotron' style={{'backgroundImage': 'url("http://ce.unm.edu/assets/imgs/enrich/cooking-header")', borderRadius: '0'}}>
          <div className='container-fluid'>
            <h1 style={{textAlign: 'center', color: 'white'}}>Let's cook {this.state.recipe.name.value}!</h1>
          </div>
        </div>


        <div className="row" style={{margin: '0 auto', width: '980px'}} >
          {this.state.stepsArray.map((step, index) => (
            <div className="col-md-12" style={{padding: '10px', marginBottom: '40px', borderRadius: '6px', height: '240px', width: '940px'}}>
              
              <div className="col-md-10" style={{border: '1px solid rgba(128, 128, 128, 0.4)', borderRadius: '6px', height: '140px'}}>
                <div className="col-md-1" style={{borderRadius: '6px', height: '60px', fontSize: '40px', marginTop: '10px', textAlign: 'center'}}>
                  {step.position}
                </div>

                <div className="col-md-10" style={{borderRadius: '6px', height: '120px', marginTop: '20px', marginLeft: '20px', width: '88.499999995%', fontSize: '16px'}}>
                  {step.stepDescription}
                </div>
              </div>

              <div className="col-md-1" style={{height: '220px', borderRadius: '6px', float: 'right', width: '14.499999995%', padding: '0px'}}>
                <div style={{border: '1px solid rgba(128, 128, 128, 0.4)', padding: '20px', height: '60px', borderRadius: '6px', width: '100%', margin: '0 auto', textAlign: 'center'}}>
                  {step.time}
                </div> 

                <div style={{border: '1px solid rgba(128, 128, 128, 0.4)', padding: '20px', height: '60px', borderRadius: '6px', width: '100%', margin: '0 auto', marginTop: '20px', textAlign: 'center'}}>
                # Issues
                </div>

                <div style={{border: '1px solid rgba(128, 128, 128, 0.4)', padding: '20px', height: '60px', borderRadius: '6px', width: '100%', margin: '0 auto', marginTop: '20px', textAlign: 'center'}}>
                Begin!
                </div>
              </div>

              <div className="col-md-10" style={{border: '1px solid rgba(128, 128, 128, 0.4)', height: '60px', borderRadius: '6px', marginTop: '20px', padding: '20px', fontSize: '16px'}}>
                Ingredients: {step.ingredients}
              </div>

            </div>
          ))}
        </div>
        
      </Grid>
    );
  }
}


export default CookMeMain;