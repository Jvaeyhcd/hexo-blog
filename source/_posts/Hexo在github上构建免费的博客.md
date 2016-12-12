---
title: Hexo在github上构建免费的博客
date: 2016-02-20 12:07:20
tags:
---


很多次想搭建一个自己的博客，彻底从csdn上转移到自己的博客站点中，但是一直由于时间的原因耽搁了。之前也使用过Wordpress来搭建自己的博客，但是发现Wordpress使用起来不是太方便。后来再接触了markdown语法写文章后，喜欢上了markdown。再后来了解到了hexo，一个基于Node的博客框架，同样可以实现基于github的博客，而且更轻更快，更适合Node的开发程序员。

## Hexo介绍

Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 [Markdown](http://daringfireball.net/projects/markdown/)（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

<!-- more -->

## Hexo安装

安装 Hexo 相当简单。然而在安装前，您必须检查电脑中是否已安装下列应用程序：
* [Node.js](http://nodejs.org/)
* [git](http://git-scm.com/)

如果您的电脑中已经安装上述必备程序，那么恭喜您！接下来只需要使用 npm 即可完成 Hexo 的安装。
``` bash
$ npm install -g hexo-cli
```
如果您的电脑中尚未安装所需要的程序，请根据以下安装指示完成安装。
>Mac用户在编译时可能会遇到问题，请先到 App Store 安装 Xcode，Xcode 完成后，启动并进入 Preferences -> Download -> Command Line Tools -> Install 安装命令行工具。

### 安装 Git
* Windows：下载并安装 [git](https://git-scm.com/download/win)
* Mac：使用 [Homebrew](http://brew.sh/), [MacPorts](http://www.macports.org/) 或下载 安装程序 安装。
* Linux (Ubuntu, Debian)：sudo apt-get install git-core
* Linux (Fedora, Red Hat, CentOS)：sudo yum install git-core

### 安装 Node.js
安装 Node.js 的最佳方式是使用[nvm](https://github.com/creationix/nvm)
cURL:
``` bash
$ curl https://raw.github.com/creationix/nvm/master/install.sh | sh
```
Wget:
``` bash
$ wget -qO- https://raw.github.com/creationix/nvm/master/install.sh | sh
```
安装完成后，重启终端并执行下列命令即可安装 Node.js。
``` bash
nvm install 5.0
```
或者您也可以下载 [安装程序](https://nodejs.org/en/) 来安装。

### 安装 Hexo

所有必备的应用程序安装完成后，即可使用 npm 安装 Hexo,Hexo安装，要用全局安装，加-g参数。
``` bash
$ npm install -g hexo-cli
$ npm install -g hexo
```
查看hexo的版本
``` bash
$ hexo version
hexo-cli: 1.0.1
os: Darwin 15.3.0 darwin x64
http_parser: 2.5.0
node: 4.2.1
v8: 4.5.103.35
uv: 1.7.5
zlib: 1.2.8
ares: 1.10.1-DEV
icu: 56.1
modules: 46
openssl: 1.0.2d
```

## Hexo创建项目

我的系统环境：
* Mac OS X EI Capitan
* node v4.2.1
* npm 2.14.7

安装好后，我们就可以使用Hexo创建项目了。
``` bash
hexo init nodejs-hexo 
```
我们看到当前在目录下，出现了一个文件夹，包括初始化的文件。

进入目录，并启动Hexo服务器。

``` bash
# 进入目录
$ cd nodejs-hexo
# 启动hexo服务器
$ hexo server
INFO  Hexo is running at http://0.0.0.0:4000/. Press Ctrl+C to stop.
```
这时端口4000被打开了，我们能过浏览器打开地址，http://0.0.0.0:4000/ 
ps:Mac上的地址是[http://0.0.0.0:4000/](http://0.0.0.0:4000/)， windows上的地址是http://localhost:4000/

## Hexo结构解析
接下来，我们需要对Hexo做全面的了解，才能做出个性化的博客。
### 目录和文件
{% asset_img hexo-dict.png Hexo目录结构示意图 %}
* .deploy_git 发布到github上生成的静态文件夹
* node_modules mode的modules
* scaffolds 脚手架，也就是一个工具模板
* scripts 写文件的js，扩展hexo的功能
* source 存放博客正文内容
* source/_drafts 草稿箱
* source/_posts 文件箱
* themes 存放皮肤的目录
* themes/landscape 默认的皮肤
* _config.yml 全局的配置文件
* db.json 静态常量

_posts目录：我们每次创建的文章都放在了_posts目录下面，Hexo是一个静态博客框架，没有数据库，文章内容都是以文本文件的方式进行存储的，直接存储在_posts的目录。

themes目录：是存放皮肤的，包括一套Javascript+CSS样式和基于EJS的模板设置。通过在themes目录下，新建一个子目录，就可以创建一套新的皮肤，当然我们也可以直接在landscape上面修改。

### 全局配置
_config.yml是全局的配置文件：很多的网站配置都在这个文件中定义。
* 站点信息: 定义标题，作者，语言
* URL: URL访问路径
* 文件目录: 正文的存储目录
* 写博客配置：文章标题，文章类型，外部链接等
* 目录和标签：默认分类，分类图，标签图
* 归档设置：归档的类型
* 服务器设置：IP，访问端口，日志输出
* 时间和日期格式： 时间显示格式，日期显示格式
* 分页设置：每页显示数量
* 评论：外挂的Disqus评论系统
* 插件和皮肤：换皮肤，安装插件
* Markdown语言：markdown的标准
* CSS的stylus格式：是否允许压缩
* 部署配置：主要是github发布

附上我本地的_config.yml配置
``` bash
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site 站点信息
title: Salvador
subtitle:
description:
author: Salvador
language: en
timezone:

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://yoursite.com
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:

# Directory 文件目录
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:

# Writing 写博客配置
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: true
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace:

# Category & Tag 目录和标签
default_category: uncategorized
category_map:
tag_map:

# Date / Time format 时间和日期格式
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss

# Pagination 分页设置
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

# Extensions 插件和皮肤
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
# theme: landscape
theme: apollo

# Deployment 部署配置
## Docs: https://hexo.io/docs/deployment.html
deploy: 
  type: git 
  repo: https://github.com/Jvaeyhcd/jvaeyhcd.github.io.git
```

## Hexo使用

### 创建新文章

接下来，我们可以开始创建博客了。Hexo建议通过命令来创建文章，当然你也可以直接在_posts目录下创建文件。
通过命令创建新的文章
``` bash
$ hexo new post Hexo在github上构建免费的
INFO  Created: ~/hexo-blog/source/_posts/Hexo在github上构建免费的.md
```
创建完成后在_posts目录下，就会生成文件“Hexo在github上构建免费的.md”

{% asset_img hexo-new.png Hexo创建新的文章 %}

然后，我们编辑文件：”Hexo在github上构建免费的.md”，以markdown语法写文章，然后保存。

在命令行，启动服务器。
``` bash
$ sudo hexo server
```

### 文章的语法
我们在写文章时，有一些语法的要求。
语法包括3部分：
* 基本信息：标题，发布日期，分类目录，标签，类型，固定发布链接
* 正文：markdown语法和Swig语法(掌握一个就行)
* 特殊标记：引用，链接，图片，代码块，iframe，youtube视频

#### 基本信息
必须在文件的顶部，---的行之前的部分。如：
``` bash
---
title: Hexo在github上构建免费的博客
date: 2016-02-20 12:07:20
tags:
---
```
#### 正文
hexo的正文要求使用markdown的语法，markdown的语法可以参考 [此处](http://www.markdown.cn/).

#### 特殊标记
hexo对于一些有特殊标记 文字块，做了特殊的定义。

** 引用 **
``` bash
# Swig语法
{% blockquote Seth Godin http://sethgodin.typepad.com/seths_blog/2009/07/welcome-to-island-marketing.html Welcome to Island Marketing %}
Every interaction is both precious and an opportunity to delight.
{% endblockquote %}

# Markdown语法
> Every interaction is both precious and an opportunity to delight.
```

** 代码块 **
``` bash
# Swig语法
{% codeblock .compact http://underscorejs.org/#compact Underscore.js %}
.compact([0, 1, false, 2, ‘’, 3]);
=> [1, 2, 3]
{% endcodeblock %}

# Markdown语法
'```{bash}
.compact([0, 1, false, 2, ‘’, 3]);
=> [1, 2, 3]
```'

```

** 链接 **
``` bash
# Swig语法
{% link 粉丝日志 http://blog.fens.me true 粉丝日志 %}

# Markdown语法
[粉丝日志](http://blog.fens.me)
```

** 图片 **
对于本地图片，需要在_config.yml文件中配置"post_asset_folder: true"。
``` bash
# Writing 写博客配置
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: true
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace:
```
这样在"hexo new"创建文章的时候hexo会自动会在_posts文件夹下面生成一个与文章同名的文件夹存放图片资源,如下图所示
{% asset_img hexo-new.png Hexo创建新的文章 %}

通过常规的 markdown 语法和相对路径来引用图片和其它资源可能会导致它们在存档页或者主页上显示不正确。在Hexo 2时代，社区创建了很多插件来解决这个问题。但是，随着Hexo 3 的发布，许多新的标签插件被加入到了核心代码中。这使得你可以更简单地在文章中引用你的资源。

``` bash
{% asset_path slug %}
{% asset_img slug [title] %}
{% asset_link slug [title] %}
```
比如说：当你打开文章资源文件夹功能后，你把一个 "example.jpg" 图片放在了你的资源文件夹中，如果通过使用相对路径的常规 markdown 语法 它将 不会 出现在页面上。正确的引用本地图片方式是使用下面的标签而不是 markdown ：
``` bash
{% asset_img example.jpg This is an example image %}
```

## 发布到github

### 静态化处理
写完了文章，我们就可以发布了。要说明的一点是hexo的静态博客框架，那什么是静态博客呢？静态博客，是只包含html, javascript, css文件的网站，没有动态的脚本。虽然我们是用Node进行的开发，但博客的发布后就与Node无关了。在发布之前，我们要通过一条命令，把所有的文章都做静态化处理，就是生成对应的html, javascript, css，使得所有的文章都是由静态文件组成的。

** 静态化命令 **
``` bash
$ hexo generate
```
运行完命令后，在本地目录下，会生成一个public的目录，里面包括了所有静态化的文件。

### 上传到github

接下来，我们把这个博客发布到github。
首先在github上创建一个项目“你的用户名.github.io”,我创建的项目是[jvaeyhcd.github.io](https://github.com/Jvaeyhcd/jvaeyhcd.github.io)
编辑全局配置文件：_config.yml，找到deploy的部分，设置github的项目地址。
``` bash
# Deployment 部署配置
## Docs: https://hexo.io/docs/deployment.html
deploy: 
  type: git #这里必须是git，以前是github
  repo: https://github.com/Jvaeyhcd/jvaeyhcd.github.io.git
```
然后，通过命令进行部署。
``` bash
$ sudo hexo d
```
部署完成后，打开你在github上创建的工程，你会看到
{% asset_img github.png github %}
然后访问[http://jvaeyhcd.github.io/](http://jvaeyhcd.github.io/)就能看到你发布到github上的博客了。
