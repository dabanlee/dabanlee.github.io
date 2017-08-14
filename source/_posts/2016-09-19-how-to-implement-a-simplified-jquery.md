---
layout: 		post
title: 			如何实现一个简化版的 jQuery
excerpts: 		'对于操作 DOM 来说，jQuery 是非常方便的一个库，虽然如今随着 React, Vue 之类框架的流行，jQuery 用得越来越少了，但是其中很多思想还是非常值得我们学习的，这篇文章将介绍如何从零开始实现一个简化版 jQuery。'
categories: 	note
---

对于操作 DOM 来说，jQuery 是非常方便的一个库，虽然如今随着 React, Vue 之类框架的流行，jQuery 用得越来越少了，但是其中很多思想还是非常值得我们学习的，这篇文章将介绍如何从零开始实现一个简化版 jQuery。

在这里，我把这个库命名为 [Clus(class 的谐音)](https://github.com/JustClear/clus)，下面以 `$` 符号代替。

首先需要声明一个构造函数并做一些初始化操作：

```js
function $(selector) {
    return new $.fn.init(selector);
}

$.fn = $.prototype = {
    contructor: $,
    init,
};
```

可以看到，该构造函数返回一个 `$.fn.init` 的实例，这样做的好处就是在使用的时候不要每次都 `new` 一个构造函数就可以创建一个新的实例了，可以看出来，整个核心都在 `init` 函数上了：

```js
function init(selector) {
    let dom,
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        selectorType = $.type(selector),
        elementTypes = [1, 9, 11];

    if (!selector) {
        dom = [],
        dom.selector = selector;
    } else if (elementTypes.indexOf(selector.nodeType) !== -1 || selector === window) {
        dom = [selector],
        selector = null;
    } else if (selectorType === 'function') {
        return $(document).ready(selector);
    } else if (selectorType === 'array') {
        dom = selector;
    } else if (selectorType === 'object') {
        dom = [selector],
        selector = null;
    } else if (selectorType === 'string') {
        if (selector[0] === '<' && fragmentRE.test(selector)) {
            dom = $.parseHTML(selector),
            selector = null;
        } else {
            dom = [].slice.call(document.querySelectorAll(selector));
        }
    }

    dom = dom || [];
    $.extend(dom, $.fn);
    dom.selector = selector;

    return dom;
}
```

可以很清楚的看到，根据传入的参数类型的不同进行一些不同的操作，比如传入的是函数的话，则该函数里的操作的都是 DOM Ready 之后的操作了；再比如传入的是字符串的话，并且如果是标签的话，则会把这段标签字符串解析成 DOM Fragment，如果是普通字符串，则会调用 `document.querySelectorAll()` 方法来查找 DOM。

相信大家都能很容易的看明白上面的代码，不过有一点值得一提的是 `$.extend(dom, $.fn);` 这段代码，其含义是把实例上的所有方法都添加到 `dom` 这个数组对象中，这样做的目的就是为了可以直接链式调用某个实例的方法，比如 `$('.clus').addClass('hello')`，这个 `addClass()` 方法就是在 `$.fn` 上实现的。因此所有在 `$.fn` 实现的方法都可以通过 `$(selector).method()` 这种方式来调用了。

至于 `extend()` 方法我认为是除了 `init()` 方法以外，整个库中最核心的一个方法了，代码如下：

```js
export default function extend() {
    let options, name, clone, copy, source, copyIsArray,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }

    if (typeof target !== 'object' && $.type(target) !== 'function') {
        target = {};
    }

    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        //
        if ((options = arguments[i]) !== null) {
            // for in source object
            for (name in options) {

                source = target[name];
                copy = options[name];

                if (target == copy) {
                    continue;
                }

                // deep clone
                if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    // if copy is array
                    if (copyIsArray) {
                        copyIsArray = false;
                        // if is not array, set it to array
                        clone = source && Array.isArray(source) ? source : [];
                    } else {
                        // if copy is not a object, set it to object
                        clone = source && $.isPlainObject(source) ? source : {};
                    }

                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
}
```

可以看到，和 jQuery 的实现一毛一样，没错就是从那儿 copy 过来的当然一样。

下面以 `addClass()` 方法为例介绍如何操作 DOM 的：

```js
function addClass(cls) {
    let classes, clazz, el, cur, curValue, finalValue, j, i = 0;

    if (typeof cls === 'string' && cls) {
        classes = cls.match(rnotwhite) || [];

        while((el = this[i++])) {
            curValue = getClass(el);
            cur = (el.nodeType === 1) && ` ${curValue} `.replace(rclass, ' ');

            if (cur) {
                j = 0;

                while((clazz = classes[j++])) {
                    // to determine whether the class that to add has already existed
                    if (cur.indexOf(` ${clazz} `) == -1) {
                        cur += clazz + ' ';
                    }
                    finalValue = $.trim(cur);
                    if ( curValue !== finalValue ) {
                        el.setAttribute('class', finalValue);
                    }
                }
            }
        }
    }

    return this;
}

$.fn.addClass = addClass;
```

值得一提的就是在实例方法中，`this` 关键字可以访问到根据选择器所查询到的所有元素的集合，在这里是通过 `while` 循环来对每个元素进行操作。要实现类似 `$(selector).addClass().removeClass()` 这样的链式操作，只需要在每个实例方法中返回一个 `this` 即可。要实现其他实例方法比如 `hasClass()` 之类的也是类似的方法。

其实每个实例方法都是通过 `this` 关键字来获取查询到的元素，然后遍历这些元素来针对每个元素进行具体的操作，在举一个栗子：

```js
function append(DOMString) {
    let el, i = 0,
        fregmentCollection = $.parseHTML(DOMString),
        fregments = Array.prototype.slice.apply(fregmentCollection);

    while((el = this[i++])) {
        fregments.map(fregment => {
            el.appendChild(fregment);
        });
    }

    return this;
}

$.fn.append = append;
```

上面是 `append()` 的实现，首先先解析 DOMString 为 fregment，然后就是遍历查询到的元素（通过 `this` 关键字）并针对每个元素去进行 `appendChild()` 的操作，从而把 DOM 插入到匹配到的所有元素中。

其他实例方法也是通过类似的方式实现的，这里就不一一细说了，想更详细的查看其他方法的实现可以直接到 [Clus](https://github.com/JustClear/clus) 中查看源码。
