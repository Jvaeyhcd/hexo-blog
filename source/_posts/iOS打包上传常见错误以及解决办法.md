---
title: iOS打包上传常见错误以及解决办法
date: 2016-10-18 16:02:20
tags:
  - iOS
categories: 技术杂谈
abbrlink: 44b8d78d98445413
---

关于打包上传至AppStore，大家都认为是最后一步了，其实到了这里往往会遇到很多的坑。对于踩过的坑我不想再踩第二篇，所以在此将我遇到的所有奇葩问题在此做一个记录，当作对自己的一个提醒，同时也分享给给位。

## ERROR ITMS-90535

* 首先这个原因导入了其他第三方导致的问题，首先找到友盟库里面的腾讯API,找到其中的info.plist文件：

{% asset_img QQ201610180.png%}
* 找到箭头所指向的一行,随后删掉 这一行 就可以了：

{% asset_img QQ201610181.png%}
<!-- more -->
## ERROR ITMS-90635
这个是由于项目中有使用到Cocoapods导入第三方的库使用bitcode造成的，此种错误我在网上找到了三种解决办法：
### 方法一

项目->targets->enable bitcode->no

pods->project->enable bitcode->no

如果以前设置过，现在不行了，pods的enable bitcode改成yes，然后再改成no，专治抽风
### 方法二
podfile文件加入以下代码：

``` bash
post_install do |installer|
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
            config.build_settings['ENABLE_BITCODE'] = 'NO'
        end
    end
end
```
### 方法三
打包上传的时候，注意界面是否有复选框“include bitcode”，改成不勾选

## ERROR ITMS-90168

关于这个错误网上给的所有解决办法都是如下的办法：
``` bash
$ cd ~/.itmstransporter  
$ rm update_check*  
$ mv softwaresupport softwaresupport.bak  
$ cd UploadTokens  
$ rm *.token
```

## ERROR ITMS-4238

出现这个错误的原因是iTunes Connect已经上传了一个相应版本号的包，然后现在上传的版本号没有修改，所以就出现了这个错误，解决办法十分简单，修改版本号，重新打包再上传就可以了。