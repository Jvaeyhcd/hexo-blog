---
title: iOS UIWebView简单使用
date: 2016-03-26 15:44:12
tags:
---

UIVebView可以帮你在App中创建一个网页浏览器，来加载一些网页展示页面。现在我们可能会看到很多的app中或多或多或少都有嵌入一些h5的页面，对于一些复杂的页面有h5来展示时一种不错的办法。

下面我想简单记录一下UIWebView的简单使用。

1. 创建UIWebView
``` objc
CGRect bouds = [[UIScreen manScreen]applicationFrame];  
UIWebView* webView = [[UIWebView alloc]initWithFrame:bounds]; 
```
2. 设置相关属性
``` objc
webView.scalespageToFit = YES;	    //自动对页面进行缩放以适应屏幕  
webView.detectsPhoneNumbers = YES;  //自动检测网页上的电话号码，单击可以拨打 
```

<!-- more -->

3. 显示UIWebView到UIViewController上
``` objc
[self.view addSubview:webView];
```
4. 加载内容

    加载一个完整的网页的内容
``` objc
NSURL* url = [NSURL URLWithString:@"http://www.youku.com"];//创建URL  
NSURLRequest* request = [NSURLRequest requestWithURL:url]; //创建NSURLRequest  
[webView loadRequest:request];                             //加载  
```
    加载本地网页资源
``` objc
NSURL* url = [NSURL   fileURLWithPath:filePath];          //创建URL  
NSURLRequest* request = [NSURLRequest requestWithURL:url];//创建NSURLRequest  
[webView loadRequest:request];                            //加载  
```
    加载带标签的htmlString，你可以提供一个基础URL,来指导UIWebView对象如何跟随链加载远程资源
``` objc
[self.webContentView loadHTMLString:@"<a>hahhaha</a>" baseURL:nil];//显示带标签的字符串
```
5. 导航

    UIWebView内部会管理浏览器的导航动作，通过goForward和goBack方法你可以控制前进与后退动作
``` objc
[webView goBack];          //后退
[webView goForward];       //前进
[webView reload];          //重载  
[webView stopLoading];     //取消载入内容
```
6. UIWebViewDelegate委托代理

    UIWebViewDelegate的一组代理方法在特定时间会得到通知，要使用这些方法必须先设定webView的委托
``` objc
webView.delegate = self;
```
    具体的一些委托方法有
``` objc
/**
 *  当网页视图被指示载入内容而得到通知。应当返回YES，这样会进行加载
 *  通过导航类型参数可以得到请求发起的原因，可以是以下任意值：
 *  UIWebViewNavigationTypeLinkClicked
 *  UIWebViewNavigationTypeFormSubmitted
 *  UIWebViewNavigationTypeBackForward
 *  UIWebViewNavigationTypeReload
 *  UIWebViewNavigationTypeFormResubmitted
 *  UIWebViewNavigationTypeOther
 */
-(BOOL)webView:(UIWebView*)webView 
shouldStartLoadWithRequest:(NSURLRequest*) reuqest 
navigationType:(UIWebViewNavigationType)navigationType;  

//当网页视图已经开始加载一个请求后，得到通知。
-(void)webViewDidStartLoad:(UIWebView*)webView;

//当网页视图结束加载一个请求之后，得到通知。 
-(void)webViewDidFinishLoad:(UIWebView*)webView;

//当在请求加载中发生错误时，得到通知。会提供一个NSSError对象，以标识所发生错误类型。
-(void)webView:(UIWebView*)webView  DidFailLoadWithError:(NSError*)error;  

```