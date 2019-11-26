---
title: RXSwift基础
date: 2016-06-08 09:32:44
tags:
   - RXSwift
categories: 知识积累
abbrlink: 1cdda3c06a430c09
---

## 概念

一个观察者(Observer)订阅一个可观察序列(Observable)。观察者对Observable发射的数据或数据序列作出响应

## 为什么发用RxSwift
一个程序通常包含着大量的各种事件的产生以及对应的处理逻辑，各种响应方法使代码更加的混乱和复杂，而RxSwift是一个统一的处理各种响应事件的方式

* Observable的创建和订阅
* Subjects的使用
* Combination：Observable的混合操作
* Transforming：Observable的转换操作
* Filtering：Observable消息元素的过滤操作
* 对Observable元素做运算操作
* Connectable操作
* 错误处理
* debug

<!-- more -->

## 消息的订阅方式
这些都是Observable的方法，参数都是闭包，闭包是观察者
1. subscribe(on:(Event) -> void)：订阅所有消息(Next, Error, and Completed)
2. subscribeNext((Element) -> void)：只订阅Next
3. subscribeError((ErrorType) -> void)：只订阅Error
4. subscribeCompleted(() -> Void)：只订阅Completed
5. subscribe(onNext:(Element) -> void, onError:(ErrorType) -> void, onCompleted:() -> Void, onDisposed:() -> Void)订阅多个消息

## 释放分配的资源
订阅者可以通过调用.dispose()来释放分配的资源，但通过DisposeBag来管理或者通过takeUntil来自动释放更好

``` swift
let disposeBag = DisposeBag()
subscription.addDisposableTo(disposeBag)
```
或

``` swift
sequence
    .takeUntil(self.rx_deallocated)
    .subscribe {
        print($0)
    }
```
## Observable的创建和订阅
Observable序列分为两类：
* 冷：只有当有观察者订阅这个序列时，序列才发射值
* 热：序列创建时就开始发射值

### never()创建即不会完成也不会发消息的Observable
``` swift
let disposeBag = DisposeBag()
let neverSequence = Observable<String>.never()

let neverSequenceSubscription = neverSequence
        .subscribe { _ in
            print("This will never be printed")
    }

neverSequenceSubscription.addDisposableTo(disposeBag)
```
<img src='./never.png' width=400/>

### empty()创建只会发送一次完成消息的Observable
``` swift
let disposeBag = DisposeBag()

Observable<Int>.empty()
        .subscribe { event in
            print(event)
        }
        .addDisposableTo(disposeBag)
```
`output:`
Completed

<img src='./empty.png' width=400>

### just()创建只包含一个元素的Observable，在发送一次Next消息后便发送Completed消息
``` swift
let disposeBag = DisposeBag()

Observable.just("🔴")
    .subscribe { event in
        print(event)
    }
    .addDisposableTo(disposeBag)        
```
> 注：如果传递null给just，它将返回一个发送null消息的Observable，不要传入错误的参数，否则将会得到一个空的Observable

`output:`
Next(🔴)
Completed
<br/>
<img src='./just.png' width=400>


### of()创建可以包含任意个元素的Observable，连续相同的元素会被忽略
``` swift
 let disposeBag = DisposeBag()

 Observable.of("🐶", "🐱", "🐭", "🐹")
        .subscribeNext { element in
            print(element)
        }
        .addDisposableTo(disposeBag)
```
`output:`
🐶
🐱
🐭
🐹

### create()可以创建自定义的Observable，在最原始的Observable基础上创建Observable
``` swift
let disposeBag = DisposeBag()

let myJust = { (element: String) -> Observable<String> in
        return Observable.create { observer in
            observer.on(.Next(element))
            observer.on(.Completed)
            return NopDisposable.instance
        }
    }

 myJust("🔴")
    .subscribe { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
Next(🔴)
Completed
<br/>
<img src='./create.png' width=400>
<br/>

### range()创建一个发送一个范围的整数的Observable，发送完后发送Completed
``` swift
let disposeBag = DisposeBag()

Observable.range(start: 1, count: 10)
        .subscribe { print($0) }
        .addDisposableTo(disposeBag)
