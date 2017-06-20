var express       = require('express');
var URL           = require('url');
var querystring   = require('querystring');
var tips          = require('../confs/tips.config');
var mongo         = require('../database/mongodb');
var markdown      = require('markdown').markdown;
var router        = express.Router(); 

module.exports = router;

// 首页 列表 取10篇文章
router.get('/',function(req,res){
	res.set({'Access-Control-Allow-Origin':'*'});
	// 连接数据库 查询数据
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			res.json({error:"database error!"});
		}
		var col = db.collection('articles');
		col.find().limit(10).toArray(function(err,docs){
			if(err){
				res.json({error:"database error!"});
			}
			console.log("greate!!!!")
			// markdown语法 文章内容需要转换
			docs.forEach(function(val,index){
				val.content = markdown.toHTML(val.content);
			});
			res.json(docs);
		});
	});

});

// 获取具体文章内容
router.get('/Nodejs',function(req,res){
	res.set({'Access-Control-Allow-Origin':'*'});
	res.json({
		id:"kkkkkkk"
	})
})