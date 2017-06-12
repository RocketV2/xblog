

$(function(){

	/**
	 * 分页处理
	 * @type {[type]}
	 *
	 * 问题：目前实现的分页功能，伴随着服务器重新渲染页面而一次次从0开始，
	 * 		致使页数只是0-7
	 * 此函数作废
	 * 	var totalPages = $('#totalPages').html()-0;
		$('#prePage').on('click',function(){
			$('#nextPage').parent().removeClass('disabled');

			var arr = $("[auto='apage']");
			var minNum = $(arr[0]).html()-0;

			for(var i=0;i<arr.length;i++){
				var num = $(arr[i]).html()-0;
				if(minNum==1){
					$('#prePage').parent().addClass('disabled');
					return;
				}else if(minNum==0 || minNum==3 || minNum==2){
					$(arr[i]).html( num-minNum+1 );
					var hrefVal = "/admin/list?page="+(num-minNum+1);
					$(arr[i]).attr('href',hrefVal)
				}else if(minNum == -2){
					$('#prePage').parent().addClass('disabled');
					return;
				}else{
					$(arr[i]).html( num-3 );
					var hrefVal = "/admin/list?page="+(num-3);
					$(arr[i]).attr('href',hrefVal)
				}
			}
		});
		$('#nextPage').on('click',function(){
			$('#prePage').parent().removeClass('disabled');

			var arr = $("[auto='apage']");

			for(var i=0;i<arr.length;i++){
				var num = $(arr[i]).html()-0;
				var maxNum = $(arr[arr.length-1]).html()-0;
				var final = totalPages-maxNum;

				if(final>0 && final<3){
					$(arr[i]).html( num+final );
					var hrefVal = "/admin/list?page="+(num+final);
					$(arr[i]).attr('href',hrefVal);
				}else if(final==0){
					$('#nextPage').parent().addClass('disabled');
					return;
				}else{
					$(arr[i]).html( num+3 );
					var hrefVal = "/admin/list?page="+(num+3);
					$(arr[i]).attr('href',hrefVal)
				}
				
			}
		});
	 */
	
	
	/**
	 * 删除列表随笔 弹出蒙层
	 *
	 */
	(function(){
		var _id = null;
		$('.articles-delete-li').on('click',function(event){
			$('#mask').show(1000);
			_id = $(event.target).attr('li-id');
		});
		$('#mask-cancle').on('click',function(){
			$('#mask').hide();
		});
		$('#mask-comfirm').on('click',function(event){
			$('#mask').hide();
			$("a[li-a-id="+_id+"]")[0].click();
		});
	})();

	/**
	 * 分页处理
	 * @type {[type]}
	 * 必须在整体DOM加载完成后执行此函数
	 *
	 * 关键点：通过服务器渲染的界面，分页处理时，要讲当前页数／总页数传递出来
	 */
	(function(){
		var totalPages = $('#totalPages').html()-0;// 总页数
		var curPage    = $('#curPage').html()-0; // 当前页数
		var reqURL     = "/admin/list?page=";
		// 完成基本分页功能
		if(curPage >= 5 && totalPages > 5){
			if(totalPages-curPage==0){
				$('.page-next').hide();
				for(var i=0;i<5;i++){
					$('.page-mid > a')[i].innerHTML = curPage-(5-1-i);
					$($('.page-mid > a')[i]).attr( 'href',reqURL+(curPage-(5-1-i)) );
				}
			}else if(totalPages-curPage==1){
				$('.page-next').hide();
				for(var i=0;i<5;i++){
					$('.page-mid > a')[i].innerHTML = curPage-(5-2-i);
					$($('.page-mid > a')[i]).attr( 'href',reqURL+(curPage-(5-2-i)) );
				}
			}else{
				if(totalPages-curPage==2)
					$('.page-next').hide();
				for(var i=0;i<5;i++){
					$('.page-mid > a')[i].innerHTML = curPage-(5-3-i);
					$($('.page-mid > a')[i]).attr( 'href',reqURL+(curPage-(5-3-i)) );
				}
			}
		}else if(curPage < 5){
			$('.page-pre').hide();
		}else if(curPage < 5 && totalPages < 5){
			$('.page-pre').hide();
			$('.page-next').hide();
		}else{}

		// 选中的分页标签改变颜色
		if(totalPages>=5){
			for(var i=0;i<5;i++){
				var num = $('.page-mid > a')[i].innerHTML - 0;
				if(curPage == num){
					console.log(num)
					$($('.page-mid > a')[i]).parent().css({'background-color':'#fff'});
				}
			}
		}else{
			for(var i=0;i<totalPages;i++){
				var num = $('.page-mid > a')[i].innerHTML - 0;
				if(curPage == num){
					$($('.page-mid > a')[i]).css({'color':'#f0ad4e','font-weight':'700'});
				}
			}
		}
		
	})();


















































});
