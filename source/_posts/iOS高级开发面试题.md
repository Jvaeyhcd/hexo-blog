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

## 线程与进程的区别和联系？
简单概括下线程与进程之间的区别和联系：
* 一个程序至少要有一个进程，一个进程至少要有一个线程。
* 进程是资源分配的最小独立单元，进程是具有一定独立功能的程序关于某个数据集合上的一次运行活动，进程是系统进行资源分配和调度的一个独立单位。
* 线程是进程的一个分支，是进程的实体，是CPU调度和分配的基本单元，它是比进程更小的能独立运行的基本单位，线程自己基本不拥有系统资源，只拥有一点在运行中必不可少的资源（计数器、栈、寄存器），但是它可以与同属一个进程的其他线程共享线程所拥有的全部资源。
* 线程和进程的主要区别在于他们是不同的操作系统资源的管理方式。进程有独立的地址空间，一个进程崩溃以后，在保护模式下不会对其他进程造成影响，而线程只是一个进程中的不同执行路径。线程有自己的堆栈和局部变量，但线程之间没有单独的地址空间，一个线程死掉以后就等于整个进程死掉，所以多进程的程序比多线线程的程序要健壮，但在进程切换时，耗费资源较大，效率要差些。
* 但对于一些要求同时进行并且又要共享某些变量的并发操作，只能用线程，不能用进程。

## assign、retain、copy、weak、strong的区别以及nonatomic的含义
首先从ARC和非ARC层面上可以分为两部分，第一部分是assign、retain、copy，第二部分是weak、strong。

首先看看第一部分assign、retain、copy的含义：
### assign
assign一般用来修饰基本的数据类型，包括基本数据类型（NSInteger、CGFloat）和C数据类型（int、float、double、char）等。因为assign声明的属性不会增加引用计数，也就是说声明的属性释放后，就没有了，及时其他对用用到了他也无法留住他，只会crash。但是即使是释放了，指针却还在，成为了野指针，如果新的对象被分配到了这个内存地址上，也会crash。所一般只能修饰基本数据类型，因为他会被分配在栈上，而栈会由系统自动处理，不会造成野指针。

### retain
与assign相对，我们要解决对象被其他对象引用后释放造成的问题，就要用retain来声明。retain声明后的对象会更改引用计数，那么每次被引用，引用计数都会+1，释放后都会-1，及时这个对象本身被释放了，只要还有对象在引用它，就会持有不会造成什么问题，只有当引用计数为0时候，就会被dealloc构析函数回收内存了。

### copy
最常见的使用copy修饰应该是NSString。copy与retain的区别在于retain的引用是拷贝指针地址，copy是拷贝对象本身，也就是说retain是浅复制，copy是深复制。<b>如果是浅复制，当修改对象时，都会被修改，而深复制不会。</b>之所以在NSString这类有可变类型的对象上使用，是因为他们有可能和对应的可变类型如NSMutableString之间进行赋值操作，为了防止内容被改变，使用copy去深复制一份。copy工作由copy方法执行，此属性只对那些实现了NSCopying协议的对象有效。

以上三个可以在MRC中使用，但是weak和strong就只能在ARC中使用，也就是自动引用计数，这时就不能手动去进行retain、release等操作了，ARC会帮我们完成这些工作。

### weak
weak其实类似于assign，叫弱引用，也就是不增加引用计数。一般只有在防止循环引用时使用，比如父类引用了子类，子类又去引用父类。IBOutlet、Delegate一般用的就是weak，这是因为它们会在类外部被调用，防止循环引用。

### strong
相对的，strong就类似retain了，叫强引用，会增加引用计数，类内部使用的属性一般都是strong修饰的，现在ARC已经基本代替了MRC，所以我们最常见的就是strong了。

### nonatomic
在修饰属性时，我们往往会加上一个nonamatic，这又是什么呢？它的名字叫非原子访问。对应有atomic，是原子访问。我们知道使用多线程为了避免在写操作时同时进行写导致问题，经常会对要写的对象进行加锁，也就是同一时刻只允许一个线程去操作它。如果一个属性是由atomic修饰的，那么系统就会对线程进行保护，防止多个写操作同时进行。这有好处，也有坏处，那就是消耗系统资源，所以对于iPhone这种小型设备，如果不是进行多线程的写操作，就可以使用nonatomic，取消线程保护，提高性能。

