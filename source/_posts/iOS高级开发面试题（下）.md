---
title: iOS高级开发面试题（下）
date: 2017-08-06 13:27:26
tags:
  - iOS
categories: 知识汇总
abbrlink: 5f644c17f993a457
---

## objc使用什么机制管理对象内存？
1. MRC(manual retain-release)手动内存管理。
2. ARC(automatic reference counting)自动引用计数。
3. Garbage collection（垃圾回收机制）但是iOS不支持垃圾回收。
ARC作为LLVM3.0编译器的一项特性，在iOS5.0（Xcode4）版本后推出的自动内存管理，节约时间，减少代码量，降低出错率。开发者不需要手动写入retain、release、autorelease三个关键字。

ARC通过retainCount的机制来决定对象是否需要释放，每次runloop的时候，都会检查对象的retainCount，如果retainCount为0，说明该对象没有地方需要继续使用了，可以释放掉了。
<!-- more -->

## 苹果为什么要废弃dispatch_get_current_queue？

`dispatch_get_current_queue`容易造成死锁。

说到被废弃的`dispatch_get_current_queue`不得不提一个概念：可重入。若一个程序或子程序可以“安全的被并行执行”，则称其为可重入的。

若一个函数是可重入的，则该函数：
1. 不能含有静态（全局）非常量数据。
2. 不能返回静态（全局）非常量数据的地址。
3. 只能处理由调用者提供的数据。
4. 不能依赖于单实例模式资源的锁。
5. 不能调用不可重入的函数

有时候，我们希望知道当前执行的`queue`是谁，比如UI操作需要放在`mian queue`中执行。如果可以知道当前工作的`queue`是谁，就可以很方便的指定一段代码再特定的`queue`中执行。`dispatch_get_current_queue`正好能帮上忙。于是乎，在指定queue中做一些操作，就可以非常清晰的实现：
``` objc

void func(dispatch_queue_t queue, dispatch_block_t block)
{
    if (dispatch_get_current_queue() == queue) {
        block();
    } else {
        dispatch_sync(queue, block);
    }
}
```
然后潜意识里觉得这个函数是可重入的。但当`target queue`恰好是`current queue`时，同步阻塞会导致死锁。
``` objc

- (void)deadLockFunc
{
    dispatch_queue_t queueA = dispatch_queue_create("com.yiyaaixuexi.queueA", NULL);
    dispatch_queue_t queueB = dispatch_queue_create("com.yiyaaixuexi.queueB", NULL);
    dispatch_sync(queueA, ^{
        dispatch_sync(queueB, ^{
            dispatch_block_t block = ^{
                //do something
            };
            func(queueA, block);
        });
    });
}
```
问题出在GCD队列本身是不可重入的，串行队列的层级关系，是出现问题的根本原因。为防止类似的误用，苹果在iOS6废弃了`dispatch_get_current_queue()`方法，强大的`dispatch_get_current_queue()`也只能当做一个调试工具了。

那么应该如何保证GCD方法可重入呢？
* `dispatch_queue_set_specific`标记队列
* 递归锁

以下是上面两种方法的代码片段。

**dispatch_queue_set_specific**
``` objc
    dispatch_queue_t queueA = dispatch_queue_create("com.yiyaaixuexi.queueA", NULL);
    dispatch_queue_t queueB = dispatch_queue_create("com.yiyaaixuexi.queueB", NULL);
    dispatch_set_target_queue(queueB, queueA);
   
    static int specificKey;
    CFStringRef specificValue = CFSTR("queueA");
    dispatch_queue_set_specific(queueA,
                                &specificKey,
                                (void*)specificValue,
                                (dispatch_function_t)CFRelease);
   
    dispatch_sync(queueB, ^{
        dispatch_block_t block = ^{
                //do something
        };
        CFStringRef retrievedValue = dispatch_get_specific(&specificKey);
        if (retrievedValue) {
            block();
        } else {
            dispatch_sync(queueA, block);
        }
    });
```
**递归锁**
``` objc
void dispatch_reentrant(void (^block)())
{
    static NSRecursiveLock *lock = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        lock = [[NSRecursiveLock alloc]init];
    });
    [lock lock];
    block();
    [lock unlock];
}
 
    dispatch_queue_t queueA = dispatch_queue_create("com.yiyaaixuexi.queueA", NULL);
    dispatch_block_t block = ^{
         //do something
    };
    dispatch_sync(queueA, ^{
        dispatch_reentrant(block);
    });
```

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

