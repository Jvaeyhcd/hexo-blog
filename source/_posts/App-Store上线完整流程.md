---
title: App Store上线完整流程
date: 2016-03-05 17:25:33
tags:
  - App Store
categories: iOS学习笔记
---

经过一年的iOS开发，到现在一共上线了6款App到App Store。从iOS6到iOS9，每一次苹果系统的更新，App Store的上线流程都会有点相应的改变。对于上线App到App Store的这个流程现在已经是得心应手，现在利用周末这个闲暇的时间纪录一下完整的上传App到App Store的流程。

## 预先准备

在你开始将程序提交到App Store之前，您需要有一个开发者帐号、一个App ID、一个有效的证书以及一个有效的Provisioning Profiles。

<!-- more -->

### Step 1:申请开发者帐号

如果您现在已有开发者帐号，那么恭喜您，您可以直接跳过此步骤直接进入下一步骤。苹果开发者帐号分为三种：个人开发者帐号、公司帐号、企业帐号。

**个人帐号（Individual）:**
* 费用：99美元一年
* App Store上架：是
* 最大uuid支持数：100
* 协作人数：1人（开发者自己）

说明：“个人”开发者可以申请升级“公司”，可以通过拨打苹果公司客服电话（400 6701 855）来咨询和办理。

** 公司帐号（Company）: **
* 费用：99美元一年
* App Store上架：是
* 最大uuid支持数：100
* 协作人数：多人

说明：允许多个开发者进行协作开发，比个人多一些帐号管理的设置，可设置多个Apple ID，分4种管理级别的权限。申请时需要填写公司的邓白氏编码（DUNS Number）。

** 企业帐号（Enterprise）: **
* 费用：299美元一年
* App Store上架：否
* 最大uuid支持数：不限制
* 协作人数：多人

说明：需要注意的是，企业账号开发的应用不能上线App Store，适合那些不希望公开发布应用的企业。同样，申请时也需要公司的邓白氏编码（DUNS Number）。

### Step 2:App ID（应用ID）
App ID是识别不同应用程序的唯一标示符。每个app都需要一个App ID或者app标识。目前有两种类型的App标识：一个是精确的App ID（explicit App ID），一个是通配符App ID（wildcard App ID）。使用通配符的App ID可以用来构建和安装多个程序。尽管通配符App ID非常方便，但是一个精确的App ID也是需要的，尤其是当App使用iCloud 或者使用其他iOS功能的时候，比如Game Center、Push Notifications或者IAP。如果你已经申请开发者帐号，接下你需要登录https://developer.apple.com/membercenter/。
登录成功后界面如下：
{% asset_img developer_center.png Developer页面 %}
点击“Certificates,Identifiers&Profiles”进入到
{% asset_img Identifiers.png Identifiers%}
选择Identifiers，然后点击“＋”注册你自己的应用的App Id
{% asset_img create_app_id.png 创建App ID%}
以上两项设置好后，点击下一步，然后注册即可，这样一个App Id就创建好了。接下来需要设置开发证书。

### Step 3:Distribution Certificate(发布证书)
iOS应用都有一个安全证书用于验证开发者身份和签名。为了可以向App Store提交app，你需要创建一个iOS provisioning profile 。首先需要创建一个distribution certificate（发布证书），过程类似于创建一个development certificate（开发证书）。如果你已经在实体设备上测试你的App，那么你对创建development certificate就已经很熟悉了。

首先选择Certificate,然后点击“＋”

{% asset_img create_certificates_step1.png 创建Certificate证书第一步%}
{% asset_img create_certificates_step2.png 创建Certificate证书第二步%}

然后点击“下一步”来到如下界面：
{% asset_img create_certificates_step3.png 创建Certificate证书第三步%}

这里需要上传一个.certSigningRequest文件来生成相应的证书。下面简单讲一下.certSigningRequest文件的生成方法：
首先打开“钥匙串访问”，在菜单中选择“钥匙串访问”->“证书助理”->“从证书颁发机构请求证书...”。
{% asset_img create_certSigningRequest_step1.png 创建.certSigningRequest文件%}
然后填写好相应的信息，注意：选择保存到磁盘。
{% asset_img create_certSigningRequest_step2.png 填写.certSigningRequest文件信息%}
点击继续，然后会生成一个.certSigningRequest文件。
然后选择生成的.certSigningRequest文件，点击下一步即可生成相应的证书。

