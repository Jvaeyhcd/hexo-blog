---
title: iOS高级开发面试题（下）
date: 2018-08-06 13:27:26
tags:
---

## objc使用什么机制管理对象内存？
通过retainCount的机制来决定对象是否需要释放，每次runloop的时候，都会检查对象的retainCount，如果retainCount为0，说明该对象没有地方需要继续使用了，可以释放掉了。
<!-- more -->

## 苹果为什么要废弃dispatch_get_current_queue？
`dispatch_get_current_queue`容易造成死锁。

## 苹果是如何实现autoreleasepool的？
`autoreleasepool`以一个队列数组的形式现实，主要通过下列三个函数完成：
1. `objc_autoreleasepoolPush`
2. `objc_autoreleasepoolPop`
3. `objc_autorelease`

看函数名就可以知道，对autorelease分别执行push和pop操作，销毁对象时执行release操作。

具体说明：我们都知道用类方法创建的对象都是autorelease的，那么一旦Person出了作用域，当在Person的dealloc方法中打上断点，我们就可以看到这样的调用堆栈信息。

## 使用系统的某些block API（如UIView的block版本写动画时），是否也考虑循环引用的问题？

系统的某些block API中，UIVIew的block版本写动画时不需要考虑循环引用，但有一些API需要考虑。所谓“循环引用”是指双向的强引用，所以那些“单向的强引用”没有问题，比如这些：
``` objc
[UIView animateWithDuration:duration animations:^{
    [self.superview layoutIfNeeded];
}];

[[NSOperationQueue mainQueue] addOperationWithBlock:^{
    self.someProperty = xyz;
}];

[[NSNotificationCenter defaultCenter] addObserverForName:@"someNotification" object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification * _Nonnull note) {
    self.someProperty = xyz;
}];
```
这些情况不需要考虑“循环引用”。

但如果使用了一些参数中可能含有ivar的系统API，如GCD、NSNotificationCenter就要小心一点，比如GCD内部如果引用了self，而且GCD的其他参数是ivar，则要考虑到循环引用：
``` objc

```

## 若一个类有实例变量NSString *_foo，调用setValue:forKey:时，可以以foo还是_foo作为key？
都可以。

## KVC和KVO的keyPath一定是属性么？KVC的keyPath中的集合运算符如何使用？

## 如何关闭默认的KVO的默认实现，并进入自定义的KVO实现？

## IB中User Defined Runtime Attributes如何使用？

## BAD_ACCESS在什么情况下出现？


## 如何调试BAD_ACCESS错误

## lldb（gdb）常用的调试命令？

## ios里面存数据有哪些方法？

## frame bounds center 的区别

## 线程共享进程资源的实例

## OC运行时能加实例变量吗?

## 64位下NSNumber的优化

## NSThread NSOperation dispatch 和 gcd的关系

## iOS常用回调方式以及它们之间的区别

## 声明delegate的时候为什么用assign，而不用weak等等

## Block的使用

## 二叉树的深度优先遍历和广度优先遍历

## iOS crash后的调试方法？

## OC中深拷贝,浅拷贝

## iOS沙盒机制

## 不更新版本的方式添加新特性（热更新）

## 如果在发送异步请求的情况下，当前的界面删除了，会出现什么后果，如何解决？

## 怎么用C++ 实现kvo？

## 你会如何储存用户的认证信息？

## 堆和栈的区别

## OC有多继承吗？没有的话用什么代替？

## SDWebImage原理

## 请问push view controller 和 present view controller有什么区别？