```
`output:`
Next(1)
Next(2)
Next(3)
Next(4)
Next(5)
Next(6)
Next(7)
Next(8)
Next(9)
Next(10)
Completed

### repeatElement()创建一个可以重复发送消息的Observable，可以指定重复的次数，未指定即无限发送
``` swift
let disposeBag = DisposeBag()

Observable.repeatElement("🔴")
        .take(3)
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)
```
`output:`
🔴
🔴
🔴
> 注：take可以用于所有Observable指定限制元素个数

### generate()创建一个可以指定规则的Observable，会发送所有满足规则的元素
``` swift
let disposeBag = DisposeBag()

 Observable.generate(
            initialState: 0,
            condition: { $0 < 3 },
            iterate: { $0 + 1 }
        )
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)
```
**iterate：每次condition之后都会对当前值做一次相应迭代运算**

`output:`<br/>
0
1
2

### deferred()序列为每一个订阅者创建一个全新的Observable
``` swift
let disposeBag = DisposeBag()
var count = 1

let deferredSequence = Observable<String>.deferred {
        print("Creating \(count)")
        count += 1
        return Observable.create { observer in
            print("Emitting...")
            observer.onNext("🐶")
            observer.onNext("🐱")
            observer.onNext("🐵")
            return NopDisposable.instance
        }
    }

deferredSequence
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)

deferredSequence
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
> 注：deferred序列只有在一个观察者订阅它的时候才执行它的创建Observable方法，产生一个全新的Observable**

`output:`
Creating 1
Emitting...
🐶
🐱
🐵
Creating 2
Emitting...
🐶
🐱
🐵
<img src='./deferred.png' width=400>
<br/>

### error()创建一个不发送元素的Observable，然后立即发送error并终止
``` swift
let disposeBag = DisposeBag()

Observable<Int>.error(Error.Test)
        .subscribe { print($0) }
        .addDisposableTo(disposeBag)
```
`output:`
Error(Test)

### doOn()在发送元素消息前对每一个元素做指定的操作，然后返回操作前的元素消息
``` swift
let disposeBag = DisposeBag()

Observable.of("🍎", "🍐", "🍊", "🍋")
        .doOn { print("Intercepted:", $0) }
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)
```
> 注： doOn(onNext:onError:onCompleted:)为不同订阅方式分别指定

`output:`
Intercepted: Next(🍎)
🍎
Intercepted: Next(🍐)
🍐
Intercepted: Next(🍊)
🍊
Intercepted: Next(🍋)
🍋
Intercepted: Completed

<img src='./doOn.png' width=400>
<br/>

### toObservable()通过Array,Dictionary,或Set等SequenceType创建一个Observable
<br/>
## Subjects的使用

Subjects理解为observer和Observable之间的桥梁或代理，即扮演着observer又扮演着Observable，规定了添加的observer如何接收消息

### PublishSubject向所有订阅者广播从订阅之后的事件
``` swift
let disposeBag = DisposeBag()
let subject = PublishSubject<String>()

subject.addObserver("1").addDisposableTo(disposeBag)
subject.onNext("🐶")
subject.onNext("🐱")

subject.addObserver("2").addDisposableTo(disposeBag)
subject.onNext("🅰️")
subject.onNext("🅱️")
```
`output:`
Subscription: 1 Event: Next(🐶)
Subscription: 1 Event: Next(🐱)
Subscription: 1 Event: Next(🅰️)
Subscription: 2 Event: Next(🅰️)
Subscription: 1 Event: Next(🅱️)
Subscription: 2 Event: Next(🅱️)

### ReplaySubject有一个缓存机制，可以在创建时通过指定bufferSize指定缓存大小或调用buffer方法指定更详细的缓存条件来指定新添加的订阅者可以接收多少订阅前的消息
``` swift
 let disposeBag = DisposeBag()
 let subject = ReplaySubject<String>.create(bufferSize: 1)

 subject.addObserver("1").addDisposableTo(disposeBag)
 subject.onNext("🐶")
 subject.onNext("🐱")

 subject.addObserver("2").addDisposableTo(disposeBag)
 subject.onNext("🅰️")
 subject.onNext("🅱️")
```
`output:`
Subscription: 1 Event: Next(🐶)
Subscription: 1 Event: Next(🐱)
Subscription: 2 Event: Next(🐱)
Subscription: 1 Event: Next(🅰️)
Subscription: 2 Event: Next(🅰️)
Subscription: 1 Event: Next(🅱️)
Subscription: 2 Event: Next(🅱️)

