---
title: objc常用关键字的使用与区别
date: 2016-03-23 10:17:12
tags:
  - objc
categories: 经验积累
abbrlink: 3e1fbb3521ce224a
---

虽然接触iOS已经很久了，但是对于objc中常见的关键字还经常处于傻傻分不清楚的状态。遇到最多的情况就是在申明一个属性的时候，比如：
``` objc
@propperty (?,?) ?*!;
...............
............
.........
......
```
就是这里，每次在这里的时候都不知道，怎么去申明他的关键字。这个看起来简单（弄明白了确实也是很简单的），但是如果没有系统的去区分这些关键字很容易混淆。
所以今天通过自己的一些积累以及在网上总结的一些资料，给自己总结一下，主要作为自己对iOS学习的一个小小的总结。

OC中常见的关键字有copy,assign,strong,retain,weak,readonly,nonatomic,atomic。
这篇文章主要从这几个关键字的含义和简单的使用以及iOS开发中使用的时候的一些区别来进行总结。（看似简单但却非常重要）

<!-- more -->

## 含义
### copy
创建一个索引计数为1的对象,释放掉原来的对象。复制内容（深复制），如果调用copy的是数组，则为指针复制（浅复制），仅仅复制子元素的指针。copy常常用来修饰NSString，NSMutableArray和Block。
``` objc
@property  (nonatomic,copy) NSString  *title;
@property (nonatomic, copy) NSMutableArray *myArray;
@property (nonatomic, copy) void(^myBlock)();
```
### assign 
简单的赋值，不会更改索引计数，主要是对基本数据类型使用。eg：（NSInteger，CGFloat和C语言的int,float, double,char等）
``` objc
@property (nonatomic, assign) int n;
@property (nonatomic, assign) BOOL isOK;
@property (nonatomic, assign) CGFloat width;
@property (nonatomic, assign) CGPoint height;
```
### retain
释放旧的对象，将旧对象的值赋予输入对象并将输入对象的索引计数＋1，主要应用与NSObject与其子类中。 retain是指针复制（浅复制），引用计数加1，而不会导致内容被复制。
``` objc
@property  (nonatomic, retain) UIColor *myColor;

- (void)setName:(NSString *)newName {
    [newName retain];
    [name release];  
    name = newName;  
}

```

### strong
相当于retain，strong在ARC环境下为默认属性类型。
``` objc
@property (nonatomic,readwrite,strong) NSString *title;
@property (strong, nonatomic) UIViewController *viewController;
@property (nonatomic,  strong) id childObject;
```

### weak
取代之前的assign，对象销毁之后会自动置为nil，防止野指针。
assign不能自动置为nil，需要手动置为nil。
delegate基本总是使用weak，以防止循环引用。特殊情况是，如果希望在dealloc中调用delegate的某些方法进行释放，此时如果使用weak将引起异常，因为此时已经是nil了，那么采用assign更为合适。
``` objc
@property  (weak, nonatomic) IBOutlet UIButton *myButton;//处于最顶层的IBOutlet应该为strong
@property (nonatomic, weak) id parentObject;
@property(nonatomic, readwrite, weak) id  <MyDelegate> delegate;
@property (nonatomic, weak) NSObject <SomeDelegate> *delegate;
```

### readonly
此标记说明属性是只读的，默认的标记是读写，如果你指定了只读，在@implementation中只需要一个读取器。或者如果你使用@synthesize关键字，也是有读取器方法被解析。而且如果你试图使用点操作符为属性赋值，你将得到一个编译错误。

### readwrite
此标记说明属性会被当成读写的，这也是默认属性。设置器和读取器都需要在@implementation中实现。如果使用@synthesize关键字，读取器和设置器都会被解析。

## 使用区别

### copy和retain
1. copy其实是建立了一个相同的对象，而retain不是；
2. copy是内容拷贝，retain是指针拷贝；
3. copy是内容的拷贝 ,对于像NSString的确是这样，但是如果copy的是一个NSArray呢?这时只是copy了指向array中相对应元素的指针.这便是所谓的"浅复制".
4. copy的情况：NSString *newPt = [pt copy];
此时会在堆上重新开辟一段内存存放@"abc" 比如0X1122 内容为@"abc 同时会在栈上为newPt分配空间 比如地址：0Xaacc 内容为0X1122 因此retainCount增加1供newPt来管理0X1122这段内存；

### assign与retain
1. assign: 简单赋值，不更改索引计数；
2. assign的情况：NSString *newPt = [pt assing];
此时newPt和pt完全相同 地址都是0Xaaaa 内容为0X1111 即newPt只是pt的别名，对任何一个操作就等于对另一个操作， 因此retainCount不需要增加；
3. assign就是直接赋值；
4. retain使用了引用计数，retain引起引用计数加1, release引起引用计数减1，当引用计数为0时，dealloc函数被调用，内存被回收；
5. retain的情况：NSString *newPt = [pt retain];
此时newPt的地址不再为0Xaaaa，可能为0Xaabb 但是内容依然为0X1111。 因此newPt 和 pt 都可以管理"abc"所在的内存，因此 retainCount需要增加1；

### readonly与readwrite
1. readonly：只产生简单的getter,没有setter。
2. readwrite：同时产生setter\getter方法

### nonatomic与atomic
1. nonatomic非原子性访问，对属性赋值的时候不加锁，多线程并发访问会提高性能。如果不加此属性，则默认是两个访问方法都为原子型事务访问；
2. 成员变量的@property属性时，默认为atomic，提供多线程安全。在多线程环境下，原子操作是必要的，否则有可能引起错误的结果；
### weak and strong property (强引用和弱引用的区别)
3. 比如setter函数里面改变两个成员变量，如果你用nonatomic的话，getter可能会取到只更改了其中一个变量时候的状态，这样取到的东西会有问题，就是不完整的。当然如果不需要多线程支持的话，用nonatomic就够了，因为不涉及到线程锁的操作，所以它执行率相对快些。
4. atomic的意思就是setter/getter这个函数，是一个原语操作。如果有多个线程同时调用setter的话，不会出现某一个线程执行完setter全部语句之前，另一个线程开始执行setter情况，相当于函数头尾加了锁一样，可以保证数据的完整性。nonatomic不保证setter/getter的原语行，所以你可能会取到不完整的东西。因此，在多线程的环境下原子操作是非常必要的，否则有可能会引起错误的结果。

### weak与strong
1. weak 和 strong 属性只有在你打开ARC时才会被要求使用，这时你是不能使用retain release autorelease 操作的，因为ARC会自动为你做好这些操作，但是你需要在对象属性上使用weak 和strong,其中strong就相当于retain属性，而weak相当于assign。
2. 只有一种情况你需要使用weak（默认是strong），就是为了避免retain cycles（就是父类中含有子类{父类retain了子类}，子类中又调用了父类{子类又retain了父类}，这样都无法release）
3. 声明为weak的指针，指针指向的地址一旦被释放，这些指针都将被赋值为nil。这样的好处能有效的防止野指针。