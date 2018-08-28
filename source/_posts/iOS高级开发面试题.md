---
title: iOS高级开发面试题（上）
date: 2018-08-06 10:37:30
tags:
---

## nil、Nil、NULL、NSNull的区别？
<table><tr><td>Symbol</td><td>Value</td><td>Meaning</td></tr><tr><td>NULL</td><td>(void *)0</td><td>literal null value for C pointers</td></tr><tr><td>nil</td><td>(id)0</td><td>literal null value for Objective-C objects</td></tr><tr><td>Nil</td><td>(Class)0</td><td>literal null value for Objective-C classes</td></tr><tr><td>NSNull</td><td>[NSNull null]</td><td>singleton object used to represent null
</td></tr></table>

### nil：对象为空
定义某一实例对象为空值。例如：
``` objc
NSObject* obj = nil;
if (obj == nil) {
  NSLog(@"obj is nil");
} else {
  NSLog(@"obj is not nil");
}
```
<!-- more -->
### Nil：类为空
定义一个类为空。例如：
``` objc
Class someClass = Nil;
Class anotherClass = [NSString class];
```
### NULL：基本数据对象指针为空
用于C语言的各种数据类型的指针为空。例如：
``` objc

int *pointerToInt = NULL; 
char *pointerToChar = NULL; 
struct TreeNode *rootNode = NULL;
```
### NSNull
集合对下那个无法包含nil作为其具体值，如NSArray、NSSet和NSDictionary。相应的，nil值使用一个特定的对象NSNull来表示。`NSNull`提供了一个单一实例用于表示对象属性中的的nil值。

通常初始化NSArray对象，我们是这样的：
``` objc
NSArray *arr = [NSArray arrayWithObjects:@"wang", @"zz", nil];
```
当NSArray里遇到nil时，说明这个数组对象元素截止了，即NSArray只关注nil之前的对象，nil之后的对象会被抛弃，比如下面的写法，与上面的arr值是一样的。
``` objc
NSArray *arr = [NSArray arrayWithObjects:@"wang", @"zz", nil, @"foogry"];
```
如果要让nil后的元素不被抛弃就只能借助NSNull了。
``` objc
NSArray *arr = [NSArray arrayWithObjects:@"wang", @"zz", [NSNull null], @"foogry"];
```

一句话总结Nil、nil、NSNull之间的区别就是：不管是NULL、Nil、nil，他们本质上都是一样的，都是(void *)0，只是写法不同。这样做的意义是区分不同的数据类型，比如你看到NULL就知道他是一个C指针，看到nil就知道这是一个Objective-C对象，看到Nil就知道这是一个Class类型的数据。

## 线程与进程的区别

## 定义一个NSString类类型属性时，为什么使用copy不用strong？

## 引用多线程时会出现什么问题，应如何避免问题的发生？

## 循环引用是如何产生的，如何解决循环引用？

## NSTimer使用中的注意事项

## App的生命周期以及运行状态

## 栈、堆、静态区域的区别

## 子试图超出父视图部分能看到吗？超出的部分有什么影响？

## respond链是如何响应的，响应顺序是什么样的？

## GCD中栅栏机制

## Notification响应顺序

## 利用AutoLayout让可变长度标签居中

## Core Data、SQLite是如何使用的？

## 归档是如何使用的？

## 对Http的理解，socket编程的套路

## NSUserDefault使用的时候需要注意什么？

## ARC的底层实现机制

## 滑动TableView视图的时候NSTimer会不会工作？

## 绘制图形

## 构建缓存时选用NSCache而非NSDictionary

## Runtime机制

## Runloop是怎样持续监听事件从而实现线程保护？如果线程启用Runloop，它会一直占用CPU吗？

## 临界区的理解，临界资源有什么特点？为什么会发生死锁？死锁怎么预防？发生死锁了怎么办？

## 上线APP的crash收集

## 动画掉帧，CADisPlayLink， Core graphics

## 如何给按钮画边框

## Socket和Http的区别，和TCP的区别

## OC对象模型

## HTTPS和HTTP的区别

## 使用atomic一定是线程安全的吗？

