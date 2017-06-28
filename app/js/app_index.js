$(function(){
	/**
	 * 进度条
	 */
	$('#loading-bar').animate({'width':'10%'},100);
	window.onload = function(){
		$('#loading-bar').animate({'width':'100%'},500);
		$('#loading-bar').fadeOut();
	}
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

	/**
	 * 结合jQuery 实现返回顶部效果
	 */
	//只要窗口滚动,就触发下面代码 
	$(window).scroll(function(){ 
		//获取滚动后的高度 
		var scrollt = document.documentElement.scrollTop + document.body.scrollTop; 

		if( scrollt >200 ){  //判断滚动后高度超过200px,就显示  

			$("#returnTop").fadeIn(400); //淡出     

		}else{      

			$("#returnTop").stop().fadeOut(400); //如果返回或者没有超过,就淡入.必须加上stop()停止之前动画,否则会出现闪动   

		}
	});
	//当点击标签的时候,使用animate在200毫秒的时间内,滚到顶部
	$("#returnTop").click(function(){ 
		$("html,body").animate({scrollTop:"0px"},800);
	});

	/**
	 * 加载效果
	 */

});