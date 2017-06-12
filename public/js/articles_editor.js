$(function(){

	// 使用KindEditor编辑器
	var editor;
	KindEditor.ready(function(K){
		var initWidth = $('div.form-content').width();
		// 初始化
		editor = K.create('#editorTextArea',{
			width:initWidth+'px',
			minWidth:'500px',
		});


	});

	// 在窗口大小改变时，改变KindEditor的宽度
	$(window).on('resize', function() {
		var width = $('div.form-content').width();
	    if (editor) {
	    	editor.resize(width, null); // editor是K.create返回的对象。
		}
	});
	
	

});