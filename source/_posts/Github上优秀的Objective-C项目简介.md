---
title: Github上优秀的objc项目简介
date: 2016-02-20 17:15:47
tags:
  - iOS
categories: 知识积累
abbrlink: 2d92c93946db5207
---

主要对当前Github排名靠前的项目做一个简单的简介，方便自己快速了解 objc的一些优秀的开源框架。

* <a href="https://github.com/AFNetworking/AFNetworking" target="AFNetworking">AFNetworking</a>
作者是 NSHipster 的博主, iOS 开发界的大神级人物, 毕业于卡内基·梅隆大学, 开源了许多牛逼的项目, 这个便是其中之一, AFNetworking 采用 NSURLConnection + NSOperation, 主要方便与服务端 API 进行数据交换, 操作简单, 功能强大, 现在许多人都用它取代 ASIHTTPRequest
* <a href="https://github.com/gavinkwoe/BeeFramework">BeeFramework</a>
BeeFramework是一个iOS应用开发框架，由国内开发者郭虹宇创立并且在Github上开源。经过一年多的发展，BeeFramework在Github上，得到了广泛关注，有1000多的star数和400多的fork数
* <a href="https://github.com/BradLarson/GPUImage">GPUImage</a>
一款强大的图片滤镜工具, 支持自定义滤镜, 可用来实时处理图片和视频流, 作者是 SonoPlot 公司的 CTO, 在很小的时候便开始接触编程, 他在 SO 上面的回答也有很多值得阅读, GPUImage 这个项目从 2012 年开始, 使用 OpenGL 图形程序接口编写, 性能非常好, 现在很多 iOS 程序员都用它来实现 iOS 的模糊效果

<!-- more -->

