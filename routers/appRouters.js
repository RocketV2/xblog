var express       = require('express');
var URL           = require('url');
var querystring   = require('querystring');
var tips          = require('../confs/tips.config');
var mongo         = require('../database/mongodb');
var router        = express.Router(); 

module.exports = router;

router.get('/',function(req,res){
	res.set({'Access-Control-Allow-Origin':'*'});
	res.json({
		title:'love of water',
		author:'rocketv2'
	});
});