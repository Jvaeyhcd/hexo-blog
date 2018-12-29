---
title: objc过滤NSString中的HTML标签
date: 2016-05-04 11:17:29
tags:
  - objc
categories: 经验积累
---

开发过程中常常会遇到这样一个情况：对于后台编辑的一些文本都是使用富文本的形式进行编辑的，我们在使用接口区请求数据的时候，请求到的数据是带HTML标签的富文本形式，但是我们前台是使用UIlabel去显示的，这个时候就需要去掉NSString的HTML标签。

## 解决办法

对于这种常用的一些方法，我们一般会创建一个NSString的Category去实现。关于去掉NSString中HTML标签的实现方法我在网上找到了两种实现方式：

### 方法一
用NSScanner扫描来处理

<!-- more -->

NSString+Jvaeyhcd.h
``` objc
#import <Foundation/Foundation.h>

@interface NSString (Jvaeyhcd)

- (NSString *)removeHTML;

@end
```

NSString+Jvaeyhcd.m
``` objc
- (NSString *)removeHTML {
    
    NSScanner *theScanner;
    NSString *text = nil;
    
    theScanner = [NSScanner scannerWithString:self];

    while ([theScanner isAtEnd] == NO) {
        // find start of tag
        [theScanner scanUpToString:@"<" intoString:NULL] ;
        // find end of tag
        [theScanner scanUpToString:@">" intoString:&text] ;
        
        // replace the found tag with a space
        
        //(you can filter multi-spaces out later if you wish)
        
        self = [self stringByReplacingOccurrencesOfString:[NSString stringWithFormat:@"%@>", text] withString:@" "];
    }
    
    return self;
}

```

### 方法二
用NSString自带的Seprated自截断方法

NSString+Jvaeyhcd.h
``` objc
#import <Foundation/Foundation.h>

@interface NSString (Jvaeyhcd)

- (NSString *)removeHTML2;

@end
```

NSString+Jvaeyhcd.m
``` objc
- (NSString *)removeHTML2 {
    NSArray *components = [self componentsSeparatedByCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]];
    NSMutableArray *componentsToKeep = [NSMutableArray array];
    
    for (int i = 0; i < [components count]; i = i + 2) {
        [componentsToKeep addObject:[components objectAtIndex:i]];
    }
    
    NSString *plainText = [componentsToKeep componentsJoinedByString:@""];
    
    return plainText;
}
```