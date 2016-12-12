---
title: Swift学习笔记之闭包
date: 2016-06-01 09:20:16
tags:
  - Swift
  - 闭包
categories: Swift学习笔记
---

## 概述

一般来说，在学习一个新的东西前我们都需要先了解这个东西的定义。在Swift中的闭包是什么呢？
> 闭包是自包含的函数代码块，可以在代码中被传递和使用。Swift中的闭包与C和objc中的代码块(blocks)以及其它一些语言中的匿名函数比较相似。

闭包可以捕获和存储其所在上下文中任意常量和变量的引用。这就是所谓的闭合并包裹着这些常量和变量，俗称闭包。Swift 会为您管理在捕获过程中涉及到的所有内存操作。

<!-- more -->

全局和嵌套函数其实也是特殊的闭包，闭包采取如下三种形式之一：
* 全局函数是一个有名字但不会捕获任何值的闭包
* 嵌套函数是一个有名字并可以捕获其封闭函数内值的闭包
* 闭包表达式是一个利用轻量级语法	所写的可以捕获其上下文中变量或常量值的匿名闭包

Swift表达式拥有简洁的风格，并鼓励在常见场景进行语法优化，主要有如下优化方式
* 利用上下文推断判断参数和返回值类型
* 隐式返回单表达式闭包，即单表达式可以省略`return`关键字
* 参数名称缩写
* 尾随（Trailing）闭包语法

## 闭包表达式

闭包表达式是一种利用简洁语法构建内联闭包的方式，闭包表达式提供了一些语法优化，使得撰写闭包变得简单明了。下面闭包表达式的例子通过几次迭代展示了`sort`方法定义和语法优化的方式。每一次都用更简洁的方式描述了相同的功能。

### sort方法

Swift标准库提供了名为`sort`的方法，会根据您提供的用于排序的闭包函数将已知类型数组中的值进行排序。一旦排序完成，`sort`方法会返回一个与原数组大小相同，包含同类型元素且元素已正确排序的新数组。原数组并不会被`sort`方法修改。

``` Swift	
let names = ["Jay", "Vae", "Jvaeyhcd", "Tom", "Jack"]

func sortFun(s1:String, s2:String) -> Bool {
    return s1 > s2
}

var sortedNames = names.sort(sortFun)
```
该例子是对一个`String`类型的数组进行排序，因此排序闭包函数类型需为`(String,String)->Bool`。提供排序闭包函数的方式是写一个符合其类型要求的普通函数，并将其作为`sort`的参数传入。然而，这是一个相当冗长的方式，本质上只是写一个单表达式函数（`s1 > s2`）。下面例子中，利用闭包表达式可以更好地构建一个内联排序闭包。

### 闭包表达式语法

闭包表达式语法一般如下：
``` Swift
{ (parameters) -> returnType in
    statements
}
```
闭包表达式可以使用变量、常量以及`inout`类型作为参数，但是不能提供默认值。也可以在参数列表的最后使用可变参数，元组也可以作为参数和返回值。

下面例子展示了上面`sortFun(_:_:)`函数对应的闭包表达式版本的代码：
``` Swift
sortedNames = names.sort({
    (s1:String, s2:String)->Bool in
    return s1 < s2
})
```
需要注意的是内联闭包参数和返回值类型申明与`sortFun(_:_:)`类型申明相同。两种方式中，都写成了`(s1:String, s2:String)->Bool`。然而在内联表达式中，函数和返回值类型都写在大括号内，而不是大括号外。
闭包函数体部分由关键字`in`引入。该关键字表示闭包的参数和返回值类型都已定义完成，闭包函数体即将开始。由于这个闭包函数体部分如此短，以至于可以将其写成一行代码：
``` Swift
sortedNames = names.sort({(s1:String, s2:String) -> Bool in return s1 < s2})
```
该例中`sort(_:)`方法的整体调用保持不变，一对圆括号仍然包裹住了方法的整个参数。然而，参数现在变成了内联闭包。

