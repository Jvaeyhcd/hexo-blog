---
title: Jenkins+iOS集成常见错误及解决办法
date: 2016-08-04 09:36:07
tags:
 - 常见错误
 - Jenkins
 - iOS
---

### 问题一: failed to import bridging header

#### 问题详情

``` bash
Header.h:7:9: error: 'HcdGuideView/HcdGuideView.h' file not found
#import <HcdGuideView/HcdGuideView.h>
^
<unknown>:0: error: failed to import bridging header '/Users/polesapp/.jenkins/workspace/qiangtoubao/qiangtoubao/OCFile/qiangtoubao-Bridging-Header.h'

** BUILD FAILED **
```

集成项目是Swift项目，使用了Cocoapods导入一个自己写的一个Objective-C第三方库，所以需要用到桥接文件。在Xcode中运行没有任何问题，但是用Jenkins集成的时候却报错了。
<!-- more -->
#### 解决办法

上述所报的错误已经写得十分明显了，错误的原因出在`#import <HcdGuideView/HcdGuideView.h>`这一句，桥接文件中找不到`HcdGuideView.h`这个文件。

所以最后的解决办法如下：

1. 选择target-BuildSettings-Search Paths下的User Header Search Paths，点击空白处，并且点击“＋”号添加一项，然后输入`$(PODS_ROOT)`,选择：recursive（会在相应的目录递归搜索文件）,如下图所示：

{% asset_img error_example_1.png failed to import bridging header%}

这样就需要将`#import <HcdGuideView/HcdGuideView.h>`替换成`#import "HcdGuideView.h"`就可以了。
