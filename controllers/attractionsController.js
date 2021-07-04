//include model
var attractions = require('../models/attractions');

exports.index = function(req, res) {
    attractions.find({}, 'id  name image').sort('id').exec(function (err, result) {
        console.log(result);
        if (err) throw err;
        res.render('attractions/index',{attractions:result});
    });
};
exports.findid = function(req, res) {
    attractions.find({id:req.params.id},function(err,result){
        if (err) throw err;
        res.render('attractions/detail',{attraction:result});
    });
};