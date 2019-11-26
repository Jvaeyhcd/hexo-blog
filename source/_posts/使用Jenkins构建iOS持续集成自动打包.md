---
title: Jenkins+Cocoapods+Coding+Git+Fir iOS项目持续集成
date: 2016-05-21 15:48:50
tags:
   - Jenkins
abbrlink: f3698aa6c24ae046
---

> 持续集成是一种软件开发实践，即团队开发成员经常集成它们的工作，通过每个成员每天至少集成一次，也就意味着每天可能会发生多次集成。每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。

### 为什么使用持续集成
1、减少重复繁琐的打包过程
2、任何时间、任何地点测试都可以获取到新包
3、增强项目的可见性

做持续集成对我们开发者来说是一件一劳永益的事情，对于发包这个问题，相信是每个程序员GG心中挥之不去的痛，而测试MM们也在每次马上就发出来的承诺中得出一个结论就是“你是个大骗子”。

所以每次被测试MM追着要包，产品经理说给我装一个新包瞧瞧呗，后台GG说给我装一个老版本调试一下啊。。。这个时候我们的内心是奔溃的，然后我们不得不暂停手下的工作，切换到某个版本，Archive。。。其实对于打包发包这种事情根本就不是开发需要做的，因为这是一个简单没有技术含量且浪费时间的工作。时间就是金钱，所以为了不再浪费我们开发宝贵的时间，自动化构建这件事情必须得提上日程了。

<!-- more -->

### 常见的持续集成工具
* [Jenkins CI](https://jenkins-ci.org)
* [Travis CI](https://travis-ci.com/)
* [Hudson CI](http://hudson-ci.org/)
* [Circle CI](https://circleci.com/)

持续集成的工具有很多，不过最好用的还是Jenkins，Travis能够对Github上的开源项目做很好的集成，考虑到Jenkins的稳定性，我们还是选择Jenkins来开始我的iOS持续集成。

### 工程结构

本事例项目工程代码存放在coding，使用Cocoapods管理第三方库，存在在coding上的项目目录结构如下：
{% asset_img coding.png 目录结构图 %}
由于cocoapods文件过多，所以没有必要上传到git仓库中，只用将Podfile文件传上去即可。

### Jenkins的安装

由于Jenkins是Java开发的，所以首先我们需要先安装好Java环境，然后去Jenkins的[官网](http://jenkins-ci.org/)下载最新的war包。下载完成后，打开终端，进入到war包所在目录，执行以下命令：
``` bash
java -jar jenkins.war --httpPort=8888
```
httpPort指的就是Jenkins所使用的http端口，这里指定8888，可根据具体情况来修改。待Jenkins启动后，在浏览器页面输入以下地址:
``` bash
http://localhost:8888
```
这样就可以打开Jenkins页面了。
> `--httpPort=8888`可以不输入，不输入默认端口号为8080

打开链接后，先要设置一些安装信息，这里就不再啰嗦，因为十分简单，接下来我们来看安装成功后的相关配置。

### Jenkins的配置
到Jenkins页面，Jenkins－系统管理－插件管理－可选插件中，安装一下插件：
* GIT plugin
* Git client plugin
* Xcode integration
* CocoaPods Jenkins Integration

#### Git私有仓库配置
按照如下方式添加SSH，因为项目代码是存放在coding上的所以，这个关于生成SSH可以以Coding为例：https://coding.net/help/doc/git/ssh-key.html

{% asset_img ssh_username_private_key.png SSH 秘钥配置 %}

#### 创建Job

这里的步骤我准备全部一图片的形式展示出来。

点击“Jenkins”－“新建”：

{% asset_img new_job.png 创建Job %}

#### 源码管理

选择刚刚创建的项目，点击“配置”：

{% asset_img set_code_source.png 设置源码地址 %}

这里最好使用SSH，这个工程是私有项目，如果出现错误肯定是由你自己配置错误造成的。

#### 构建步骤设置

选择构建步骤，记得添加Xcode插件，选择添加Execute Shell和Xcode，有先后顺序。

{% asset_img execte_config.png 添加构建步骤 %}

设置Execute Shell

{% asset_img execute_shell.png Execute Shell %}

#### Xcode General build settings

{% asset_img xcode_general_build_settings.png General build settings %}

{% asset_img code_signing_OS_X_keychain_options.png Code signing & OS X keychain options %}

Keychain path填写`${HOME}/Library/Keychains/login.keychain`
Keychain password对应的密码可以在钥匙串中查看：

{% asset_img keychain.png Code signing & OS X keychain password查看方法 %}

#### Advanced Xcode build options

{% asset_img xcode_build_options.png Advanced Xcode build options %}

### fir.im Jenkins 插件安装

上面的构建配置好了后，如果顺利的话就已经能够编译出ipa文件了，但是编译出来的ipa只能放在本地，不能给大家安装，所以编译完成后我们还需要将ipa文件上传到fir.im。
fir插件的安装方法详情请移步：[《fir.im Jenkins 插件使用方法》](http://blog.fir.im/jenkins/)

### 构建后上传到fir.im

安装好fir插件后在“构建后操作”中点击“添加构建后操作步骤”，可以看到：

{% asset_img upload_fir.png 添加构建后上传fir步骤 %}

点击“upload to fir.im”，然后会出现如下界面：

{% asset_img set_upload_fir.png 设置fir.im的Token %}

Fir.im的Token获取地址：http://fir.im/apps/apitoken

### 手动构建

选中你要构建的项目，然后点击“立即构建”

{% asset_img shoudong_goujian.png 手动构建 %}

选择正在构建的Build，然后点击“Console Output”可以查看build过程中打印的一些信息，如果遇到什么报错信息都可以在这里面查看。

{% asset_img build_message.png 控制台输出 %}

### 自动构建设置

构建触发器有一下几种触发方式：
* 触发远程构建 (例如,使用脚本)
* Build after other projects are built
* Build periodically
* Poll SCM

这里我只用到了Build periodically

{% asset_img zidong_goujian.png Build periodically触发自动构建 %}

### 总结

为了搭建这个Jenkins我看了很多博客，不过大多比较难懂，一直都没有成功，经过各种尝试后最终搭建成功，我在此将整个过程记录下来，以来是对自己知识的一个积累，二来如果能够给将要搭建Jenkins的iOS持续集成的朋友们一点帮助也是极好的。

参考文档：
[一步一步构建iOS持续集成:Jenkins+GitLab+蒲公英+FTP](http://www.jianshu.com/p/c69deb29720d#)
[使用 Xcodebuild + Jenkins + Apache 做 iOS 持续集成](http://rannie.github.io/ios/2014/12/29/xcodebuild-jenkins-ci.html)
