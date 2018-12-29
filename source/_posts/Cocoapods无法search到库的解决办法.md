---
title: Cocoapods无法search到库的解决办法
date: 2016-10-09 17:05:43
tags:
  - Cocoapods
categories: 经验积累
---

## 缘由

按照往常的方法一样安装Cocoapods，在安装的过程中遇到了一切问题，按照传统的命令`sudo gem install cocoapods`出现了如下的错误：
``` bash
ERROR:  While executing gem ... (Errno::EPERM)
    Operation not permitted - /usr/bin/pod
```
然后再[stackoverflow](http://stackoverflow.com/questions/30812777/cannot-install-cocoa-pods-after-uninstalling-results-in-error/30851030#30851030)上找到了如下的解决办法:
``` bash
sudo gem install -n /usr/local/bin cocoapods -v 1.0.1
```
-v可以跟版本号，来按照您想安装的版本。
这就这样Cocopods安装成功了，当然如果您没有翻墙的话安装Cocoapods需要切换ruby源到[https://gems.ruby-china.org](https://gems.ruby-china.org)，具体按照可以参考我的这篇文章[《CocoaPods安装和使用教程》](http://jvaeyhcd.github.io/2016/02/20/CocoaPods%E5%AE%89%E8%A3%85%E5%92%8C%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/)。
<!-- more -->
当我以为一切就绪的时候，我`pod search RxSwift`却提示我如下的错误：
``` bash
[!] Unable to find a pod with name, author, summary, or descriptionmatching '······'
```

> 对于有些类库确实是在Cocoapods中所不存在的，为了确定我们搜索的库是不是真的在Cocoapods的Repos中存在，我们可以到[https://cocoapods.org/](https://cocoapods.org/)中进行搜索。

## 解决办法

在记录一下自己的解决办法，同时分享一下自己的经验，希望能够帮助到大家。

### 执行pod setup
* 在终端输入`pod setup`,会出现`Setting up CocoaPods master repo`，等几分钟，会输入`Setup completed`，说明`pod setup`执行成功。
* 结果pod search还是失败
* 在终端输入`pod search RxSwift`
* 依然还是提示`Unable to find a pod with name, author, summary, or descriptionmatching 'RxSwift'`。
* 但是我输入`pod search pop`，却有相应的结果。

### 删除~/Library/Caches/CocoaPods目录下的search_index.json文件
* `pod setup`成功后会生成`~/Library/Caches/CocoaPods/search_index.json`文件。
* 终端输入`rm ~/Library/Caches/CocoaPods/search_index.json`
* 删除成功后再执行`pod search`

### 执行pod search

* 终端输入：`pod search RxSwift`(不区分大小写)
* 输出：`Creating search index for spec repo 'master'.. Done!`，稍等片刻就会出现所有带RxSwift字段的类库出现。
