---
title: NSURLErrorDomain Code=-1002 “unsupported URL”
date: 2016-06-30 15:13:42
tags:
  - iOS
categories: 常见错误
---

在进行iOS网络请求的时候，报Error Domain=NSURLErrorDomain Code=-1002 “unsupported URL”的错误，请求的类型是GET，但是使用PSOTMAN和在浏览器中打开此接口可以返回正确的数据。通过google搜索最后找到了解决办法，今天记录下这个奇怪的问题。

## 问题概述
我在一个接手的二次开发的项目中，发现了这样一个问题，有的接口可以用正常访问，但是却有一个接口就不能正常访问。我对比了这个不能访问的接口和其它能够正常访问的接口的区别发现，当我传入的参数有值为中文字符串时就会报如下的错误，所以显然问题就出在传入参数为中文字符串的问题上。

<!-- more -->

## 问题分析
通过对比发现（分析问题常见的方法），当这个接口传入了中文后将会报错，如果不传中文接口并不会报错，所以我基本上就可以锁定问题就出在中文字符的问题上。

## 解决方法
找到了问题出现的原因后其它的一切都变得简单了，因为传入中文字符会出现服务器不能解析然后报错的情况，所以我们应该将传入的中文字符用UTF8编码一下后再通过接口传递给服务器。（问题轻松解决～～～就是这么简单）
``` objc
//text为传入参数
text = [text stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
```
