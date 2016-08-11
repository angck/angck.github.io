---
layout: post
title: Mac alias 自定义命令并保存别名使其永久生效
cssLink: /stylesheets/article.css
summary: 日常开发中不想去敲写一些重复的命令，我们可以使用alias命令来解决这个问题
tags: Mac alias
---
日常开发中不想去敲写一些重复的命令，我们可以使用alias命令来解决这个问题

比如：

```Haskell

alias gpull='git pull'

```

这样在终端中，只需要输入gpull命令就可以执行git pull拉取代码

但是只是这样的话，会在重启之后失效，解决办法是编辑~/.bashrc文件，每行加入一个alias命令。比如：

```Haskell

alias e='emacsclient -t'                                                                                                                                                                                          
alias ec='emacsclient -c'                                                                                                                                                                                         
alias vim='emacsclient -t'

alias gpull='git pull'
alias gci='git commit -a'

```

保存文件后，运行打开~/.bash_profile在里面加入一行：

```Haskell

source ~/.bashrc

```
就ok了。
我在mac系统下测试ok的。
