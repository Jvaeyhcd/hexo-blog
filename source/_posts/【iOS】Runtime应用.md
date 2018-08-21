---
title: 【iOS】Runtime应用
date: 2018-08-08 16:47:52
tags:
  - Runtime
author: Jvaeyhcd
categories: iOS学习笔记
---

`Runtime`简直就是做大型架构的利器，它的应用场景非常多，下面就介绍一些常见的应用场景。
* 关联对象（Objective-C Associated Objects）给分类添加属性
* 方法魔法（Method Swizzling）方法添加、替换和KVO实现
* 消息转发（热更新）解决Bug（JSPatch）
* 实现NSCoding的自动归档和自动解档
* 实现字典和模型的自由转换（MJExtension）

## 关联对象（Objective-C Associated Objects）给分类添加属性

通过对`objc_category`的结构体分析后我们知道分类是不能直接自定义属性和变量的，但是可以通过关联对象的方法给分类添加属性。

<!-- more -->

关联对象在`objc/runtime.h`中提供了以下几个接口：
``` objc
/** 
 * Sets an associated value for a given object using a given key and association policy.
 * 
 * @param object The source object for the association.
 * @param key The key for the association.
 * @param value The value to associate with the key key for object. Pass nil to clear an existing association.
 * @param policy The policy for the association. For possible values, see “Associative Object Behaviors.”
 * 
 * @see objc_setAssociatedObject
 * @see objc_removeAssociatedObjects
 */
 // 关联对象
OBJC_EXPORT void
objc_setAssociatedObject(id _Nonnull object, const void * _Nonnull key,
                         id _Nullable value, objc_AssociationPolicy policy)
    OBJC_AVAILABLE(10.6, 3.1, 9.0, 1.0, 2.0);

/** 
 * Returns the value associated with a given object for a given key.
 * 
 * @param object The source object for the association.
 * @param key The key for the association.
 * 
 * @return The value associated with the key \e key for \e object.
 * 
 * @see objc_setAssociatedObject
 */
 // 获取关联的对象
OBJC_EXPORT id _Nullable
objc_getAssociatedObject(id _Nonnull object, const void * _Nonnull key)
    OBJC_AVAILABLE(10.6, 3.1, 9.0, 1.0, 2.0);

/** 
 * Removes all associations for a given object.
 * 
 * @param object An object that maintains associated objects.
 * 
 * @note The main purpose of this function is to make it easy to return an object 
 *  to a "pristine state”. You should not use this function for general removal of
 *  associations from objects, since it also removes associations that other clients
 *  may have added to the object. Typically you should use \c objc_setAssociatedObject 
 *  with a nil value to clear an association.
 * 
 * @see objc_setAssociatedObject
 * @see objc_getAssociatedObject
 */
 // 移除关联的对象
OBJC_EXPORT void
objc_removeAssociatedObjects(id _Nonnull object)
    OBJC_AVAILABLE(10.6, 3.1, 9.0, 1.0, 2.0);
```

参数解释：
* id object：被关联的对象
* const void *key：被关联的key，要求唯一
* id value：关联的对象
* objc_AssociationPolicy policy：内存管理的策略

内存管理策略的定义有：

``` objc
/**
 * Policies related to associative references.
 * These are options to objc_setAssociatedObject()
 */
typedef OBJC_ENUM(uintptr_t, objc_AssociationPolicy) {
    OBJC_ASSOCIATION_ASSIGN = 0,           /**< Specifies a weak reference to the associated object. */
    OBJC_ASSOCIATION_RETAIN_NONATOMIC = 1, /**< Specifies a strong reference to the associated object. 
                                            *   The association is not made atomically. */
    OBJC_ASSOCIATION_COPY_NONATOMIC = 3,   /**< Specifies that the associated object is copied. 
                                            *   The association is not made atomically. */
    OBJC_ASSOCIATION_RETAIN = 01401,       /**< Specifies a strong reference to the associated object.
                                            *   The association is made atomically. */
    OBJC_ASSOCIATION_COPY = 01403          /**< Specifies that the associated object is copied.
                                            *   The association is made atomically. */
};
```

下面实例实现了给`UIView`的`Category`添加自定义属性`defaultColor`。
``` objc
#import <UIKit/UIKit.h>
#import "objc/runtime.h"

@interface UIView (DefaultColor)
@property (nonatomic, strong) UIColor *defaultColor;
@end

@implementation UIView (DefaultColor)
@dynamic defaultColor;

static char kDefaultColor;

- (void)setDefaultColor:(UIColor *)defaultColor {
    objc_setAssociatedObject(self, &kDefaultColor, defaultColor, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (UIColor *)defaultColor {
    return objc_getAssociatedObject(self, &kDefaultColor);
}
@end

@interface ViewController : UIViewController

@end

@implementation ViewController
- (void)viewDidLoad {
    [super viewDidLoad];
    UIView *view = [UIView new];
    view.defaultColor = [UIColor blueColor];
    
    NSLog(@"%@", view.defaultColor);
}
@end
```
打印结果：
> 2018-08-08 22:21:41.683715+0800 Runtime[59801:3820981] UIExtendedSRGBColorSpace 0 0 1 1