## 定义一个NSString类类型属性时，为什么使用copy不用strong？
NSString类型属性是一个指针，定义成copy，操作是拷贝一份等同的对象，这个指针指向新生成的拷贝对象。当使用copy时，这个拷贝的对象无论是拷贝自NSMutableString还是NSString结构都是不可变的NSString。而如果是用strong，则指向一个字符串对象，若指向的是一个NSMutableString，则当指向的对象改变时，属性值也会发生相应改变，导致错误，因为是一个不可变的字符串。

## 引用多线程时会出现什么问题，应如何避免问题的发生？
多线程容易导致资源争抢，发生死锁现象。死锁通常是一个线程锁定一个资源A，而又想去锁定资源B；在另一个线程中，锁定了资源B，而又想去锁定资源A以完成自身的操作，两个线程都想得到对方的资源，而不愿释放自己的资源，造成两个线程都在相互等待，造成了无法执行的情况。

避免死锁的一个通用的经验法则是：当几个线程都要访问共享资源A、B、C时，保证使每个线程都按照同样的顺序去访问它们，比如先访问A，在访问B和C。

采用GCD中的栅栏方法，用并行队列去装载事件并异步去执行。

## 循环引用是如何产生的，如何解决循环引用？
两个类中有属性分别为彼此的实例，这样就会引发循环引用。

使用block、NSTimer时也容易导致循环引用，设置一个引用为弱引用可以解决强引用循环。

## NSTimer使用中的注意事项
在类中定义定时器并把目标对象设置为self时，NSTimer实例会保存此实例，但定时器是用在类中用实例变量存放的，所以此实例也保留了定时器，这就造成了循环引用。除非调用invalidate方法并把定时器设置为nil，或则系统回收实例，才能打破循环引用。如果无法确保stop一定被调用，就极易造成内存泄漏。

使用block可以防止NSTimer导致的内存泄漏。

在NSTimer分类中定义方法，让NSTimer的target为NSTimer实例本身，然后block从实例中copy一份，在NSTimer中定义方法去执行拷贝block。
## App的生命周期以及运行状态
状态：未运行、未激活、激活、后台、挂起。

未运行：程序未启动

未激活：程序在前台运行，不过没有接受到事件

激活：程序在前台运行且收到了事件

后台：程序在后台而且能执行代码，大多程序进入这个状态后会在这个状态停留一会，时间到之后会进入挂起状态

挂起：程序在后台不能执行代码。系统会自动把程序变成这个状态而且不会发出通知。当挂起时，程序还是停留在内存中，系统内存低时，系统就把挂起的程序清除掉
## 栈、堆、静态区域的区别
OC中，非对象的变量都存在栈中，对象都存在堆中，静态区域的内存在程序编译的时候就已经分配好，这块内存在程序的整个运行期间都在，主要存放静态数据、全局数据和常量。

栈区：在执行函数时，函数内局部变量的存储单元都可以在栈上创建，函数执行结束时这些存储单元自动被释放。栈内存效率高，内存容量有限。

堆区：OC对象存储于堆中，当对象的引用计数为0时自动释放该对象。
## 子试图超出父视图部分能看到吗？超出的部分有什么影响？
子视图超出父视图的部分能看到，但是超出部分不能响应事件。
想让超出部分响应事件，就该写父视图的hitTest方法。判断触碰区是否在子视图内，如果在子视图内，则返回子视图。让子视图去响应事件。
## respond链是如何响应的，响应顺序是什么样的？
在iOS系统中，能够响应并处理事件的对象称之为responder object，UIResponder是所有responder对象的基类，在UIResponder类中定义了处理各种事件，包括触摸事件、运动事件和远程控制事件的编程接口，UIApplication、UIViewController、UIVIew和所有继承自UIVIew的UIKit类（包括UIWindow继承自UIVIew）都直接或间接的继承自UIResponder，所以它们的实例都是responder object对象，都实现了上述4个方法。UIResponder中的默认实现是什么都不做，但UIKit中UIResponder的直接子类（UIView，UIVIewController...）的默认实现是将事件延着responder chain继续向上传递到下一个responder，即nextResponder。所以在定制UIView子类的上述事件处理方法时，如果需要将事件传递给next responder，可以直接调用super的对应事件处理方法，super的对应方法将事件传递给next responder，即使用`[super touchesBegan:touches withEvent:event];`，不建议直接向nextResponder发送消息，这样可能会漏掉父类对这一事件的其他处理。
``` objc
[self.nextResponder touchesBegan:touches withEvent:event];
```
另外在定制UIVIew子类的事件处理方法时，如果其中一个方法没有调用super的对应方法，则其他方法也需要重写，不使用super的方法，否则事件处理流程会很混乱。
<strong>responder chain是一系列连接的responder对象，通过responder对象可以将处理事件的责任传递给下一个，更高级的对象，即当前responder对象的nextResponder。</strong>

