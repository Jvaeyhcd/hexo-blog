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