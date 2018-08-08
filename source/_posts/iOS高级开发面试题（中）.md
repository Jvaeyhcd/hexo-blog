---
title: iOS高级开发面试题（中）
date: 2018-08-06 11:44:34
tags:
---

## __block在arc和非arc下含义一样吗？
<!-- more -->
## 什么是method swizzling?

## 如何高性能的给UIImageView加个圆角？

## UIView和CALayer是什么关系？

## 使用drawRect有什么影响？

## 设计简单的图片内存缓存器

## 用过coreData或者sqlite吗？读写是分线程的吗？遇到过死锁没？如何解决

## 二叉搜索树？search的时间复杂度是多少?

## loadView是干嘛用的？

## viewWillLayoutSubView是？

## 如何让自己的类用 copy 修饰符？如何重写带 copy 关键字的 setter？

## @protocol 和 category 中如何使用 @property

## runtime 如何实现 weak 属性

## @property 的本质是什么？ivar、getter、setter 是如何生成并添加到这个类中的
https://blog.csdn.net/u011774517/article/details/56013365
### @property的本质是什么？
`@property`的本质就是：@property = ivar + getter + setter;
属性（property）有两大概念：ivar（实例变量）、存取方法（access method ＝ getter + setter）

“属性” (property)作为 Objective-C 的一项特性，主要的作用就在于封装对象中的数据。 Objective-C 对象通常会把其所需要的数据保存为各种实例变量。实例变量一般通过“存取方法”(access method)来访问。

例如下面的类：
``` objc
@interface Person : NSObject
@property NSString *firstName;
@property NSString *lastName;
@end
```
上述代码写出来与下面这种写法等效：
``` objc
@interface Person : NSObject
- (NSString *)firstName;
- (void)setFirstName:(NSString *)firstName;
- (NSString *)lastName;
- (void)setLastName:(NSString *)lastName;
@end
```

### ivar、getter、setter是如何生成并添加到这个类中的？
自动合成（autosynthesize）

完成属性定义后，编译器会自动编写访问这些属性所需的方法，此过程叫做自动合成（autosynthesize）。这个过程由编译器在编译执行期间执行，所以编辑器里看不到这些合成方法（synthesized method）的源码。除了生成方法代码getter、setter之外，编译器还要自动向类中适当添加类型的实例变量，并且在属性名前加下划线，以此作为实例变量的名字。

## @synthesize和@dynamic分别有什么作用？

1. `@propert`有两个对应的词，一个是`@synthesize`，一个是`@dynamic`。如果`@synthesize`和`@dynamic`都没有写，那么默认的就是`@syntheszie var = _var;`。

2. `@synthesize`的语意是如果你没有手动实现setter和getter方法，那么编译器会自动给你加上这两个方法。

3. `@dynamic`告诉编译器setter和getter方法由用户自己实现，不自动生成。（对于readonly属性的字需要提供getter即可）。

## ARC下，不显式指定任何属性关键字时，默认的关键字都有哪些？

分两种情况，对于基本数据类型默认关键字是`(atomic,readwrite,assign)`，对于普通的OC对象默认关键字是`(atomic,readwrite,strong)`。

## 扩展（Extension）和分类（Category）的区别？

推荐使用Category，Category可以：
* 给已经存在的类添加方法
* 把类的方法分开在不同的文件中，这样的优点有：
  * 减少单个文件的体积
  * 把不同功能组织在不同的category文件中
  * 多个开发者可以共同完成一个类
  * 按照需求加载想要加载的category
* 声明私有和公用方法

### category和extension的区别1
* category：类别，分类
  * 专门用来给类添加新的方法
  * 通常不能给类添加属性，添加了成员变量也获取不到（但是通过Runtime可以给类添加属性）
  * 分类（Category）中@property定义变量，只会生成变量的getter，setter方法申明，没有方法实现和带下划线的成员变量
  * 分类会覆盖类的方法，如果分类的方法与类本来的方法同名，则会覆盖类的方法

* extension：扩展
  * 扩展可以说是特殊的分类，也称做匿名分类
  * 可以给类添加成员属性，但是是私有的
  * 可以给类添加成员方法，但是是私有方法
  * 伴随着类的产生而产生，与随着类的消失而消失
  * extension一般用来隐藏类的私有方法，必须要有一个类的源码才能添加一个类的extension，所以对于一些系统类NSString就无法添加扩展


## 如何实现A、B请求完成后，再执行C请求？

## @synthesize合成实例变量的规则是什么？假如property名为foo，存在一个名为_foo的实例变量，那么还会自动合成新变量么？

## 在有了自动合成属性实例变量之后，@synthesize还有哪些使用场景？

## 什么时候会报unrecognized selector的异常？

## objc中向一个nil对象发送消息将会发生什么？

## 一个objc对象的isa的指针指向什么？有什么作用？

## 一个objc对象如何进行内存布局？（考虑有父类的情况）

## objc中的类方法和实例方法有什么本质区别和联系？

## _objc_msgForward函数是做什么的，直接调用它将会发生什么？

## runloop的mode作用是什么？

## 能否向编译后得到的类中增加实例变量？能否向运行时创建的类中添加实例变量？为什么？

## runloop和线程有什么关系？

## runloop内部是如何实现的？

## OC各个关键字修饰都有哪些？都使用在什么场景中？