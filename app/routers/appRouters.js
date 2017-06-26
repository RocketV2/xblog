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
	// 分页功能 传递page参数
	var query = querystring.parse( URL.parse(req.url).query );
	var page  = query.page;

	// 连接数据库 查询数据
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			res.json({error:"database error!"});
		}
		// 跳过的条数
		var skipCount = page?(page-1)*10:0;

		var col = db.collection('articles');

		// 分页 10篇一页
		col.count({},function(err,total){

			col.find().skip(skipCount).limit(10).toArray(function(err,docs){
				if(err){
					res.json({error:"database error!"});
				}
				// 关闭数据库
				db.close();
				// 总页数
				var pageTotalCount = ( (total%10==0)?parseInt(total/10):parseInt(total/10+1) );
				// 查询页数超过真实总页数
				if(page > pageTotalCount){
					req.flash('error',tips.list_pagesOut);
					return res.json({error:"error!"})
				}

				// markdown语法 文章内容需要转换
				docs.forEach(function(val,index){
					val.content = markdown.toHTML(val.content);
				});

				res.render('app_show_list',{
					curKind:'',
					pageList:docs,
					pageCount:pageTotalCount,//总页数
					curPage:page?page:1,// 当前页数
				});
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
			res.render('app_show_page',{
				pageData:docs[0],
			});
		});
	});
});

// 列表 根据分类获取文章列表
router.get('/list',function(req,res){
	var kind = querystring.parse(URL.parse(req.url).query).kind;
	// 分页功能 传递page参数
	var query = querystring.parse( URL.parse(req.url).query );
	var page  = query.page;
	

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

	// // 连接数据库 查询数据
	// mongo.Client.connect(mongo.URL,function(err,db){
	// 	if(err){
	// 		res.json({error:"database error!"});
	// 	}
	// 	var col = db.collection('articles');
	// 	var selector = {'tags':kind};
	// 	col.find(selector).limit(10).toArray(function(err,docs){
	// 		if(err){
	// 			res.json({error:"database error!"});
	// 		}
	// 		// markdown语法 文章内容需要转换
	// 		docs.forEach(function(val,index){
	// 			val.content = markdown.toHTML(val.content);
	// 		});
	// 		res.render('app_show_list',{
	// 			pageList:docs,
	// 		});
	// 	});
	// });

	// 连接数据库 查询数据
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			res.json({error:"database error!"});
		}
		// 跳过的条数
		var skipCount = page?(page-1)*10:0;

		var col = db.collection('articles');
		var selector = {'tags':kind};
		// 分页 10篇一页
		col.count(selector,function(err,total){

			col.find(selector).skip(skipCount).limit(10).toArray(function(err,docs){
				if(err){
					res.json({error:"database error!"});
				}
				// 关闭数据库
				db.close();
				// 总页数
				var pageTotalCount = ( (total%10==0)?parseInt(total/10):parseInt(total/10+1) );
				// 查询页数超过真实总页数
				if(page > pageTotalCount){
					req.flash('error',tips.list_pagesOut);
					return res.json({error:"error!"})
				}

				// markdown语法 文章内容需要转换
				docs.forEach(function(val,index){
					val.content = markdown.toHTML(val.content);
				});

				res.render('app_show_list',{
					curKind:kind,
					pageList:docs,
					pageCount:pageTotalCount,//总页数
					curPage:page?page:1,// 当前页数
				});
			});
		});
		
	});
});

// 侧边栏 热门文章
router.get('/aside/news',function(req,res){
	// 连接数据库 查询数据
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			res.json({error:"database error!"})
		}
		var col = db.collection('articles');
		// 根据pv排序
		col.find({},{'title':1,'pv':1,'time':1}).sort({'pv':1}).limit(5).toArray(function(err,docs){
			if(err){
				res.json({error:"database error!"})
			}
			// markdown语法 文章内容需要转换
			// docs[0].content = markdown.toHTML(docs[0].content);
			res.json({
				data:docs
			});
		});
	});
});























