---
title: 全屏设置setStatusBarOrientation 未生效的解决办法
date: 2016-07-06 15:21:10
tags:
  - StatusBar
categories: 常见问题
abbrlink: 8ab809de7f3aefd3
---

最近在一个项目中用到了视频播放组件，并且项目要求视频能够边下边播，并且需要实现视频的缓存，如果下次播放就不要再通过网络去访问播放，而是直接读取本地的缓存文件播放。在实现让视频全屏播放的时候遇到了比较难搞的问题，当视频全屏的时候，视频成功旋转过来了，，但是状态栏的方向始终不能旋转过来。
手动调用了如下代码，但是并没有什么卵用：
``` objc
[[UIApplication sharedApplication]setStatusBarOrientation:UIInterfaceOrientationLandscapeRight];
```
经过一番搜索，网上给了各种方法，归纳起来大致是这个样子的：

<!-- more -->
1. 首先在Info.plist中设置View controller-based status bar appearance为NO
2. 需要旋转的视频ViewController的方法`- (BOOL)shouldAutorotate`要返回NO，不然手动旋转不会生效。

> Tips:本以为到了这里问题就应该已经解决了，but问题并没有得到解决,覆写`- (BOOL)shouldAutorotate`方法并为生效，或许此时你一定会说:"WTF?"

最后的原因是:<span style="textColor:'#00ff00'">由于UIViewController放置在Navigation中，而由于Navigation不人性化的设计，navigation的- (BOOL)shouldAutorotate是不会根据显示ViewController的- (BOOL)shouldAutorotate设置的值来改变的。</span>

最后最终的解决办法是将下面这段代码放在AppDelegate.m的最后面，这个时候NavigationController就会根据你显示的ViewController改变返回值了，然后再去ViewController覆写方法，返回NO，方法生效了！
``` objc
@implementation UINavigationController (Rotation)  

- (BOOL)shouldAutorotate  
{  
    return [[self.viewControllers lastObject] shouldAutorotate];  
}  

- (NSUInteger)supportedInterfaceOrientations  
{  
    return [[self.viewControllers lastObject] supportedInterfaceOrientations];  
}  

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation {  
    return [[self.viewControllers lastObject] preferredInterfaceOrientationForPresentation];  
}  
@end  
```
