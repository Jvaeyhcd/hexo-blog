---
title: iOS高级开发面试题（中）
date: 2018-08-06 11:44:34
tags:
---

## __block在arc和非arc下含义一样吗？
一般在block中修改变量多需要事先加`__block`进行修饰。在非arc下，`__block`修饰的变量的引用计数是不变的，在arc下会引用到计数+1。非arc中使用`__block`解决循环引用问题，在arc中使用`__weak`解决循环引用问题。
``` objc
//非ARC
__block typeof(self) weakSelf = self;
//ARC
__weak typeof(self) weakSelf = self;

self.myBlock = ^(int paramInt){ 
//使用weakSelf访问self成员
 [weakSelf anotherFunc];
};
```
<!-- more -->
## 什么是method swizzling?

method swizzling就是通过Runtime机制，将两个实现调换。如图看起来比较形象：

{% asset_img method_swizzling.png Method Swizzling %}

具体做法是，首先建立自己的方法，然后在`+load`方法中去实现方法交换的代码。（以下调换实现的方法要在`+load`中执行）

``` objc
Method ori_Method =  class_getInstanceMethod([MYclass class], @selector(lastObject));  
Method my_Method = class_getInstanceMethod([MYclass class], @selector(myLastObject));  
method_exchangeImplementations(ori_Method, my_Method);
```

## 如何高性能的给UIImageView加个圆角？

### 不好的解决方法
``` objc
self.imageView.layer.cornerRadius = 5;
self.imageView.layer.masksToBounds = YES;
```
上面的方式会强制Core Animation提前渲染屏幕的离屏绘制，而离屏绘制就会给性能带来负面影响，会有卡顿的现象出现。

### 真正的解决方案：使用绘图技术

通过绘图技术给`UIImageview`添加一个分类，使用下面代码，取保添加圆角时`imageView.image`不为`nil`。

``` objc
#import "UIImageView+cornerRadius.h"

@implementation UIImageView (cornerRadius)

- (void)quickSetCornerRadius:(CGFloat)cornerRadius {
    if (self.image != nil) {
        self.image = [self.image imageAddCornerWithRadius:cornerRadius andSize:self.bounds.size];
    }
}

@end

@implementation UIImage (cornerRadius)
- (UIImage *)imageAddCornerWithRadius:(CGFloat)radius andSize:(CGSize)size {
    // NO代表透明
    UIGraphicsBeginImageContextWithOptions(size, NO, 0.0);
    // 获取上下文
    CGContextRef ctx = UIGraphicsGetCurrentContext();
    // 添加一个圆
    CGRect rect = CGRectMake(0, 0, size.width, size.height);
    CGContextAddEllipseInRect(ctx, rect);
    // 裁剪
    CGContextClip(ctx);
    // 将图片画上去
    [self drawInRect:rect];
    // 得到画上的图像
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    // 关闭上下文
    UIGraphicsEndImageContext();
    return image;
}
@end
```

### 使用了贝塞尔曲线"切割"个这个图片

与上面的方法一致都是通过绘图产生新的`UIImage`，这里只是将`CGContextAddEllipseInRect`画圆换成了`UIBezierPath bezierPathWithRoundedRect:`。给UIImageview添加一个分类方法`- (void)bezierCornerRadius:(CGFloat)cornerRadius`。
``` objc
- (void)bezierCornerRadius:(CGFloat)cornerRadius {
    UIImage *newImage = self.image;
    // NO代表透明
    UIGraphicsBeginImageContextWithOptions(self.bounds.size, NO, 1.0);
    // 获取上下文，用Bezier曲线画圆，并裁剪
    [[UIBezierPath bezierPathWithRoundedRect:self.bounds cornerRadius:cornerRadius] addClip];
    // 将图片画进裁剪的图形中
    [newImage drawInRect:self.bounds];
    // 将画布中新得到的图形设置为UIImageview的image
    self.image = UIGraphicsGetImageFromCurrentImageContext();
    // 关闭上下文
    UIGraphicsEndImageContext();
}
```

使用`[imageView quickSetCornerRadius:50];`就可以给`imageView`添加半径为50的圆角。

## UIView和CALayer是什么关系？

