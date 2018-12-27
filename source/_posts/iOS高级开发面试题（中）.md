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

那么runtime如何实现weak变量的自动置为nil？

在runtime中对注册的类进行管理，对于`weak`对象将会放入`hash`表中。用weak指向的内存地址作为key,当此对象的引用计数为0的时候回dealloc，加入weak指向的内存地址是a，那么就会以a为键，在这个weak表中搜索，找到键为a的weak对象，从而设置为nil。

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
基本思路是使用iOS的gcd异步请求A、B完成后汇总结果，然后再执行C请求。
``` objc
- (void)gcdGroup {
    dispatch_queue_t queue = dispatch_queue_create(0, 0);
    dispatch_group_t group = dispatch_group_create();
    
    dispatch_group_async(group, queue, ^{
        // 任务A
    });
    dispatch_group_async(group, queue, ^{
        // 任务B
    });
    
    dispatch_group_notify(group, dispatch_get_main_queue(), ^{
        // 任务C
    });
}
```

## @synthesize合成实例变量的规则是什么？假如property名为foo，存在一个名为_foo的实例变量，那么还会自动合成新变量么？

实例变量 = 成员变量 = ivar

`@synthesize`合成实例变量的规则，有一下几点：
* 如果指定了成员变量的名称，会生成一个指定名称的成员变量
* 如果这个成员变量存在了就不会再生成了
* 如果是`@synthesize foo;`会生成一个名称为foo的成员变量，也就是说：如果没有指定成员变量的名称会生成一个和属性同名的成员变量
* 如果是`@synthesize foo = _foo;`，就不会生成成员变量了

加入property名为foo，存在一个名为_foo的实例变量，就不会再自动合成新变量。

## 在有了自动合成属性实例变量之后，@synthesize还有哪些使用场景？
有了自动合成属性实例变量之后，`@synthesize`还有以下使用场景：
* 同时重写了属性的setter和getter方法
* 只读属性的getter时
* 使用了`@dynamic`时
* 在`@protocol`中定义的所有属性
* 在category中定义的所有属性重载的属性
* 当在子类中重载了父类的属性

在上面的场景中，你必须使用`@synthesize`来手动合成ivar。

## 什么时候会报unrecognized selector的异常？
objc向一个对象发送消息时，runtime库会根据对象的isa指针找到该对象所属的类，然后在该类的方法列表以及父类方法列表中寻找方法运行，如果在最顶层的父类方法列表中依然找不到相应的方法时，程序运行就会挂掉并抛出unrecognized selector的异常。但是在这之前，runtime会有三次拯救程序崩溃的机会。

## objc中向一个nil对象发送消息将会发生什么？

不会报错，看上去什么都没有发生，但事实上还是发生了一些事情的。
``` objc
SomeClass * someObject;
someObject = nil;
[someObject doSomething];
```
就上上面的代码，向nil对象发送了doSomething，OC中nil是被当做0定义的。也就是说runtime要去获取这个nil的对象时，回去读取内存中0的位置，这是肯定不会被允许的，会返回nil，0，0.0等数据，根据返回值类型。

nil比较容易与僵尸对象混淆，僵尸对象并不是nil，僵尸对象是你的对象被销毁了或则用于其他地方了，但是他的指针依然存在。会发生向一个object发送一个没有的方法。

## 一个objc对象的isa指针指向什么？有什么作用？
一个objc对象的isa指针指向它的类对象，从而可以找到类对象上的方法。

每个objc对象都有一个隐藏的数据结构，这个数据结构是objcd对象的第一个成员变量，他就是isa指针。它指向一个类对象(class object，记住它是一个对象，是占用内存空间的一个变量，这个对象在编译的时候编译器就生成了，专门来描述某个类的定义)，这个类对象包含了objc对象的一些信息(为了区分两个对象，这里我们称作objc对象)，包含objc对象的方法调度表，实现了什么协议等等。
``` objc
@implementation Son : Father
- (id)init
{
    self = [super init];
    if (self) {
        NSLog(@"%@", NSStringFromClass([self class]));
        NSLog(@"%@", NSStringFromClass([super class]));
    }
    return self;
}
```
上面的代码输出都是Son，因为`[self class]`和`[super class]`都是以这个Son实例作为参数，去调用自己的class方法或father的class方法，结果发现它们都没有实现，都是调用NSObject的class方法，参数是同一个Son，所以输出的都是Son。

