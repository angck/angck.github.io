---
layout: post
title: Javascript 事件监听及阻止事件
cssLink: /stylesheets/article.css
summary: 整理JS常用的事件处理方法及其兼容处理
tags: javascript event
---
1 阻止事件

a.阻止冒泡事件，使其成为捕获型事件触发机制

```javascript
function stopBubble(e) {
//如果提供了事件对象，则这是一个非IE浏览器
if ( e && e.stopPropagation )
    //因此它支持W3C的stopPropagation()方法
    e.stopPropagation();
else
    //否则，我们需要使用IE的方式来取消事件冒泡
    window.event.cancelBubble = true;
}
```

b.阻止默认事件行为

```javascript
//阻止浏览器的默认行为
function stopDefault( e ) {
    //阻止默认浏览器动作(W3C)
    if ( e && e.preventDefault )
        e.preventDefault();
    //IE中阻止函数器默认动作的方式
    else
        window.event.returnValue = false;
    return false;
}
```

2.事件监听

a.传统的绑定方法:

```javascript
element.onclick = function(event)
{
    alert(event.type);
};
```
a)、传统的绑定方法，非常简单稳定，函数体内的this指向的也是指向正在处理事件的节点（如当前正在运行事件句柄的节点）。

b)、一个元素的一个事件句柄只能注册一个函数，如果重复注册，会产生覆盖；而且，传统绑定方法只会在事件冒泡中运行。

b.W3C标准绑定方法：

```javascript
var element = document.getElementById('ID');
element.addEventListener('click', function(event)
{
     alert(event.type);
}, false     //冒泡阶段执行
);
```
a)、这种绑定方法同时支持时间处理的捕获和冒泡两个阶段；同一元素的同一事件句柄可以注册多个监听函数；而且，监听函数内部this指向当前元素。

b)、但是流行的IE浏览器不支持这种注册方法。

c.IE事件句柄注册方法：

```javascript
var elem = document.getElementById('a');
elem.attachEvent('onclick' ,
    function(){
        alert(window.event.srcElement.innerHTML + ' ' + this.innerHTML + 1);
    }
);
elem.attachEvent('onclick' ,
    function(){
        alert(window.event.srcElement.innerHTML + ' ' + this.innerHTML + 2);
    }
);
```
a、这种绑定方法，可以为同一事件句柄注册多次。

b、IE的事件模型不支持事件捕获；监听函数体内的this指向的不是当前于元素，而且window.event.srcElement指向的是发生事件的节点，而不是当前节点，并且在IE的事件对象中也没有等价的DOM currentTarget属性。
