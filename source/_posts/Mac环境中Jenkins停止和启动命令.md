---
title: Mac环境中Jenkins停止和启动命令
date: 2016-08-02 12:02:06
tags:
---

### 启动
``` bash
sudo launchctl load /Library/LaunchDaemons/org.jenkins-ci.plist
```

### 停止
``` bash
sudo launchctl unload /Library/LaunchDaemons/org.jenkins-ci.plist
```
<!-- more -->
