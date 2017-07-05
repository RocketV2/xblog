/*$(function(){

	// 使用KindEditor编辑器
	var editor;
	KindEditor.ready(function(K){
		var initWidth = $('div.form-content').width();
		// 初始化
		editor = K.create('#addTextArea',{
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
	
	

});*/



$(function(){
	// 使用Editor.md编辑器
	// 
	var editor = editormd({
		id : "editormd", 
		// 根据路径加载编辑器依赖
        path : "/editorMD/lib/",
        // 上传图片相关配置
        imageUpload : true,
		imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
		imageUploadURL : "/admin/uploadfile",
		// 设置emoji 默认关闭，太丑
		// emoji : true,
    });
































});