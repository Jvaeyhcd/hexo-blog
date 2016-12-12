---
title: Swift学习笔记之函数
date: 2016-05-31 18:19:17
tags:
  - Swift
categories: Swift学习笔记
---

函数是用来完成特定任务的独立代码块，你给一个个函数起一个合适的名字，用来标识该函数做什么，并且当函数需要执行的时候，这个名字会被用于“调用”函数。

Swift统一的函数语法足够灵活，可以用来表示任何函数，包括从最简单的没有参数名字的C风格函数，到复杂带局部和外部参数名的Objective-C风格函数。参数可以提供默认值，以简化函数调用。参数也可以即当传入参数，也当传出参数。也就是说函数也是第一等公民，和常亮、变量一样。

在Swiftl中，每一个函数都有一种类型，包括函数的参数值类型和返回值类型。你可以把函数类型当做其他不同类型变量一样处理，这样就可以更简单地把函数当做别的函数参数，也可以从其他函数中返回函数。函数的定义可以卸载其他函数定义中，这样可以在嵌套函数范围内实现功能封装。

<!-- more -->

## 函数的定义与调用
当你定义一个函数时，你可以定义一个或多个有名字和类型的值，作为函数的输入（称为参数），也可以定义某种类型的值作为函数执行结束的输出（称为返回类型）。

每个函数有个函数名，用来描述函数执行的任务，要使用一个函数时，你用函数名“调用”，并传给它匹配的输入值（称作实参）。一个函数的实参必须与函数表里的顺序一致。

下面有个例子函数叫做`sayHello(_:)`,之所以叫这个名字，是因为这个函数用一个人的名字当做输入，并返回给这个人的问候语。为了完成这个任务，你定义一个输入参数，一个叫做`personName`的`String`值，和一个包含给这个人的问候语的`String`类型的返回值。

``` swift
func sayHello(personName: String) -> String {
    let greeting = "Hello, " + personName + "!"
    return greeting
}
```
所有这些信息汇总起来成为函数的定义，并以`func`作为前缀。指定函数返回类型时，用返回箭头`->`后跟返回类型的名称的方式来表示。

该定义描述了函数做什么，它期望接受什么和执行结束时它返回的结果类型是什么，这样的定义使得函数可以在别的地方以一种清晰的方式被调用：
``` swift
print(sayHello("Anna"))
// prints "Hello, Anna!"
print(sayHello("Brian"))
// prints "Hello, Brian!"
```
### 函数参数和返回值
函数参数与返回值在Swift中极为灵活，你可以定义任何类型的函数，包括从只带一个未名参数的简单函数到复杂的带有表达性参数名和不同参数选项的复杂函数。

### 无参函数
函数可以没有参数。下面这个函数就是一个无参函数，当被调用时，它返回固定的 `String` 消息：
``` swift
func sayHelloWorld() -> String {
    return "hello, world"
}
print(sayHelloWorld())
// prints "hello, world"
```
> 尽管这个函数没有参数，但是定义中在函数名后还是需要一对圆括号。当被调用时，也需要在函数名后写一对圆括号。

### 多参函数
函数可以有多种输入参数，这些参数被包含在函数的括号之中，以逗号分隔。
这个函数用一个人名和是否已经打过招呼作为输入，并返回对这个人的适当问候语:
``` swift
func sayHello(personName: String, alreadyGreeted: Bool) -> String {
    if alreadyGreeted {
        return sayHelloAgain(personName)
    } else {
        return sayHello(personName)
    }
}
print(sayHello("Tim", alreadyGreeted: true))
// prints "Hello again, Tim!"
```
### 无返回值函数
函数可以没有返回值。下面是`sayHello(_:)`函数的另一个版本，叫`sayGoodbye(_:)`，这个函数直接输出`String`值，而不是返回它：
``` swift
func sayGoodbye(personName: String) {
    print("Goodbye, \(personName)!")
}
sayGoodbye("Dave")
// prints "Goodbye, Dave!"
```
因为这个函数不需要返回值，所以这个函数的定义中没有返回箭头`->`和返回类型。
> 注：严格上来说，虽然没有返回值被定义，`sayGoodbye(_:)`函数依然返回了值。没有定义返回类型的函数会返回特殊的值，叫做`Void`。它是一个空的元组，没有任何元素，可以写成`()`。