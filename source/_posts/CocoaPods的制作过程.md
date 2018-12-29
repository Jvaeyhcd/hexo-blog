---
title: CocoaPods的制作过程
date: 2016-07-08 17:14:00
tags:
  - Cocoapods
categories: 经验积累
---

最新项目不算太忙，于是抽出了一点时间将以前项目中的使用的AVPlayer视频播放器做了一个简单的封装。现在我想把它做成CocoaPods方便以后的使用。下面我要详细的记录下我的制作过程。

### 创建仓库

#### 本地仓库
使用Xcode创建一个叫做HcdCachePlayer的工程，然后将相关的封装全部编写完毕。

#### 远程仓库
在github上同样创建一个`HcdCachePlayer`,最好保持同名,需要注意的是,在创建仓库的时候需要添加`license`类型,这里我使用`license`类型为`MIT`。这个很简单就不再啰嗦了。
<!-- more -->
#### 关联本地仓库到远程仓库
进入本地仓库目录
``` bash
cd ~/github/HcdCachePlayer/
```
关联远程仓库
``` bash
git init
git remote add origin https://github.com/Jvaeyhcd/HcdCachePlayer.git
git push -u origin master
```

### 添加Pods依赖库所需文件
依赖库所需的文件格式为`{project}.podspec`格式，每个Pods依赖库必须有这个描述文件。

#### 添加{project}.podspec文件

使用pod命令创建
``` bash
pod spec create HcdCachePlayer
```
这样就生成了HcdCachePlayer.podspec文件，打开该文件添加内容，并删除不需要的后就像这样：
``` bash
Pod::Spec.new do |s|
  s.name         = "HcdCachePlayer"
  s.version      = "0.0.1"
  s.summary      = "一个带缓存的视频播放器HcdCachePlayer"
  s.description  = <<-DESC
  一个使用AVPlayer封装的带缓存的视频播放器,支持全屏，可以左右滑动手势快进快退，上下滑动手势调节屏幕亮度
                   DESC
  s.homepage     = "https://github.com/Jvaeyhcd/HcdCachePlayer"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.author             = { "Jvaeyhcd" => "chedahuang@icloud.com" }
  s.platform     = :ios, '7.0'
  s.source       = { :git => "https://github.com/Jvaeyhcd/HcdCachePlayer.git", :tag => s.version.to_s }
  s.source_files  = "hcdCachePlayer/**/*.{h,m}"
  s.resource  = "hcdCachePlayer/hcdCachePlayer.bundle"
  s.frameworks = "UIKit", "AVFoundation", "MobileCoreServices", "Foundation"
  s.requires_arc = true
  s.dependency "Masonry"
end

```
s.source_files指向循环滚动的核心代码放在项目的s.hcdCachePlayer/**/*.{h,m},所以这里最好将库代码都放在同一个目录下。

### 提交到github
此时编码已经完成了，并且配置好了相关文件我们可以先将代码提交到github上了。

#### Pods验证
提交之前我们需要先验证一下HcdCachePlayer.podspec文件。在HcdCachePlayer.podspec所在目录运行如下命令：
``` bash
pod lib lint
```
如果出现ERROR和WARING都会失败，如果失败会明确指明哪个地方出错了，按提示修改就可以了。

#### 提交代码到Github

``` bash
git add .
git commit -m "version 0.0.1"
git push origin master
```

打上标签
``` bash
git tag 0.0.1
git push --tags
```
不出问题的话,就可以在github上看到最新提交的内容了。

### 上传{project}.podspec到CocoaPods官方仓库中
要想一个HcdCachePlayer真正可以用,就得把生成的HcdCachePlayer.podspec文件提交到Cocoapods官方的[Specs](https://github.com/CocoaPods/Specs)仓库中,才能被search到并使用。

> 之前的提交方式是先将[Specs](https://github.com/CocoaPods/Specs)仓库fork一份，添加修改，然后push，等待审核，这种显示是不安全的，所以现在不能使用了。也就是这篇文章：[《CocoaPods详解之----制作篇》](http://blog.csdn.net/wzzvictory/article/details/20067595)中说提到的方法，注意这个方法已经不能使用了。

CocoaPods为我们提供了另外一个更加安全的方法[Trunk](http://blog.cocoapods.org/CocoaPods-Trunk/#transition)。

#### Trunk的Register
如果第一次使用的话那么就需要注册了，需要CocoaPods0.33版本以上才支持
``` bash
pod trunk register *youremail* *yourname* --description='iMac' --verbose
```
以上命令是注册所需的,替换你的邮箱,用户名,以及描述内容, --verbose可以输入详细的debug。

注册完成后可以使用一下命令查看注册信息
``` bash
pod trunk me
```
#### 提交{project}.podspec
在{project}.podspec文件的路径下执行
``` bash
pod trunk push HcdCachePlayer.podspec
```
这条命令做了如下三件事:
* 验证本地的podspec文件,也可以使用 pod lib lint验证
* 上传podspec文件到trunk服务
* 将{project}.podspec文件转为{poject}.podspec.json文件

如果没有报错那么就成功了。

#### 使用
终端执行 pod search HcdCachePlayer就可以找到了,如果没有找到 pod setup再试一下。
``` bash
-> HcdCachePlayer (0.0.1)
   一个带缓存的视频播放器HcdCachePlayer
   pod 'HcdCachePlayer', '~> 0.0.1'
   - Homepage: https://github.com/Jvaeyhcd/HcdCachePlayer
   - Source:   https://github.com/Jvaeyhcd/HcdCachePlayer.git
   - Versions: 0.0.1 [master repo]
(END)
```
> 这里遇到一个问题创建成功了，但是另外一台电脑却收不到。

#### 协同工作
当需要其他人来共同维护你的代码,需要提供权限。
``` bash
pod trunk add-owner HcdCachePlayer *email*
```

参考文章：

[CocoaPods 详解之----更新篇](http://foggry.com/blog/2016/03/23/cocoapods-xiang-jie-zhi-geng-xin-pian/)
