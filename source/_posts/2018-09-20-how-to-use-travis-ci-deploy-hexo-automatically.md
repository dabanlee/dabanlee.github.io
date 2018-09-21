---
layout:         post
title:          '如何使用 Travis CI 自动部署 hexo'
excerpts:       '使用 Travis CI 自动部署 hexo'
categories:     
---

## 生成 SSH Key

在命令行中使用 `ssh-keygen -t rsa -C "username@example.com"` 命令生成 SSH Key。

## 将 SSH Key 添加到 Github 中

执行上面命令后，会在 `~/.ssh` 目录生成两个文件，分别是 `id_rsa.pub` 和 `id_rsa`，分别对应着「公钥」和「私钥」。我们把 `id_rsa.pub` 的内容添加到 GitHub 中（https://github.com/settings/ssh），然后保存即可。

## Travis CI 配置

### 安装 Travis CI 的命令行工具

```sh
# 需要提前装好 gem
$ gem install travis
```

### 登陆 Travis CI

```sh
# 需要提前装好 gem
$ travis login --auto
```

此时输入 GitHub 账号和密码即可。

### 加密私钥并上传至 Travis CI

前面我们通过 `ssh-keygen` 分别生成了 `id_rsa.pub` 公钥和 `id_rsa` 私钥，前面我们把公钥 `id_rsa.pub` 添加到了 GitHub，现在我们则需要把私钥 `id_rsa` 加密，再上传到 Travis CI 中，下面是加密方法：

```sh
$ travis encrypt-file ~/.ssh/id_rsa --add
```

然后会在当前目录生成一个名为 `id_rsa.enc` 的加密文件。

然后 Travis CI 会自动检测当前目录中的 `git` 信息，并且添加到 `.travis.yml` 中去。所以在进行此步操作前，当前目录下要先创建 `.travis.yml` 配置文件，否则会报错。

### 配置 SSH 设置

在当前目录下新建一个文件 `ssh_config`：

```text
Host github.com
User git
StrictHostKeyChecking no
IdentityFile ~/.ssh/id_rsa
IdentitiesOnly yes
```

最后指定 `openssl` 解密后生成的位置：

```yml
- openssl aes-256-cbc -K $encrypted_26b4962af0e7_key -iv $encrypted_26b4962af0e7_iv -in id_rsa.enc -out ~/.ssh/id_rsa -d
```

### 修改目录权限

```yml
- chmod 600 ~/.ssh/id_rsa
```

### 将密钥加入系统

```yml
- ssh-add ~/.ssh/id_rsa
- cp .travis/ssh_config ~/.ssh/config
```

### 修改git信息

```yml
- git config --global user.name 'username'
- git config --global user.email username@example.com
```

### .travis.yml 配置

指定语言、版本和分支：

```yml
language: node_js
node_js:
  - '8'
branches:
  only:
    - write
```

配置好 `.travis.yml` 后，我们只需要把 `hexo` 代码推送到 `write` 分支即可，然后 Travis CI 将会把构建的结构同步到 `master` 分支。

## Hexo 配置

### 安装

```yml
install:
  - npm install hexo-cli -g
  - npm install hexo-deployer-git --save
  - npm install
```

### 执行 hexo 命令生成网页

```yml
script:
  - hexo clean
  - hexo generate
  - hexo deploy
```

## 最终配置

```yml
language: node_js
node_js:
  - '8'
branches:
  only:
    - write
cache:
  directories:
    - node_modules
before_install:
  - openssl aes-256-cbc -K $encrypted_ff761c8d00fa_key -iv $encrypted_ff761c8d00fa_iv -in id_rsa.enc -out ~/.ssh/id_rsa -d
  - chmod 600 ~/.ssh/id_rsa
  - eval $(ssh-agent)
  - ssh-add ~/.ssh/id_rsa
  - cp .travis/ssh_config ~/.ssh/config
  - git config --global user.name 'JustClear'
  - git config --global user.email 576839360@qq.com
install:
  - npm install hexo-cli -g
  - npm install hexo-deployer-git --save
  - npm install
script:
  - hexo clean
  - hexo generate
  - hexo deploy
```