* <a href="https://github.com/rs/SDWebImage">SDWebImage</a>
作者 Olivier Poitrey 是 Dailymotion 的 CTO, 拥有多个不错的开源项目, 此项目常用于对从 Web 端接受到的图片进行缓存, 是 UIImageView 的扩展, 应用起来比较简单
* <a href="https://github.com/RestKit/RestKit">RestKit</a>
主要用于 iOS 上网络通信, 允许与 RESTful Web 服务交互, 常用于处理 API, 解析 JSON, 映射响应对象等操作, 简单易用, 方便你把所有精力都放在对数据的操作上
* <a href="https://github.com/ReactiveCocoa/ReactiveCocoa">ReactiveCocoa</a>
由 GitHub 工程师们开发的一个应用于 iOS 和 OS X 开发的函数响应式编程新框架, Matt 称其为 "An open source project that exemplifies this brave new era for objc", 也有人说它是 Cocoa 的未来,GitHub自家的函数式响应式编程范式的objc实现，名字听着很高大上，学习曲线确实也比较陡，但是绝对会改变你对iOS编程的认知
* <a href="https://github.com/facebookarchive/three20">three20</a>
由 Facebook iOS 客户端衍生出的一款 iPhone 框架, 内置许多丰富的功能, 有丰富的界面, 对底层的操作便捷, 为开发者省下了很多时间, 但现在已经停止了更新, 一个 PR 把代码删得干干净净, 不要好奇去点开 Files changed, 我点开后该页面直接卡死, three20 当中的一位作者创建了 Nimbus, 算是 three20 的一个替代品
* <a href="https://github.com/jdg/MBProgressHUD">MBProgressHUD</a>
作者 Matej Bukovinski 是一位全栈工程师, UI/UX 设计师, 此项目是一款提示框第三方库, 帮助开发者快速应用到项目中)
* <a href="https://github.com/magicalpanda/MagicalRecord">MagicalRecord</a>
作者是 Coursera 的 iOS 工程师, 该项目创作灵感来自于 Ruby on Rails 的 Active Record, 主要为方便操作 CoreData 而生, 帮助清除 CoreData 引用的代码, 协助方便 CoreData 的工作
* <a href="https://github.com/ccgus/fmdb">FMDB</a>
一个对 SQLite 进行封装的库, 使用起来方便, 简单
* <a href="https://github.com/Mantle/Mantle">Mantle</a>
作者是 GitHub 的员工, 文档写的很清楚: Mantle makes it easy to write a simple model layer for your Cocoa or Cocoa Touch application, 主要用来将 JSON 数据模型化为 Model 对象, 唱吧在前段时间也改用 Mantle 了。GitHub自家的产物，轻量级建模的首选，也可以很好的配合CoreData工作
* <a href="https://github.com/Grouper/FlatUIKit">FlatUIKit</a>
收集了很多扁平化 UI 的 iOS 组件, 方便使用
* <a href="https://github.com/pokeb/asi-http-request">ASIHTTPRequest</a>
一个轻量级的 iOS 网络通信类库, 基于 CFNetwork 框架开发, 但现在已经停止更新, 多数开发者改用 AFNetworking 替代)
* <a href="https://github.com/path/FastImageCache">FastImageCache</a>
Path 公司出品的 iOS 库, 作者 Mallory Paine 是苹果前员工, 此类库适用于在滚动时快速显示图像, 高速持久是其最大的特点
* <a href="https://github.com/SnapKit/Masonry">Masonry</a>
一个轻量级的布局框架, 同时支持 iOS 和 Mac OS X, 语法优雅, 帮助开发者快速适配不同分辨率的 iOS 设备
* <a href="https://github.com/facebook/Shimmer">Shimmer</a>
Facebook 推出的一款具有闪烁效果的第三方控件, 供它旗下一款名为 Paper 的应用使用, 安装使用整个过程都十分简单
* <a href="https://github.com/TransitApp/SVProgressHUD">SVProgressHUD</a>
又一款轻量级的 iOS 第三方控件, 用于显示任务加载时的动画, 非常轻便, 容易使用
* <a href="https://github.com/johnezang/JSONKit">JSONKit</a>
主要用于解析 JSON, 适用于 iOS6 以下环境, 自从 iOS5 开始 Apple 官方给出了 NSJSONSerialization API, 自此大家都用官方的了
* <a href="https://github.com/jverkoey/nimbus">Nimbus</a>
作者 Jeff 曾为 Facebook, Google 做过不少好东西, 也是 three20 的成员之一, three20 停更后, 他创造出这个框架来代替 three20, 文档齐全
* <a href="https://github.com/facebook/facebook-ios-sdk"> Facebook SDK for iOS</a>
Facebook 官方的 iOS SDK, 方便开发者集成 Facebook 的一些功能到自己的 iOS APP 里面
* <a href="https://github.com/facebook/AsyncDisplayKit">AsyncDisplayKit</a>
Facebook 开源的一款 iOS UI 框架, Paper 用的就是该框架, 另外框架还用到了 Facebook 早期开源 Pop 动画引擎
* <a href="https://github.com/supermarin/Alcatraz">Alcatraz</a>
Alcatraz 是一款管理 Xcode 插件、模版以及颜色配置的工具, 可以集成到 Xcode 的图形界面中, 安装删除都是几条命令的事, 很方便, 支持自己开发插件并上传
* <a href="https://github.com/jessesquires/JSQMessagesViewController">JSQMessagesViewController</a>
优雅的 iOS 消息类库, 常用于聊天应用中, 可定制性高
* <a href="https://github.com/facebook/xctool">Xctool</a>
是 Facebook 开源的一个命令行工具，用来替代苹果的 XcodeBuild 工具, 极大的方便了 iOS 的构建和测试, 输出错误信息也比较友好, 受到许多 iOS 开发者的称赞, 经常与其搭配使用的还有 OCUnit, Travis CI, OCLint 等测试工具
* <a href="https://github.com/OpenEmu/OpenEmu">OpenEmu</a>
超强的游戏模拟器, 做游戏开发必备, 官网做得也很不错
* <a href="https://github.com/nicklockwood/iCarousel">iCarousel</a>
作者是英国 Charcoal Design 公司的创始人, 开源领域的贡献颇为卓著, 这个项目就是其中之一, 这是一款可以在 iOS 上实现旋转木马视图切换效果的第三方控件, 并提供多种切换效果
* <a href="https://github.com/romaonthego/RESideMenu">RESideMenu</a>
作者 Roman Efimov 是雅虎的 iOS 工程师, 这个项目实现了 iOS 上的菜单侧滑效果, 创意来源于 Dribbble, 该项目支持 iOS8
* <a href="https://github.com/kevinzhow/PNChart">PNChart</a>
作者周楷雯是 90 后, 秒视的创始人, 该项目是一个带动画效果的图表控件, 简约易用, 受到不少开发者喜爱
* <a href="https://github.com/square/PonyDebugger">PonyDebugger</a>
由 Square 公司推出的一款优秀的 iOS 应用网络调试工具, 用户可以实时看到应用程序的网络请求, 也可以对 iOS 应用程序的核心数据栈进行远程调试
* <a href="https://github.com/jverdi/JVFloatLabeledTextField">JVFloatLabeledTextField</a>
作者是 Thumb Labs 的联合创始人, JVFloatLabeledTextField 是 UITextField 的子类, 主要实现输入框标签浮动效果, 创作灵感来自 Dribbble, 已出现多个移植版本
* <a href="https://github.com/CEWendel/SWTableViewCell">SWTableViewCell</a>
UITableViewCell 的子类, 实现了左右滑动显示信息视图并调出按钮
* <a href="https://github.com/levey/AwesomeMenu">AwesomeMenu</a>
作者是一位中国人, 该项目主要是使用 CoreAnimation 还原了 Path menu 的动画效果
* <a href="https://github.com/tonymillion/Reachability">Reachability</a>
Reachablity 是用于检测 iOS 设备网络环境的库,Beeframeowrk中使用过的库
* <a href="https://github.com/onevcat/VVDocumenter-Xcode"> VVDocumenter-Xcode</a>
作者是王巍国内著名的 iOS 开发者, 人称喵神, 目前在日本 LINE 公司工作, 该项目帮助开发者轻松的生成注释文档, 节省了不少工作量, 赞
* <a href="https://github.com/google/physical-web">The Physical Web</a>
由 Chrome 团队主导的一个项目, 意在用 URL 连接世界, 方便用户接受数据, 目前尚处在实验阶段
* <a href="https://github.com/samuelclay/NewsBlur">NewsBlur</a>
作者独自一个人 Samuel Clay 做出来的一款名为 NewsBlur 的新闻阅读器, 很多人都称其为 Google Reader 的替代品, 这是它的源码
* <a href="https://github.com/cocos2d/cocos2d-objc">Cocos2D-SpriteBuilder</a>
一个可用于在 iOS, Mac 和 Android 上制作 2D 游戏或其它图形/交互应用的框架, 之前的项目名称为 Cocos Swift, 目前该项目在 GitHub 上更新较为频繁
* <a href="https://github.com/TTTAttributedLabel/TTTAttributedLabel">TTTAttributedLabel</a>
UILabel 的替代品, 使 iOS 上的 Label 功能更加丰富, 可支持链接植入等功能
* <a href="https://github.com/robbiehanson/CocoaAsyncSocket">CocoaAsyncSocket</a>
一个功能强大、简单易用的异步 socket 通讯类库, 支持 TCP 和 UDP 协议, 可用于 Mac 和 iOS 设备上, 作者 Robbie Hanson 是 Deusty 的首席软件工程师
* <a href="https://github.com/devinross/tapkulibrary">TapkuLibrary</a>
作者是 Devin Ross, 这是在 iOS 上一款功能强大的 UI 效果类库, 可以实现多种酷炫的效果, 目前仍在更新中</a>
* <a href="https://github.com/CanvasPod/Canvas">Canvas</a>
无需编码实现牛逼的动画效果的库, 连设计师都可以快速上手
* <a href="https://github.com/square/SocketRocket">SocketRocket</a>
Square 公司开源的一个 WebSocket 客户端, 稳定并且易用, 做实时应用常会用到, 受广大开发者喜爱
* <a href="https://github.com/ECSlidingViewController/ECSlidingViewController">ECSlidingViewController</a>
一个视图控制器容器, 将子视图处理成两层, 通过滑动来处理层的切换, 创作灵感来自 Facebook 和 Path的 App, 作者是 Cleveland 的员工
* <a href="https://github.com/stig/json-framework">Json Framework</a>
用于解析 JSON 数据的一个框架, 但是在 iOS5 以上版本大多数人都选择使用 NSJSONSerialization 来解析 JSON, 该项目现在在 GitHub 上也几乎没怎么更新了
* <a href="https://github.com/facebook/Tweaks">Tweaks</a>
Facebook 开源的一款工具, 旨在帮助 iOS 开发者更快的迭代应用, 方便用户动态的调整参数, 是的, Paper 这个项目也用到了
* <a href="https://github.com/realm/realm-cocoa">realm-cocoa</a>
Realm-Cocoa 是 Realm 公司推出一款移动端数据库, 可以运行在手机、平板和可穿戴设备之上, 其目标是取代 CoreData 和 SQLite 数据库
* <a href="https://github.com/icanzilb/JSONModel">JSONModel</a>
一个能迅速解析服务器返回的 Json 数据的库, 方便数据的类型转换
* <a href="https://github.com/facebook/KVOController">KVOController</a>
一个简单安全的 KVO(Key-value Observing, 键-值 观察)工具, 提供简单方便、线程安全的API, Facebook 的开源项目之一
* <a href="https://github.com/mwaterfall/MWPhotoBrowser">MWPhotoBrowser</a>
一款简单的 iOS 照片浏览控件
* <a href="https://github.com/samvermette/SVPullToRefresh">SVPullToRefresh</a>
<b>一款只需一行代码便可集成上拉刷新和下拉加载的组件</b>
* <a href="https://github.com/facebook/pop">POP</a>
facebook出品的paper，动画效果太好了，赶超apple的原生app一大截。pop就是paper的动画库！
* <a href="https://github.com/dennisreimann/ioctocat">ioctocat</a>
github的iOS客户端，目前开源代码是V1版本，V2版本在appstore上可以下载
* <a href="https://github.com/ChatSecure/ChatSecure-iOS">ChatSecure</a>
使用XMPP协议的IM开源软件，很强大，在appstore上可以下载
* [FDFullscreenPopGesture](https://github.com/forkingdog/FDFullscreenPopGesture)
一个丝滑的全屏滑动返回手势,相关博客文章点击[这里](http://blog.sunnyxx.com/2015/06/07/fullscreen-pop-gesture/)
* [TKSubmitTransition](https://github.com/Jvaeyhcd/TKSubmitTransition)
非常漂亮的一个登录转场动画
* [DZNEmptyDataSet](https://github.com/dzenbot/DZNEmptyDataSet)
非常方便的对一些没有数据的UITableView或者UIScrollView加上提示图片和文字。

* [iRate](https://github.com/nicklockwood/iRate)
一个开源的评分控件，能够非常友好的设置提醒用户去评论我们的app

* [iVersion](https://github.com/nicklockwood/iVersion)
和iRate一样出自同一个人之手，，这个是提示用户更新版本。

* [PureLayout](https://github.com/PureLayout/PureLayout)
自动布局

### 文本相关

* [SlackTextViewController](https://github.com/slackhq/SlackTextViewController)
你曾经用过Slack iOS应用吗？如果你在较大的软件公司工作，也许会用过。对那些没用过的人呢？—?Slack令人激动。用到Slack的应用也是这样，尤其是用作极佳、定制的文本输入控制时。这时你有了一个现成可用在应用中的代码。自适应文本区域？试一下。手势识别、自动填充、多媒体合并？试一下。快速drop-in解决方案？试一下。其他还想要什么？SlackTextViewController 可以替代 UITableViewController & UICollectionViewController。

* [RTLabel](https://github.com/honcheng/RTLabel)
用于显示html的Label

* [Shimmer](https://github.com/facebook/Shimmer)
滑动解锁效果的界面

* [DDRichText](https://github.com/daiweilai/DDRichText)
为图文混排提供了一个思路

### 进度条

* [NJKWebViewProgress](https://github.com/ninjinkun/NJKWebViewProgress)
web界面加载进度条

* [MBProgressHUD](https://github.com/jdg/MBProgressHUD)
MBProgressHUD 使用非常广泛，网上很多基于ta的封装

* [SVProgressHUD](https://github.com/SVProgressHUD/SVProgressHUD)
Navigation的扩展，强烈推荐

* [Toast](https://github.com/scalessec/Toast)

### 导航栏

* [LTNavigationbar](https://github.com/ltebean/LTNavigationbar)
上下滑动动态改变导航栏颜色

* [JZNavigationExtension](https://github.com/JazysYu/JZNavigationExtension)

### 键盘类

* [IQKeyboardManager](https://github.com/hackiftekhar/IQKeyboardManager)

* [TPKeyboardAvoiding](https://github.com/michaeltyson/TPKeyboardAvoiding)
这个我用得很多，界面上如果有输入框可以界面会跟着键盘动，而不被键盘挡住。

### 基础工具类以及Category

* [BFKit OC版本](https://github.com/FabrizioBrancati/BFKit)
国外的一个大神写的很好用的分类，比较齐全

* [DateTools](https://github.com/MatthewYork/DateTools)
很强大的日期工具类

* [iOS-Categories](https://github.com/shaojiankui/iOS-Categories)
很是全面的一个扩展 iOS中的各种objc Category, a collection of useful objc Categories extending iOS Frameworks such as Foundation,UIKit,CoreData,QuartzCore,CoreLocation,MapKit Etc.

* [Material-Controls-For-iOS](https://github.com/fpt-software/Material-Controls-For-iOS)
大神模仿谷歌做的iOS原生特效控件

* [BlocksKit](https://github.com/zwaldowski/BlocksKit)
为基础类提供Block支持，很好用

### 弹出框

* [STPopup](https://github.com/kevin0571/STPopup)
很方便的弹出框

* [MMPopupView](https://github.com/adad184/MMPopupView)
里脊串的弹出框

* [NYAlertViewController](https://github.com/nealyoung/NYAlertViewController)
非常强大的弹出框

* [TYAlertController](https://github.com/12207480/TYAlertController)
很好很强大的弹出框，多种样式满足你的需求

* [JKPopMenuView](https://github.com/UncleJoke/JKPopMenuView)
一个简单的弹出菜单

### 其它

* [SWTableViewCell](https://github.com/CEWendel/SWTableViewCell)
自定义侧滑

* [MGSwipeTableCell](https://github.com/MortimerGoro/MGSwipeTableCell)
同上自定义侧滑

* [FDFullscreenPopGesture](https://github.com/forkingdog/FDFullscreenPopGesture)
全屏滑动返回上级页面

* [PDTSimpleCalendar](https://github.com/jivesoftware/PDTSimpleCalendar)
一款日历控件，可以看看