从打印结果来看，我们成功在分类上添加了一个属性，实现了他的`getter`和`setter`方法。通过关联对象实现属性的内存管理也是有`ARC`管理的，所以我们只需要给定适当的内存策略就行了，不需要操心对象的释放。

内存策略对应的属性修饰符对比如下表：
<table><tr><td>内存策略</td><td>属性修饰</td><td>描述</td></tr><tr><td>OBJC_ASSOCIATION_ASSIGN</td><td>@property (assign) 或 @property (unsafe_unretained)</td><td>指定一个关联对象的弱引用</td></tr><tr><td>OBJC_ASSOCIATION_RETAIN<br/>_NONATOMIC</td><td>@property (nonatomic, strong)</td><td>@property (nonatomic, strong)	指定一个关联对象的强引用，不能被原子化使用</td></tr><tr><td>OBJC_ASSOCIATION_COPY<br/>_NONATOMIC</td><td>@property (nonatomic, copy)</td><td>指定一个关联对象的copy引用，不能被原子化使用</td></tr><tr><td>OBJC_ASSOCIATION_RETAIN</td><td>@property (atomic, strong)</td><td>指定一个关联对象的强引用，能被原子化使用</td></tr><tr><td>OBJC_ASSOCIATION_COPY</td><td>@property (atomic, copy)</td><td>指定一个关联对象的copy引用，能被原子化使用</td></tr></table>

## 方法魔法（Method Swizzling）方法添加、替换和KVO实现

### 方法添加

在[Rutime详解]()中介绍消息转发的时候，动态方法的添加就已经提到了。

``` objc
/** 
 * Adds a new method to a class with a given name and implementation.
 * 
 * @param cls The class to which to add a method.
 * @param name A selector that specifies the name of the method being added.
 * @param imp A function which is the implementation of the new method. The function must take at least two arguments—self and _cmd.
 * @param types An array of characters that describe the types of the arguments to the method. 
 * 
 * @return YES if the method was added successfully, otherwise NO 
 *  (for example, the class already contains a method implementation with that name).
 *
 * @note class_addMethod will add an override of a superclass's implementation, 
 *  but will not replace an existing implementation in this class. 
 *  To change an existing implementation, use method_setImplementation.
 */
OBJC_EXPORT BOOL
class_addMethod(Class _Nullable cls, SEL _Nonnull name, IMP _Nonnull imp, 
                const char * _Nullable types) 
    OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0, 2.0);
```
* cls：被添加方法的类
* name：添加的方法名称的SEL
* imp：方法的实现。改函数至少要有两个参数，`self`和`_cmd`
* types：类型编码

### 方法替换

下面实现了一个替换`UIViewController`的`viewDidLoad`方法的例子：
``` objc
@implementation ViewController

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = [self class];
        SEL originalSelector = @selector(viewDidLoad);
        SEL swizzledSelector = @selector(swizzledViewDidLoad);
        
        Method originalMethod = class_getInstanceMethod(self, originalSelector);
        Method swizzledMethod = class_getInstanceMethod(self, swizzledSelector);
        
        BOOL didAddMethod = class_addMethod(class, originalSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
        if (didAddMethod) {
            class_replaceMethod(class, swizzledMethod, method_getImplementation(originalMethod), method_getTypeEncoding(originalSelector));
        } else {
            method_exchangeImplementations(originalMethod, swizzledMethod);
        }
    });
}

- (void)swizzledViewDidLoad {
    NSLog(@"替换的方法");
    
    [self swizzledViewDidLoad];
}

- (void)viewDidLoad {
    NSLog(@"自带的方法");
    
    [super viewDidLoad];
}
...
@end
```

打印结果：
> 2018-08-08 23:30:51.912380+0800 Runtime[70331:3958814] 替换的方法
> 2018-08-08 23:30:51.913268+0800 Runtime[70331:3958814] 自带的方法

`method swizzling`在`+load`中完成，在`Objective-C`的运行时中，每个类有两个方法会自动调用。`+ (void)load`是在一个类被初始装载时调用的，`+ (void)initialize`是在应用第一次调用该类方法或实例方法前调用的。两个方法都是可选的，并且在方法被实现的情况下才会调用。

`swizzling`只能在`dispatch_once`中完成，由于`swizzling`改变了全局的状态，所以我们需要确保每个预防措施在运行时都是可用的。原子操作就是这样用于确保代码只执行一次的预防措施，就算是在不同的线程中也能确保代码只执行一次。`gcd`的`dispatch_once`满足了所需要的需求。

### KVO实现

> KVO全称是key-value observing，翻译成中文就是键值观察。提供了一种当对象属性被修改的时候能通知当前对象的一种机制。在MVC设计架构下的项目，KVO机制很适合做Model与Controller之间的通讯。

KVO的实现依赖于Objective-C强大的Runtime，Apple使用isa混写（isa-swizzling）来实现KVO。当观察对象A时，KVO机制动态创建一个新的名为`NSKVONotifying_A`的新类，该类继承自对象A的本类，且KVO为`NSKVONotifying_A`类重写观察属性的`setter`方法，`setter`方法会负责在调用原`setter`之前和之后，通知所观察对象属性值的更改情况。