但如果使用了一些参数中可能含有ivar的系统API，如GCD、NSNotificationCenter就要小心一点，比如GCD内部如果引用了self，而且GCD的其他参数是ivar，则要考虑到循环引用。

## 若一个类有实例变量NSString *_foo，调用setValue:forKey:时，可以以foo还是_foo作为key？
都可以。

## KVC和KVO的keyPath一定是属性么？
KVC支持实例变量，KVO只能手动支持手动设置实例变量的KVO实现监听。
## KVC的keyPath中的集合运算符如何使用？
1. 必须用在集合对象上或普通对象的集合上
2. 简单集合运算符有@avg,@count,@max,@min,@sum
3. 格式@"@sum.age"或 @"集合属性

### 如何手动触发一个value的KVO
所谓的“手动触发”是区别于“自动触发”：
自动触发是类似这种场景：在注册KVO之前设置一个初始值，注册之后，设置一个不一样的值，就可以触发了。
想知道如何手动触发，必须知道自动触发KVO的原理：

键值观察通知依赖于NSObject的两个方法：`willChangeValueForKey:`和`didChangevlueForKey:`。在一个观察属性发生改变之前，`willChangeValueForKey:`一定会被调用，这就会记录旧的值。而当改变发生后，`observeValueForKey:ofObject:change:context:`会被调用，继而`didChangeValueForKey:`也会被调用。如果可以手动实现这些调用，就可以实现“手动触发”了。

那么“手动触发”的使用场景是什么？一般我们只在希望能控制“回调的调用时机”时才会这么做。

具体做法如下：
如果这个`value`是表示时间的`self.now`，那么代码如下：最后两行代码缺一不可。
``` objc
// @property (nonatomic, strong) NSDate *now;
- (void)viewDidLoad {
   [super viewDidLoad];
   _now = [NSDate date];
   [self addObserver:self forKeyPath:@"now" options:NSKeyValueObservingOptionNew context:nil];
   NSLog(@"1");
   [self willChangeValueForKey:@"now"]; // “手动触发self.now的KVO”，必写。
   NSLog(@"2");
   [self didChangeValueForKey:@"now"]; // “手动触发self.now的KVO”，必写。
   NSLog(@"4");
}
```
但是平时我们一般不会这么干，我们都是等系统去“自动触发”。“自动触发”的实现原理：
> 如何调用`setNow:`时，系统还会以某种方式在中间插入`wilChangeValueForKey:`、`didChangeValueForKey:`和`observeValueForKeyPath:ofObject:change:context:`的调用。

大家可能以为是因为`setNow:`是合成方法，有时候我们也能看到有人这么写代码：
``` objc
- (void)setNow:(NSDate *)aDate {
   [self willChangeValueForKey:@"now"]; // 没有必要
   _now = aDate;
   [self didChangeValueForKey:@"now"];// 没有必要
}
```
这完全没有必要，不要做么做，这样的话，KVO代码会被调用两次。KVO在调用存取方法之前总是调用`willChangeValueForKey:`，之后总是调用`didChangeValueForkey:`。怎么做到的呢？答案是通过isa混写(isa-swizzling)。

## 如何关闭默认的KVO的默认实现，并进入自定义的KVO实现？
### KVO实现机制
KVO的实现也依赖于Objective-C强大的Runtime。Apple的文档有简单提到过KVO的实现：
> Automatic key-value observing is implemented using a technique called isa-swizzling... When an observer is registered for an attribute of an object the isa pointer of the observed object is modified, pointing to an intermediate class rather than at the true class ...
从Apple官方文档我们可以看到：被观察者对象的`isa`指针会指向一个中间类，而不是原来真正的类。看来，Apple并不希望过多暴露KVO的实现细节。不过，要是你用Runtime提供的方法深入挖掘，所有被掩盖的细节都会原形毕露。

简单概述下KVO的实现：
当你观察一个对象时，一个新的类会会被动态创建。这个类继承自该对象的原本的类，并重写了被观察属性的`setter`方法。自然，重写的`setter`方法会负责在调用原`setter`方法之前和之后，通知所有观察者对象值的改变。最后把这个对象的`isa`指针（`isa`指针告诉Runtime系统这个对象的类是什么）指向这个新创建的子类，对象就神奇的变成了新创建的子类的实例。

