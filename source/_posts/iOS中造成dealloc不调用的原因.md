---
title: iOS中造成dealloc不调用的原因
date: 2016-04-06 12:18:32
tags:
---

## 问题描述

最近在一个项目中用到了地图，发现在地图页面和上一个页面间反复切换回出现内存爆增的情况，就像吃了炫迈一样根本停不下来（直到app内存爆表，app闪退收场）。造成这一结果的根本原因是地图的mapView没有释放，导致每次打开地图界面的时候内存中都重新加载了一个地图mapView。于是在网上搜索了一番找到了解决办法，只需要在地图的ViewController中dealloc方法中释放掉mapView就行了。具体代码如下:
``` objc
- (void)dealloc {
    [_mapView release];
    [super dealloc];
}

//并且在界面将要显示的时候设置代理，将要消失的时候取消代理
- (void)viewWillAppear:(BOOL)animated {
    _mapView.delegate = self;
}

- (void)viewWillDisappear:(BOOL)animated {
    _mapView.delegate = nil;
}

```

<!-- more -->

以上给出的方法确实是对的，可以解决反复切换地图页面和地图上一级页面内存暴增造成的闪退问题。但是这里要说的不是这个问题，而是一个新的问题，我在dealloc中打了断点，但是dealloc根本就没有执行，所以mapView也就根本就没有释放，内存还是一样在暴增。为什么ViewController已经被pop了，而ViewController的dealloc方法却没有被调用？（按理说ViewController被pop的时候它的dealloc的方法应该被调用才对）。

## 解决办法

通过Google搜索终于在晚上找到了答案（大家就不要用百度，想要快速准确的找到自己想要的答案推荐大家用google）。造成ViewController不释放的原因可能有很多。遇到dealloc不调用的时候只需要检查您的ViewController中是否存在以下几个问题：

1. <b>ViewController中存在NSTimer</b>

    如果你的ViewController中有NSTimer，那么你就要注意了，因为当你调用
``` objc
[NSTimer scheduledTimerWithTimeInterval:1.0 
                                 target:self 
                               selector:@selector(updateTime:) 
                               userInfo:nil 
                                repeats:YES];
```
    时，这个<a style="color: #FF00EE">target:self</a>就增加了ViewController的return count，如果你不将这个timer invalidate，将别想调用dealloc。

2. <b>ViewController中有关的代理</b>

    一个比较隐秘的因素，你去找找与这个类有关的代理，有没有强引用属性？比如一个代理的delegate应该是 assign 的现在是retain，(╯‵□′)╯︵┻━┻，就是这个，它会影响你不让你调用dealloc，不信，就试试吧。（这个我还没有遇到过）。

3. <b>ViewController中有Block</b>

    这个就是我我上面不进入dealloc的真正原因，Block体内使用实例变量也会造成循环引用，使得拥有这个实例的对象不能释放。
    例如你这个类叫OneViewController,有个属性是NSString *name; 如果你在block体中使用了self.name，那样子的话这个类就没法释放。
    要解决这个问题，MRC下只需
``` objc
__block Viewcontroller *weakSelf = self;
```
    ARC下将__block 换为 __weak

目前我所知道的就以上三种情况，如果有什么错误的地方或者还存在的一些情况，欢迎大家来补充。