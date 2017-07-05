/**
 * 各个中间件的介绍
 * 		1.body-parser 
 * 			解析客户端请求的body部分，请求体各种各样，有普通的json，也有表单，也有文件等
 * 			1.1 bodyParser.json是用来解析json数据格式的
 * 			1.2 bodyParser.urlencoded则是用来解析我们通常的form表单提交的数据，
 * 				也就是请求头中包含这样的信息： Content-Type: application/x-www-form-urlencoded
 * 			1.3 除了以上两种方法，还有text(),raw()
 * 		2.cookie-parser
 * 			用于服务端设置cookie，没有此中间件请求体无法设置cookie
 * 		3.express-session connect-mongo
 * 			3.1 前者用于服务端设置session
 * 			    后者连接mongo数据库，将session自动保存在数据库中
 * 			3.2 在使用connect-mongo连接数据库时，new MongoStore()参数需要注意
 * 				在express4.0中，使用URL参数
 * 		4.multer
 * 			上传文件时，对文件的处理
 * 			
 * 		
 * 		
 * 	托管静态资源
 * 		1.托管的静态资源有何作用
 * 		
 *  模板引擎pug
 *  	1.sublime text 3 已经很好的支持pug，下载安装插件pug
 *  	2.
 *  
 */
var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);
var flash        = require('connect-flash-plus');
var settings     = require('./confs/db.config');
var adminRouters = require('./admin/routers/adminRouters');//后端路由
var appRouters = require('./app/routers/appRouters');// 前端路由
var app          = express();

// 设置cookie-parser
app.use(cookieParser());
// 设置session 并将session保存到数据库
app.use(session({
	secret:settings.cookieSecret,
	key:settings.db,
	cookie:{maxAge:1000*60*30},//保活期30分钟
	store:new MongoStore({
		// db:settings.db,
		// host:settings.host,
		// port:settings.port
		url: 'mongodb://'+settings.host+':'+settings.port+'/'+settings.db
	})
}));
// 设置页面通知 flash
app.use(flash());

// 设置body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:false}));

// 设置模板引擎
app.set('views',['admin/views','app/views']);
app.set('view engine','pug');

// 引入路由控制器
app.use('/admin',adminRouters);// 后端请求处理
app.use('/',appRouters); // 前端app请求

// 设置静态资源
app.use(express.static('./public'));// 公共文件
app.use('/app',express.static('./app'));// 前端界面文件
app.use('/admin',express.static('./admin'));// 前端界面文件



// 404页面，一定要放在所有路由之后
// 只有匹配不到路由时，才会进入此处
app.use(function(req,res){
	return res.render('404',{});
});


// 设置监听端口
app.listen(8888,function(){
	console.log('The app is on 8888!');
});


/*
{
	'title':'mongodb基础学习',
	'author':'xubiao',
	'time':
	'tags':'mongodb',
	'likes':22,
	'pv':23,
	'content':'mongodb是非关系型数据库，它的存储方式非常像json体，因而操作起来十分方便；'
}*/

/**
 * 还没有解决的问题
 * 1.日志
 * 2.编辑器上传图片--
 * 3.关闭／刷新编辑器窗口 触发事件
 * 4.统计PV的方法 $inc
 */
/**
 * tips:
 * 	1.linux如何删除大量前缀名相同的文件
 * 		使用通配符* rm *name
 */

/**
 * 学习建议文档
 * 	pug:
 * 		https://pugjs.org/language/conditionals.html
 * 		https://segmentfault.com/a/1190000000357534#articleHeader20
 *
 * 	mongodb:(express连接mongodb)
 * 		https://www.npmjs.com/package/mongodb
 * 		
 * 	nodejs入门：
 * 		http://wiki.jikexueyuan.com/list/nodejs/
 *
 * 	kindeditor编辑器
 * 		http://kindeditor.net/doc.php
 * 		
 * 	nodejs 中的markdown编辑器
 * 		https://www.npmjs.com/package/markdown
 *
 *	multer 处理文件上传
 *		https://www.npmjs.com/package/multer
 *		
 * 		
 */