### KVO缺陷
KVO和很强大，知道它内部实现，或许能够帮助我们更好地使用它，或在它出错时更方便调试。但官方实现的KVO提供的API实在不怎么样。比如，你只能通过重写`observeValueForKeyPath:ofObject:change:context:`方法来获得通知。想要提供自定义的`selector`，不行，想要传一个`block`，门都没有。而且你还要处理父类的情况-父类同样监听同一个对象的不同属性。但有时候，你不知道父类是不是对这个消息有兴趣。虽然`context`这个参数就是干这个的，也可以解决这个问题-在`observeValueForKeyPath:ofObject:change:context:`传进去一个父类不知道的`context`。但总觉得框在这个API的设计下，代码写得很别扭。至少，也应该支持`block`吧。

有不少人觉得官方KVO不好使，所以在实际开发中KVO使用的情景并不多，更多时候还是用Delegate或NotificationCenter。

### 自己实现KVO
首先创建NSObject的Category，并在头文件中添加两个API：
``` objc
typedef void(^PGObservingBlock)(id observedObject, NSString *observedKey, id oldValue, id newValue);
@interface NSObject (KVO)
- (void)PG_addObserver:(NSObject *)observer
                forKey:(NSString *)key
             withBlock:(PGObservingBlock)block;
- (void)PG_removeObserver:(NSObject *)observer forKey:(NSString *)key;
@end
```
接下来，实现`PG_addObserver:forKey:withBlock:`方法。逻辑并不复杂：
1. 检查对象的类有没有相应的`setter`方法。如果没有抛出异常；
2. 检查对象`isa`指向的类是不是一个KVO类。如果不是，新建一个集成原来类的子类，并把`isa`指向这个新建的子类；
3. 检查对象的KVO类重写过没有这个`setter`方法。如果没有，添加重写的setter方法；
4. 添加观察者；

``` objc
- (void)PG_addObserver:(NSObject *)observer
                forKey:(NSString *)key
             withBlock:(PGObservingBlock)block
{
    // Step 1: Throw exception if its class or superclasses doesn't implement the setter
    SEL setterSelector = NSSelectorFromString(setterForGetter(key));
    Method setterMethod = class_getInstanceMethod([self class], setterSelector);
    if (!setterMethod) {
        // throw invalid argument exception
    }

    Class clazz = object_getClass(self);
    NSString *clazzName = NSStringFromClass(clazz);

    // Step 2: Make KVO class if this is first time adding observer and 
    //          its class is not an KVO class yet
    if (![clazzName hasPrefix:kPGKVOClassPrefix]) {
        clazz = [self makeKvoClassWithOriginalClassName:clazzName];
        object_setClass(self, clazz);
    }

    // Step 3: Add our kvo setter method if its class (not superclasses) 
    //          hasn't implemented the setter
    if (![self hasSelector:setterSelector]) {
        const char *types = method_getTypeEncoding(setterMethod);
        class_addMethod(clazz, setterSelector, (IMP)kvo_setter, types);
    }

    // Step 4: Add this observation info to saved observation objects
    PGObservationInfo *info = [[PGObservationInfo alloc] initWithObserver:observer Key:key block:block];
    NSMutableArray *observers = objc_getAssociatedObject(self, (__bridge const void *)(kPGKVOAssociatedObservers));
    if (!observers) {
        observers = [NSMutableArray array];
        objc_setAssociatedObject(self, (__bridge const void *)(kPGKVOAssociatedObservers), observers, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    [observers addObject:info];
}
```
再来一步步细看。

第一步里，先通过`setterForGetter()`方法获得相应的`setter`的名字（SEL）。也就是把key的首字母大写，然后前面加上`set`后面加上`:`，这样`key`就变成了`setKey:`。然后再用`class_getInstanceMethod`去获得`setKey:`的实现（Method）。如果没有，自然要抛出异常。

