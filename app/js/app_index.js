$(function(){
	
	/**
	 * ajax请求完成对侧边栏数据的获取
	 */
	$.ajax({
		method:"GET",
		url:"/aside/news",
		success:function(json){
			var dataArr = json.data;
			var html = '';
			dataArr.forEach(function(val,index){
				var pv = val.pv,
					time = new Date(val.time),
					title = val.title,
					_id = val._id;
				html += "<li class='docs-news-li'>"
							+"<a href='/blogs?_id="+_id+"'>"+title+"</a>"
							+"<span> "+time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+"&nbsp;阅读("+pv+")</span>"
						+"</li>";
			});
			$("#docs-news-ul").html(html);
		},
		error:function(err){
			console.log(err)
		}
	});








});