$(function(){

	/**
	 * PV LIKES 排名
	 */
	(function(){
		var now = new Date();

		var chart = {
      		type: 'column'
   		};
		// 主标题
		var title = {
	      text: '随笔 点赞 前十名'   
	   	};
	   	// 副标题
	   	var subtitle = {
	    	text: '根据LIKE进行排名 '+now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate()
	    };
	    var tooltip = {
	      	headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	      	pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	         			'<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
	      	footerFormat: '</table>',
	      	shared: true,
	   	   	useHTML: true
	   	};
	    // 横坐标
	    var xAxis = {
	    	title:{
	    		text:"名次顺序"
	    	},
	    	// categories: ['mongoDB学习','2','3','4','5','6','6','7','8','9','9','10'],
	    	categories: [],
	    	crosshair: true
	   	};
	   	// 纵坐标
	   	var yAxis = {
	    	min: 0,
	    	title: {
	        	text: '点赞量'         
	    	}      
	    };
	    // 数据
	    var series= [
	        {
	            name: 'LIKES',
	            // data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
	            data: []
	        }
	    ];
	 //    var json = {};   
	 //    json.chart = chart; 
	 //    json.title = title;   
	 //    json.subtitle = subtitle; 
	 //    json.tooltip = tooltip;
	 //    json.xAxis = xAxis;
	 //    json.yAxis = yAxis;  
	 //    json.series = series;
	 //    json.plotOptions = plotOptions;  
	 //    json.credits = credits;
		// $('#pv-likes-sort').highcharts(json);


		// 异步请求数据
		$.ajax({
			method:'get',
			url:'/admin/visitPvLikes',
			success:function(data){
				data.forEach(function(val,index){
					xAxis.categories.push( val.title );
					series[0].data.push( val.likes );
				});
				// 将获取的数据赋值
				var json = {};   
			    json.chart = chart; 
			    json.title = title;   
			    json.subtitle = subtitle; 
			    json.tooltip = tooltip;
			    json.xAxis = xAxis;
			    json.yAxis = yAxis;  
			    json.series = series;
				$('#pv-likes-sort').highcharts(json);
			},
			error:function(err){
				console.log(err)
			}
		});
	})();

	/**
	 * PV 总量变化 每5分钟变化一次
	 *
	 * 涉及到数据的实时，需要保存数据日志，如果没有此文档无法获取准确数据，只能造假
	 */
	(function(){
		var everyFiveMinutes = 1000*5;// 每隔5分钟更新一次
		var everyStep = 1000*20; //横坐标步进值
		var chart = {
	      	type: 'spline',
		  	animation: Highcharts.svg, // don't animate in IE < IE 10.
	      	marginRight: 10,
		  	events: {
		        load: function () {
		            // set up the updating of the chart each second
		            var series = this.series[0];
		            setInterval(function () {
		               var x = (new Date()).getTime(), // current time
		               y = parseInt(Math.random()*100); // 需要从数据看中获取数据
		               series.addPoint([x, y], true, true);
		            }, everyFiveMinutes);
		        }
	      	}
	   	};
		// 主标题
		var title = {
      		text: '随笔PV 实时监控'   
   		};   
   		// 副标题
	   	var subtitle = {
	    	text: '每5分钟更新一次'  
	    };
   		// 横坐标
	   	var xAxis = {
	      	type: 'datetime',
	      	// tickPixelInterval: 300
	      	tickInterval:everyStep // ...更新一次步进值
	   	};
	   	// 纵坐标
   		var yAxis = {
      		title: {
         		text: '访问量 (次)'
      		},
	      	plotLines: [{
	         	value: 0,
	         	width: 1,
	         	color: '#808080'
	      	}]
   		};
   		// 提示信息
   		var tooltip = {
      		formatter: function () {
      			return '<b>' + this.series.name + '</b><br/>' +
         				Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
         				Highcharts.numberFormat(this.y, 2);
      		}
      	};

      	var plotOptions = {
	      	area: {
	         	pointStart: 1940,
	         	marker: {
	            	enabled: false,
	            	symbol: 'circle',
	            	radius: 2,
	            	states: {
	               		hover: {
	                 		enabled: true
	               		}
	            	}
	         	}
	      	}
	   	};

	   	var legend = {
	      	enabled: false
	   	};
   		var exporting = {
      		enabled: false
   		};

	   	var series= [{
	      	name: '随笔PV',
	      	// 这里的数据是默认值
	      	// 需要从数据库获取以往数据日志
	      	// 比如数据库PV总数，每个5分钟记录一次，这个需要服务器写个程序
	      	data: (function () {
	         	// generate an array of random data
	         	var data = [],
	         		time = (new Date()).getTime();

	         	for (var i=0;i<20;i++) {
	            	data.push({
	               		x: time - (20-i) * everyFiveMinutes,// 时间间隔必须同数据库日志中的间隔相符合
	               		y: parseInt(Math.random()*100) // 数据库中日志数据
	            	});
	         	}
	         	return data;
	      	}())    
	   	}];     
      
	   	var json = {};   
	   	json.chart = chart; 
	   	json.title = title;
	   	json.subtitle = subtitle;     
	   	json.tooltip = tooltip;
	   	json.xAxis = xAxis;
	   	json.yAxis = yAxis; 
	   	json.legend = legend;  
	   	json.exporting = exporting;   
	   	json.series = series;
	   	json.plotOptions = plotOptions;
   
   
	   	Highcharts.setOptions({
	      	global: {
	         	useUTC: false
	      	}
	   	});
	   	$('#pv-watch').highcharts(json);
	})();

	/**
	 * 设置两个图表的宽度
	 */
	(function(){
		// 初始化参数
		var divWidth = $('.pv-likes').width()-0;
		var setWidth = divWidth*0.75;
		$('#pv-likes-sort').css({'width':setWidth});
		$('#pv-watch').css({'width':setWidth});
		$('#pv-watch > div').css({'width':setWidth});

		// 窗口大小改变时
		$(window).on('resize',function(){
			var divWidth = $('.pv-likes').width()-0;
			var setWidth = divWidth*0.75;
			$('#pv-likes-sort').css({'width':setWidth});
			$('#pv-watch').css({'width':setWidth});
			$('#pv-watch > div').css({'width':setWidth});

		});

	})();

});