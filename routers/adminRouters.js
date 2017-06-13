
var express       = require('express');
var multer        = require('multer');
var URL           = require('url');
var querystring   = require('querystring');
var tips          = require('../confs/tips.config');
// var usersModel    = require('../models/users.model');
var mongo         = require('../database/mongodb');
var router        = express.Router(); 


/**
 * 页面权限控制 登录状态不能再次进入登录界面 登出状态就只能进入登录页面，别的界面都进不去
 *
 * 必须添加return 否则报错 Error: Can't set headers after they are sent.
 */
function InStatus(req,res,next){
	if(req.session.user){
		req.flash('error',tips.login_status);
		// res.redirect('back');
		return res.redirect('/admin/list');
	}
	next();
}
function OutStatus(req,res,next){
	if(!req.session.user){
		req.flash('error',tips.logout_status);
		return res.redirect('/admin/');//跳转到登录界面
	}
	next();
}

// 后台管理 登录界面
router.get('/',InStatus);
router.get('/',function(req,res){
	res.render('login',{
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
	});
});
router.post('/login',InStatus);
router.post('/login',function(req,res){
	var name     = req.body.name,
		password = req.body.password;
	// 检测是否为空
	if(name=='' || password==''){
		req.flash('error',tips.login_empty);
		return res.redirect('/admin/');
	}
	// 连接数据库查询比对
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			req.flash('error',tips.db_error);
			return res.redirect('/admin/');
		}
		// 查询
		var col       = db.collection('usersInfo');
		var selector  = {'name':name,'password':password};
		col.find(selector).toArray(function(err,docs){
			if(err){
				req.flash('error',tips.db_error);
				return res.redirect('/admin/');
			}
			// 查询成功 操作
			if(docs.length==0){
				req.flash('error',tips.login_not_match);
				return res.redirect('/admin/');
			}
			if(name!=docs[0].name || password!=docs[0].password){
				req.flash('error',tips.login_not_match);
				return res.redirect('/admin/');
			}
			// 关闭数据库
			db.close();
			// 匹配成功 将用户信息存入 session
			req.session.user = {'name':name,'password':password};
			req.flash('success',tips.login_success);
			res.redirect('/admin/list');
		});
	});
});

// 后台管理 登出界面
router.get('/logout',OutStatus);
router.get('/logout',function(req,res){
	req.session.user = null;
	req.flash('success',tips.logout_success);
	res.redirect('/admin/');
});

// 后台管理 主界面
/*router.get('/main',OutStatus);
router.get('/main',function(req,res){
	res.render('main',{
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
	});
});*/

// 后台管理 文章列表
router.get('/list',OutStatus);
router.get('/list',function(req,res){
	// 分页功能 传递page参数
	var query = querystring.parse( URL.parse(req.url).query );
	var page  = query.page;

	// 数据库查询10条 如果不够，则全部列出
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			res.render('articles_status',{
				title:tips.error,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		}

		var skipCount = page?(page-1)*10:0;

		// 数据库连接成功 查询10条 如果不够，则全部列出
		var col = db.collection('articles');
		col.count({},function(err,total){// 查询总条数
			// 查找特定字段
			col.find({},{'title':1,'likes':1,'pv':1}).skip(skipCount).limit(10).toArray(function(err,docs){
				// 关闭数据库
				db.close();

				// 总页数
				var pageTotalCount = ( (total%10==0)?parseInt(total/10):parseInt(total/10+1) );

				if(page > pageTotalCount){// 查询页数超过真实总页数
					req.flash('error',tips.list_pagesOut);
					return res.render('articles_status',{
						title:tips.error,
						success:req.flash('success').toString(),
						error:req.flash('error').toString(),
					});
				}
				res.render('articles_list',{
					data:docs,
					pageCount:pageTotalCount,//总页数
					curPage:page?page:1,// 当前页数
					user:req.session.user,
					success:req.flash('success').toString(),
					error:req.flash('error').toString(),
				});
			});

		});
		
	});
});