### Step 4:Provisioning Profile(配置文件)
一旦你创建了App ID和distribution certificate，你可以创建一个iOS provisioning profile以方便在App Store中销售你的App。Provisioning Profile主要分为开发配置文件和发布配置文件，发布配置文件中又分App Store配置文件和Ad Hoc配置文件。App Store类型的Provisioning Profile顾名思义是用于发布到App Store的配置文件。Ad Hoc的Provisioning Profile配置文件是用于发布应用内的测试包的，在应用还没有上线的时候需要发ipa给客户安装的时候需要用到，只需要获取到客户手机的UDID然后生成相应的Ad Hoc类型的Provisioning Profile文件然后打包发布即可。
同样Provisioning Profile的创建方式如下：
选择“Provisioning Profiles”，然后点击“➕”创建Provisioning Profiles文件

{% asset_img create_pp_step1.png 创建Provisioning Profiles文件%}

选择相应的Provisioning Profiles文件类型
{% asset_img create_pp_step2.png 选择Provisioning Profiles文件类型%}

选择您需要生成Provisioning Profiles文件的App ID
{% asset_img create_pp_step3.png 选择Provisioning Profiles文件的App ID%}
选择相应的证书
{% asset_img create_pp_step4.png 选择相应的证书%}
选择已注册的设备
{% asset_img create_pp_step5.png 选择已注册的设备%}
然后点击下一步即可生成Provisioning Profiles文件，点击下载，然后双击打开。

### Step 5:Build Settings(生成设置)
配置App ID、distribution certificate 和provisioning profile已经完成，是时候配置Xcode中target的build settings了。在Xcode Project  Navigator的targets列表中选择一个target，打开顶部的Build Settings选项，然后更新一下Code Signing来跟之前创建的distribution provisioning profile相匹配。最近添加的provisioning profiles有时候不会立马就在build settings的Code Signing中看到，重启一下Xcode就可以解决这个问题。
{% asset_img build_setting.png Build Setting配置%}

### Step 6:Deployment Target(部署目标)
所有配置都已配好后，就可以开始打包了生成ipa了。
{% asset_img archive.png 开始打包%}

## iTunes Connect相关配置

### Step 1:创建“我的App”

首先用你自己的开发者帐号登录到[iTunes Connect](https://itunesconnect.apple.com/)。

{% asset_img itunes_connect_step1.png iTunes Connect%}
登录成功后点击“我的App”，然后点击“＋”->“新建App”
{% asset_img itunes_connect_step2.png 在iTunes Connect上新建App%}
其中平台选择iOS，名称为你的app的名词，主要语言为你的app的主要语言，套装ID为之前创建的App ID，也就是Xcode工程中的Bundle ID。
点击下一步，创建成功后，选择你刚创建成功的应用，进行相关的设置。
{% asset_img itunes_connect_step3.png 填写相关信息%}

相关设置比较简单就不再多说。

### Step 2:打包上传到iTunes Connect

配置好了iTunes Connect的相关配置后，就可以将我们生成的ipa包上传到iTunes Connect上了。Xcode中配置完成后archive成功后Xcode会弹出如下界面：
{% asset_img upload_itunes_connect.png 上传到iTunes Connect%}
 上传到iTunes Connect有两种方法：

** 方法一 **
直接点击上图的“Upload to App Store”按钮直接上传到App Store。

** 方法二 **
先导出ipa，然后使用Application Loader上传到App Store。
点击“Export”，会弹出如下界面，选择导出的类型，这里要上传App Store，所以选择第一种。
{% asset_img archive_step_1.png 导出ipa文件%}
点击“下一步”，默认回去检查你的证书，如果没有什么问题一直下一步，最后会在桌面生成一个ipa的包。然后在Xcode中打开Application Loader。
{% asset_img application_loader_1.png Application Loader%}
用你自己的开发者帐号登录Application Loader，
{% asset_img application_loader_login.png Application Loader登录%}
登录成功后选取你刚刚生成的ipa
{% asset_img application_loader_step2.png Application Loader上传%}
然后上传提交到App Store。

### Step 3:提交给苹果审核
完成上面的步骤后，返回到iTunes Connect界面，选择你先前创建的App，在它的活动页面下可以看到所有已上传过的ipa版本。
{% asset_img itunes_connect_step4.png 上传成功后%}
选择App信息配置界面，找到“构建版本”，然后选择你刚刚上传的构建版本，然后提交审核即可
{% asset_img itunes_connect_step5.png 提交审核%}