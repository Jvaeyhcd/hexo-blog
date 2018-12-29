---
title: CocosPods使用过程中遇到的一些问题，以及解决办法
date: 2016-06-16 15:21:30
tags:
  - CocoaPods
categories: 经验积累
---

经常会遇到很多莫名其妙的问题，这次遇到了，下次可能依然还会遇到，常常因为自己没有做什么记录，所以下次遇到了还是不知道如何解决。所以在这里我想记录一些我在使用CocosPods的过程中遇到过的一些问题。

## library not found for -lPods ##
### 问题描述
这是一个很奇葩的问题，我在使用Cocoapods管理项目，编译Debug运行没有任何问题，但是就是在Archive的时候，报错如下
``` bash
ld: library not found for -lPods
```
<!-- more -->

### 解决办法
于是在网上搜索了一番找打了一篇帖子：http://www.cocoachina.com/bbs/read.php?tid-253614.html

各种各样的回复都有，我最终的解决步骤如下：
1. 更新cocospods到最新版本，注：gem的最新的镜像地址：[https://gems.ruby-china.org/](https://gems.ruby-china.org/)， 淘宝的好像不能访问了。（也有说将版本降到0.37的，但是我是不想退步的，要用就用最新的）。
2. 在Build Setting > Other Linker Flag 中删除所有，只留下$(inherited)轻松解决。

其实还有一个原因就是我的工程目录名称和Finder工程目录的文件夹不一致造成的。
