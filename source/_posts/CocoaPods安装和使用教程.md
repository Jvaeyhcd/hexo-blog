---
title: CocoaPods安装和使用教程
date: 2016-02-20 09:14:02
tags:
  - CocoaPods
categories: 经验积累
---

## CocosPods是什么

CocoaPods是iOS项目的依赖管理工具，该项目源码在Github上管理。开发iOS项目不可避免地要使用第三方开源库，CocoaPods的出现使得我们可以节省设置和第三方开源库的时间。
在使用CocoaPods之前，开发项目需要用到第三方开源库的时候，我们需要
1.把开源库的源代码复制到项目中
2.添加一些依赖框架和动态库
3.设置-ObjC，-fno-objc-arc等参数
4.管理他们的更新
在使用CocoaPods后，我们只需要把用到的开源库放到一个名为Podfile的文件中，然后执行pod install.Cocoapods就会自动将这些第三方开源库的源码下载下来，并且为我们的工程设置好响应的系统依赖和编译参数。

<!-- more -->

## CocoaPods的原理##

CocoaPods的原理是将所有的依赖库都放到另一个名为Pods的项目中，然后让主项目依赖Pods项目，这样，源码管理工作都从主项目移到了Pods项目中。Pods项目最终会编译成一个名为libPods.a的文件，主项目只需要依赖这个.a文件即可。

## CocoaPods的安装##

CocoaPods可以方便地通过Mac自带的RubyGems安装。
打开Terminal，然后键入以下命令：
``` bash
$ sudo gem install cocoapods
```
执行完这句如果报告以下错误：
``` bash
ERROR: Could not find a valid gem 'cocoapods' (>= 0), here is why:
Unable to download data from https://rubygems.org/ - Errno::ETIMEDOUT: Operation timed out - connect(2) (https://rubygems.org/latest_specs.4.8.gz)
ERROR: Possible alternatives: cocoapods
```
这是因为ruby的软件源rubygems.org因为使用亚马逊的云服务，被我天朝屏蔽了，需要更新一下ruby的源，过程如下：
``` bash
$ gem sources -l (查看当前ruby的源)
$ gem sources --remove https://rubygems.org/
$ gem sources -a https://ruby.taobao.org/
$ gem sources -l
```
如果gem太老，可以尝试用如下命令升级gem
``` bash
$ sudo gem update --system
```
升级成功后会提示: RubyGems system software updated

然后重新执行安装下载命令
``` bash
$ sudo gem install cocoapods
```
这时候应该没什么问题了

接下来进行安装，执行：
``` bash
$ pod setup
```
Terminal会停留在 Setting up CocoaPods master repo 这个状态一段时间,是因为要进行下载安装,而且目录比较大,需要耐心等待一下.如果想加快速度,可使用cocoapods的镜像索引.（文章末尾附使用镜像索引的方法）

## Cocoapods的使用

进入工程所在的目录（工程根目录）
执行命令 touch Podfile
这句是说新建一个名为Podfile的文件（不能写成别的名字，也可以自己在工程根目录里面直接新建）

然后对改文件进行编辑，执行命令 open -e Podfile
第一次执行这个命令,会有一个空白文件打开，可以先放在一边，
Podfile文件的格式应该如下：
``` bash
platform :ios, '7.0'
pod 'AMap2DMap', '~> 2.5.0'
pod 'AFNetworking', '~> 2.5.3'
pod 'SDWebImage', '~> 3.7.2'
```
需要注意的几点：platform那一行，ios三个字母都要小写，而且与前面的冒号之间不能有间隔，后面的版本号也可以不写，但是有些开源库对版本是有要求的，比如要在6.0以上才能运行，遇到这样的开源库就需要写上版本号。

platform下面就是Cocoapods需要集成的开源库，根据你的需要确定集成那些库。

举个例子：
我要集成AFNetworking这个库类，需要在Cocoapods里面先搜索是否有需要的库，可以在Terminal中输入：
``` bash
pod search AFNetworking
```
回车之后就可以看到和你搜索的关键字相关的一些库类。

其中第一个就是我们需要的，把pod ‘AFNetworking’， ‘~>2.5.3’
那一行复制到我们的Podfile文件中，保存修改。
然后在Terminal中执行 ：
``` bash
pod install
```
这样，AFNetworking就已经下载完成并且设置好了编译参数和依赖，以后使用的时候切记如下两点：
1.从此以后需要使用Cocoapods生成的 .xcworkspace文件来打开工程，而不是使用以前的.xcodeproj文件
2.每次更改了Podfile文件，都需要重新执行一次pod update命令

ps:当执行pod install之后，除了Podfile，还会生成一个名为Podfile.lock的文件，它会锁定当前各依赖库的版本，之后即使多次执行pod install也不会更改版本，只有执行pod update才会改变Podfile.lock.在多人协作的时候，这样可以防止第三方库升级时候造成大家各自的第三方库版本不一致。所以在提交版本的时候不能把它落下，也不要添加到.gitignore中.