### 根据上下文推断类型

因为排序闭包函数是作为`sort(_:)`方法参数传入的，Swift可判断其参数和返回值的类型。`sort(_:)`方法被一个字符串数组调用，此参数必须是`(String, String)->Bool`类型的函数。这意味着`(String, String)`和`Bool`类型并不是必须作为闭包表达式定义的一部分。因为所有类型都可以被正确判断，返回箭头(`->`)和围绕在周围的括号也可以被省略：

``` Swift
sortedNames = names.sort({s1, s2 in return s1 > s2})
```
实际上任何情况下，通过内联闭包表达式构造的闭包作为参数传递给函数或方法时，都可以推断出闭包的参数和返回值类型。 这意味着闭包作为函数或者方法的参数时，您几乎不需要利用完整格式构造内联闭包。

尽管如此，您仍然可以明确写出有着完整格式的闭包。如果完整格式的闭包能够提高代码的可读性，则可以采用完整格式的闭包。

### 单表达式闭包隐式返回
单行表达式闭包可以通过省略`return`关键字来隐式返回单行表达式的结果，如上面版本代码可以改写为：
``` Swift
sortedNames = names.sort({s1, s2 in s1 > s2})
```
在这个例子中，`sort(_:)`方法的参数类型明确了闭包必须返回一个`Bool`类型值。因为闭包函数体只包含了一个单一表达式（`s1 > s2`），该表达式返回`Bool`类型值，因此这里没有歧义，`return`关键字可以省略。

### 参数名称缩写
Swift自动为内联包提供了参数名称缩写功能，你可以直接通过`$0`,`$1`,`$2`来顺序调用闭包的参数，以此类推。如果您在闭包表达式中使用参数名缩写，你可以在闭包参数列表中省略对其的定义，并且对应参数名称缩写的类型会通过函数类型进行推断。`in`关键字同样也可以被省略，因此闭包表达式完全由闭包函数体构成：
``` Swift
sortedNames = names.sort({$0 > $1})
```
在这个例子中，`$0`和`$1`表示闭包中第一个和第二个`String`类型的参数。

### 运算符函数
实际上还有更简单的方式来实现上面例子中的闭包表达式。Swift中`String`类型定义了关于大于符号(`>`)的字符串实现，其作为一个函数接收两个`String`类型的参数并返回`Bool`类型的值。而这正好与`sort(_:)`方法的参数需要的函数类型相符合。因此，您可以简单地传递一个大于号，Swift 可以自动推断出您想使用大于号的字符串函数实现：
``` Swift
sortedNames = names.sort(>)
```

## 尾随闭包

如果你需要将一个很长的闭包表达式作为最后一个参数传递给函数，可以使用尾随闭包来增强函数的可读性。尾随闭包是一个书写在函数括号后的闭包表达式，函数支持将其作为最后一个参数调用：
``` Swift
func someFunctionThatTakesAClosure(closure: () -> Void) {
    // 函数体部分
}

// 以下是不使用尾随闭包进行函数调用
someFunctionThatTakesAClosure({
    // 闭包主体部分
})

// 以下是使用尾随闭包进行函数调用
someFunctionThatTakesAClosure() {
    // 闭包主体部分
}
```

