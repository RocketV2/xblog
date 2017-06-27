$(function(){
	
	/**
	 * ajax请求完成对侧边栏数据的获取
	 */
	// 最新文章
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

	// 分类的文章篇数
	$.ajax({
		method:"GET",
		url:"/aside/kinds",
		success:function(json){
			var html = '';
			json.forEach(function(val,index){
				var name = val._id,
					num  = val.num_total;
				html += "<li class='docs-kinds-years-li'> " 
							+"<a href='/list?kind="+name+"'>"
								+"<i class='fa fa-folder-o' aria-hidden='true'></i>&nbsp;"
								+name+"&nbsp;("+num+")"
							+"</a>"
						+"</li>";
			});
			$("#docs-kinds-years-ul").html(html);
		},
		error:function(err){}
	});

























});