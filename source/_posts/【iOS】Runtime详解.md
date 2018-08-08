---
title: 【iOS】Runtime详解
date: 2018-08-08 09:50:48
tags:
---

做了很久的iOS开发了，但依然还是没有将一些基础的知识弄清楚，想要真正的掌握一门技术或则语言，真的不能一知半解，就像你说你熟练掌握了iOS的开发，但是如果别人问你什么是Runtime，它的原理是什么，如果这你都不知道真的算不上对iOS已经熟练掌握了。以前一直有一个误区，拿到一门语言或则技术直接就开始写东西了，但是对很多的原理都是一知半解，以致于忽略了很多基本知识，这篇笔记我要将我丢掉runtime的一些知识都捡起来。

## Runtime简介

> Objective-C是一门动态语言，它将很多静态语言在编译和链接时期做的事情放到了运行时来处理。对于Objective-C来说，这个Runtime就像是一个操作系统一样，它让所有的工作可以正常运行。Runtime简称运行时。Objective-C就是运行时机制，也就是在运行时的一些机制，最主要的就是消息机制。
* 对于C语言，函数的调用在编译的时候会决定调用那个函数。
* 对于Objective-C的函数，属于动态调用过程，在编译的时候并不能真正的决定调用哪个函数，只有真正运行的时候才会根据函数的名称找到对应的函数来调用。

<!-- more -->

## Runtime消息传递

一个对象的方法像这样`[obj foo]`，编译器转成消息发送`objc_msgSend(obj, foo)`，Runtime时的执行流程是这样的：
* 首先，通过它的`obj`的`isa`指针找到它的`class`；
* 在`class`的`method_list`中找到`foo`方法；
* 如果`class`中没有找到`foo`，就继续往它的`super_class`中找；
* 一旦找到`foo`这个函数，就去执行它的实现`IMP`（如果还是找不到就会报`unrecognized selector`的错）。

### 类对象（objc_class）
Objective-C类是由Class类型来表示，它实际上是指向objc_class结构体的一个指针。
``` objc
typedef struct objc_class *Class
```

查看`objc/runtime.h`文件中objc_class结构体的定义如下：
``` c
// 类
struct objc_class {
    Class _Nonnull isa  OBJC_ISA_AVAILABILITY;

#if !__OBJC2__
    Class _Nullable super_class                              OBJC2_UNAVAILABLE;   // 父类
    const char * _Nonnull name                               OBJC2_UNAVAILABLE;   // 类名
    long version                                             OBJC2_UNAVAILABLE;   // 类的版本信息，默认为0
    long info                                                OBJC2_UNAVAILABLE;   // 类信息，供运行期使用的一些位标识
    long instance_size                                       OBJC2_UNAVAILABLE;   // 类的实例变量大小
    struct objc_ivar_list * _Nullable ivars                  OBJC2_UNAVAILABLE;   // 该类的成员变量链表
    struct objc_method_list * _Nullable * _Nullable methodLists                    OBJC2_UNAVAILABLE;   // 方法定义的链表
    struct objc_cache * _Nonnull cache                       OBJC2_UNAVAILABLE;   // 方法缓存
    struct objc_protocol_list * _Nullable protocols          OBJC2_UNAVAILABLE;   // 协议链表
#endif

} OBJC2_UNAVAILABLE;

// 方法
struct objc_method {
    SEL _Nonnull method_name                                 OBJC2_UNAVAILABLE;
    char * _Nullable method_types                            OBJC2_UNAVAILABLE;
    IMP _Nonnull method_imp                                  OBJC2_UNAVAILABLE;
}                                                            OBJC2_UNAVAILABLE;

// 方法列表
struct objc_method_list {
    struct objc_method_list * _Nullable obsolete             OBJC2_UNAVAILABLE;

    int method_count                                         OBJC2_UNAVAILABLE;
#ifdef __LP64__
    int space                                                OBJC2_UNAVAILABLE;
#endif
    /* variable length structure */
    struct objc_method method_list[1]                        OBJC2_UNAVAILABLE;
}                                                            OBJC2_UNAVAILABLE;


```

