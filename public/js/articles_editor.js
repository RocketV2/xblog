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