## 一个objc对象如何进行内存布局？（考虑有父类的情况）
所有父类成员变量和父类成员变量都会存放在该对象对应的存储空间中。
每个对象内部都有一个isa指针，指向它的类对象，类对象中存放着本对象的：
* 对象方法列表（对象能够接受的消息列表，保存在它所对应的类对象中）
* 成员变量的列表
* 属性列表

它内部有一个isa指针指向元对象（meta class），元对象内部存放的是类方法列表，类对象内部还有一个superclass的指针，指向他的父类对象。
* 根对象就是NSObject，它的superclass指针指向nil。
* 类对象既然成为对象，那它也是一个实例。类对象中也有一个isa指针指向它的元类（meta class），即类对象是元类的实例。元类内部存放的是类方法列表，根元类的isa指针指向自己，superclass指针指向NSObject类。

## objc中的类方法和实例方法有什么本质区别和联系？

### 类方法
* 类方法是属于类对象的
* 类方法只能通过类对象调用
* 类方法中的self是类对象
* 类方法可以调用其他的类方法
* 类方法不能访问成员变量
* 类方法不能直接调用对象方法

### 实例方法
* 实例方法是属于实例对象的
* 实例方法只能通过实例对象调用
* 实例方法中的self是实例对象
* 实例方法中可以访问成员变量
* 实例方法中直接调用实例方法
* 实例方法中可以调用类方法（通过类名）

## _objc_msgForward函数是做什么的，直接调用它将会发生什么？
_objc_msgForward是IMP类型，用于消息转发的：当一个对象发送一条消息，但它并没有实现的时候，_objc_msgForward会尝试做消息转发。

直接调用_objc_msgForward是非常危险的事，如果用不好会导致程序Crash，但是如果用得好，能做非常酷的事。

一旦调用_objc_msgForward，将调过查找IMP的过程，直接触发“消息转发”，如果调用了_objc_msgForward，即使这个对象确实已经实现了这个方法，也会告诉objc_msgSend：“我没有在这个对象里找到这个方法的实现”。

## runloop的mode作用是什么？
runloop主要是用来指定事件在运行循环的优先级，分为：
* `NSDefaultRunLoopMode`：默认，空闲状态
* `UITrackingRunLoopMode`：ScrollView滑动时
* `UIInitializationRunLoopMode`：启动时
* `NSRunLoopCommonModes`：Mode集合

苹果公开提供的Mode有两个：
* `NSDefaultRunLoopMode`
* `NSRunLoopCommonModes`

## 能否向编译后得到的类中增加实例变量？能否向运行时创建的类中添加实例变量？为什么？

不能向编译后得到的类中增加实例变量，能向运行时创建的类中添加实例变量。

因为编译后的类已经注册在runtime中，类结构体中的objc_ivar_list实例变量的链表和instance_size实例变量的内存大小已经确定，同时runtime会调用class_setIvarLayout或class_setWeakIvarLayout来处理strong weak引用。所以不能向存在的类中添加实例变量。

运行时创建的类是可以添加实例变量，调用class_addIvar函数。但是得在调用objc_allocateClassPair之后，objc_registerClassPair之前，原因和上面一样。

## runloop和线程有什么关系？

## 以`scheduledTimerWithTimeInterval`的方式触发的timer，在滑动页面上的列表时，timer会暂停回调，为什么？如何解决？

RunLoop只能运行在一种mode下，如果要换mode，当前的loop也需要停下重启成新的。利用这个机制，scrollView滚动过程中`NSDefaultRunLoopMode`(`kCFRunLoopDefaultMode`)的mode会切换到`UITrackingRunLoopMode`来保证scrollView的流畅滑动：只能在`UITrackingRunLoopMode`模式下处理的事件会影响scrollView的滑动。

如果我们把一个NSTimer对象以`UITrackingRunLoopMode`(`kCFRunLoopDefaultMode`)添加到主运行循环中的时候，scrollView滚动过程中会因为mode的切换，而导致NSTimer将不再被调度。

同时因为mode还是可以定制的，所以：
NSTimer计时器会被scrollView的滑动影响的问题可以通过将timer添加在`NSRunLoopCommonModes`（`kCFRunLoopCommonModes`）来解决。

这个模式等效于`NSDefaultRunLoopMode`和`NSEventTrackingRunLoopMode`的结合。两个模式以数组的形式组合，当只要其中任意一个模式触发，都是这个大模式的触发，都会响应。

## runloop内部是如何实现的？
在while里有一个一直监听唤醒时间的东西，监听到就立马处理。之后又循环回来监听，直到满足跳出条件。

``` objc
function loop() {
    initialize();
    do {
        var message = get_next_message();
        process_message(message);
    } while (message != quit);
}
```