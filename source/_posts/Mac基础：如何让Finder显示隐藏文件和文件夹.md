---
title: Mac基础：如何让Finder显示隐藏文件和文件夹
date: 2016-04-28 09:43:25
tags:
  - Mac
categories: Mac基础
abbrlink: 348ede5553fda841
---
有些人中喜欢折腾一些奇怪的东西（比如说我），使用git已经很长一段时间了，但是最近才发现在Finder中找不到.git的文件夹。原来这个东西是被隐藏了，那么现在问题来了，我要将隐藏的文件或者文件夹显示出来应该如何做呢？

## 让Finder显示隐藏文件和文件夹

* <b>第一步：</b>打开「终端」应用程序（我推荐使用[iTerm](https://www.iterm2.com/),他比Mac自带终端好用很多）。

<!-- more -->

* <b>第二步：</b>输入如下命令，如图一所示：
{% asset_img bash.png 图一%}
```bash
defaults write com.apple.finder AppleShowAllFiles -boolean true ; killall Finder
//OS X Mountain Lion 和早期版本命令如下：
defaults write com.apple.finder AppleShowAllFiles TRUE ; killall Finder
```
* <b>第三步：</b>按下「Return」键确认。
现在你将会在 Finder 窗口中看到那些隐藏的文件和文件夹了。如图二所示：
{% asset_img finder.png 图二%}


## 让Finder隐藏隐藏文件和文件夹
* 只需要一步
如果你想再次隐藏原本的隐藏文件和文件夹的话，将上述命令替换成（图三）即可。
{% asset_img show.png 图三%}
```bash
defaults write com.apple.finder AppleShowAllFiles -boolean false ; killall Finder
//OS X Mountain Lion 和早期版本命令如下：
defaults write com.apple.finder AppleShowAllFiles FALSE ; killall Finder
```

* 最后看到的效果如图四所示：
{% asset_img hidefinder.png 图四%}