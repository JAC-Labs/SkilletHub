let Promise = require('bluebird');
let _ = require('underscore');
let db = require(`${__dirname}/schemas.js`);
let Recipe = db.Recipe;
let UserRecipe = db.UserRecipe;
let Dependency = db.Dependency;
let Notification = db.Notification;
let Follow = db.Follow;

const fields = [
  '_id',
  'rootVersion',
  'previousVersion',  
  'deleted',                      
  'branch',            
  'username',  
  'name',                   
  'description',            
  'servings', 
  'cookTime',             
  'skillLevel',            
  'picture',                
  'ingredients',
  'steps',
  'forkedFrom',
  'tags'
];

module.exports = {
  //build a version and save it
  makeVersion: (prev, changes, username) => {
    //New recipe
    let newVersion;
    if (prev === 'new') {
      newVersion = {
        rootVersion: null,
        previousVersion: null,
        deleted: false,
        branch: 'master',
        username: username,
        forkCount: 0,
        followers: 0
      };
    //New branch or version
    } else {
      newVersion = {
        rootVersion: prev.rootVersion || prev._id,
        previousVersion: prev._id,
        deleted: prev.deleted,
        branch: prev.branch,
        username: prev.username
      };
    }

    if (prev.forkedFrom) {
      newVersion.forkedFrom = prev.forkedFrom
    }

    if (prev !== 'new' && username !== prev.username) {
      newVersion.forkedFrom = prev.username;
      newVersion.forkCount = 0;
      newVersion.followers = 0;
    }
    changes.username = username;
    //build new version object
    _.extend(newVersion, changes);
    //insert new version
    return new Recipe(newVersion).save();
  },

  //retrieve a particular version
  retrieveVersion: (versionId) => {
    let built, mostRecentRecipe;

    //get specific version object from version id
    return Recipe.findOne({
      _id: versionId
    }).then(recipe => {
      mostRecentRecipe = recipe;

      //find all recipes that belong to that recipe tree
      let id = recipe.rootVersion || recipe._id;
      return Recipe.find().or([{
        _id: id
      }, {
        rootVersion: id
      }]);
    }).then(recipes => {
      //convert to plain objects
      recipes.forEach((recipe, i) => {
        recipes[i] = recipe.toObject();
      });

      //build history out of recipes
      let history = [];
      let addVersionToHistory = (id) => {
        //find matching version
        matchingVersion = _.find(recipes, recipe => {
          return recipe._id.equals(id);
        });
        history.unshift(matchingVersion);

        //if previous exists
        if (matchingVersion.previousVersion) {
          addVersionToHistory(matchingVersion.previousVersion);
        }
      };
      addVersionToHistory(versionId);
      //iterate through history
      built = history[0];
      for (let i = 1; i < history.length; i++) {
        let currentHistory = history[i];
        //apply each change
        fields.forEach(field => {
          if (currentHistory[field]) {
            //ingredients / steps
            if (Array.isArray(currentHistory[field])) {
              //iterate through array
              for (let j = 0; j < currentHistory[field].length; j++) { 
                //ingredient/step added, changed, or swapped position
                if (currentHistory[field][j].changed) {
                  built[field][currentHistory[field][j].position - 1] = currentHistory[field][j];
                //ingredient/step deleted
                } else {
                  //remove last
                  if (built[field].length > j) {
                    built[field].pop();
                  }
                }
              }
            //previous ver, deleted, root ver, etc
            } else if (_.contains(['_id', 'rootVersion', 'previousVersion', 'branch', 'deleted', 'username', 'forkedFrom'], field)) {
              built[field] = currentHistory[field];
            } else if (currentHistory[field].changed === true) {
              built[field] = currentHistory[field];
            } else if (currentHistory[field].changed === false) {
              built[field] = undefined;
            }
          }
        });
      }
      return UserRecipe.findOne({
        username: built.username
      });
    }).then(userRecipeCollection => {
      let branches;

      let rootVerId = mostRecentRecipe.rootVersion || mostRecentRecipe._id;
      userRecipeCollection.recipes.forEach(recipe => {
        if (rootVerId.equals(recipe.rootRecipeId)) {
          built.branches = recipe.branches;
        }
      });
      return built;
    });
  },

  // description: adds a collection of a user's recipes
  // username: username of collection owner
  // recipe: intial recipe to be added
  addUserRecipesCollection: (username, recipe) => {
    return UserRecipe.findOne({
      username: username
    }).then(result => {
      //first recipe by users
      if (result === null) {
        return new UserRecipe({
          username: username,
          recipes: [
            {
              name: recipe.name.value,
              rootRecipeId: recipe.rootVersion || recipe._id,
              branches: [
                {
                  name: 'master',
                  mostRecentVersionId: recipe._id
                }
              ]
            }
          ]
        }).save();

      //previously existing recipes by user
      } else {
        result.recipes.push({
          name: recipe.name.value,
          rootRecipeId: recipe.rootVersion || recipe._id,
          branches: [
            {
              name: 'master',
              mostRecentVersionId: recipe._id
            }
          ]
        });
        return UserRecipe.update({
          username: username
        }, result);
      }

    });
  },

  // description: update the amount of followers a recipe contains
  updateRecipeFollowers: (username, recipeId, change) => {
    return Recipe.findOne({
      username: username,
      _id: recipeId
    }).then(recipe => {
      let followers = recipe.followers;
      if (!(change < 0 && followers < 1)) {
        followers += change;
      }
      return Recipe.update({
        username: username,
        _id: recipeId
      }, {
        followers: followers
      });
    });
  },

  // description: creates a notification
  createNotification: notification => {
    return new Notification(notification).save();
  },

  // description: finds all followers, then creates a notification for each one
  createBatchNotification: (search, notification) => {
    return Follow.find(search).then(follows => {
      let notifications = follows.map(follow => {
        notification.notificationOwner = follow.username;
        module.exports.createNotification(notification);
      });
      return Promise.all(notifications);
    });
  }
};