所以上面`sort(_:)`方法参数字符串排序闭包可以改写为
``` Swift
sortedNumbers = numbers.sort{$0 > $1}
```
如果函数只需要闭包表达式一个参数，当使用尾随闭包时可以把`()`省略
``` Swift
sortedNumbers = numbers.sort(){$0 > $1}
```
当闭包非常长以至于不能在一行进行书写，尾随闭包变得非常有用。举个例子来说，Swifte的`Array`类型有一个`map(_:)`方法，其获取一个闭包表达式作为唯一参数。该闭包函数会为数组中的额每一个元素调用一次，并返回该元素所映射的值。具体的映射方式和返回值类型由闭包来指定。当提供给数组的闭包用于数组每个元素后，`map(_:)`方法将返回一个新的数组，数组中包含了与原数组中的元素一一对应的映射后的值。
``` Swift
let digitNames = [
    0:"Zero", 1:"One", 2:"Two", 3:"Three", 4:"Four",
    5:"Five", 6:"Six", 7:"Seven", 8:"Eight", 9:"Nine"
]

numbers = [34, 65, 89]

let strings = numbers.map {
    (number) -> String in
    
    var number = number
    var output = ""
    
    while number > 0 {
        output = digitNames[number % 10]! + output
        number /= 10
    }
    
    return output
}

print(strings)
```
上面示例代码展示了如何在`map(_:)`方法中使用尾随闭包将`Int`类型的数组`[34, 65, 89]`转换为包含对应`String`类型值的数组`["ThreeFour", "SixFive", "EightNine"]`。
`map(_:)`为数组中每一个元素调用了闭包表达式。您不需要指定闭包的输入参数`number`的类型，因为可以通过要映射的数组类型进行推断。
在该例中，局部变量`number`的值由闭包中的`numbe`r参数获得,因此可以在闭包函数体内对其进行修改，(闭包或者函数的参数总是固定的),闭包表达式指定了返回类型为`String`，以表明存储映射值的新数组类型为`String`。

闭包表达式在每次被调用的时候创建了一个叫做`output`的字符串并返回。其使用求余运算符（`number % 10`）计算最后一位数字并利用`digitNames`字典获取所映射的字符串。

> 注：字典digitNames下标后跟着一个叹号（`!`），因为字典下标返回一个可选值（optional value），表明该键不存在时会查找失败。在上例中，由于可以确定`number % 10`总是digitNames字典的有效下标，因此叹号可以用于强制解包 (force-unwrap) 存储在下标的可选类型的返回值中的`String`类型的值。

## 捕获值
闭包可以在其被定义的上下文中捕获常量或者变量。即使定义这些常量或变量的作用域已经不在，闭包仍然可以在闭包函数体内引用和修改这些值。Swift中可捕获值的最简单的形势就是嵌套函数，也就是定义在其它函数内的函数。嵌套函数可以捕获其外部函数所有的参数以及常量和变量。

举个例子：
``` Swift
func makeIncrementor(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementor() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementor
}

let incrementByOne = makeIncrementor(forIncrement: 1)
incrementByOne()//返回1
incrementByOne()//返回2

let incrementByTen = makeIncrementor(forIncrement: 10)
incrementByTen()//返回10
incrementByOne()//返回3
```
上面例子中有一个叫`makeIncrementor`的函数，它包含了一个叫`incrementor`的嵌套函数。嵌套函数`incrementor`从上下文捕获了两个值`runningTotal`和`amount`，捕获值后`makeIncrementor`将`incrementor`作为闭包返回。每次调用`incrementor`时，它会以`amount`作为增量增加`runningTotal`的值。
`makeIncrementor`函数返回类型为`() -> Int`，这意味着它返回的是一个函数，而不是一个简单类型的值。该函数在每次调用时不接受参数，只返回一个`Int`类型的值。
`makeIncrementer(forIncrement:)`又一个`Int`类型的参数，其外部参数名为`forIncrement`，内部参数名为`amount`，该参数表示每次`incrementor`被调用时`runningTotal`将要增加的量。
嵌套函数`incrementor`用来执行实际的增加操作，使`runningTotal`增加`amount`，并将其返回。
如果我们单独看`incrementor()`这个函数，会发现不同寻常
``` Swift
func incrementor() -> Int {
    runningTotal += amount
    return runningTotal
}
```
`incrementor()`并没有接受任何参数，但是在函数体内访问了`runningTotal`和`amount`，这是因为它从外围函数捕获了`runningTotal`和`amount`变量的引用。捕获引用保证了`runningTotal`和`amount`变量在调用完`makeIncrementor`或不会消失，并且保证在下一次执行`incrementer`函数时`runningTotal`依然存在。
> 注：为了优化，如果一个值是不可变的，Swift可能会改为捕获并保存一份对值的拷贝。Swift也会负责被捕获变量的所有内存管理工作。

