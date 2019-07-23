---
layout:         post
title:          '什么是 Event Loop'
excerpts:       ''
---

大家都知道 JavaScript 是一个单线程的语言，至于为什么设计成单线程则是因为它可以对 DOM 进行操作，假设 JavaScript 是一种多线程语言的话，如果同时去修改同一个 DOM 时就可能会导致出问题了。

既然它是单线程的，那么它是如何处理一些异步 IO 事件的呢，这就要从 JavaScript 的 **Event Loop** 说起。

Event Loop 分为两种：

- 浏览器中的 Event Loop
- NodeJS 中的 Event Loop

## 浏览器中的 Event Loop

先来思考一下如下代码的输出顺序：

```js
console.log(1)

setTimeout(() => {
    console.log(2)
})

const promise = new Promise(resolve => {
    setTimeout(() => {
        console.log(3)
        resolve(4)
    })
})

promise.then(v => {
    console.log(v)
})

setTimeout(() => {
    console.log(5)
})
```

## NodeJS 中的 Event Loop