// 后台管理 添加文章
router.get('/add',OutStatus);
router.get('/add',function(req,res){
	res.render('articles_add',{
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
	});
});
router.post('/add',OutStatus);
router.post('/add',function(req,res){
	var nowTime = new Date();
	var title    = req.body.title,
		content  = req.body.content,
		tags     = req.body.tags,
		time     = nowTime.toString(),
		author   = 'xubiao',
		likes    = 0,
		pv       = 0;
	if(title=="" || content=="" || tags==""){
		req.flash('error',tips.add_empty);
		return res.render('articles_add',{
				title:tips.success,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
	}
	// 连接数据库 插入
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			req.flash('error',tips.db_error);
			return res.redirect('/admin/add');
		}
		// 连接成功后 插入
		var col = db.collection('articles');
		var selector = {'title':title,'author':author,'time':time,'tags':tags,'likes':likes,'pv':pv,'content':content};
		col.insert(selector,function(err,result){
			if(err){
				req.flash('error',tips.add_error);
				res.redirect('/admin/add');
			}
			// 关闭数据库
			db.close();
			// 一切正常
			req.flash('success',tips.add_success);
			res.render('articles_status',{
				title:tips.success,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		});
	});
});

// 后台管理 编辑文章
router.get('/editor',OutStatus);
router.get('/editor',function(req,res){
	var query = querystring.parse( URL.parse(req.url).query );
	var _id   = query._id;
	if(!_id){
		req.flash('error',tips.editor_error);
		return res.render('articles_status',{
			title:tips.success,
			success:req.flash('success').toString(),
			error:req.flash('error').toString(),
		});
	}
	// 数据库中查询
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			req.flash('error',tips.db_error);
			return res.render('articles_status',{
				title:tips.success,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		}
		var col = db.collection('articles');
		var selector = {'_id':mongo.ObjectId(_id)};
		col.find(selector).toArray(function(err,docs){
			if(err){
				req.flash('error',tips.db_error);
				return res.render('articles_status',{
					title:tips.success,
					success:req.flash('success').toString(),
					error:req.flash('error').toString(),
				});
			}
			res.render('articles_editor',{
				data:docs[0],
				user:req.session.user,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		});
	});
});

// 后台管理 更新文章
router.post('/update',OutStatus);
router.post('/update',function(req,res){

	var _id      = req.body._id,
		title    = req.body.title,
		content  = req.body.content,
		tags     = req.body.tags;

	if(title=="" || content=="" || tags==""){
		req.flash('error',tips.add_empty);
		return res.redirect('/admin/add');
	}
	// 连接数据库 更新
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			req.flash('error',tips.db_error);
			return res.redirect('/admin/add');
		}
		// 连接成功后 插入
		var col = db.collection('articles');
		var _idObj = mongo.ObjectId(_id);
		col.update({'_id':_idObj},{$set:{'title':title,'content':content,'tags':tags}},false,function(err,result){
			if(err){
				req.flash('error',tips.add_error);
				res.redirect('/admin/add');
			}
			// 关闭数据库
			db.close();
			// 一切正常
			req.flash('success',tips.add_success);
			res.render('articles_status',{
				title:tips.success,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		});
	});
});

// 后台管理 删除文章
router.get('/delete',OutStatus);
router.get('/delete',function(req,res){

	var _ids = querystring.parse( URL.parse(req.url).query )._id;

	if(!_ids){
		req.flash('error',tips.delete_error);
		res.render('articles_status',{
			title:tips.error,
			success:req.flash('success').toString(),
			error:req.flash('error').toString(),
		});
	}
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			req.flash('error',tips.delete_error);
			res.render('articles_status',{
				title:tips.error,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		}
		// 连接成功
		var col = db.collection('articles');
	    var _id = mongo.ObjectId(_ids);
		col.remove({'_id':_id},function(err,result){
			if(err){
				req.flash('error',tips.delete_error);
				res.render('articles_status',{
					title:tips.error,
					success:req.flash('success').toString(),
					error:req.flash('error').toString(),
				});
			}
			// 删除成功
			req.flash('success',tips.delete_success);
			res.render('articles_status',{
				title:tips.success,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		})
	});
});

// LIKES信息
router.get('/visit',OutStatus);
router.get('/visit',function(req,res){
	res.render('visitsInfo',{
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
	});	
});
// 查询LIKES
router.get('/visitPvLikes',OutStatus);
router.get('/visitPvLikes',function(req,res){
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			req.flash('error',tips.delete_error);
			res.render('articles_status',{
				title:tips.error,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		}
		// 连接成功
		var col = db.collection('articles');
		col.find({},{'title':1,'likes':1}).sort({'likes':-1}).limit(10).toArray(function(err,docs){
			if(err){
				req.flash('error',tips.delete_error);
				res.render('articles_status',{
					title:tips.error,
					success:req.flash('success').toString(),
					error:req.flash('error').toString(),
				});
			}
			// 查询成功
			res.json(docs);
		});
	});
});
// 查询PV总量
router.get('/visitPV',OutStatus);
router.get('/visitPV',function(req,res){
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			req.flash('error',tips.delete_error);
			res.render('articles_status',{
				title:tips.error,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		}
		// 连接成功
		// 使用聚合语法 计算总和，平均值等
		var col = db.collection('articles');
		var selector = [{$group:{_id:'$author',num_total:{$sum:'$likes'}}}];
		col.aggregate(selector).toArray(function(err,docs){
			if(err){
				req.flash('error',tips.delete_error);
				res.render('articles_status',{
					title:tips.error,
					success:req.flash('success').toString(),
					error:req.flash('error').toString(),
				});
			}
			// 
			res.json(docs);
		});
	});
});


