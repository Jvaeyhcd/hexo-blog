---
title: RESideMenu在所有界面都会侧滑的问题解决办法
date: 2016-03-05 16:24:40
tags:
  - iOS
categories: 经验积累
abbrlink: 55ca4aace52ac6d0
---

>RESideMenu一个非常好用的左右侧滑菜单控件，很多IOS项目都会用到此类左右侧滑效果。然而在RESideMenu的使用过程中，发现其默认将所有界面都加入了侧滑效果。如在主界面导航的Menu放在屏幕的左右两侧，侧滑才可以显示出来，但是当我们进入主界面的某个次级View中，甚至更深一层的View中，侧滑功能仍然可用。这一点就用IOS的UINavigationController的滑动返回冲突。为了解决这个问题，通过Google在网上搜索找到了如下的解决方法。

<!-- more -->

奉上参考原文链接地址：http://blog.csdn.net/icetime17/article/details/46883915

## RESideMenu基本用法

首先创建window的rootViewController，在RootViewController引入并继承RESideMenu及其RESideMenuDelegate. 

具体相关代码如下：

``` objc
#import "RESideMenu.h"
@interface RootViewController : RESideMenu <RESideMenuDelegate>
@end
```

然后在RootViewController.m文件中设置好RESideMenu

``` objc
#import "RootViewController.h"
@interface RootViewController ()
@end

@implementation RootViewController

- (void)viewDidLoad {
  [super viewDidLoad];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
}

- (void)awakeFromNib {
  self.menuPreferredStatusBarStyle = UIStatusBarStyleLightContent;
  self.contentViewShadowColor = [UIColor blackColor];
  self.contentViewShadowOffset = CGSizeMake(0, 0);
  self.contentViewShadowOpacity = 0.6;
  self.contentViewShadowRadius = 12;
  self.contentViewShadowEnabled = NO;

  self.contentViewController = [self.storyboard instantiateViewControllerWithIdentifier:@"ContentViewController"];
  self.leftMenuViewController = [self.storyboard instantiateViewControllerWithIdentifier:@"LeftMenuViewController"];

  self.delegate = self;
}

#pragma mark - RESideMenu Delegate

- (void)sideMenu:(RESideMenu *)sideMenu willShowMenuViewController:(UIViewController *)menuViewController {
}

- (void)sideMenu:(RESideMenu *)sideMenu didShowMenuViewController:(UIViewController *)menuViewController {
}

- (void)sideMenu:(RESideMenu *)sideMenu willHideMenuViewController:(UIViewController *)menuViewController {
}

- (void)sideMenu:(RESideMenu *)sideMenu didHideMenuViewController:(UIViewController *)menuViewController {
}
@end
```

## 遇到问题

在RESideMenu的使用过程中，发现所有的界面都加上了侧滑功能，并且iOS的滑动返回功能失效了。

## 解决办法

通过观察RESideMenu的源码发现，RESideMenu类中有一个BOOL属性panGestureEnabled, 可以将其视为侧滑效果的开关。以RESideMenu的panGestureEnabled属性为突破口，采用通知的方式来解决这个问题。
在RootViewController.m文件中加入如下代码：
``` objc
- (void)viewDidLoad {
  [super viewDidLoad];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(disableRESideMenu)
                                               name:@"disableRESideMenu"
                                             object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(enableRESideMenu) 
                                               name:@"enableRESideMenu"
                                             object:nil];
}

- (void)enableRESideMenu {
  self.panGestureEnabled = YES;
}

- (void)disableRESideMenu {
  self.panGestureEnabled = NO;
}
```
在其他页面需要禁止侧滑的时候调用如下代码,发送通知
``` objc
// 关闭侧滑效果
[[NSNotificationCenter defaultCenter] postNotificationName:@"disableRESideMenu"
                                                            object:self
                                                          userInfo:nil];
```
相反在需要侧滑的地方调用
``` objc
// 开启侧滑效果
[[NSNotificationCenter defaultCenter] postNotificationName:@"enableRESideMenu"
                                                    object:self
                                                  userInfo:nil];
```