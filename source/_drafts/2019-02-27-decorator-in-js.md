---
layout:         post
title:          'JavaScript 中的装饰器模式'
excerpts:       ''
# follow:         ['/images/follow.png', '更多干货请关注公众号 <span>前端小专栏：QianDuanXiaoZhuanLan</span>']
---

文章目录：

- 什么是装饰器模式
- 装饰器模式在 JavaScript 中的实现
- 装饰器模式的应用
- 总结

## 什么是装饰器模式

> 是面向对象编程领域中，一种动态地往一个类中添加新的行为的设计模式。就功能而言，修饰模式相比生成子类更为灵活，这样可以给某个对象而不是整个类添加一些功能。 —— wikipedia

## 装饰器模式在 JavaScript 中的实现

JavaScript 中的装饰器其实就是一个函数，它可以接受 3 个参数：

- `target`: 目标装饰对象
    - 装饰在 `class` 上的话，`target` 指向这个 `class`
    - 装饰在 `class` 的属性上的话，`target` 指向这个 `class` 的属性
    - 装饰在 `class` 的方法上的话，`target` 指向这个 `class` 的方法
    - **装饰器不能直接装饰在一个函数上**
- `name`:
    - `name` 指向 `class` 的方法名或属性名
    - `class` 的装饰器没有 `name`
- `descriptor`:
    - 

```js
Object.defineProperty(object, 'key', {
    get() {},
    set() {},
    value: 'static',
    writable: false,
    enumerable: false,
    configurable: false,
});
```

### 一个简单的装饰器

实现一个让某个属性 **只读** 的装饰器：

```js
function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
}
```

可以发现 `readonly` 装饰器做了一件非常简单的事情，就是把描述符的 `writable` 设置为 `false` 并返回这个描述符，那么如何使用这个装饰器呢：

```js
class SuperMan {
    @readonly
    fly() {
        console.log(`superman can fly.`);
    }
}

const superMan = new SuperMan();
superMan.fly(); // superman can fly.

superMan.fly = () => {
    console.log(`superman can't fly.`);
}
// TypeError: Cannot assign to read only property 'fly' of [object Object]
```

给超人会飞的能力加上 `readonly` 之后，就没有人能剥夺他会飞的能力了。