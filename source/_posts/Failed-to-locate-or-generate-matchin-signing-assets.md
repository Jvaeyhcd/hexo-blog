---
title: Failed to locate or generate matchin signing assets
date: 2016-04-18 16:58:38
tags:
---

## 发现问题

刚开始还是好好的，突然就出现了标题的提示错误，首先签名是正确的，App ID也没有被占用的，但是在导出ipa的时候一直出现“Failed to locate or generate matchin signing assets”的提示信息。我也是醉得不行，有时能成功，有时不行，不知道苹果在搞什么鬼（不管他在搞什么，出现问题，还是不要一味的去抱怨，找解决办法才是真的）。

{% asset_img problem.png 问题详情%}

<!-- more -->

## 如何解决

还是Google大法好，一下就找到了解决办法。

以下是我在网上找到了解决办法的详细步骤：

* 首先创建一个文件夹，名字就叫Payload，<a style="color:#4cc190">一定要是Payload</a>（如果你不信，可以换一个名字试试）。

* 然后在Organizer中然后把 archive 出来的那个在 finder 打开。
{% asset_img export.png Organizer中显示%}

* 然后点击显示包内容。
{% asset_img show_in_finder.png 在Finder中显示%}

* 把app 和 dsym 那两个文件拷贝到 Payload文件夹中。
{% asset_img product.png product文件目录%}
{% asset_img dSYMs.png dSYMs文件目录%}

* 然后对Payload压缩
{% asset_img zip.png Payload压缩%}

* 最后将Playload.zip的后缀名改成ipa即可。

以上的方法完全可以解决无法导出ipa的问题，但是导出ipa比export出来的包要大一些。