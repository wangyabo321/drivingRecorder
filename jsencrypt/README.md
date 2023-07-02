# jsencrypt-plus

基于 [jsencrypt](https://github.com/travist/jsencrypt) 扩展的 RSA 非对称加密算法库

## 特性

- 支持微信小程序等非浏览器环境
- 支持长度超过 128 的明文串加解密
  - encryptLong
  - decryptLong

## 目录简介

当前库基于一个 [uni-app](https://uniapp.dcloud.io/) 项目开发，这样比较方便调试。

```
- src/jsencrypt.js 开发调试用的 jsencrypt-plus 代码
- index.js 压缩后用于发布的 jsencrypt-plus 代码
```

### demo

为方便前后端协作调试，初步学习了一下其他语言的相关知识。

- Java
- PHP

按照『前端公钥加密后端私钥解密』的方案，在本地测试通过后，精简出示例代码，以供参考。

## 使用指南

### 安装

```
$ npm install jsencrypt-plus
```

### 初始化配置

``` javascript
import JSEncrypt from 'jsencrypt-plus';

var PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END PUBLIC KEY-----`;

var PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
-----END RSA PRIVATE KEY-----`;

var data = {
  service: 'api',
  path: 'register',
  version: '1.0.0',
  username: 'xiaoming',
  password: '123456',
  email: 'xiaoming@email.com',
  code: 'ABCD',
  phone: '1234567890123'
};
data = JSON.stringify(data);
```

### 公钥加密

``` javascript
var encryptContext = new JSEncrypt();
encryptContext.setPublicKey(PUBLIC_KEY);

var encryptedData = encryptContext.encryptLong(data);
console.log('加密后的结果：', encryptedData);
```

### 私钥解密

``` javascript
var decryptContext = new JSEncrypt();
decryptContext.setPrivateKey(PRIVATE_KEY);

var decryptedData = decryptContext.decryptLong(encryptedData);
console.log('解密后的结果：', decryptedData);
```

## 支持的平台

- [x] 浏览器
- [x] 微信小程序
- [ ] 支付宝小程序
- [ ] 百度小程序
- [ ] 头条小程序

没有勾选是尚未测试到的平台，欢迎各位同学进行补充。

## 预览效果

### 浏览器

执行以下命令后，即可在浏览器中体验。

```
$ npm run serve
```

### 微信小程序

方法一：

直接点击 [https://developers.weixin.qq.com/s/xWng0Pmw76kN](https://developers.weixin.qq.com/s/xWng0Pmw76kN) 打开代码片段。

方法二：

打开微信开发者工具，选择“代码片段”点击右下角的“导入”，填写该分享链接即可。
