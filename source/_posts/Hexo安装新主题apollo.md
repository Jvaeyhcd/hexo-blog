---
title: Hexo安装新主题apollo
date: 2016-02-20 16:15:35
tags:
  - Hexo
categories: 经验积累
---

Hexo博客系统的流行原因，是因为他的个人性，而皮肤就是个人性的一种体现。Hexo换皮肤还是比较简单的,既可以自己根据默认的主题来修改，也可以到[https://hexo.io/themes/](https://hexo.io/themes/)上去找主题。

下面简单描述一下我安装apollo主题的过程。

<!-- more -->

## 安装
github上的文档给出了详细的安装命令
``` bash
hexo init #blogname#
cd #blogname# 
npm install
npm install --save hexo-renderer-jade hexo-generator-feed hexo-generator-sitemap hexo-browsersync hexo-generator-archive
git clone https://github.com/pinggod/hexo-theme-apollo.git themes/apollo
```

## 启用
安装成功后就可以开始启用主题，主题的启用需要修改_config.yml 的 theme 配置项为 apollo：
``` bash
# Extensions 插件和皮肤
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
# theme: landscape
theme: apollo
```

启动hexo后修改成功后的皮肤如图所示
{% asset_img apollo.png apollo主题 %}