### 实例（objc_object）
objc_object是表示一个类的实例的结构体，在`objc/objc.h`文件中定义如下：
``` objc
typedef struct objc_class *Class;

struct objc_object {
    Class _Nonnull isa  OBJC_ISA_AVAILABILITY;
};

typedef struct objc_object *id;
```

可以看到这个结构体只有一个字段，及指向其类的isa指针。这样当我们向一个Objective-C对象发送消息时，Runtime库会根据实例对象的isa指针找到这个实例对象所属的类。Runtime库会在类方法列表以及父类的方法列表中去寻找消息对应的selector指向的方法，找到后即运行这个方法。

### 元类(Meta Class)

类对象中的元数据存储的是如何创建一个实例的相关信息，类对象和类方法都应该从哪里创建呢？就是从isa指针指向的结构体创建，类对象的isa指针指向的我们称之为元类（Meta Class），元类中保存了创建类对象以及类方法所需的所有信息。因此整个结构应该如下图所示：

![Meta Class](https://user-gold-cdn.xitu.io/2018/4/1/1628088a3e4f0167?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

通过上图我们可以看出整个体系构成了一个自闭环，`struct objc_object`结构体实例它的isa指针指向类对象，类对象的isa指向了元类，`super_class`指向了父类的类对象，而元类的`super_class`指向了父类的元类，那元类的isa又指向了自己。

元类（Meta Class）是一个类对象的类。所有的类自身也是一个对象，我们可以向这个对象发送消息（即调用方法）。为了调用方法，这个类的isa指针必须指向一个包含类方法的一个`objc_class`结构体。这就引入了Meta Class概念，元类中保存了创建类对象以及类方法需要的所有信息。任何`NSObject`集成体系下的`meta-class`都使用`NSObject`的`meta-class`作为自己的所属类，而基类的`meta-class`的isa指向它自己。

### Method(objc_method)

在`objc/runtime.h`中的定义如下：
``` objc
// 方法
struct objc_method {
    SEL _Nonnull method_name                                 OBJC2_UNAVAILABLE;   // 方法名
    char * _Nullable method_types                            OBJC2_UNAVAILABLE;   // 方法类型
    IMP _Nonnull method_imp                                  OBJC2_UNAVAILABLE;   // 方法实现
}         
```
`Method`和我们平时理解的函数是一致的，就是表示能够独立完成一个功能的一段代码，比如：
``` objc
- (void)logName
{
    NSLog(@"name");
}
```
上面这段代码就是一个函数。

在`objc_method`的结构体中，看到了`SEL`和`IMP`，说明`SEL`和`IMP`其实都是`Method`的属性。

### SEL(objc_selector)

在`objc/objc.h`中的定义为：
``` objc
/// An opaque type that represents a method selector.
typedef struct objc_selector *SEL;
```

`objc_msgSend`函数第二个参数类型为`SEL`，它是`selector`在`Objective-C`中的表示类型。`selector`是方法选择器，可以理解为区分方法的`ID`，而这个`ID`的数据结构是`SEL`：
``` objc
@property SEL selector;
```
可以看到`selector`是`SEL`的一个实例。

其实`selector`就是映射到方法的C字符串，你可以用`Objective-C`编译器命令`@selector()`或则Runtime系统的`sel_registerName`函数来获得一个`SEL`类型的方法选择器。

`selector`既然是一个string，我觉得应该是类似于`className+MethodName`的组合，命名规则有两条：
* 同一个类，selector不能重复
* 不同的类，selector可以重复

所以在Objective-C中如下的代码会报错：
``` objc
- (void)caculate(NSInteger)num;
- (void)caculate(CGFloat)num;
```
只能通过方法名来进行区别：
``` objc
- (void)caculateWithInt(NSInteger)num;
- (void)caculateWithFloat(CGFloat)num;
```

### IMP

在`objc/objc.h`中IMP的定义如下：
``` objc
/// A pointer to the function of a method implementation. 
#if !OBJC_OLD_DISPATCH_PROTOTYPES
typedef void (*IMP)(void /* id, SEL, ... */ ); 
#else
typedef id _Nullable (*IMP)(id _Nonnull, SEL _Nonnull, ...); 
#endif
```
就是指向最终实现程序函数的内存地址的指针。

在`iOS`的`Runtime`中，`Method`通过`SEL`和`IMP`两个属性，实现了快速方法的查询以及实现，相对提高了性能又保持了灵活性。

### 类缓存(objc_cache)

当Objective-C运行时通过跟踪它的isa指针检查对象时，它可以找到一个实现多个方法的对象。然而你只调用其中的以一小部分，并且每次检查时，搜索所有选择器的分派表没有意义。所以实现一个缓存，每当你搜索一个类分派表，并找到相应的选择器，它把它放入缓存。所以当`objc_msgSend`查找一个类的选择器，它首先搜索缓存。

为了加速消息分发，系统会对方法和对应的地址进行缓存，就放在上面所述的`objc_cache`，所以在实际运行中，大部分常用的方法都会被缓存起来，`Runtime`系统实际上非常快，接近于直接执行内存地址程序的速度。

### Category(objc_category)

在`obj/runtime.h`中`objc_category`的定义如下：
``` objc
struct objc_category {
    char * _Nonnull category_name                            OBJC2_UNAVAILABLE;   // 分类名
    char * _Nonnull class_name                               OBJC2_UNAVAILABLE;   // 分类所属的类名
    struct objc_method_list * _Nullable instance_methods     OBJC2_UNAVAILABLE;   // 实例方法列表
    struct objc_method_list * _Nullable class_methods        OBJC2_UNAVAILABLE;   // 类方法列表
    struct objc_protocol_list * _Nullable protocols          OBJC2_UNAVAILABLE;   // 分类所现实的协议列表
}     
```
从上面的`objc_category`的结构体可以看出，分类中可以添加实例方法、类方法，甚至可以实现协议，不能添加实例变量和属性。

## Runtime消息转发

上面Runtime消息传递中已经介绍了一次发送消息会在相关的类对象中搜索方法列表，如果找不到则会沿着继承树向上一直搜索直到继承树根部（通常为NSObject），如果还是找不到并且消息转发都失败了就会执行`doesNotRecognizeSelector:`方法报`unrecognized selector`错。

因此对于对象尝试调用未实现的方法会报错，遇到这种情况会不会有什么“补救措施”，当然有，这就需要了解消息的转发机制。

当没有找到实现方法时，会调用一下函数：
* 动态方法解析
  ``` objc
  +(BOOL)resolveInstanceMethod:(SEL)sel
  +(BOOL)resolveClassMethod:(SEL)sel
  ```
* 备用接受者
  ``` objc
  -(id)forwardingTargetForSelector:(SEL)aSelector
  ```
* 完整地消息转发
  ``` objc
  -(NSMethodSignature*)methodSignatureForSelector:(SEL)aSelector
  -(void)forwardInvocation:(NSInvocation *)anInvocation
  ```

首先来看一张别人总结的一张图：

![Runtime转发流程简图](https://user-gold-cdn.xitu.io/2018/4/1/1628088a3e48a485?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 动态解析方法

首先会调用动态方法的解析方法，我们可以尝试在`+(BOOL)resolveInstanceMethod:(SEL)selector`（针对实例方法）和`+(BOOL)resolveClassMethod:(SEL)sel`（针对类方法）中添加实现方法。

实现一个动态方法解析的例子如下：

``` objc
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    //执行eat函数
    [self performSelector:@selector(eat:)];
}

+ (BOOL)resolveInstanceMethod:(SEL)sel {
    if (sel == @selector(eat:)) {//如果是执行eat函数，就动态解析，指定新的IMP
        class_addMethod([self class], sel, (IMP)eatMethod, "v@:");
        return YES;
    }
    return [super resolveInstanceMethod:sel];
}

void eatMethod(id obj, SEL _cmd) {
    NSLog(@"Person eat");//新的eat函数
}
```
> 2018-08-08 15:54:30.652862+0800 Runtime[32473:3482683] Person eat

从上面的例子可以看到虽然没有实现`eat:`这个函数，但是通过`class_addMethod`动态添加`eatMethod`函数，并执行`eatMethod`这个函数的`IMP`。

如果`+ (BOOL)resolveInstanceMethod:(SEL)sel`或`+(BOOL)resolveClassMethod:(SEL)sel`方法没有处理`eat:`方法，运行时就会移到下一步：`- (id)forwardingTargetForSelector:(SEL)aSelector`。

### 备用接受者

如果目标对象实现了`- (id)forwardingTargetForSelector:(SEL)aSelector`，那么运行时就会调用这个方法，把这个消息转发给其他对象。


``` objc
#import "ViewController.h"
#import "objc/runtime.h"

@interface Person: NSObject

@end

@implementation Person
- (void)eat {
    NSLog(@"forwardingTargetForSelector Person eat");
}
@end

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    //执行eat函数
    [self performSelector:@selector(eat)];
}

+ (BOOL)resolveInstanceMethod:(SEL)sel {
    return NO; // 这里不管返回是YES还是NO都会进入forwardingTargetForSelector
}

- (id)forwardingTargetForSelector:(SEL)aSelector {
    if (aSelector == @selector(eat)) {
        return [Person new];
    }
    return [super forwardingTargetForSelector:aSelector];
}

void eatMethod(id obj, SEL _cmd) {
    NSLog(@"resolveInstanceMethod Person eat");//新的eat函数
}

@end
```

打印结果：
> 2018-08-08 16:14:54.714890+0800 Runtime[35945:3529505] forwardingTargetForSelector Person eat

从上面的例子我们可以看到通过`forwardingTargetForSelector`把当前`ViewController`的方法传给了`Person`去执行了。

### 完整消息转发

如果上面两部步都无法处理未知消息，那么唯一能做的就是启用完整消息转发机制了。首先它会发送`- (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector`消息获得函数的参数和返回值类型。如果`- (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector`返回`nil`，`Runtime`则会发`-doesNotRecognizeSelector:`消息，程序也会挂掉。如果返回的了一个函数签名，`Runtime`就会创建一个`NSInvocation`对象并发送`- (void)forwardInvocation:(NSInvocation *)anInvocation`消息给目标对象。

实现的例子如下：
``` objc
#import "ViewController.h"
#import "objc/runtime.h"

@interface Person: NSObject

@end

@implementation Person
- (void)eat {
    NSLog(@"完整消息转发 Person eat");
}
@end

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    //执行eat函数
    [self performSelector:@selector(eat)];
}

+ (BOOL)resolveInstanceMethod:(SEL)sel {
    return NO; // 这里不管返回是YES还是NO都会进入forwardingTargetForSelector
}

- (id)forwardingTargetForSelector:(SEL)aSelector {
    return nil;
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector {
    if ([NSStringFromSelector(aSelector) isEqualToString:@"eat"]) {
        return [NSMethodSignature signatureWithObjCTypes:"v@:"];
    }
    return [super methodSignatureForSelector:aSelector];
}

- (void)forwardInvocation:(NSInvocation *)anInvocation {
    SEL sel = anInvocation.selector;
    Person *p = [Person new];
    if ([p respondsToSelector:sel]) {
        [anInvocation invokeWithTarget:p];
    } else {
        [self doesNotRecognizeSelector:sel];
    }
}

void eatMethod(id obj, SEL _cmd) {
    NSLog(@"resolveInstanceMethod Person eat");//新的eat函数
}

@end
```

打印结果：
> 2018-08-08 16:38:29.076233+0800 Runtime[39848:3579675] 完整消息转发 Person eat

从打印结果来看，我们实现了完整的消息转发。通过签名，`Runtime`生成了一个对象`(NSInvocation *)anInvocation`发送给`forwardInvocation`方法，我们在`forwardInvocation`方法中让`Person`对象去执行`eat`函数。

> 关于签名参数`v@:`的解释，在苹果官方文档[Type Encoding](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtTypeEncodings.html#//apple_ref/doc/uid/TP40008048-CH100-SW1)中有详细的解释。