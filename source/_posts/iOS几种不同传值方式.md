---
title: iOS几种不同传值方式
date: 2016-03-17 15:17:32
tags:
  - iOS
categories: 知识汇总
abbrlink: f5934f826f15c52f
---

关于iOS的传值方式我所知道的一共有一下6种方式：
* 属性传值
* 代理传值
* block传值
* 单例传值
* 通知传值
* NSUserDefault保存数据传值

以上六种方式都可以实现iOS不同对象之间的传值，但是针对不同的情况，我们会采取不同的传值方式。

<!-- more -->

## 属性传值

属性传值一般常用在页面中，从一个页面传值到另一个页面。例如从A页面跳转到B页面，如果需要将A页面中的某个值传递到B页面中，这个时候用到最简单的传值方式就是属性传值。

下面是一个简单例子实现将AViewController中UItextFiled中的值传到BViewController中Label中。
AViewController.m中的代码如下：
``` objc
#import "AViewController.h"
#import "BViewController.h"

@interface AViewController ()

//定义输入框
@property (nonatomic, strong) UITextField *textField;

@end

@implementation AViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [self.view addSubview:self.textField];
    //定义点击跳转的按钮
    UIButton *pushBtn = [[UIButton alloc]initWithFrame:CGRectMake(20, 150, 100, 30)];
    pushBtn.titleLabel.font = [UIFont systemFontOfSize:12];
    [pushBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [pushBtn setTitle:@"push显示" forState:UIControlStateNormal];
    [pushBtn setBackgroundColor:[UIColor yellowColor]];
    [pushBtn addTarget:self action:@selector(pushAction) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:pushBtn];
}

- (void)pushAction {
    //定义跳转页面，并给B页面str赋值
    BViewController *vc = [[BViewController alloc]init];
    vc.str = self.textField.text;
    [self.navigationController pushViewController:vc animated:YES];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (UITextField *)textField {
    if (!_textField) {
        _textField = [[UITextField alloc]initWithFrame:CGRectMake(20, 100, 280, 30)];
        _textField.borderStyle = UITextBorderStyleRoundedRect;
    }
    return _textField;
}
```

BViewController.h文件中，声明被赋值的属性
``` objc
#import <UIKit/UIKit.h>

@interface BViewController : UIViewController

@property (nonatomic, copy) NSString *str;

@end
```
BViewController.m中显示AViewController传递过来的属性值
``` objc
#import "BViewController.h"

@interface BViewController ()

@end

@implementation BViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.view.backgroundColor = [UIColor whiteColor];
    
    UILabel *label = [[UILabel alloc]initWithFrame:CGRectMake(20, 100, 100, 20)];
    label.font = [UIFont systemFontOfSize:14];
    label.textColor = [UIColor blackColor];
    //显示AViewController传递过来的值
    label.text = self.str;
    [self.view addSubview:label];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
```

## 代理传值
