---
title: 关于UItableView的复用
date: 2016-04-05 09:26:44
tags:
  - iOS
  - 笔记
categories: iOS学习笔记
abbrlink: b0943f086f49644d
---

UITableView是我从开始接触iOS编程到现在最常用的一个控件，没有之一。这篇文章就先不说UITableView的基本用法了，详细有一点iOS基础的人都应该知道，这里主要想理一理UItableView的复用机制。

## 概述

为了更清楚明白的描述UItableView的复用机制，我们先假设UItableView如果没有复用机制。如果UItableVIew没有复用机制，我们要展示10000条数据的的话，那就得生成10000条UItableViewCell，这样将会占用大量的内存，并且性能大家可以想象一下（这个UItableView滑动起来一定是相当的卡顿，非常影响用户体验）。

<!-- more -->

关于UItableView的复用机制大概是这样的：假设一个UItableView要加载10000条数据，但是一个屏幕最大只能展示3条数据（这里屏幕最多能展示的数据条数是根据UItableViewCell的高度来定的）。然后当你向上滑动，想要查看更多的内容，那么肯定需要一个cell放在已经存在的内容下边。这个时候并不会重新去创建一个UItableViewCell放在下面，而是根据cellIdetifier去内存池中拿到与之对应的UItableViewCell。

## 复用方式

UItableView的复用方式有如下四种方式实现

方式一:
``` objc
UITableViewCell *cell=[tableView dequeueReusableCellWithIdentifier:cellIdentifier];  
if (!cell) {
	cell=[[UITableViewCell alloc]initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier]; 
}
```
方式二:UItableViewCell是xib写的
``` objc
XXXTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];  
if (nil == cell) {  
    cell = [[[NSBundle mainBundle]loadNibNamed:@"XXXTableViewCell" owner:self options:nil]lastObject];  
    cell.selectionStyle=UITableViewCellSelectionStyleNone;  
    [tableView registerNib:[UINib nibWithNibName:@"XXXTableViewCell" bundle:[NSBundle mainBundle]] forCellReuseIdentifier:cellIdentifier];
}
```
方式三:在xib中identifier属性必须写上cellIdentifier ,对应代码中的cellIdentifier
``` objc
XXTableViewCell *cell;  
cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];  
if (nil == cell) {  
    cell= [[[NSBundle mainBundle] loadNibNamed:@"XXTableViewCell" owner:nil options:nil] lastObject];  
}  
return cell;
```
方式四：先register cell，然后复用
``` objc
#pragma mark - 初始化控件

- (UITableView *)tableView
{
    if (!_tableView) {
        _tableView = [[UITableView alloc]initWithFrame:self.frame style:UITableViewStylePlain];
        _tableView.backgroundColor = kMainBgColor;
        _tableView.dataSource = self;
        _tableView.delegate = self;
        _tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        [_tableView registerClass:[XXXCell_iPhone class] forCellReuseIdentifier:kCellIdentifier_XXXCell];
        _tableView.tableFooterView = self.loadingFooterView;
    }
    return _tableView;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
	//复用
    XXXCell_iPhone *cell = [tableView dequeueReusableCellWithIdentifier:kCellIdentifier_XXXCell forIndexPath:indexPath];
    cell.type = self.type;
    [cell setExpressOrder:[_list safeObjectAtIndex:indexPath.row] needTopView:indexPath.row == 0];
    return cell;
}

```

##  常见问题