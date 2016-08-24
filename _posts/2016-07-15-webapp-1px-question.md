---
layout: post
title: 移动端1像素边框问题解决方案
cssLink: /stylesheets/article.css
summary: 
tags: 移动前端 1像素边框
---

关于移动端1像素边框问题，先通过这两张图来对比看一下。就明白了

![image](/images/1px_1.jpg)
![image](/images/1px_2.jpg)

**解决1像素边框的方法比较多，主要有以下几种方法：**

##### 1. 通过viewport + REM的方式来兼容。
目前这种兼容方案相对比较完美，适合新项目（老项目改用REM单位成本会比较高）。[淘宝M首页](https://m.taobao.com)就是这种方案。

在devicePixelRatio = 2 时，输出viewport

```html

<meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">

```

在devicePixelRatio = 3 时，输出viewport

```html

<meta name="viewport" content="initial-scale=0.3333333333333333333, maximum-scale=0.3333333333333333333, minimum-scale=0.3333333333333333333, user-scalable=no">

```

[demo实例](/example/1px.html)

##### 2. transform: scale(0.5)

实现方式

```CSS

attr {
    height:1px;
    -webkit-transform: scaleY(0.5);
    -webkit-transform-origin:0 0;
    overflow: hidden;
}

```

优点

圆角无法实现，hack代码多，实现4条边框比较闹心

缺点

只能单独使用，如果嵌套，scale的作用也会对包含的元素产生，不想要的影响，所以此种方案配合:after和:before独立使用较多，比如画一个商品的边框四条线，容器的after和before可以画2条线，利用容器的父元素的after、before再画2条线。

```CSS

.after-scale{
    position: relative;
}
.after-scale:after{
    content:"";
    position: absolute;
    bottom:0px;
    left:0px;
    right:0px;
    border-bottom:1px solid #c8c7cc;
    -webkit-transform:scaleY(.5);
    -webkit-transform-origin:0 0;
}

```

##### 3. box-shadow

实现方式

利用css 对阴影处理的方式实现0.5px的效果

底部一条线

```CSS

attr {
    -webkit-box-shadow:0 1px 1px -1px rgba(0, 0, 0, 0.5); /*下边框*/
    -webkit-box-shadow:0 -1px 1px -1px rgba(0, 0, 0, 0.5); /*上边边框*/
}

```

优点

基本所有场景都能满足，包含圆角的button，单条，多条线，

缺点

颜色不好处理， 黑色 rgba(0,0,0,1) 最浓的情况了。有阴影出现，不好用。

##### 4. background-image

实现方式

设置1px通过css 实现的image，50%有颜色，50%透明

```CSS
.border {
      background-image:linear-gradient(180deg, red, red 50%, transparent 50%),
      linear-gradient(270deg, red, red 50%, transparent 50%),
      linear-gradient(0deg, red, red 50%, transparent 50%),
      linear-gradient(90deg, red, red 50%, transparent 50%);
      background-size: 100% 1px,1px 100% ,100% 1px, 1px 100%;
      background-repeat: no-repeat;
      background-position: top, right top,  bottom, left top;
      padding: 10px;
  }

```

优点

配合background-image,background-size,background-position 可以实现单条，多条边框。边框的颜色随意设置

缺点

如果有圆角的效果，很sorry 圆角的地方没有线框的颜色。都要写的代码也不少

##### 5. border-image

实现方式

```CSS
.border-image{
    border-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAECAYAAABP2FU6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5JREFUeNpiPnH8zH/G////MzAxAAHTyRNn/wMEGABpvQm9g9TJ1QAAAABJRU5ErkJggg==") 2 0 stretch;
    border-width: 0px 0px 1px;
}

```

优点

无

缺点

也可以通过修改图片来达到圆角的效果，但是由于图片的原因，压缩过后的图片边缘变模糊了（不放大的情况下不明显），需要引用图片或者base64，边框颜色修改起来不方便。