---
title: Vue IE报错SCRIPT1006：缺少‘)’解决办法
date: 2019-02-06 17:14:26
tags:
  - Vue
categories: 技术杂谈
---

在最近的一个小项目中，客户强烈要求兼容IE浏览器，大家都知道IE是所有浏览器中最让开发者头痛的浏览器，搞了好久都没有适配成功，头都搞大了。网上搜索了很多方法都没有解决我的问题，后来结合网上的一些经验之谈通过自己的一番摸索，终于解决了这个问题。

网上关于IE报错SCRIPT1006：缺少‘)’的原因都是说IE11前浏览器不知此ES6所导致的。要想兼容IE，就需要引入ES6语法包。所以首先引入`babel-polyfill`：
``` bash
npm i babel-polyfill --save-dev
```
安装完成后，在项目的主入口文件`main.js`的首行就可以直接引用:
``` bash
import 'babel-polyfill'
```

然后在`webpack.config.js`配置文件中做修改：
``` bash
module.exports = {
  entry: {
    // app: ['./src/main.js']
    app: ['babel-polyfill', './src/main.js']
  },
}
```

大多数方法到此就结束了，但我的问题到了这里还没有结束，IE依然无法显示。通过各种尝试推测发现，引入的Vuex库应该也使用了ES6。所以需要制定下vuex，让他支持ES6。

同样还是在`webpack.config.js`文件中，添加：
``` json
{
  test: /\.js$/,
  loader: 'babel-loader',
  include: [
    resolve('src'),
    resolve('test'),
    resolve('node_modules/iview/src'),
    resolve('node_modules/vuex'),
    resolve('node_modules/webpack-dev-server/client')
  ]
},
```

到此我的问题就得到完美解决了。