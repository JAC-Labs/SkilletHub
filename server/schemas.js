let mongoose = require('mongoose');
let Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

let recipeSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  rootVersion: Schema.Types.ObjectId,       //The root version of the recipe
  previousVersion: Schema.Types.ObjectId,   //The preceding version of the curent recipe
  deleted: Boolean,                         //set to true when deleted, but cannot remove because of downstream branches
  branch: String,            
  username: String,                         //Creator of recipe
  name: {                                   //Recipe Title / Name
    changed: Boolean,
    value: String
  },                   
  description: {                            //Recipe description
    changed: Boolean,
    value: String
  },            
  servings: {                               //Number of people served
    changed: Boolean,
    value: String
  }, 
  cookTime: {                               //Cook time in minutes
    changed: Boolean,
    value: Number                         
  },             
  skillLevel: {                             //Recipe difficulty [easy, medium, hard]
    changed: Boolean,
    value: String
  },            
  picture: {                                //OPTIONAL: URL of recipe picture
    changed: Boolean,
    value: String
  },                
  dependencies: [{                          //Tools used for the recipe
    changed: Boolean,
    position: Number,
    dependencyId: Schema.Types.ObjectId
  }],
  ingredients: Schema.Types.Mixed,
  // ingredients: [{
  //   changed: Boolean,
  //   name: String,                 //name of ingredient
  //   type: String,                 //type of ingredient (dairy, meat, vegetable, etc)
  //   position: Number,             //Order of ingredients
  //   amount: Number,               //OPTIONAL: Amount of ingredient
  //   unit: String,                 //OPTIONAL: Unit of ingredient (cups, tbsp, etc)
  //   prep: String,                 //OPTIONAL: Preperation of ingredient (chopped, diced)
  //   substitutes: [String],        //Optional: Substitute ingredients for that ingredient
  //   optional: Boolean             //Whether ingredient is necessary
  // }],
  steps: Schema.Types.Mixed,
  // [{
  //   changed: Boolean,
  //   position: Number,             //Step position in order
  //   description: String,          //Step details
  //   time: Number,                 //OPTIONAL: Time to complete step
  //   ingredients: [String],        //OPTIONAL: Ingredients required in step
  // }],
  tags: Schema.Types.Mixed,
  // [{
  //   changed: Boolean,
  //   position: Number,
  //   tagId: Schema.Types.ObjectId
  // }],
  issues: Schema.Types.Mixed
  // [{
  //   changed: Boolean,
  //   position: Number,
  //   issueId: Schema.Types.ObjectId
  // }]
});

let userRecipeSchema = new Schema({
  username: String,                   //User who owns recipes / forks
  recipes: Schema.Types.Mixed
  // [{   //Forks and created recipes belonging to that user
  //   name: String,
  //   rootRecipeId: Schema.Types.ObjectId,
  //   branches: [{
  //     name: String,
  //     mostRecentVersionId: Schema.Types.ObjectId
  //   }]
  // }]
});  

let dependencySchema = new Schema({
  name: String,                         //name of dependency
  type: String                          //type of dependency (measuring containers, utensil, pans)
}); 

let tagSchema = new Schema({
  name: String,                         //tag name
  type: String                          //tag type [cuisine, dietary restriction, etc]
}); 

let issueSchema = new Schema({
  username: String,                     //User who left issue
  description: String,                  //Description of the problem / issue
  step: Number                          //Optional: Step in the recipe that had issue
}); 

let userSchema = new Schema({
  username: String,                     // Username 
  firstname: String,                    // First name
  lastname: String,                     // Last Name
  email: String,                        // email address
  createdAt: String,                    // Timestamp
  bio: String,                          // Optional: user can edit profile page
  picture: String,                      // Optional: url of hosted picture
  token: String                         // Session token from AWS Cognito
}); 

module.exports = {
  Recipe: mongoose.model('Recipe', recipeSchema),
  UserRecipe: mongoose.model('UserRecipe', userRecipeSchema),
  Dependency: mongoose.model('Dependency', dependencySchema),
  Tag: mongoose.model('Tag', tagSchema),
  Issue: mongoose.model('Issue', issueSchema),
  User: mongoose.model('User', userSchema)
};