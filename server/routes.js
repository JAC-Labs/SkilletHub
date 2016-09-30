var users = require('./controllers/usersController.js');
var recipes = require('./controllers/recipesController.js');
var branches = require('./controllers/branchesController.js');
var versions = require('./controllers/versionsController.js');

module.exports = function(app, express) {
  // /*** Sign up / Sign in / Logout ***/
  app.post('/user/signup', users.signup);
  app.post('/user/login', users.login);
  app.get('/user/logout', users.logout);

  // /*** Users ***/
  // app.get('/:username/profile', users.getProfile); //gets recipes
  // app.put('/:username/profile', users.updateProfile);

  // /*** Recipes ***/
  app.post('/:username/create-recipe', recipes.createRecipe);
  app.get('/:username/:recipe', recipes.getRecipe); 
  app.delete('/:username/:recipe', recipes.deleteRecipe);

  // /*** Branches ***/
  app.post('/:username/:recipe/:branch', branches.createBranch);
  app.get('/:username/:recipe/:branch', branches.getBranch);
  app.delete('/:username/:recipe/:branch', branches.deleteBranch);

  /*** Versions ***/
  app.post('/:username/:recipe/:branch/:version', versions.createVersion);
  app.get('/:username/:recipe/:branch/:version', versions.getVersion);
  app.delete('/:username/:recipe/:branch/:version', versions.deleteVersion);
};