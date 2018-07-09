---
title: 修改Mysql数据库支持emoji
date: 2018-03-01 17:51:16
tags:
---

使用sql语句修改数据库字符集的方法：
语法如下：
``` bash
ALTER DATABASE 库名 CHARACTER SET 字符集名称 COLLATE 排序规则名称;
修改表:
ALTER TABLE 表名 CONVERT TO CHARACTER SET 字符集名称  COLLATE 排序规则名称; 修改一列: ALTER TABLE 表名 MODIFY 列名 字段类型 CHARACTER SET 字符集名称  COLLATE 排序规则名称;
```

示例：下面三条sql 分别将库 govlan_system , 表 bbs_comment , 表 bbs_comment 中的 content 列修改为utf8mb4 字符集, 代码如下: 
``` bash
ALTER DATABASE govlan_system character set utf8mb4 collate utf8mb4_general_ci;
use govlan_system;
alter table bbs_comment character set utf8mb4 collate utf8mb4_general_ci;
ALTER TABLE bbs_comment modify content LONGTEXT character set utf8mb4;
```