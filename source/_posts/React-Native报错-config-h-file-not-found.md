---
title: React Native报错'config.h' file not found
date: 2018-11-12 13:47:23
tags:
  - React Native
  - iOS
---

打开Xcode编译react native的iOS程序出现了如下的错误：

{% asset_img 20171205145336037.jpeg 'config.h' file not found%}

<!-- more -->

解决方法：

``` bash
cd node_modules/react-native/third-party/glog-{version}
../../scripts/ios-configure-glog.sh
```

其实执行 .sh 命令之后Terminal界面的一些处理流程，我们不难看出，这个命令是check .h头文件的引用情况，然后建立关联关系。