iOS中responder chain的结构为：
{% asset_img responder_chain.webp responder chain %}
第一响应者是第一个接收事件的View对象，我们在Xcode的Interface Builder画视图时，可以看到视图结构中就有First Responder。这里的First Responder就是UIApplication了。另外，我们可以控制一个View让其成为First Responder，通过实现`- (BOOL)canBecomeFirstResponder`方法并返回YES可以使当前View成为第一响应者，或则调用View的`becomeFirstResponder`方法也可以，例如当UITextField调用该方法时，会弹出键盘进行输入，此时输入框控件就是第一响应者。

iOS系统在处理事件时，通过UIApplication对象和每个UIWindow对象的`sendEvent:`方法将事件分发给具体处理此事件的responder对象（对于触摸事件为hitTest view，其他事件为first responder），当具体处理此事件的responder不处理此事件时，可以通过responder chain交给上一级处理。

如果hit-test view或first responder不处理此事件，则将事件传递给其nextResponder处理，若有UIViewController对象则传递给UIViewController，传递给其superView。

如果view的viewController也不处理事件，则viewController将事件传递给其管理view的superView。

视图层级结构的顶级为UIWindow对象，如果window仍不处理此事件，传递给UIApplication。

若UIApplication对象不处理此事件，则事件被丢弃。

使用响应链，能够让一条链上的多个对象对同一个事件做出响应。每一个应用有一个响应链，我们得视图结构是一个N叉树（一个视图可以有多个子视图，一个子视图同一时刻只有一个父视图），而每一个继承自UIResponder的对象都可以在这个N叉树中成为一个节点。当叶节点成为最高响应者的时候，从这个叶节点开始往其父节点开始追溯出一条链，那么对于这一个叶节点来说，这一条链就是当前的响应者链。响应者链将系统捕获到的UIEvent与UITouch从叶节点层层向上分发，期间可以选择停止分发，也可以继续向上分发。一句话就是事件传递过程。

## GCD中栅栏机制
栅栏函数只能用在调度并发队列中，不能使用在全局并发队列中。
1. 实现高效率的数据库访问和文件访问
2. 避免数据竞争
dispatch_barrier_async函数会等待追加到并行队列上的并行执行的处理全部结束之后，再将制定的处理追加到该并行队列中。然后再由dispatch_barrier_async函数追加的处理执行完毕后，并行队列才恢复为一般的动作，追加到该并行队列的处理又开始执行。

## Notification响应顺序
NSNOtification使用的是同步操作。即如果你在程序中的A位置post了一个NSNotification，在B注册了一个observer，通知发出后，必须等到B位置的通知回调执行完以后才能返回到A处继续往下执行。如果想让NSNotification的post处和observer处异步执行，可以通过NSNotificationQueue实现。

多线程应用中，Notification在哪个线程中post，就在哪个线程中被转发，而不一定是在注册观察者的那个线程中。Notification的发送与接收处理都是在同一个线程中。

为了顺应语法的变化，apple从iOS4之后提供了带有block的NSNotification。

一种重定向的实现思路是自定义一个通知队列（注意，不是NSNotificationQueue对象，而是一个数组），让这个队列去维护那些我们需要重定向的Notification。我们仍然是像平常一样去注册一个通知的观察者，当Notification来了时，先看看post这个Notification的线程是不是我们所期望的线程，如果不是，则将这个Notification存储到我们得队列中，并发送一个信号（signal）到期望的线程中，来告诉这个线程需要处理一个Notification。指定的线程在收到信号后，将Notification从队列中移除，并进行处理。

当我们注册一个观察者时，通知中心会持有观察者的一个弱引用，来确保观察者是可用的。主线程调用dealloc操作会让observer对象的引用计数减为0，这时对象会释放掉。后台线程发送一个通知，如果此时observer还未被释放，则会用其转出消息，并执行回调方法。而如果在回调执行的过程中对象被释放了，就会出现上面的问题。

