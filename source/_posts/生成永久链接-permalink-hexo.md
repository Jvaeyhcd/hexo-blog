---
title: '生成永久链接(permalink) | hexo '
date: 2019-12-30 16:48:53
tags:
  - hexo
categories: hexo
abbrlink: 05c9df7e0c47bd64
---
### 概述
熟悉Hexo博客系统的朋友都知道，hexo默认的文字链接形式为`domain/year/month/day/postname`，这样的文章链接形式存在一下几点不足：
<!-- more -->
1. 当我们把源文件名改掉之后，链接也会改变。
2. 如果文章标题很长，那么文章链接也会很长。
3. 如果文章名包含，那么文章链接中将会有汉字，这样很不友好。

这里记录一种方法来生成永久链接。使用的是node.js常用的自动构建工具[grunt](https://gruntjs.com/)。

### 解决步骤

#### 步骤1
在文章的`Front-matter`中加入一个`abbrlink`字段；

{% asset_img 4249636-95dccafbae3fbf64.png abbrlink%}

#### 步骤2
使用grunt的插件`grunt-rewrite`自动填充替换`abbrlink`的值，在根目录下创建`Gruntfile.js`文件，并按照如下内容编辑。
``` js
module.exports = function(grunt) {
 
  grunt.initConfig({

    rewrite: {
      abbrlink: {
        src: 'source/_posts/**/*.md',
        editor: function(contents, filepath){
          const crypto = require('crypto');
          const hash = crypto.createHash('sha256');

          hash.update(contents);
          var hashValue = hash.digest('hex');

          return contents.replace(/@@abbrlink/g, hashValue.substring(0, 16));
        }
      },
    },
  });
 
  grunt.loadNpmTasks('grunt-rewrite');
};
```
这表示，插件到`source/_posts/`下读取所有的.md文件，把文件中的@@abbrlink替换成文件内容的hash值。

#### 步骤3
编辑站点配置文件`_config.yml`的`permalink`。
``` ymal
permalink: posts/:abbrlink.html
```

最后，当我们运行`grunt rewrite`后，`@@abbrlink`会被替换成一个16位的hash值。
链接地址变成`www.jvaeyhcd.wang/posts/916d83182e15eeb1.html`这种样式，只要不去改动这个hash值，链接地址不会变。
