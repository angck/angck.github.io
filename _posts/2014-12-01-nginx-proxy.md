---
layout: post
title: Nginx 配置反向代理
cssLink: /stylesheets/article.css
summary: Nginx 反向代理配置说明
tags: Nginx
---

进入nginx目录找到conf目录在下面添加一个反向代理文件(proxy.conf)

#####proxy.conf文件内容：
``` Nginx
upstream proxy {
        server 127.0.0.1:3000;
        #server 127.0.0.1:3001;
        keepalive 64;
}
server {
        listen 80;
        server_name www.proxy.com;
        access_log /var/log/nginx/proxy.log;
        location / {
                proxy_set_header   X-Real-IP            $remote_addr;
                proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
                proxy_set_header   Host                   $http_host;
                proxy_set_header   X-NginX-Proxy    true;
                proxy_set_header   Connection "";
                proxy_http_version 1.1;
                proxy_pass         http://proxy;
        }
}
```

对配置项的解释：

* listen，监听端口80
* server_name , 监听域名 www.proxy.com
* access_log ，nginx日志输出 /var/log/nginx/proxy.log
* proxy_pass ，反向代理转发 http://proxy;
* 通过upstream proxy 可以配置多台nodejs节点，做负载均衡。
* keepalive ，设置存活时间。如果不设置可能会产生大量的timewait。
* 重新启动nginx