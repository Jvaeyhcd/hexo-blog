---
title: 关闭iOS系统自动更新提示的方法
date: 2016-05-16 10:16:25
tags:
   - iOS系统
categories: 其他
abbrlink: e5a0477099f91071
---

一直以来都被iOS的自动更新困扰，每次苹果推出了最新版本的iOS系统都会提示自动更新，真的很烦。并且公司的测试机不可能全都是一个版本的系统，不然很多不同iOS版本系统的bug根本无法测出来，所以为了保持测试机系统的多样性，我想保持一部分手机系统永不更新，让我自己的手机保持最新系统就行了。

<!-- more -->

## 解决办法

经过一段时间的试验，有如下几个对应方案：
1. 设置 - 通用 - 用量 - 管理存储空间 - 找到更新包，然后删除它
2. 设置 - iTunes&App Stores, 找到Updates，关闭

如果以上两个方案还不管用，直接放大招：
在手机上打开safari，地址栏输入:

```
https://oldcat.me/web/NOOTA9.mobileconfig
```
然后回车
按照要求安装此provision文件即可，然后重启。

{% asset_img thumb_IMG_0889_1024.jpg 安装provision文件%}

重启后打开设置 - 通用 - 软件更新 有惊喜

{% asset_img thumb_IMG_0890_1024.jpg 结果图%}