### BehaviorSubject向新的订阅者发送一条最近的事件，如果没有事件则发送一条默认的消息
``` swift
let disposeBag = DisposeBag()
let subject = BehaviorSubject(value: "🔴")

subject.addObserver("1").addDisposableTo(disposeBag)
subject.onNext("🐶")
subject.onNext("🐱")

subject.addObserver("2").addDisposableTo(disposeBag)
subject.onNext("🅰️")
subject.onNext("🅱️")

subject.addObserver("3").addDisposableTo(disposeBag)
subject.onNext("🍐")
subject.onNext("🍊")
```
**note：以上都不会自动发送Completed当它们被释放的时候**

`output:`
Subscription: 1 Event: Next(🔴)
Subscription: 1 Event: Next(🐶)
Subscription: 1 Event: Next(🐱)
Subscription: 2 Event: Next(🐱)
Subscription: 1 Event: Next(🅰️)
Subscription: 2 Event: Next(🅰️)
Subscription: 1 Event: Next(🅱️)
Subscription: 2 Event: Next(🅱️)
Subscription: 3 Event: Next(🅱️)
Subscription: 1 Event: Next(🍐)
Subscription: 2 Event: Next(🍐)
Subscription: 3 Event: Next(🍐)
Subscription: 1 Event: Next(🍊)
Subscription: 2 Event: Next(🍊)
Subscription: 3 Event: Next(🍊)

### Variable与BehaviorSubject的区别是在完成的时候它会自动发送一条Completed消息和调用deist
``` swift
  let disposeBag = DisposeBag()
  let variable = Variable("🔴")

  variable.asObservable().addObserver("1").addDisposableTo(disposeBag)
  variable.value = "🐶"
  variable.value = "🐱"

  variable.asObservable().addObserver("2").addDisposableTo(disposeBag)
  variable.value = "🅰️"
  variable.value = "🅱️"
```
> 注:variable.asObservable()实际是获取variable中的BehaviorSubject。variable也没有onNext，而是通过value来获取或添加元素，它会添加元素到BehaviorSubject

`output:`
Subscription: 1 Event: Next(🔴)
Subscription: 1 Event: Next(🐶)
Subscription: 1 Event: Next(🐱)
Subscription: 2 Event: Next(🐱)
Subscription: 1 Event: Next(🅰️)
Subscription: 2 Event: Next(🅰️)
Subscription: 1 Event: Next(🅱️)
Subscription: 2 Event: Next(🅱️)
Subscription: 1 Event: Completed
Subscription: 2 Event: Completed

## Combination：Observable的混合操作

### startWith()分为原Observable和新Observable，并且在发送原Observable元素前会先发送完新Observable元素，有点像栈
``` swift
   let disposeBag = DisposeBag()

    Observable.of("🐶", "🐱", "🐭", "🐹")
        .startWith("1️⃣")
        .startWith("2️⃣")
        .startWith("3️⃣", "🅰️", "🅱️")
        .subscribeNext { print($0) }
        .addDisposableTo(disposeBag)
```
`output:`
3️⃣
🅰️
🅱️
2️⃣
1️⃣
🐶
🐱
🐭
🐹
<http://reactivex.io/documentation/operators/startwith.html>


### merge()按顺序混合多个Observable为一个新Observable
``` swift
let disposeBag = DisposeBag()

let subject1 = PublishSubject<String>()
let subject2 = PublishSubject<String>()
let subject3 = PublishSubject<String>()

Observable.of(subject1, subject2, subject3)
    .merge()
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)

subject1.onNext("🅰️")

subject1.onNext("🅱️")

subject2.onNext("①")

subject2.onNext("②")

subject1.onNext("🆎")

subject3.onNext("🐱")

subject2.onNext("③")
```
`output:`
🅰️
🅱️
①
②
🆎
③
<http://reactivex.io/documentation/operators/merge.html>