## Core Data、SQLite是如何使用的？
Core Data是一个功能强大的层，位于SQLite数据库之上，它避免了SQL的复杂性，能让我们以更自然的方式与数据库进行交互。Core Data将数据库进行转换为OC对象（托管对象）来实现，这样无需任何SQL知识就能操作他们。

Core Data能将应用程序中的对象直接保存到数据库中，无需进行复杂的查询，也无需确保对象的属性名和数据库字段名对应，这一切由Core Data完成。
## 归档是如何使用的？
归档是指某种格式来保存一个或多个对象，以便以后还原这些对象的过程。

只要在类中实现的每个属性都是标量（如int或float）或都是符合NSCoding协议的某个类的实例，就可以对你的对象进行完整归档。

## 对Http的理解，socket编程的套路
HTTP协议是基于TCP连接的，是应用层协议，主要解决如何包装数据。Socket是对TCP/IP协议的封装，Socket本身并不是协议，而是一个调用接口（API），通过Socket，我们才能使用TCP/IP协议。

HTTP连接：短连接，客户端向服务器发送一次请求，服务器响应后连接断开，节省资源。服务器不能主动给客户端响应（除非采用HTTP长连接技术），iPhone主要使用NSURLConnection。

Socket连接：长连接，客户端跟服务器端直接使用Socket进行连接，没有规定连接后断开，因此客户端和服务器端保持连接通道，双方可以主动发送数据，一般多用于游戏。Socket默认连接超时时间是30秒，默认大小是8k（理解为一个数据包大小）。

## NSUserDefault使用的时候需要注意什么？
NSUserDefault非常好用，并不需要用户在程序中设置NSUserDefault的全局变量，需要在哪里使用NSUserDefault的数据，那么就在哪里创建一个NSUserDefault对象，然后进行读或写操作。

针对同一个关键字对应的对象或者数据，可以对它进行重写，重写之后关键字就对应新的对象或者数据，旧的对象或者数据会自动清理。

注意一点：只能存储基本对象，如果是自定义的对象，需要转换成NSData存储进去才可以。

iOS中本地存储数据简单的说有三种方式：数据库、NSUserDefault和文件。

NSUserDefault用于存储数据量小的数据，例如用户配置。并不是所有的东西都能往里放，只支持：NSString、NSNumber、NSData、NSMArray、NSDictionary。但是如果把一个自定义的类存到一个NSArray里，然后再存到NSUserDefault里也是不能成功的。
## ARC的底层实现机制
通过retainCount的机制来决定对象是否需要释放。每次runloop的时候，都会检查对象的retainCount，如果retainCount为0，说明该对象没有地方需要继续使用了，可以释放掉了。

ARC相对于MRC，不是编译时添加retain、release、autorelease这么简单。应该是编译期和运行期两部分共同帮助开发者管理内存。在编译期，ARC用的是更底层的C接口实现的retain、release、autorelease，这样做新能更好，也是为什么不能在ARC环境下手动retain、release、autorelease，同时对同一上下文的同一对象的成对retain、release操作进行优化（即忽略掉不必要的操作）；ARC也包含运行期组件，这个地方做的优化比较复杂，但也不能被忽略。

1. ARC会自动执行retain、release、autorelease等操作，在ARC下不能主动调用这些内存管理方法。
2. ARC在调用这些方法时，并不通过Objective-C的消息转发机制，而是直接调用其底层C语言版本API，这样做新能更好，因为保留及释放操作需要频繁的执行，直接调用其底层的函数节省很多CPU周期，如ARC会调用与retain等价的底层函数objc_retain。
3. 在使用ARC时必须遵循方法命名规则，alloc、new、copy、mutablecopy。ARC通过命名约定将内存管理标准化。
4. ARC管理对象生命周期的办法是：在合适的地方“插入”、“保留”及“释放”操作。在方法中创建的对象，在方法中自动release；类中的对象，在dealloc方法中释放。
5. ARC下，变量的内存管理语义可以通过修饰符指明。
6. ARC只负责管理Objective-C对象的内存，CoreFoundation对象不归ARC管理。

## 滑动TableView视图的时候NSTimer会不会工作？
1. 默认情况下NSTimer不能在后台正常工作。
2. 滑动UI是NSTimer不能工作。

这其实就是Runloop的mode再做怪。
Runloop可以理解为cocoa下的一种消息循环机制，用来处理各种消息事件，我们在开发的时候并不需要手动去创建一个runloop，因为框架为我们创建了一个默认的runloop，通过`[NSRunloop currentRunloop]`我们可以得到一个当前线程下面对应的runloop对象，不过我们需要注意的是不同的runloop之间消息的通知方式。

