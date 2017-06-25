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

// 获取具体文章内容 从列表中获取
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
});

// 列表 根据分类获取文章列表
router.get('/list',function(req,res){
	var kind = querystring.parse(URL.parse(req.url).query).kind;

	// 只允许以下参数
	var allowKind = ['Javascript','ES6','Nodejs','MongoDB','Project'];
	var allowCtrl = false;
	// 判断参数是否在允许范围中
	allowKind.forEach(function(val,index){
		if(val==kind)
			allowCtrl=true;
	});

	// 不符合条件
	if(kind==undefined || allowCtrl==false){
		return res.redirect('/');
	}

	// 连接数据库 查询数据
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			res.json({error:"database error!"});
		}
		var col = db.collection('articles');
		var selector = {'tags':kind};
		col.find(selector).limit(10).toArray(function(err,docs){
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

