### zip()相当于并排的将多个Observable合并成一个新Observable
``` swift
let disposeBag = DisposeBag()

let stringSubject = PublishSubject<String>()
let intSubject = PublishSubject<Int>()

Observable.zip(stringSubject, intSubject) { stringElement, intElement in
    "\(stringElement) \(intElement)"
    }
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)

stringSubject.onNext("🅰️")
stringSubject.onNext("🅱️")

intSubject.onNext(1)

intSubject.onNext(2)

stringSubject.onNext("🆎")
intSubject.onNext(3)
```
`output:`
🅰️ 1
🅱️ 2
🆎 3

<http://reactivex.io/documentation/operators/zip.html>
</br>
### combineLatest()总是将某个Observable发出的最新元素与其他Observable的最后发出的元素混合
``` swift
let disposeBag = DisposeBag()

let stringSubject = PublishSubject<String>()
let intSubject = PublishSubject<Int>()

Observable.combineLatest(stringSubject, intSubject) { stringElement, intElement in
        "\(stringElement) \(intElement)"
    }
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)

stringSubject.onNext("🅰️")

stringSubject.onNext("🅱️")
intSubject.onNext(1)

intSubject.onNext(2)

stringSubject.onNext("🆎")
```
`output:`
🅱️ 1
🅱️ 2
🆎 2
<http://reactivex.io/documentation/operators/combinelatest.html>

在数组上的应用：

``` swift
let disposeBag = DisposeBag()

let stringObservable = Observable.just("❤️")
let fruitObservable = ["🍎", "🍐", "🍊"].toObservable()
let animalObservable = Observable.of("🐶", "🐱", "🐭", "🐹")

[stringObservable, fruitObservable, animalObservable].combineLatest {
        "\($0[0]) \($0[1]) \($0[2])"
    }
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
**note：所有集合的类型必须一样**

`output:`
❤️ 🍊 🐶
❤️ 🍊 🐱
❤️ 🍊 🐭
❤️ 🍊 🐹

### switchLatest()可以将多个Observable序列合并成一个一维的Observable序列，只合并当前关注的Observable序列最近的消息
``` swift
let disposeBag = DisposeBag()

let subject1 = BehaviorSubject(value: "⚽️")
let subject2 = BehaviorSubject(value: "🍎")

let variable = Variable(subject1)

variable.asObservable()
    .switchLatest()
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)

subject1.onNext("🏈")
subject1.onNext("🏀")

variable.value = subject2

subject1.onNext("⚾️")
subject1.onNext("🎾")

subject2.onNext("🍐")

variable.value = subject1
```
`output:`
⚽️
🏈
🏀
🍎
🍐
🎾
**note：⚽️ 被忽略**
<br/>
<img src='./switch.png' width=400>
<br/>

## Transforming：Observable的转换操作 

### map()将闭包操作应用到一个被观察序列的所有元素上，然后返回一个新的被观察序列
``` swift
let disposeBag = DisposeBag()
Observable.of(1, 2, 3)
    .map { $0 * $0 }
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
1
4
9
<http://reactivex.io/documentation/operators/map.html>


### scan()可以迭代的操作，并且可以设置一个初始的迭代值
``` swift
let disposeBag = DisposeBag()

Observable.of(10, 100, 1000)
    .scan(1) { aggregateValue, newValue in
        aggregateValue + newValue
    }
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
11
111
1111
<http://reactivex.io/documentation/operators/scan.html>

## Filtering：Observable消息元素的过滤操作

### filter()发出满足bool条件的元素
``` swift
let disposeBag = DisposeBag()

Observable.of(
    "🐱", "🐰", "🐶",
    "🐸", "🐱", "🐰",
    "🐹", "🐸", "🐱")
    .filter {
        $0 == "🐱"
    }
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
🐱
🐱
🐱
<http://reactivex.io/documentation/operators/filter.html>