在开启一个NSTimer实质上是在当前的runloop中注册一个新的事件源，而当scrollView滚动的时候，当前MainRunloop是处于UITrackingRunLoopMode的模式下，在这个模式下，是不会处理NSDefaultRunLoopMode的消息（因为RunLoop Mode不一样），要想在scrollView滚动的同时也接受其他runloop的消息，我们需要改变两者之间的runloop mode。
``` objc
[[NSRunLoop currentRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
```
简单的说就是NSTimer不会开启新的进程，只是在runloop里注册了一下，runloop每次loop时都会检测这个timer，看是否可以触发。当runloop在A mode，而timer注册在B mode时就无法去检测这个timer，所以需要把NSTimer也注册到A mode，这样就可以被检测到。

## 绘制图形

## 构建缓存时选用NSCache而非NSDictionary
当系统资源将要耗尽时，NSCache可以自动删减缓存。如果采用普通的字典，那么就要自己编写挂钩，在系统发出“低内存”通知时手动删减缓存，NSCache会先删减“最久未使用”的对象。

NSCache不会拷贝键，而是会保留它。此行为用NSDictionary也可以实现，但是需要编写比较复杂的代码。NSCache对象不拷贝键的原因在于：很多时候，键都是由不支持拷贝操作的对象来充当的。因此，NSCache对象不会自动拷贝键，所以说，在键不支持拷贝操作的情况下，该类用起来比字典方便。

NSCache是线程安全的，NSDictionary不是。在开发者自己不编写加锁代码的前提下，多个线程可以同时访问NSCache。对缓存来说，线程安全很重要，因为开发者可能要在某个线程中读取数据，此时如果发现缓存里找不到指定的键，那么就要下载该键对应的数据了。

如果缓存使用得当，那么应用程序的响应速度就能提高。只有那种“重新计算起来很费事”的数据，才值得放入缓存，比如那些需要从网络获取从磁盘读取的数据。

## Runtime机制


## Runloop是怎样持续监听事件从而实现线程保护？如果线程启用Runloop，它会一直占用CPU吗？
RunLoop是一个让线程能随时处理事件但不退出的机制。RunLoop实际上是一个对象，这个对象管理了其需要处理的事件和消息，并提供了一个入口函数来执行EventLoop的逻辑。线程执行了这个函数后，就会一直处于这个函数内部“接受消息->等待->处理”的循环中，知道循环结束（比如传入quit的消息），函数返回。让线程在没有处理消息时休眠以避免资源占用、在有消息到来时立刻被唤醒。

OSX/iOS系统中，提供了两个这样的对象：NSRunLoop和CFRunLoopRef。CFRunLoopRef是在CoreFoundation框架内的，它提供了纯C函数的API，所有这些API都是线程安全的。NSRunLoop是基于CFRunLoopRef的封装，提供了面向对象的API，但是这些API不是线程安全的。

线程和RunLoop之间是一一对应的，其关系是保存在一个全局的Dictionary里。线程刚创建时并没有RunLoop，如果你不主动获取，那它一直都不会有。RunLoop的创建是发生在第一次获取时，RunLoop的销毁是发生在线程结束时。你只能在一个线程的内部获取其RunLoop（主线程除外）。

系统默认注册了5个RunLoop的Mode：
1. `kCFRunLoopDefaultMode`：App的默认Mode，通常主线程是在这个Mode下运行的。
2. `UITrackingRunLoopMode`：界面跟踪Mode，用于ScrollView追踪触摸滑动，保证界面滑动时不受其他Mode影响。
3. `UIInitializationRunLoopMode`：在刚启动App时进入的第一个Mode，启动完成后不再使用。
4. `GSEventReceiveRunLoopMode`：接受系统事件的内部Mode，通常用不到。
5. `kCFRunLoopCommonModes`：这是一个占位的Mode，没有实际作用。

RunLoop的四个作用：
1. 使程序一直运行接受用户输入
2. 决定程序在何时应该处理哪些Event
3. 调用解耦
4. 节省CPU时间

主线程的RunLoop默认是启动的。iOS的应用程序里面，程序启动后会有一个如下的main()函数：
``` objc
int main(int argc, char * argv[]) {
    @autoreleasepool {
        return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
    }
}
```

参考文章：https://blog.csdn.net/potato512/article/details/51455728

