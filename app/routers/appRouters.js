var express       = require('express');
var URL           = require('url');
var querystring   = require('querystring');
var tips          = require('../../confs/tips.config');
var mongo         = require('../../database/mongodb');
var markdown      = require('markdown').markdown;
var router        = express.Router(); 

module.exports = router;

// 首页 列表 取10篇文章
router.get('/',function(req,res){
	
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
			// markdown语法 文章内容需要转换
			docs.forEach(function(val,index){
				val.content = markdown.toHTML(val.content);
			});
			res.render('app_show_list',{
				pageList:docs,
			});
		});
	});
});

// 获取具体文章内容
router.get('/blogs',function(req,res){
	// 解析文章_id
	var _id = querystring.parse( URL.parse(req.url).query )._id;
	// 连接数据库 查询数据
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			res.json({error:"database error!"})
		}
		var col = db.collection('articles');
		var selector = {"_id":mongo.ObjectId(_id)};
		col.find(selector).toArray(function(err,docs){
			if(err){
				res.json({error:"database error!"})
			}
			// markdown语法 文章内容需要转换
			// docs[0].content = markdown.toHTML(docs[0].content);
			console.log(docs)
			res.render('app_show_page',{
				pageData:docs[0],
			});
		});
	});
})

