UIView和CALayer有一下区别：
* `UIView`可以响应事件，`CALayer`不能响应事件
* `UIView`主要是对显示内容的管理而 `CALayer` 主要侧重显示内容的绘制
* 每个UIView内部都有一个CALayer在背后提供内容的绘制和显示，并且UIView的尺寸和样式都由内部的CALayer所提供。两者都由树状层级结构，`CALayer`内部有`sublayers`，`UIView`内部有`subViews`。但是`CALayer`比`UIView`多了个`AnchorPoint`。
* 在UIView显示的时候，UIView作为`CALayer`的`CALayerDelegate`，`UIView`的显示内容由内部的`CALayer`的`dispaly`。
* `CALayer`是默认修改属性支撑隐形动画的，在给UIVIiew的Layer做动画的时候，UIView作为CALayer的代理，CALayer通过`actionForLayer:forKey:`向UIView请求相应的action（动画）。
* `CALayer`内部维护着三份`layer tree`，分别是`presentLayer Tree`（动画树）、`modeLayer Tree`（模型树）、`render Tree`（渲染树），在做iOS动画的时候，我们修改动画的属性其实是`CALayer`的`presentLayer`属性值，而最终展示在界面上的实际是UIView的modalLayer。

参考详解：https://www.jianshu.com/p/079e5cf0f014

## 使用drawRect有什么影响？

`drawRect`方法依赖Core Graphics框架来进行自定义绘制，这种方法的主要缺点是处理touch时间的时候，都会用`setNeddsDisplay`进行强制重绘（比如每次点击按钮的时候都会被强制重绘）；并且不不止一次，每次单点事件触发两次执行。这样的话从性能角度来说，对CPU和内存使用上都是欠佳的（特别是在界面上有多个`UIButton`）。

## 设计简单的图片内存缓存器

写一个FIFO的存储机制，设置一定量的内存大小。每次添加新的图片后检查是否超出容量，如果超出则释放队列最前面的图片。

## 用过coreData或者sqlite吗？读写是分线程的吗？遇到过死锁没？如何解决

## 什么是二叉搜索树？search的时间复杂度是多少?

二叉搜索树是一种节点值之间具有一定数量级次序的二叉树，对于树中每个节点：
* 若其左子树存在，则其左子树中每个节点的值都不大于该节点值；
* 若其右子树存在，则其右子树中每个节点的值都不小于该节点值。

搜索的时间复杂度为O(log(n))~O(n)。

## `loadView`是干嘛用的？

* 作用: 加载控制器（`UIViewController`）的`view`。
* 调用时间：第一次使用控制器view的时候。

关于`loadView`的一些理解：
* 只要重写`loadView`，里面就不要调用`[super loadView]`，因为如果我们重写了`loadView`的方法，就代表着我们需要初始化的是自己创建的`view`，而不再是系统默认的`view`，如果再调用`[super loadView]`就显得多余了。`[super loadView]`会去判断有没有指定storyboard，如果有，就会帮你加载storyborad描述的控制器的`view`。
* 在`loadView`方法中，如果没有给控制器的`view`赋值，就不能获取控制器的`view`，否则会造成死循环。

## `viewWillLayoutSubView`的调用情况？

`viewWillLayoutSubView`在以下情况会被调用：
* 在`UIView`init初始化的时候`viewWillLayoutSubView`不会被调用，但是用`initWithFrame:`进行初始化时，当rect的值不为`CGRectZero`时会触发`viewWillLayoutSubview`。
* `addSubview`时会触发`viewWillLayoutSubview`。
* 设置`view`的`frame`时会触发`viewWillLayoutSubview`，当然前提是设置前后的`frame`值发生了变化。
* 滚动一个`UIScrollView`时会触发`viewWillLayoutSubview`。
* 旋转`UIScreen`时会触发父`UIView`上的`viewWillLayoutSubview`。

## 如何让自己的类用`copy`修饰符？如何重写带`copy`关键字的setter？
遵循`NSCopying`协议并实现`copyWithZone`方法就可以让自己的类使用`copy`修饰符修饰。
``` objc
- (void)setName:(NSString *)name {
    _name = [name copy];
}
```
上面的方法可以重写带`copy`关键字的setter。
如果是只读属性可以在初始化`init`函数中完成对`copy`修饰关键字的赋值。
## @protocol 和 category 中如何使用 @property
建立关联引用。详情请见[【iOS】Runtime引用](https://jvaeyhcd.github.io/2018/08/08/%E3%80%90iOS%E3%80%91Runtime%E5%BA%94%E7%94%A8/)一文中 ”关联对象（Objective-C Associated Objects）给分类添加属性“。

## runtime 如何实现 weak 属性
weakg关键字表明该属性定义了一种“非拥有关系”（nonowning relationship）。为这种属性设置新值时，设置方法既不保留新值，又不释放旧值。此特质与`assign`类似，然而在属性所指的对象遭到摧毁时，属性值也会清空(nil out)。

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