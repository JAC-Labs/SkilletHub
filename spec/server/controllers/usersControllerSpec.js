var mongoose = require('mongoose');
var db = require(`${__dirname}/../../../server/schemas.js`);
var UserRecipe = db.UserRecipe;
var generateId = mongoose.Types.ObjectId;

var expect = require('chai').expect;
var httpMocks = require('node-mocks-http');
var Promise = require('bluebird');

var usersController = require(`${__dirname}/../../../server/controllers/usersController.js`);
var getProfile = usersController.getProfile;


describe('userController.js', function() {
  //connect to testing db, disconnect afterwards
  before(function() {
    mongoose.connect('mongodb://localhost/mochaTesting');
  });
  after(function() {
    return UserRecipe.remove({})
    .then(function() {
      mongoose.connection.close();
    });
  });

  describe('getProfile()', function() {
    var exampleUserRecipes = {
      userId: generateId(),
      recipes: [
        {
          name: 'salad',
          rootRecipeId: generateId(),
          branches: [
            {
              name: 'master',
              mostRecentVersionId: generateId()
            }, {
              name: 'caesar',
              mostRecentVersionId: generateId()
            }
          ]
        }, {
          name: 'sandwich',
          rootRecipeId: generateId(),
          branches: [{
            name: 'master',
            mostRecentVersionId: generateId()
          }]
        }
      ]
    }
    var req, res;
    beforeEach(function() {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/justin/profile'
      });
      res = httpMocks.createResponse();
    });

    it('should be a function', function() {
      expect(getProfile).to.be.a('function');
    });
    // it('should return 200 when succesful', function() {
    //   return UserRecipe.remove({})
    //   .then(function() {
    //     return new UserRecipe(exampleUserRecipes).save();
    //   }).then(function() {
    //     return getProfile(req, res);
    //   }).then(function() {
    //     expect(res.statusCode).to.equal(200);
    //   });
    // });
    // it('should return a 404 when error', function() {
    //   req.url = '/tosh/profile';
    //   return getProfile(req, res)
    //   .then(function() {
    //     expect(res.statusCode).to.equal(404);
    //   });
    // });
  });
});