### distinctUntilChanged()过滤掉连续的相同元素
``` swift
let disposeBag = DisposeBag()

Observable.of("🐱", "🐷", "🐱", "🐱", "🐱", "🐵", "🐱")
    .distinctUntilChanged()
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
🐱
🐷
🐱
🐵
🐱
<http://reactivex.io/documentation/operators/distinct.html>

### elementAt()只发送指定下标的元素
``` swift
let disposeBag = DisposeBag()

Observable.of("🐱", "🐰", "🐶", "🐸", "🐷", "🐵")
    .elementAt(3)
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
🐸
<http://reactivex.io/documentation/operators/elementat.html>

### single()不传参数则发送Observable的第一个元素，否则为满足条件表达式的第一个元素，如果没有发送一个确切的元素，将发送一个 Error消息
``` swift
let disposeBag = DisposeBag()

Observable.of("🐱", "🐰", "🐶", "🐸", "🐷", "🐵")
    .single{ $0 <= 6}//如果是==这种确切的判断，将没有Error消息而是Completed消息
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
Next(1)
Error(Sequence contains more than one element.)

### take()仅发送从第一个元素开始指定个数的元素
``` swift
let disposeBag = DisposeBag()

Observable.of("🐱", "🐰", "🐶", "🐸", "🐷", "🐵")
    .take(3)
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
🐱
🐰
🐶
<http://reactivex.io/documentation/operators/take.html>

### takeLast()与take不同的是takeLast是从末尾开始
``` swift
let disposeBag = DisposeBag()

Observable.of("🐱", "🐰", "🐶", "🐸", "🐷", "🐵")
    .takeLast(3)
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
🐸
🐷
🐵
<http://reactivex.io/documentation/operators/takelast.html>

### takeWhile()发送从头开始的满足条件的元素
``` swift
let disposeBag = DisposeBag()

Observable.of(1, 2, 3, 4, 5, 6)
    .takeWhile { $0 < 4 }
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
1
2
3
<img src='./takeWhile.png' width=400>
<br/>

### takeUntil：在与之关联的另一Observable发送元素前发送元素
``` swift
let disposeBag = DisposeBag()

let sourceSequence = PublishSubject<String>()
let referenceSequence = PublishSubject<String>()

sourceSequence
    .takeUntil(referenceSequence)
    .subscribe { print($0) }
    .addDisposableTo(disposeBag)

sourceSequence.onNext("🐱")
sourceSequence.onNext("🐰")
sourceSequence.onNext("🐶")

referenceSequence.onNext("🔴")

sourceSequence.onNext("🐸")
sourceSequence.onNext("🐷")
sourceSequence.onNext("🐵")
```
`output:`
Next(🐱)
Next(🐰)
Next(🐶)
Completed<br/>
<http://reactivex.io/documentation/operators/takeuntil.html>

### skip()与take相反，它是不发送
``` swift
let disposeBag = DisposeBag()

Observable.of("🐱", "🐰", "🐶", "🐸", "🐷", "🐵")
    .skip(2)
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
🐶
🐸
🐷
🐵
<http://reactivex.io/documentation/operators/skip.html>

### skipWhile()与takeWhile相反，它是不发送
``` swift
let disposeBag = DisposeBag()

Observable.of(1, 2, 3, 4, 5, 6)
    .skipWhile { $0 < 4 }
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
4
5
6
<br/>
<img src='./skipWhile.png' width=400>
<br/>

### skipWhileWithIndex()只是skipWhile基础上增加了一个下标index
``` swift
let disposeBag = DisposeBag()

Observable.of("🐱", "🐰", "🐶", "🐸", "🐷", "🐵")
    .skipWhileWithIndex { element, index in
        index < 3
    }
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
🐸
🐷
🐵

### skipUntil()与takeUntil相反，它是之后发送
``` swift
let disposeBag = DisposeBag()

let sourceSequence = PublishSubject<String>()
let referenceSequence = PublishSubject<String>()

sourceSequence
    .skipUntil(referenceSequence)
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)

sourceSequence.onNext("🐱")
sourceSequence.onNext("🐰")
sourceSequence.onNext("🐶")

referenceSequence.onNext("🔴")

