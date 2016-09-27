import React, {Component} from 'react';

// TODO: Confirm recipe object structure, ensure that key refers to the proper value 
// TODO: Implement conditional check that will allow users to fork recipes from another users recipe list 

export default ({recipe, forkRecipe}) => {
  return (
    <li>
      <div>
        <span className="title">{recipe.recipeName}</span>
        <span className="forkedSource"> forked from {recipe.forkedSource} </span>
        <button onClick={forkRecipe.bind(this)}> Fork </button> 
      </div>
    </li>
  ); 
}