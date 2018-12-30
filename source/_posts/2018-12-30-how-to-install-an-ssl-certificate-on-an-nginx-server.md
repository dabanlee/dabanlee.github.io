---
layout:         post
title:          '如何在 NGINX 服务器中安装 SSL 证书'
excerpts:       ''
---

2018 年 2 月 9 日 Google 宣布将于 7 月起，`Chrome` 浏览器的地址栏将把所有 `HTTP` 标示为不安全网站。

`HTTPS` 是 `HTTP` 协议的升级版本，更安全、更可靠。用户和网站之间的安全连接协议被视为减少用户风险的必要措施，否则用户可能遭受窃听、中间人攻击或数据篡改。

但是如果要升级到 `HTTPS` 的话，需要在服务器上安装 `SSL` 证书，常见的 `SSL` 证书由国际顶级 `CA` 机构授权颁发，比如 [GeoTrust](https://www.geotrust.com/)、 [Symantec](https://www.symantec.com/) 和 [GlobalSign](https://www.globalsign.com) 等等。

这些权威机构颁发的证书虽然安全稳定有保障，但却都是收费的，而且价格不菲，对于小微企业或者个人开发者来说，难以承受，所以今天介绍一个免费的解决方案 —— [Let's Encrypt](https://letsencrypt.org/)。

**Let's Encrypt** 是由 Mozilla、Cisco、Akamai、IdenTrust 等组织人员发起，目的也是为了推进网站从 `HTTP` 向 `HTTPS` 过度的进程，所以从安全可靠性上来说是没什么问题。

总的来说 **Let's Encrypt** 是一个免费、简单、自动化、安全可靠的 `HTTPS` 解决方案。接下来将介绍如何在服务器安装 `SSL` 证书。

## 安装 SSL 证书

这里将使用 **Let's Encrypt** 的客户端 [Certbot](https://certbot.eff.org/) 来自动化获取、部署和更新安全证书。

![Certbot](/images/posts/how-to-install-an-ssl-certificate-on-an-nginx-server/certbot.jpg)

这里以 `NGINX` 和 `CentOS` 为例（选择符合自己的选项），登录服务器获取 **Certbot**：

```sh
$ wget https://dl.eff.org/certbot-auto
$ chmod a+x certbot-auto
```

至此 **Certbot** 已经安装好了，**Certbot** 有一个 `NGINX` 插件，可以自动把 `SSL` 证书信息自动配置到 `NGINX` 的配置中去：

```sh
$ sudo ./path/to/certbot-auto --nginx
```

当执行这个命令的时候，**Certbot** 会先让你输入一些信息比如邮箱、同意协议、访问 `HTTP` 时是否跳转 `HTTPS` 等等，同意之后就会自动检测 `nginx.conf` 下面的配置，并把所有站点配置都列出来并让你选择哪个域名开启 `HTTPS`（输入列表编号，多个用空格分开）：

![Configure](/images/posts/how-to-install-an-ssl-certificate-on-an-nginx-server/configure.jpg)

然后到我们的 `NGINX` 配置中查看配置是否更新：

![Configure](/images/posts/how-to-install-an-ssl-certificate-on-an-nginx-server/nginx-conf.jpg)

会发现底部多了一些标有 `# managed by Certbot` 的配置信息，表明 SSL 证书已经配置好了，重启一下 `NGINX` 就可以访问 `HTTPS` 协议的域名了，基本所有内容 **Certbot** 都自动完成了，非常简单，此时已经可以打开 `HTTPS` 协议的域名了：

![Configure](/images/posts/how-to-install-an-ssl-certificate-on-an-nginx-server/https.jpg)

不过 **Let's Encrypt** 默认有效期为 90 天，所以需要长期使用的话，就要及时更新证书，不过不用担心，**Certbot** 提供了非常简单的命令 `renew` 来更新证书，并且还会提示你证书几月几号会过期（这里是 `2019-03-30`）：

```sh
$ sudo /path/to/certbot-auto renew
```

![Configure](/images/posts/how-to-install-an-ssl-certificate-on-an-nginx-server/renew.jpg)

既然是长期使用，所以当然是发布一个定时任务，`vim /etc/crontab`：

![Configure](/images/posts/how-to-install-an-ssl-certificate-on-an-nginx-server/crontab.jpg)

上面任务表示每个月的 1 号会 `renew` 一次，`renew` 后的 5 分钟会重启一次 `NGINX` 服务。

## 总结

至此，就实现了 `HTTP` 到 `HTTPS` 的升级，且自动更新 `SSL` 证书以免过期。 Emmmmm... 没了
