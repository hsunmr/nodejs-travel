var express = require('express');
var router = express.Router();

//controllers
var attractions_controller = require('../controllers/attractionsController');
var foods_controller = require('../controllers/foodsController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
//airport page
router.get('/airport', function(req, res, next) {
  res.render('airport');
});
//bus page
router.get('/bus', function(req, res, next) {
  res.render('bus');
});
//about me page
router.get('/aboutme', function(req, res, next) {
  res.render('aboutme');
});
//attractions page
router.get('/attractions', attractions_controller.index);
router.get('/attractions/:id', attractions_controller.findid);
//foods page
router.get('/foods',foods_controller.index);
router.get('/foods/:id', foods_controller.findid);

module.exports = router;
