## 前言
这是个博客小项目，身为小码农，感觉应该自己写一个(嘻嘻～～)  博客包括前端展示界面，后端管理界面，基本常见的功能都有(评论功能后续开发，不想用第三方)，后台管理界面包括增删改查，文章访问量排行榜等，后端编辑器使用的是markdown，排版更美观;  前端界面包括文章列表，全文搜索，文章归档等常用功能；这个项目适合nodejs入门练手，如果完整码下来，能够对express框架等有一个很好的了解。

原打算前端展示界面使用vue框架，后期开发中与自己使用的markdown编辑器有冲突，所以放弃了vuejs，  
个人喜欢vuejs框架，近阶段将会做个vuejs的小demo～～

欢迎各路大神 Issues～～

## 技术栈
> nodejs + express + pug(jade) + mongodb + bootstrap + hightcharts + ES6

## 项目运行
	git clone https://github.com/RocketV2/xblog.git

	cd xblog

	npm install 

	npm run app(访问本地8888端口 http://localhost:8888)


## 网站地址
> http://xblog.life

## 项目说明
- 后端开发中需要熟悉express的使用，mongodb基础语法，pug基础语法，掌握session的使用
- 前端开发中掌握基本CSS布局，bootstrap使用，媒体查询等
- 需要对博客功能有一定的了解，访问量统计等
- 如果对您有帮助，请赏个star(*脸皮太厚了，哈哈*)

## 目标功能
- 登录功能
- 文章的增删改查
- 使用markdown
- 文件上传
- 文章展示界面
- 分页功能
- 存档功能
- 增加标签
- 增加pv统计
- 增加文章检索
- 友情链接
- 增加404界面
- 增加日志功能

## 项目结构

	├── admin #后台管理内容
	│   ├── css
	│   │   ├── 404.css
	│   │   ├── articles_add.css
	│   │   ├── articles_editor.css
	│   │   ├── articles_list.css
	│   │   ├── articles_status.css
	│   │   ├── login.css
	│   │   ├── main.css
	│   │   ├── usersInfo.css
	│   │   └── visitsInfo.css
	│   ├── js
	│   │   ├── 404.js
	│   │   ├── articles_add.js
	│   │   ├── articles_editor.js
	│   │   ├── articles_list.js
	│   │   ├── login.js
	│   │   ├── main.js
	│   │   ├── usersInfo.js
	│   │   └── visitsInfo.js
	│   ├── models
	│   │   ├── articles.model.js
	│   │   └── users.model.js
	│   ├── routers
	│   │   └── adminRouters.js #后台管理路由
	│   └── views
	│       ├── 404.pug
	│       ├── articles_add_back.pug
	│       ├── articles_add.pug
	│       ├── articles_editor.pug
	│       ├── articles_list.pug
	│       ├── articles_status.pug
	│       ├── login.pug
	│       ├── main.pug
	│       ├── usersInfo.pug
	│       └── visitsInfo.pug
	├── app	#前端界面
	│   ├── css
	│   │   ├── app_index_adapt.css
	│   │   ├── app_index.css
	│   │   ├── app_show_list_adapt.css
	│   │   ├── app_show_list.css
	│   │   └── app_show_page.css
	│   ├── js
	│   │   ├── app_index.js
	│   │   ├── app_show_list.js
	│   │   └── app_show_page.js
	│   ├── routers
	│   │   └── appRouters.js.  #前端路由
	│   └── views
	│       ├── app_index.pug
	│       ├── app_show_list.pug
	│       └── app_show_page.pug
	├── app.js       #程序入口
	├── confs
	│   ├── db.config.js #数据库配置信息
	│   └── tips.config.js #提示字段
	├── database
	│   └── mongodb.js #数据库方法
	├── LICENSE
	├── package.json
	├── README.md



