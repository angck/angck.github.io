---
layout: post
title: Nginx完美安装nginx-http-concat模块
cssLink: /stylesheets/article.css
summary: 
tags: Nginx
---
[Nginx_concat_module](https://github.com/alibaba/nginx-http-concat) 是淘宝开发的基于Nginx减少HTTP请求数量的扩展模块,主要是用于合并减少前端用户Request的HTTP请求的数量

首先下载nginx-http-concat源码放在/usr/local/nginx_mod目录下

```

➜  ~  mkdir /usr/local/nginx_mod;cd /usr/local/nginx_mod
➜  nginx_mod (master) ✔ git clone https://github.com/alibaba/nginx-http-concat

```

这个需要重新编译nginx，所以顺便把nginx升级了下。 下载最新版本

```

➜  ~ wget http://nginx.org/download/nginx-1.8.0.tar.gz

```

查看之前安装时配置信息,复制配置信息下面需要用到

```

➜  ~ nginx -V
nginx version: nginx/1.8.0
built by clang 6.1.0 (clang-602.0.49) (based on LLVM 3.6.0svn)
built with OpenSSL 1.0.2a 19 Mar 2015
TLS SNI support enabled
configure arguments: --prefix=/usr/local/Cellar/nginx/1.8.0 --with-http_ssl_module --with-pcre --with-ipv6 --sbin-path=/usr/local/Cellar/nginx/1.8.0/bin/nginx --with-cc-opt='-I/usr/local/Cellar/pcre/8.36/include -I/usr/local/Cellar/openssl/1.0.2a-1/include' --with-ld-opt='-L/usr/local/Cellar/pcre/8.36/lib -L/usr/local/Cellar/openssl/1.0.2a-1/lib' --conf-path=/usr/local/etc/nginx/nginx.conf --pid-path=/usr/local/var/run/nginx.pid --lock-path=/usr/local/var/run/nginx.lock --http-client-body-temp-path=/usr/local/var/run/nginx/client_body_temp --http-proxy-temp-path=/usr/local/var/run/nginx/proxy_temp --http-fastcgi-temp-path=/usr/local/var/run/nginx/fastcgi_temp --http-uwsgi-temp-path=/usr/local/var/run/nginx/uwsgi_temp --http-scgi-temp-path=/usr/local/var/run/nginx/scgi_temp --http-log-path=/usr/local/var/log/nginx/access.log --error-log-path=/usr/local/var/log/nginx/error.log --with-http_gzip_static_module
➜  ~ 

```

开始安装，在上面复制的配置中添加 --add-module=/usr/local/src/nginx-http-concat 这段

```

➜  ~ tar zxvf nginx-1.8.0.tar.gz
➜  ~ cd nginx-1.8.0
➜  nginx-1.8.0 ./configure --prefix=/usr/local/Cellar/nginx/1.8.0 --with-http_ssl_module --with-pcre --with-ipv6 --sbin-path=/usr/local/Cellar/nginx/1.8.0/bin/nginx --with-cc-opt='-I/usr/local/Cellar/pcre/8.36/include -I/usr/local/Cellar/openssl/1.0.2a-1/include' --with-ld-opt='-L/usr/local/Cellar/pcre/8.36/lib -L/usr/local/Cellar/openssl/1.0.2a-1/lib' --conf-path=/usr/local/etc/nginx/nginx.conf --pid-path=/usr/local/var/run/nginx.pid --lock-path=/usr/local/var/run/nginx.lock --http-client-body-temp-path=/usr/local/var/run/nginx/client_body_temp --http-proxy-temp-path=/usr/local/var/run/nginx/proxy_temp --http-fastcgi-temp-path=/usr/local/var/run/nginx/fastcgi_temp --http-uwsgi-temp-path=/usr/local/var/run/nginx/uwsgi_temp --http-scgi-temp-path=/usr/local/var/run/nginx/scgi_temp --http-log-path=/usr/local/var/log/nginx/access.log --error-log-path=/usr/local/var/log/nginx/error.log --with-http_gzip_static_module --add-module=/usr/local/nginx_mod
➜  nginx-1.8.0 make

```

执行到这里就好了，千万不要 make install

为了防止意外发生啊，先备份先老版本

```

➜  ~ mv /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.old

```

把刚刚编译过的文件copy过去

```

➜  nginx-1.8.0 cp -a objs/nginx /usr/local/Cellar/nginx/1.8.0/bin/nginx

# 检测一下 NGINX 是否正常

➜  nginx-1.8.0 nginx -t                          
nginx: the configuration file /usr/local/etc/nginx/nginx.conf syntax is ok
nginx: configuration file /usr/local/etc/nginx/nginx.conf test is successful

```

到这里我们安装nginx-http-concat模块已经基本完成，下面是配置http-concat

```nginx

location /js/ {
    # 打开concat 功能
    # 默认关闭
    concat on;
    # 允许concat最大的文件数（http://m114.org/test/??1.css,2.css,3.css...10.css） 默认最大设置十个文件。
    # (默认: 10)
    # concat_max_files 10;
    # 只允许相同类型的文件（例：http://m114.org/test/??m114.css,m23.js 默认情况下是不允许的）
    # 默认是开启的
    # concat_unique on;
    # 允许内容的类型
    # (default: application/x-javascript, text/css)
    # concat_types text/html;
}

```
安装好了如何使用呢？

http://localhost/js/??a.js,b.js

两个问号（??），需要合并的文件（a.js,b.js）

当访问发现400错误是需要在nginx.conf 添加

```nginx

location /js/ {
    # 打开concat 功能
    # 默认关闭
    concat on;
    # 允许concat最大的文件数（http://m114.org/test/??1.css,2.css,3.css...10.css） 默认最大设置十个文件。
    # (默认: 10)
    # concat_max_files 10;
    # 只允许相同类型的文件（例：http://m114.org/test/??m114.css,m23.js 默认情况下是不允许的）
    # 默认是开启的
    # concat_unique on;
    # 允许内容的类型
    # (default: application/x-javascript, text/css)
    concat_types application/javascript;
}

```