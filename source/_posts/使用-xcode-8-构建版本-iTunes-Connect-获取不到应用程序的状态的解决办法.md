---
title: 使用 xcode 8 构建版本 iTunes Connect 获取不到应用程序的状态的解决办法
date: 2016-09-20 13:19:33
tags:
abbrlink: f705d18d988770f0
---

iOS10正式版本已发布，Xcode8也跟着就发布了，于是我就在第一时间将Xcode8和iOS10都更新了。但是一波需要适配的问题就来，有Xib的问题，还有很多界面上的问题，在iOS10上根本不能看。
通过半天的修改终于把界面适配好了，这时我以为iOS10的适配应该就到此为止了，于是我就Archive生成Release版本的ipa并将其提交到iTunesConnect，一切都是那么的顺利。然而事实并不是这样的，上传成功后我打开iTunesConnect网站登录我的开发账号，准备提交版本更新，然而我却找不到我之前提交的ipa。在app下的“活动”栏中的“所有构建版本”也没有我之前提交的版本。（这时我心想，我明明在Xcode中显示提交成功，为什么iTunesConnect中却不显示了，苹果也没有给出任何提示）

我发现构建版本左边的“+”号可点，点开“+”号后发现：

{% asset_img 905614-c52750828b24f91e.png %}
<!-- ![](http://upload-images.jianshu.io/upload_images/905614-c52750828b24f91e.png) -->
<!-- more -->
上面显示我之前提交的几个版本都是无效的，但是在Xcode提交时成功的啊，如果失败也应该给个提示啊。这次却没有任何提示，这肯定不应该啊，每次iTunesConnect中app的状态发生变化，苹果都会发送邮件的，于是我去查阅了一下苹果的邮件，还真有。邮件中有明确的写明：
{% asset_img 905614-7e346e4ec6a37fa2.png %}
<!-- ![](http://upload-images.jianshu.io/upload_images/905614-7e346e4ec6a37fa2.png) -->

于是我重新打开项目在Info.plist中添加了如下配置：

{% asset_img 905614-9df0785347c9212e.png %}
<!-- ![](http://upload-images.jianshu.io/upload_images/905614-9df0785347c9212e.png) -->

> 在iOS10上如果没有上述配置就使用相机、相册、麦克风程序会闪退的。

不知道还有没有其他原因，反正我就是这样解决的，再次做个笔记，同样也希望可以帮助到遇到相同问题的各位同行们。