第二步，我们先看类名有没有我们定义的前缀。如果没有，我们就去创建新的子类，并通过`object_setClass()`修改`isa`指针。动态创建新的类需要用`objc/runtime.h`中定义的`objc_allocateClassPair()`函数。传一个父类，类名，然后额外的空间（通常为0），它返回给你一个类。然后就给这个类添加方法，也可以添加变量。这里，只重写了`class`方法。哈哈，根Apple一样，这时候我们也企图隐藏这个子类的存在。最后`objc_registerClassPair()`告诉Runtime这个类的存在。
``` objc
- (Class)makeKvoClassWithOriginalClassName:(NSString *)originalClazzName
{
    NSString *kvoClazzName = [kPGKVOClassPrefix stringByAppendingString:originalClazzName];
    Class clazz = NSClassFromString(kvoClazzName);

    if (clazz) {
        return clazz;
    }

    // class doesn't exist yet, make it
    Class originalClazz = object_getClass(self);
    Class kvoClazz = objc_allocateClassPair(originalClazz, kvoClazzName.UTF8String, 0);

    // grab class method's signature so we can borrow it
    Method clazzMethod = class_getInstanceMethod(originalClazz, @selector(class));
    const char *types = method_getTypeEncoding(clazzMethod);
    class_addMethod(kvoClazz, @selector(class), (IMP)kvo_class, types);

    objc_registerClassPair(kvoClazz);

    return kvoClazz;
}
```

第三步，重写setter方法。新的setter在调用原setter方法后，通知每个观察者（调用之前传入的block）:
``` objc
static void kvo_setter(id self, SEL _cmd, id newValue)  
{
    NSString *setterName = NSStringFromSelector(_cmd);
    NSString *getterName = getterForSetter(setterName);

    if (!getterName) {
        // throw invalid argument exception
    }

    id oldValue = [self valueForKey:getterName];

    struct objc_super superclazz = {
        .receiver = self,
        .super_class = class_getSuperclass(object_getClass(self))
    };

    // cast our pointer so the compiler won't complain
    void (*objc_msgSendSuperCasted)(void *, SEL, id) = (void *)objc_msgSendSuper;

    // call super's setter, which is original class's setter method
    objc_msgSendSuperCasted(&superclazz, _cmd, newValue);

    // look up observers and call the blocks
    NSMutableArray *observers = objc_getAssociatedObject(self, (__bridge const void *)(kPGKVOAssociatedObservers));
    for (PGObservationInfo *each in observers) {
        if ([each.key isEqualToString:getterName]) {
            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                each.block(self, getterName, oldValue, newValue);
            });
        }
    }
}
```
最后一步，把这个观察者的相关信息存在`associatedObject`里。观察的相关信息（观察者，被观察的key，和传入的block）封装在`PGObservationInfo`类里。
``` objc
@interface PGObservationInfo : NSObject

@property (nonatomic, weak) NSObject *observer;
@property (nonatomic, copy) NSString *key;
@property (nonatomic, copy) PGObservingBlock block;

@end
```
到此为止，一个基本的KVO就可以work了。

## IB中User Defined Runtime Attributes如何使用？
它能够通过KVC的方式配置一些你在interface builder中不能配置的属性。当你希望在IB中作尽可能多得事情，这个特性能够帮助你编写更加轻量级的viewController。

## BAD_ACCESS在什么情况下出现？
访问了悬垂指针，比如对一个已经释放的对象进行了release、访问已经释放对象的成员变量或则发送消息、死循环等。

## 如何调试BAD_ACCESS错误
1. 重写object的respondsToSelector方法，实现出现EXEC_BAD_ACCESS前访问的最后一个object
2. 通过设置Xcode中的zombie
3. 设置全局断点快速定位问题代码所在行
4. Xcode7已经集成了BAD_ACCESS捕获功能：Address Sanitizer。用法如下：在配置中勾选Enable Address Sinitizer。