* NSKVONotifying_A类剖析

从应用层面看，完全没有意识到新的类的产生，这是系统“隐瞒”了对KVO底层的实现过程，让我们误以为还是原来的类。但是此时我们如果新建一个名为`NSKVONotifying_A`的类，就会发现系统运行到注册KVO那段代码的时候程序就奔溃了，因为在注册监听的时候动态创建了名为`NSKVONotifying_A`的中间类，并指向这个中间类。

* 子类setter方法剖析

KVO的键值观察依赖`NSObject`的两个方法：`willChangeValueForKey:`和`didChangeValueForKey:`，在存取的前后分别调用这2个方法。在被观察属性发生改变之前，`willChangeValueForKey:`被调用，通知系统该`keyPath`属性值即将变更；当被观察属性发生改变之后，`didChangeValueForKey:`被调用，通知系统该`keyPath`属性值已经变更；之后`observeValueForKey:ofObject:change:context: `也会被调用。且重写观察属性的 `setter` 方法这种继承方式的注入是在运行时而不是编译时实现的。

KVO子类setter方法的重写调用存取方法的工作原理在代码中相当于：
``` objc
-(void)setName:(NSString *)newName{ 
    [self willChangeValueForKey:@"name"];    //KVO 在调用存取方法之前总调用 
    [super setValue:newName forKey:@"name"]; //调用父类的存取方法 
    [self didChangeValueForKey:@"name"];     //KVO 在调用存取方法之后总调用
}
```

## 消息转发（热更新）解决Bug（JSPatch）

> [JSPatch](https://github.com/bang590/JSPatch/wiki/JSPatch-%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86%E8%AF%A6%E8%A7%A3) 是一个 iOS 动态更新框架，只需在项目中引入极小的引擎，就可以使用 JavaScript 调用任何 Objective-C 原生接口，获得脚本语言的优势：为项目动态添加模块，或替换项目原生代码动态修复 bug。

关于消息转发，我们知道分为三级，我们可以在每级实现替换功能，实现消息转发，从而不造成崩溃。JSPatch不仅能够实现消息转发，还可以实现方法的添加、替换等一系列功能。

## 实现NSCoding的自动归档和自动解档

原理描述：用`Runtime`提供的函数遍历`Model`自身所有属性，并对属性进行`encode`和`decode`操作。核心方法是在`Model`基类中重写方法：

``` objc
- (instancetype)initWithCoder:(NSCoder *)coder
{
    self = [super initWithCoder:coder];
    if (self) {
        unsigned int outCount;
        Ivar * ivars = class_copyIvarList([self class], &outCount);
        for (int i = 0; i < outCount; i ++) {
            Ivar ivar = ivars[i];
            NSString * key = [NSString stringWithUTF8String:ivar_getName(ivar)];
            [self setValue:[coder decodeObjectForKey:key] forKey:key];
        }
    }
    return self;
}

- (void)encodeWithCoder:(NSCoder *)coder
{
    [super encodeWithCoder:coder];
    unsigned int outCount;
    Ivar * ivars = class_copyIvarList([self class], &outCount);
    for (int i = 0; i < outCount; i ++) {
        Ivar ivar = ivars[i];
        NSString * key = [NSString stringWithUTF8String:ivar_getName(ivar)];
        [coder encodeObject:[self valueForKey:key] forKey:key];
    }
}
```

## 实现字典和模型的自由转换（MJExtension）
原理描述：用Runtime提供的函数遍历Model自身所有属性，如果属性在JSON中有对应的值，则将其赋值。核心方法在NSObject的分类中添加方法：
``` objc
- (instancetype)initWithDict:(NSDictionary *)dict {

    if (self = [self init]) {
        //(1)获取类的属性及属性对应的类型
        NSMutableArray * keys = [NSMutableArray array];
        NSMutableArray * attributes = [NSMutableArray array];
        /*
         * 例子
         * name = value3 attribute = T@"NSString",C,N,V_value3
         * name = value4 attribute = T^i,N,V_value4
         */
        unsigned int outCount;
        objc_property_t * properties = class_copyPropertyList([self class], &outCount);
        for (int i = 0; i < outCount; i ++) {
            objc_property_t property = properties[i];
            //通过property_getName函数获得属性的名字
            NSString * propertyName = [NSString stringWithCString:property_getName(property) encoding:NSUTF8StringEncoding];
            [keys addObject:propertyName];
            //通过property_getAttributes函数可以获得属性的名字和@encode编码
            NSString * propertyAttribute = [NSString stringWithCString:property_getAttributes(property) encoding:NSUTF8StringEncoding];
            [attributes addObject:propertyAttribute];
        }
        //立即释放properties指向的内存
        free(properties);

        //(2)根据类型给属性赋值
        for (NSString * key in keys) {
            if ([dict valueForKey:key] == nil) continue;
            [self setValue:[dict valueForKey:key] forKey:key];
        }
    }
    return self;
}
```