
var mongo       = require('../database/mongodb');
var mongoClient = new mongo();
var collection  = 'usersInfo';//查找指定集合

var usersModel = function(){};

usersModel.prototype.find = function(selector,callback){
	mongoClient.findData(collection,selector,function(err,docs){
		if(err==null){//查询失败
			callback(err,docs);
			return;
		}
		callback(err,docs);
	});
};




module.exports = usersModel;