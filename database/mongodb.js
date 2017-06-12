/**
 * express框架连接到mongodb数据库需要驱动模块
 *		常用的有：
 * 			1.express官方提供的mongodb
 * 			2.很多人用的mongoose
 * 		这里使用官方提供的驱动模块，如果在使用过程中体悟到问题，可以切换；
 *
 * 官方mongodb驱动模块API接口
 * 		1.连接数据库
 * 			connect(url,callback(err,db))
 * 		2.选择集合
 * 			var col = db.collection(name)
 * 		3.查询
 * 			col.find(查询语句).toArray(function(err,docs))
 * 		4.错误
 * 			连接／查询等操作 如果没有遇到错误，那么err返回的是null	
 * 
 */
var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongoConf   = require('../confs/db.config.js');
var URL         = 'mongodb://'+mongoConf.host+':'+mongoConf.port+'/'+mongoConf.db;

// var Mongo = function(){}

// 查询
// Mongo.prototype.find = function(col,selector,callback){
// 	mongoClient.connect(URL,function(err,db){
// 		if(err){
// 			console.log(err);
// 			return;
// 		}
// 		// 连接成功 进行查询
// 		var collection = db.collection(col);
// 		collection.find(selector).toArray(function(err,docs){
// 			if(err){
// 				console.log(err);
// 				return;
// 			}
// 			db.close();
// 			callback(err,docs);
// 		});
// 	});
// };

// 插入
// Mongo.prototype.insert = function(col,selector,callback){
// 	mongoClient.connect(URL,function(err,db){
// 		if(err){
// 			console.log(err);
// 			return;
// 		}
// 		// 连接成功
// 		var collection = db.collection(col);
// 		collection.insert(selector,function(err,result){
// 			if(err){
// 				console.log(err);
// 				return;
// 			}
// 			callback(err,result);
// 		});
// 	});
// };

// module.exports = Mongo;


module.exports = {
	'Client':mongoClient,
	'URL':URL,
	'ObjectId':ObjectID,
};



















