---
title: 在 React Native 中使用 ART 绘制波浪动画
date: 2018-12-29 09:50:30
tags:
  - React Native
categories: 技术杂谈
abbrlink: 6ddb868bf0c9539b
---

最近项目重构，使用了React Native来进行重写，在还原之前原生实现的波浪动画。之前不知道React Native中有ART这个库，本打算使用h5中的canvas来实现波浪动画，捣鼓了半天没有搞出来。后来又重新Google如何React Native来实现动画效果，找到几篇不错的文章介绍到了React Native ART库的使用。
<!--more-->
今天刚好使用React Native还原了之前项目中的波浪动画，于是趁热打铁整理下我的实现思路和大家分享下我的心路历程。

## React Native ART 究竟是什么?

> 所谓ART，是一个在React中绘制矢量图形的JS类库。这个类库抽象了一系统的通用接口，统一了SVG，canvas，VML这类矢量图形在React中的书写格式。你可以通过ART将SVG，canvas，VML的矢量图形拿到React中使用，也可以把ART反转回去。React Native ART是[react-art](https://github.com/reactjs/react-art)在React Native中的移植版，接口基本完全一致，React Native中的ART很早之前就已经开源iOS版了，后来又在0.18.0中开源了Android版本。

## 如何在React Native中使用 ART？

在安卓中使用无需配置任何东西就可使用，在iOS中ART是可选的，你需要手动导入ART.xcodeproj文件，并手动导入libART.a静态库。
iOS项目中配置ART的具体方式如下：

1. 在Xcode选中项目点击右键->Add Files to `Your Project Name`->选择添加`Project path/node_modules/react-native/Libraries/ART/ART.xcodeproj`。
2. 在`Build Phases`中的`Link Binary With Libraries`中点击+号，选择添加`libART.a`。

## 波浪实现

接下来就可以尽情使用ART了，我用ART实现了我的充电波浪动画，效果图如下：
#### iOS
<img src="https://github.com/Jvaeyhcd/react-native-art-wave/blob/master/gif/ios.gif?raw=true" width="375"/>

#### Android
<img src="https://github.com/Jvaeyhcd/react-native-art-wave/blob/master/gif/android.gif?raw=true" width="375"/>

以上效果代码，已经提交至GitHub，如有需要直接拿去。https://github.com/Jvaeyhcd/react-native-art-wave

## 如何使用

使用如下代码安装`react-native-art-hcdwave`到项目中。

``` bash
npm i react-native-art-hcdwave
```

然后再需要使用的地方，按照如下方法使用即可。

``` js
import React, {Component} from 'react';
import {
  StyleSheet, 
  View
} from 'react-native';
 
import { HcdWaveView } from './src/components/HcdWaveView'
 
export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <HcdWaveView
          surfaceWidth = {230} 
          surfaceHeigth ={230}
          powerPercent = {76}
          type="dc"
          style = {{backgroundColor:'#FF7800'}}></HcdWaveView>
        <HcdWaveView
          surfaceWidth = {230} 
          surfaceHeigth ={230}
          powerPercent = {76}
          type="ac"
          style = {{backgroundColor:'#FF7800'}}></HcdWaveView>
      </View>
    )
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18A4FD',
  }
});
```

## 参考文档

1. https://juejin.im/entry/56ce9bd31ea49300548a3d1d
2. https://blog.csdn.net/xiangzhihong8/article/details/76572405