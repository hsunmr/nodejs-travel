//include model
var foods = require('../models/foods');

exports.index = function(req, res) {
    foods.find({}, 'id  name image').sort('id').exec( function (err, result) {
        if (err) throw err;
        res.render('foods/index',{foods:result});
    });
};
exports.findid = function(req, res) {
    foods.find({id:req.params.id},function(err,result){
        if (err) throw err;
        res.render('foods/detail',{food:result});
    });
};