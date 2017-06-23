$(function() {
   
    /** 
     * markdown editor.md 显示在前端界面
     * 注意：
     *     需要引入很多editor.md中的脚本
     */
    var editormdView = editormd.markdownToHTML("editormd-view", {
        htmlDecode      : "style,script,iframe",  // you can filter tags decode
        emoji           : true,
        taskList        : true,
        tex             : true,  // 默认不解析
        flowChart       : true,  // 默认不解析
        sequenceDiagram : true,  // 默认不解析
    });

});