// 用户信息
router.get('/user',OutStatus);
router.get('/user',function(req,res){
	res.render('usersInfo',{
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
	});
});
router.post('/user',OutStatus);
router.post('/user',function(req,res){
	console.log(req.body)
	var name          = req.body.name,
	 	oldpassword   = req.body.oldpassword,
	 	newpassword   = req.body.newpassword,
	 	twicepassword = req.body.twicepassword;

	if(name=='' || oldpassword=='' || newpassword=='' || twicepassword==''){
		req.flash('error',tips.changeUserInfo_error_empty);
		return res.render('usersInfo',{
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString(),
		});
	}
	if(newpassword != twicepassword){
		req.flash('error',tips.changeUserInfo_error_twice);
		return res.render('usersInfo',{
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString(),
		});
	}
	mongo.Client.connect(mongo.URL,function(err,db){
		if(err){
			req.flash('error',tips.db_connect_err);
			return res.render('usersInfo',{
				user:req.session.user,
				success:req.flash('success').toString(),
				error:req.flash('error').toString(),
			});
		}
		var col = db.collection('usersInfo');
		var selector ={'name':name,'password':oldpassword};
		col.find(selector).toArray(function(err,docs){
			if(err){
				req.flash('error',tips.db_find_err);
				return res.render('usersInfo',{
					user:req.session.user,
					success:req.flash('success').toString(),
					error:req.flash('error').toString(),
				});
			}
			if(docs.length==0){
				req.flash('error',tips.db_userinfo_err);
				return res.render('usersInfo',{
					user:req.session.user,
					success:req.flash('success').toString(),
					error:req.flash('error').toString(),
				});
			}
			// 存在该用户 更新密码
			col.update(selector,{$set:{'password':newpassword}},function(errs,result){
				if(errs){
					req.flash('error',tips.db_update_err);
					return res.render('usersInfo',{
						user:req.session.user,
						success:req.flash('success').toString(),
						error:req.flash('error').toString(),
					});
				}
				// 更新密码成功
				req.flash('success',tips.changeUserInfo_success);
				res.render('articles_status',{
					title:tips.success,
					success:req.flash('success').toString(),
					error:req.flash('error').toString(),
				});
			})
		});
	});
});

// 处理上传的文件／图片
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploadfile')
  },
  filename: function (req, file, cb) {
  	// 自定义文件名称
    var fileFormat = (file.originalname).split(".");
    var suffix     = fileFormat[fileFormat.length-1];// 后缀
    //获取源名称 不带后缀
    fileFormat.pop();
    var fileName   = fileFormat.join('');// 获取除去后缀之后源元件名称

    var finalName  = fileName+'-'+file.fieldname + '-' + Date.now() + "." + suffix;
    cb(null, finalName);
  }
});
router.post('/uploadfile',OutStatus);
router.post('/uploadfile',multer({ storage: storage }).any(),function(req,res){
	// editor.md希望返回如下json
	// {
	//     success : 0 | 1,           // 0 表示上传失败，1 表示上传成功
	//     message : "提示的信息，上传成功或上传失败及错误信息等。",
	//     url     : "图片地址"        // 上传成功时才返回
	// }

	// 经过multer处理，存储在硬盘中的文件名称会放到req.files中
	// 注意研究 req.files的结构
	var filename = req.files[0].filename;
	if( filename ){//成功
		res.json({
			success:1,
			message:tips.uploadfile_success,
			url:'http://localhost:8888/uploadfile/'+filename,
		});
	}else{
		res.json({
			success:0,
			message:tips.uploadfile_error,
			url:'',
		});
	}
});



module.exports = router;