sourceSequence.onNext("🐸")
sourceSequence.onNext("🐷")
sourceSequence.onNext("🐵")
```
`output:`
🐸
🐷
🐵
<http://reactivex.io/documentation/operators/skipuntil.html>

## 对Observable元素做运算操作

### toArray()将Observable序列转换成array并发送，然后终止
``` swift
let disposeBag = DisposeBag()

Observable.range(start: 1, count: 10)
    .toArray()
    .subscribe { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
Next([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
Completed
<br/>
<img src='./toArray.png' width=400>
<br/>

### reduce()迭代运算，通过指定初始迭代值和运算符
``` swift
let disposeBag = DisposeBag()

Observable.of(10, 100, 1000)
    .reduce(1, accumulator: +)
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`=
1111
<http://reactivex.io/documentation/operators/reduce.html>

### concat()将一个Observable序列的内部Observable序列串联起来，且同一时间只操作一个序列，只有当前序列Completed后，才开始串联下一个序列的前一个元素及之后的元素
``` swift
let disposeBag = DisposeBag()

let subject1 = BehaviorSubject(value: "🍎")
let subject2 = BehaviorSubject(value: "🐶")

let variable = Variable(subject1)

variable.asObservable()
    .concat()
    .subscribe { print($0) }
    .addDisposableTo(disposeBag)

subject1.onNext("🍐")
subject1.onNext("🍊")

variable.value = subject2

subject2.onNext("I would be ignored")
subject2.onNext("🐱")

subject1.onNext("🍹")
subject1.onCompleted()

subject2.onNext("🐭")
```
`output:`
Next(🍎)
Next(🍐)
Next(🍊)
Next(🍹)
Next(🐱)
Next(🐭)
<http://reactivex.io/documentation/operators/concat.html>

## Connectable操作

Connectable操作，Connectable Observable操作跟普通的Observable区别在于，Connectable Observable只有在它们的connect()方法调用后才开始发送元素，因此可以等到所有订阅者都订阅后才开始发送元素，有点像事务一样

### publish()将一个普通序列转换成Connectable Observable序列
``` swift
printExampleHeader(#function)

let intSequence = Observable<Int>.interval(1, scheduler: MainScheduler.instance)
    .publish()

_ = intSequence
    .subscribeNext { print("Subscription 1:, Event: \($0)") }

delay(2) { intSequence.connect() }

delay(4) {
    _ = intSequence
        .subscribeNext { print("Subscription 2:, Event: \($0)") }

}

delay(6) {
    _ = intSequence
        .subscribeNext { print("Subscription 3:, Event: \($0)") }
```
`output:`

delay 2

Subscription 1:, Event: 0
Subscription 1:, Event: 1
Subscription 2:, Event: 1
Subscription 1:, Event: 2
Subscription 2:, Event: 2
Subscription 1:, Event: 3
Subscription 2:, Event: 3
Subscription 3:, Event: 3
Subscription 1:, Event: 4
Subscription 2:, Event: 4
Subscription 3:, Event: 4
<br/>
<img src='./publish.png' width=400>
<br/>

### replay()相对于publish增加了bufferSize指定对元素的缓存大小，这样新加入的订阅者可以获取相应个数的已发送的元素
``` swift
printExampleHeader(#function)

let intSequence = Observable<Int>.interval(1, scheduler: MainScheduler.instance)
    .replay(5)

_ = intSequence
    .subscribeNext { print("Subscription 1:, Event: \($0)") }

delay(2) { intSequence.connect() }

delay(4) {
    _ = intSequence
        .subscribeNext { print("Subscription 2:, Event: \($0)") }
}

delay(8) {
    _ = intSequence
        .subscribeNext { print("Subscription 3:, Event: \($0)") }
}
```
`output:`

delay 2

Subscription 1:, Event: 0
Subscription 2:, Event: 0
Subscription 1:, Event: 1
Subscription 2:, Event: 1
Subscription 1:, Event: 2
Subscription 2:, Event: 2
Subscription 1:, Event: 3
Subscription 2:, Event: 3
Subscription 1:, Event: 4
Subscription 2:, Event: 4
Subscription 3:, Event: 0
Subscription 3:, Event: 1
Subscription 3:, Event: 2
Subscription 3:, Event: 3
Subscription 3:, Event: 4
Subscription 1:, Event: 5
Subscription 2:, Event: 5
Subscription 3:, Event: 5
<br/>
<img src='./replay.png' width=400>
<br/>

### multicast()需要传入一个subject，通过subject来管理向订阅者发送消息
``` swift
printExampleHeader(#function)

let subject = PublishSubject<Int>()

_ = subject
    .subscribeNext { print("Subject: \($0)") }

let intSequence = Observable<Int>.interval(1, scheduler: MainScheduler.instance)
    .multicast(subject)

_ = intSequence
    .subscribeNext { print("\tSubscription 1:, Event: \($0)") }

delay(2) { intSequence.connect() }

delay(4) {
     _ = intSequence
        .subscribeNext { print("\tSubscription 2:, Event: \($0)") }
}

delay(6) {
     _ = intSequence
        .subscribeNext { print("\tSubscription 3:, Event: \($0)") }
}
```
`output:`

delay 2

Subject: 0
Subscription 1:, Event: 0
 Subject: 1
Subscription 1:, Event: 1
Subscription 2:, Event: 1
 Subject: 2
Subscription 1:, Event: 2
Subscription 2:, Event: 2
 Subject: 3
Subscription 1:, Event: 3
Subscription 2:, Event: 3
Subscription 3:, Event: 3
 Subject: 4
Subscription 1:, Event: 4
Subscription 2:, Event: 4
Subscription 3:, Event: 4
 Subject: 5
Subscription 1:, Event: 5
Subscription 2:, Event: 5
Subscription 3:, Event: 5

## 错误处理

### catchErrorJustReturn()通过返回一个只发送一个元素的Observable序列来捕获错误信息，然后 Completed
``` swift
let disposeBag = DisposeBag()

let sequenceThatFails = PublishSubject<String>()

sequenceThatFails
    .catchErrorJustReturn("😊")
    .subscribe { print($0) }
    .addDisposableTo(disposeBag)

sequenceThatFails.onNext("😬")
sequenceThatFails.onNext("😨")
sequenceThatFails.onNext("😡")
sequenceThatFails.onNext("🔴")
sequenceThatFails.onError(Error.Test)
```
`output:`
Next(😬)
Next(😨)
Next(😡)
Next(🔴)
Next(😊)
Completed

### catchError()当捕获错误后会返回一个正常的Observable序列与之合并
``` swift
let disposeBag = DisposeBag()

let sequenceThatErrors = PublishSubject<String>()
let recoverySequence = PublishSubject<String>()

sequenceThatErrors
    .catchError {
        print("Error:", $0)
        return recoverySequence
    }
    .subscribe { print($0) }
    .addDisposableTo(disposeBag)

sequenceThatErrors.onNext("😬")
sequenceThatErrors.onNext("😨")
sequenceThatErrors.onNext("😡")
sequenceThatErrors.onNext("🔴")
sequenceThatErrors.onError(Error.Test)

recoverySequence.onNext("😊")
```
`output:`
Next(😬)
Next(😨)
Next(😡)
Next(🔴)
Error: Test
Next(😊)
<br/>
<img src='./catch.png' width=400>
<br/>

### retry()当遇到error后发送一条error消息然后重新重头发送元素，通过传入一个整数可以指定重复次数
``` swift
let disposeBag = DisposeBag()
    var count = 1

let sequenceThatErrors = Observable<String>.create { observer in
    observer.onNext("🍎")
    observer.onNext("🍐")
    observer.onNext("🍊")

    if count == 1 {
        observer.onError(Error.Test)
        print("Error encountered")
        count += 1
    }

    observer.onNext("🐶")
    observer.onNext("🐱")
    observer.onNext("🐭")
    observer.onCompleted()

    return NopDisposable.instance
}

sequenceThatErrors
    .retry()
    .subscribeNext { print($0) }
    .addDisposableTo(disposeBag)
```
`output:`
🍎
🍐
🍊
Error encountered
🍎
🍐
🍊
🐶
🐱
🐭
<br/>
<img src='./retry.png' width=400>
<br/>

## debug

1. debug()会打印详细的信息
2. RxSwift.resourceCount()打印资源分配计数

> 注：不要在Release builds中使用