``` Swift
let incrementByOne = makeIncrementor(forIncrement: 1)
incrementByOne()//返回1
incrementByOne()//返回2

let incrementByTen = makeIncrementor(forIncrement: 10)
incrementByTen()//返回10
incrementByOne()//返回3
incrementByTen()//返回20
```
如果您创建了另一个`incrementor`，它会有属于它自己的一个全新、独立的`runningTotal`变量的引用：
再次调用原来的`incrementByOne`会在原来的变量`runningTotal`上继续增加值，该变量和`incrementByTen`中捕获的变量没有任何联系。
> 注：如果您将闭包赋值给一个类实例的属性，并且该闭包通过访问该实例或其成员而捕获了该实例，您将创建一个在闭包和该实例间的循环强引用。Swift 使用捕获列表来打破这种循环强引用。

## 闭包是引用类型
上面的例子中，`incrementByOne`和`incrementByTen`是常量，但是这些常量指向的闭包仍然可以增加其捕获的变量值。这是因为函数和闭包都是引用类型。
无论你将函数或者闭包赋值给一个常量还是变量，实际上都是将常量或者变量的值设置为对应函数或闭包的引用。。上面的示例中，指向闭包的引用`incrementByTen`是一个常量，而非闭包内容本身。
这也意味着如果您将闭包赋值给了两个不同的常量或变量，两个值都会指向同一个闭包：
``` Swift
let alsoIncrementByTen = incrementByTen
alsoIncrementByTen()//返回30
```

## 非逃逸闭包
当一个闭包作为参数传到一个函数中，但是这个闭包在函数返回之后才被执行，我们称该闭包从函数中逃逸。当你定义接受闭包作为参数的函数时，你可以在参数名之前标注`@noescape`，用来指明这个闭包时不允许“逃逸”出这个函数的。将闭包标注`@noescape`能使编译器知道这个闭包的生命周期（闭包只能在函数体中被执行，不能脱离函数体执行，所以编译器明确知道运行时的上下文），从而可以进行一些比较激进的优化。
`Array`中提供的`sort(_:)`方法接受一个用来进行元素比较的闭包作为函数，这个参数被标注了`@noescape`，因为它确保自己在排序结束后就没用了。
``` Swift
func someFunctionWithNoescapeClosure(@noescape closure: () -> Void) {
    closure()
}
```
`someFunctionWithNoescapeClosure`定义了一个传入非逃逸闭包的函数。
一种能使闭包“逃逸”出函数的方法是，将这个闭包保存在一个函数外部定义的变量中。比如，很多启动异步操作的函数接受一个闭包参数作为completion handler。这类函数会在异步操作开始之后立即返回，但是闭包直到异步操作结束后才会被调用。在这种情况下，闭包需要“逃逸”出函数，因为闭包需要在函数返回之后被调用。例如：
``` Swift
var completionHandlers:[() -> Void] = []
func someFunctionWithEscapingClosure(completionHandler:()->Void) -> Void {
    completionHandlers.append(completionHandler)
}
```
`someFunctionWithEscapingClosure(_:)`函数接受一个闭包作为参数，该闭包被添加到一个函数外定义的数组中。如果你试图将这个参数标注为`@noescape`将会得到一个编译错误。
将闭包标注为`@noescape`使你能在闭包中隐式地引用`self`。
``` Swift
class ExClass {
    var x = 1
    func doSomething() -> Void {
        someFunctionWithEscapingClosure({self.x = 120})
        someFunctionWithEscapingClosure({self.x = 10})
        someFunctionWithNoescapeClosure({x = 20})
    }
}

let instance = ExClass()
instance.doSomething()
print(instance.x)

completionHandlers.first?()
print(instance.x)

completionHandlers.last?()
print(instance.x)
```