## 临界区的理解，临界资源有什么特点？为什么会发生死锁？死锁怎么预防？发生死锁了怎么办？

## 动画掉帧，CADisPlayLink， Core graphics
使用![KMCGeigerCounter](https://github.com/kconner/KMCGeigerCounter)检测动画掉帧问题。

CADisplayLink是一个能让我们以和屏幕刷新率相同的频率将内容画到屏幕上的定时器。我们在应用中创建一个新的CADisplayLink对象，把它添加到一个RunLoop中，并给它提供一个target和selector在屏幕刷新的时候调用。另外CADisplayLink不能被继承。frameInterval属性是可读可写的NSInteger型值，标识间隔多少帧调用一次selector方法，默认值是1，即每帧都调用一次。如果每帧都调用一次的话，对于iOS设备来说那刷新频率就是60hz也就是每秒60次，如果将frameInterval设为2那么就会两帧调用一次，也就是变成了每秒刷新30次。

我们通过pause属性开控制CADisplayLink的运行。当我们想结束一个CADisplayLink的时候，应该调用`invalidate`从RunLoop中删除并删除之前绑定的target和selector，另外CADisplayLink不能被继承。

iOS设备的屏幕刷新率是固定的，CADisplayLink在正常情况下会在每次刷新结束都被调用，精确度相当高。

NSTimer的精确度就显得低了点，比如NSTimer的触发时间到的时候，RunLoop如果在阻塞状态，触发时间就会推迟到下一个RunLoop周期。并且NSTimer新增了tolerance属性，让用户可以设置可以容忍触发的时间的延迟范围。

CADisplayLink使用场合相对专一，适合做UI的不停绘制，比如自定义动画引擎或则视频播放的渲染。NSTimer的使用范围要广泛的多，各种需要单次或者循环定时处理的任务都可以使用。在UI相关的动画或者显示内容使用CADisplayLink比起用NSTimer的好处就是我们不需要在格外关系屏幕的刷新频率了，因为它本身就是跟屏幕刷新同步的。

注意：
通常来讲：iOS设备的刷新频率是60Hz也就是每秒60次。那么每一次刷新的时间就是1/60秒（大概16.7毫秒）。当我们得frameInterval值为1的时候我们需要保证的是CADisplayLink调用`target`的函数计算时间不应该大于16.7，否则就会出现严重的丢帧现象。

在mac应用中我们使用的不是CADisplayLink而是CVDisplayLink它是基于C接口的用起来配置有些麻烦但是用起来还是很简单的。

## 使用ARC是否会出现野指针，为什么？
会出现野指针，在定义block的时候，是将block内存分配在堆上的。当在函数作用范围外的时候，block的内存会被回收释放，就会生成野指针，这时候去掉用block，就会crash。
## 如何让异步方法进行二次封装让其同步执行
可以用dispatch_group_async，dispatch_group_notify。
## 为什么这样定义单例？
``` objc
static HLTestObject *instance = nil;
+ (instancetype)sharedInstance
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[[self class] alloc] init];
    });
    return instance;
}
```
为什么使用GCD去创建单例，GCD中的dispatch_once函数只调用一次，多线程若有两个线程先后去执行到dispatch_once这个地方，则先执行到的回去调用，后执行的就不会调用了。

为什么要让对象指针static，多线程情况下，因为dispatch_once只执行一次，除了第一个执行的，之后的线程都不执行，直接返回对象指针，若此时指针是临时变量，则会导致返回一个空指针，若为static 则返回的永远是同一个又第一个执行的生成的对象。
## 如何给按钮画边框
``` objc
ringButton.tintColor = [UIColor colorWithRed:0.000 green:0.537 blue:0.506 alpha:1];
[ringButton.layer setMasksToBounds:YES];
[ringButton.layer setCornerRadius:8.0];
[ringButton.layer setBorderWidth:1.0];
CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
CGColorRef colorref = CGColorCreate(colorSpace, (CGFloat[]){0.000,0.537,0.506,1});
[ringButton.layer setBorderColor:colorref];
```
## Socket和Http的区别，和TCP的区别
### Socket套接字
套接字（Socket）是支持TCP/IP协议的网络通信的基本操作单元。它是网络通信过程中端点的抽象表示，包含进行网络通信必须的五种信息：连接使用的协议、本地主机的IP地址、本地进程的协议端口、远程主机的IP地址、远程进程的协议端口。

应用层通过传输层进行数据通信时，TCP会遇到同时为多个应用程序提供并发服务的问题。多个TCP连接或多个应用程序可能需要通过一个TCP协议端口传输数据。为了区别不同的应用程序进程和连接，许多计算机操作系统为应用程序与TCP/IP协议交互提供了套接字（Socket）接口。应用层可以和传输层通过Socket接口，区分来自不同应用程序进程或网络连接的通信，实现数据传输的并发服务。

套接字之间的连接过程分为三个步骤：服务器监听、客户端请求、连接确认。
服务器监听：服务器端套接字并不定位具体的客户端套接字，而是出于等待连接的状态，实时监控网络状态，等待客户端的链接请求。

客户端请求：指客户端的套接字提出链接请求，要链接的目标是服务端的套接字。为此，客户端的套接字必须首先描述它要连接的服务器套接字，指出服务器端套接字的地址和端口，然后就向服务端套接字提出链接请求。

连接确认：当服务器端套接字监听到或则说收到客户端套接字的连接请求时，就响应客户端套接字的请求，建立一个新的线程，把服务端套接字的描述发送给客户端，一旦客户端确认了此描述，双方就正式建立连接。而服务器端套接字继续处于监听状态，继续接受其他客户端套接字的链接请求。

创建Socket连接时，可以指定使用的传输层协议，Socket可以支持不同的传输层协议（TCP或UDP），当时使用TCP协议进行连接时，该Socket连接就是一个TCP连接。

若双方建立的是HTTP连接，则服务器需要等到客户端发送一次请求后才能将数据传回给客户端，因此，客户端定时向服务器端发送连接请求，不仅可以保持在线，同时也是在“询问”服务器是否有新的数据，如果有就将数据传给客户端。

TCP/IP协议是传输层协议，主要解决数据如何在网络中传输，而HTTP是应用层协议，主要解决如何包装数据。关于TCP/IP和HTTP协议的关系，网络有一段比较容易理解的介绍：“我们在传输数据时，可以只使用（传输层）TCP/IP协议，但是那样的话，如果没有应用层，便无法识别数据内容，如果想要使传输层的数据有意义，则必须使用到应用层协议，应用层协议有很多，比如HTTP、TCP、TELNET等，也可以自己定义应用层协议。WEB使用HTTP协议作为应用层协议，以封装HTTP文本信息，然后使用TCP/IP做传输层协议将它发到网络上。”
## OC对象模型
对象是OC中基本构造单元（building block），用于存储和传递数据。类和对象的最终实现都是一种数据结构。可以完整的类应该包括类方法、实例方法和成员变量（实例变量），每个对象都包括一个isa（is a class）指针指向类对象（运行时方法发送给对象消息，才确定类别并调用相应的方法实现），元类对象中的方法列表是类方法（+，class methods）。
## HTTPS和HTTP的区别
1. HTTPS是加密传输协议，HTTP是明文传输协议
2. HTTPS需要用到SSL证书，而HTTP不用
3. HTTPS比HTTP更加安全，对搜索引擎更友好，利于SEO
4. HTTPS标准端口443，HTTP标准端口90
5. HTTPS基于传输层，HTTP基于应用层
6. HTTPS在浏览器显示绿色安全锁，HTTP没有显示

## 使用atomic一定是线程安全的吗？
不是的。
nonatomic的内存管理语义是非原子性的，非原子性的操作本来就是线程不安全的，而atomic的操作是原子性的，但是并不意味着它是线程安全的，它会增加正确的几率，能够更好的避免线程的错误，但是它仍然是线程不安全的。

当使用atomic时，虽然对属性和读和写是原则性的，但是仍然可能出现线程错误：当线程A进行写操作，这时其他线程的读或则写操作会因为该操作而等待。当A线程的写操作结束后，B线程进行写操作，然后有线程C在A线程读操作前release了该属性，那么还会导致程序崩溃。所以仅仅使用atomic并不会使得线程安全，我们还要为线程添加lock来确保线程的安全。

也就是要注意：<b>atomic所说的线程安全只是保证了getter和setter存取方法的线程安全，并不能保证整个对象是线程安全的。</b>如下例所示：
``` objc
@property(atomic,strong)NSMutableArray *arr;
```
如果一个线程循环的读数据，一个线程循环写数据，那么肯定会产生内存问题，因为这和setter、getter没有关系。如使用`[self.arr objectAtIndex:index]`就不是线程安全的。好的解决方案就是加锁。

<b>探讨一下Objective-C中几种不同方式实现的锁</b>，在这之前先构建一个测试类，假设它是我们的一个共享资源，method1和method2是互斥的，代码如下：
``` objc
@implementation TestObj

- (void)method1 
{
    NSLog(@"%@",NSStringFromSelector(_cmd));
}
- (void)method2
{
    NSLog(@"%@",NSStringFromSelector(_cmd));
}
@end
```

### 使用NSLock实现的锁
``` objc
// 主线程中
TestObj *ojc = [[TestObj alloc] init];
NSLock *lock = [[NSLock alloc] init];

// 线程一
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    [lock lock];
    [ojc method1];
    sleep(10);
    [lock unlock];
});

// 线程二
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    sleep(1);
    [lock lock];
    [ojc method2];
    [lock unlock];
});
```
根据打印的结果已经看到，线程一锁住之后，线程二回一直等待线程一走完并将锁设置为unlock后，才会执行method2中的方法。

NSLock是Cocoa提供给我们最基本的锁对象，这也是我们经常所使用的，除lock和unlock方法外，NSLock还提供了tryLock和lockBeforeDate两个方法，前一个方法会尝试加锁，如果锁不可用（已经被锁住），并不会阻塞线程，并返回NO。lockBeforeDate方法会在指定Date之前尝试加锁，如果在指定时间之前都不能加锁，则返回NO。

### 使用synchronized关键字构建的锁
当然在Objective-C中你还可以用@synchronized指令快速的实现锁：
``` objc
TestObj *ojc = [[TestObj alloc] init];
NSLock *lock = [[NSLock alloc] init];

// 线程一
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    @synchronized(ojc){
        [ojc method1];
        sleep(10);
    }
});

// 线程二
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    sleep(1);
    @synchronized(ojc){
        [ojc method2];
    }
});
```

@synchronized指令使用的obj为该锁的唯一标识，只有当标识相同时，才会满足互斥，如果线程二中的@synchronized(obj)改为@synchronized(other)，线程二就不会被阻塞，@synchronized指令实现锁的优点就是我们不需要在代码中显式的创建锁对象，便可以实现锁的机制，但作为一种预防措施，@synchronized块会隐式的添加一个异常处理例程来保护代码，该处理例程会在异常抛出的时候自动释放互斥锁。所以如果不想让隐式的异常处理例程带来额外的开销，可以考虑使用锁对象。

### 使用C语言的pthread_mutex_t实现的锁

``` objc
TestObj *ojc = [[TestObj alloc] init];
__block pthread_mutex_t mutex;
pthread_mutex_init(&mutex,NULL);

// 线程一
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    pthread_mutex_lock(&mutex);
    [ojc method1];
    sleep(10);
    pthread_mutex_unlock(&mutex);
});

// 线程二
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    sleep(1);
    pthread_mutex_lock(&mutex);
    [ojc method2];
    pthread_mutex_unlock(&mutex);
});
```
pthread_mutex_t定义在pthread.h中，需要引入`#import <pthread.h>`。

### 使用GCD来实现的锁

以上代码的多线程中已经使用到了GCD的dispatch_async方法，其实在GCD中也已经提供了一种信号机制，使用它我们也可以构建一把“锁”（本质意义上讲，信号量与锁是有区别的，具体差异参考信号量与互斥锁之间的区别）：
``` objc
TestObj *ojc = [[TestObj alloc] init];
dispatch_semaphore_t semaphore = dispatch_semaphore_create(1);
// 线程一
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    [ojc method1];
    dispatch_semaphore_signal(semaphore);
});

// 线程二
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    sleep(1);
    dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
    [ojc method2];
    dispatch_semaphore_signal(semaphore);
});
```

### 使用自旋锁OSSpinLock来实现的“锁”
``` objc
//主线程中
TestObj *obj = [[TestObj alloc] init];
OSSpinLock spinlock = OS_SPINLOCK_INIT;
//线程1
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT,0), ^{
    OSSpinLockLock(&spinlock);
    [obj method1];
    sleep(10);
    OSSpinLockUnlock(&spinlock);
});

//线程2
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT,0), ^{
    sleep(1);//以保证让线程2的代码后执行
    OSSpinLockLock(&spinlock);
    [obj method2];
    OSSpinLockUnlock(&spinlock);
});
```

参考链接：https://www.jianshu.com/p/e286d2907bf7