## lldb（gdb）常用的调试命令？
* breakpoint 设置断点定位到某一个函数
* n 断点指向下一步
* po 打印对象
更多lldb调试命令可以查看：[The LLDB Debugger](http://lldb.llvm.org/lldb-gdb.html)

## ios里面存数据有哪些方法？
这里的存储就是所谓的持久化，就是讲将数据保存在硬盘，使得在应用程序或机器重启后可以继续访问之前保存的数据。在iOS开发中，有很多数据持久化的方案：
1. plist文件（属性列表）
2. preference（偏好设置）NSUserDefaults
3. NSKeyedArchiver（归档）
4. SQLite 3
5. CoreData

## frame bounds center 的区别
* frame：描述当前视图在其父视图中的位置和大小。
* bounds：描述当前视图在其自身坐标系统中的位置和大小
* center：描述当前视图的中心点在其视图中的位置

## 线程共享进程资源的实例
NSUserDefault

## OC运行时能加实例变量吗?
可以。运行时可以通过Runtime动态添加方法，再次方法里去初始化实例变量。

## 64位下NSNumber的优化
### 64bit-tagged pointer
* 指针地址对其：分配堆中的内存时，采用偶数倍或则以2的指数倍的地址为边界
* iOS中是以16个字节为对其边界的。所以分配的内存地址后面4为永远是0
* 64为理论上可以支持最大的2^64字节内存空间。这么大的地址空间完全是浪费的。64位环境下内存地址前面有很多0
* Tagged Pointer 指针地址对齐和64位超大地址的出现，指针地址仅仅作为内存地址是比较浪费的，可以在指针地址中保存更多的信息。 所以就有了Tagged Pointer概念。

### isa指针的优化
所有的类继承自NSObject，因此每个对象都有一个isa指针指向所属的类。

在32位环境下，对象的引用都保存在外部的表中，对引用计数的增减操作都需要锁定这个表，操作完后，才解锁，这样的效率是很慢的。

在64位环境下，isa也是64-bit的，实际操作部分只用到32位，剩余部分会用到tagged pointer的概念，其中19位将保存对象的引用计数，这样引用计数的操作只需要原子的修改这个指针即可，如果超出19位，才会将引用计数保存到外部表，这种情况是很少的，因此效率会大大提高。

## NSThread NSOperation dispatch 和 gcd的关系
NSThread优点：NSThread比其他两个轻量级，使用简单。
缺点：需要自己管理线程的生命周期、线程同步、加锁、睡眠以及唤醒等。线程同步对数据加锁会有一定的系统开销。

NSOperation：不需要关系线程管理，数据同步的事情，可以把精力放在自己需要执行的操作上，NSOperation是面向对象的，属于OC类。

GCD：Grand Central Dispatch是由苹果开发的一个多核编程的解决方案。是相比NSThread， NSOperation更高效和强大的技术–GCD是基于C的底层API。

GCD主要是建立个个线程时间的依赖关系这类的情况，更高的并发执行能力。

## iOS常用回调方式以及它们之间的区别

delegate回调，kvo回调，NSNotification回调，block回调

## 声明delegate的时候为什么用assign，而不用weak等等

weak比assgin线程更安全。

但在delegate成员变量这个细分领域，我们即可以用weak，又可以用assign。因为在几乎所有场景下，delegate所指向的对象C的生存期都是覆盖了delegate成员变量本身所在的对象D的生存期的，所以，在D的生存期内，C所使用的D的指针都是有效的，所以这个时候使用assign是没有关系的。

## Block的使用

网络响应block回调。对响应数据进行一个包装作为参数调用控制器的函数。

## 二叉树的深度优先遍历和广度优先遍历

## iOS crash后的调试方法？
线上收集，Xcode中下载崩溃日志。接入腾讯的Bugly。

## OC中深拷贝,浅拷贝

对不可变对象，copy则执行浅拷贝，mutablCopy则执行深拷贝。对可变对象，copy和mutableCopy都执行深拷贝，但是copy返回的对象是不可变的。
![](https://upload-images.jianshu.io/upload_images/10601171-d7aa0b24e2fefb9b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/611/format/webp)

## iOS沙盒机制
iOS应用程序只能在为该改程序创建的文件系统中读取文件，不可以去其它地方访问，此区域被成为沙盒，所以所有的非代码文件都要保存在此，例如图像，图标，声音，映像，属性列表，文本文件等。 
1. 每个应用程序都有自己的存储空间 
2. 应用程序不能翻过自己的围墙去访问别的存储空间的内容 
3. 应用程序请求的数据都要通过权限检测，假如不符合条件的话，不会被放行

## 不更新版本的方式添加新特性（热更新）
1. 使用FaceBook的开源框架reactive native，使用js写原生的iOS应用。iOS app可以在运行时从服务器拉取最新的js文件到本地，然后执行，因为js是一门动态的脚本语言，所以可以在运行时直接读取js文件执行，因此能够实现iOS的热更新。
2. 使用lua脚本。lua脚本如同js一样，也能在运行时去读取lua脚本并执行。
3. Xcode6之后，苹果开放了iOS的动态库编译权限。所谓的动态库，其实就是可以在运行时加载。可以利用这个实现iOS的热更新。能够从沙箱里面读取到代码文件，就意味着可以在线更新代码，远程升级
4. JSPatch，热更新，不过被苹果禁止使用了。

## 如果在发送异步请求的情况下，当前的界面删除了，会出现什么后果，如何解决？
遇到这种情况程序会崩溃，因为当前界面释放的同时，在当前界面所定义的对象也会释放，会出现野指针的情况，解决的办法是将异步请求的对象保持到单例中，这样界面释放的同时异步请求的对象还存在。

## 怎么用C++ 实现kvo？
开启一个新线程去轮询监听事件，并传入响应方法，如果事件发生就调用监听响应方法。

## 你会如何储存用户的认证信息？
使用keychain来存储,也就是钥匙串。 使用keychain需要导入Security框架。 

只需要把“KeychainItemWrapper.h”和“KeychainItemWrapper.m”拷贝到我们项目，并导入Security.framework 。KeychainItemWrapper的用法：
``` objc
/** 初始化一个保存用户帐号的KeychainItemWrapper */ 

KeychainItemWrapper *wrapper = [[KeychainItemWrapper alloc] initWithIdentifier:@"Account Number" accessGroup:@"YOUR_APP_ID_HERE.com.yourcompany.AppIdentifier"];

//保存数据 

[wrapper setObject:@"<帐号>" forKey:(id)kSecAttrAccount]; 

[wrapper setObject:@"<帐号密码>" forKey:(id)kSecValueData];

//从keychain里取出帐号密码 

NSString *password = [wrapper objectForKey:(id)kSecValueData];
```

## 堆和栈的区别
栈区(stack)由编译器自动分配释放 ,存放方法(函数)的参数值, 局部变量的值等，栈是向低地址扩展的数据结构，是一块连续的内存的区域。即栈顶的地址和栈的最大容量是系统预先规定好的。 

堆区(heap)一般由程序员分配释放, 若程序员不释放,程序结束时由OS回收，向高地址扩展的数据结构，是不连续的内存区域，从而堆获得的空间比较灵活。 

碎片问题：对于堆来讲，频繁的new/delete势必会造成内存空间的不连续，从而造成大量的碎片，使程序效率降低。对于栈来讲，则不会存在这个问题，因为栈是先进后出的队列，他们是如此的一一对应，以至于永远都不可能有一个内存块从栈中间弹出. 

分配方式：堆都是动态分配的，没有静态分配的堆。栈有2种分配方式：静态分配和动态分配。静态分配是编译器完成的，比如局部变量的分配。动态分配由alloca函数进行分配，但是栈的动态分配和堆是不同的，他的动态分配是由编译器进行释放，无需我们手工实现。 

分配效率：栈是机器系统提供的数据结构，计算机会在底层对栈提供支持：分配专门的寄存器存放栈的地址，压栈出栈都有专门的指令执行，这就决定了栈的效率比较高。堆则是C/C++函数库提供的，它的机制是很复杂的。 

全局区(静态区)(static),全局变量和静态变量的存储是放在一块 的,初始化的全局变量和静态变量在一块区域, 未初始化的全局变量和未初始化的静态变量在相邻的另一块区域。程序结束后有系统释放。 

文字常量区—常量字符串就是放在这里的。程序结束后由系统释放。 

程序代码区—存放函数体的二进制代码


## OC有多继承吗？没有的话用什么代替？
OC中没有多继承，可以用委托代理Protocol来实现。

## SDWebImage原理
从内存中（字典）找图片（当这个图片在本次程序加载过），找到直接使用； 

从沙盒中找，找到直接使用，缓存到内存。 

从网络上获取，使用，缓存到内存，缓存到沙盒。

## 请问push view controller 和 present view controller有什么区别？
要是用push view controller ，首先必须确保根视图是NavigationController，不然是不可以用的。

push与present都可以推出新的界面。 

present与dismiss对应，push和pop对应。 

present只能逐级返回，push所有视图由视图栈控制，可以返回上一级，也可以返回到根vc，其他vc。 

present一般用于不同业务界面的切换，push一般用于同一业务不同界面之间的切换。
