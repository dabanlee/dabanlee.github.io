---
layout:         post
title:          'How To Install PHP 7.3 on CentOS 7'
excerpts:       ''
---

## Step 1: Add PHP 7.3 Remi repository

```bash
sudo yum -y install http://rpms.remirepo.net/enterprise/remi-release-7.rpm 
sudo yum -y install epel-release yum-utils
```

## Step 2: Disable repo for PHP prev version

```bash
sudo yum-config-manager --disable remi-php72
sudo yum-config-manager --enable remi-php73
```

## Step 3: Install PHP 7.3 on CentOS 7

```bash
sudo yum -y install php php-cli php-fpm php-mysqlnd php-zip php-devel php-gd php-mcrypt php-mbstring php-curl php-xml php-pear php-bcmath php-json
```

Check version installed

```bash
php -v
```
