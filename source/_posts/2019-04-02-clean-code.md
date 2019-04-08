---
layout:         post
title:          'JavaScript 代码简洁之道'
excerpts:       ''
# follow:         ['/images/follow.png', '更多干货请关注公众号 <span>前端小专栏</span>']
---

想必大家都有接手过老旧项目，它的代码风格怎么样？可能大部分同学都会无力吐槽吧。笔者认为一份代码的好坏，先不管其实现如何，至少其 **可读性** 得保证，才能算得上好代码。有些还没有意识到 **可读性代码** 所带来好处的同学，可能经常会遇到上周才写的代码，今天打开项目一看，卧槽，这个 💩 一样的代码是我写的吗？

笔者的 **代码洁癖** 有点严重，所以平时对自己写的代码也有比较高的要求，至少在 **可读性** 上算是比较能保证。下面将分享一些代码 **可读性** 和 **简洁性** 方面的一些技巧。

## 命名

相信大家比较多的吐槽就是变量的命名，以至于出现类似 [CodeIf](https://unbug.github.io/codelf) 这种辅助声明变量名的神器，所以平时在项目中如何做到好的命名呢。

> 其实大多数的变量赋值后都不会再改变（重新赋值），所以笔者会优先使用 `const` 而不是 `let`，确实无法避免需要赋值多次才用 `let`。

### 常量都应该命名

```js
// Bad
static({
    maxAge: 28800000, // what ???
});

// Good
const EIGHT_HOURS_IN_MILLISECOND = 28800000;
// or
const EIGHT_HOURS_IN_MILLISECOND = 8 * 60 * 60 * 1000;
static({
    maxAge: EIGHT_HOURS_IN_MILLISECOND,
});

// Bad
$(document).on('keydown', event => {
    // 27 是什么鬼？？？
    if(event.keyCode === 27) {
        // do something ...
    }
});

// Good
$(document).on('keydown', event => {
    const KEY_ESC = 27;
    if(event.keyCode === KEY_ESC) {
        // do something ...
    }
});
```

### 有意义的命名

```js
// Bad
const n = '大板栗';
const a = 18;

// Good
const name = '大板栗';
const age = 18;
```

### 减少命名冗余

```js
// Bad
const favoriteList = [];
const getCurrentUserData = () => {};

// Good
const favorites = [];
const getCurrentUser = () => {};
```

### 顾名思义

单看函数名就应该知道功能是什么。

```js
// Bad
function fetchAtls() {}

// Good
function fetchArticles() {}
// or
function getArticles() {}
```

## 函数

### 简化代码

利用三目运算符和 ES6+ 语法简化代码

```js
// Bad
$('.js-button').on('click', function() {
    var name = '开始';
    if ($(this).hasClass('again')) {
        name = '再玩一次';
    }
    app.track('按钮', name);
});

// Good
$('.js-button').on('click', function() {
    const again = $(this).hasClass('again');
    app.track(again ? '再玩一次' : '开始');
});

// Bad
const celebrationDayChange = isSameDay => {
    if (isSameDay) {
        $dateSelect.addClass('hide');
    } else {
        $dateSelect.removeClass('hide');
    }
};

// Good
const celebrationDayChange = isSameDay => {
    const action = isSameDay ? 'addClass' : 'removeClass';
    $dateSelect[action]('hide');
};
```

### 函数参数

函数的参数尽量简短，如有 3 个以上建议直接换成对象的方式：

```js
// Bad
function publish(title, author, except, content) {}
// 必须知道参数位置信息
publish('title', '大板栗', 'an excellent article', 'This is content.');

// Good
function publish({title, author, except, content}) {}
publish({
    title: 'title',
    author: '大板栗',
    except: 'an excellent article',
    content: 'This is content.',
});
```

### 设置对象默认属性

```js
// Bad
const options = {
    name: '大板栗',
    logo: 'Logo.png',
    theme: 'dark',
};
function createApp(options = {}) {
    options.name = options.name || 'App';
    options.logo = options.logo || 'Logo.png';
    options.theme = options.theme || 'light';
}

// Good
function createApp(options = {}) {
    options = Object.assign({
        name: 'App',
        logo: 'Logo.png',
        theme: 'light',
    }, options);
}
```

### 参数默认值

```js
// Bad
function App(name) {
    name = name || 'App';
    // ...
}

// Good
function App(name = 'App') {
    // ...
}
```

### 函数式风格

```js
// Bad
function querify(object = {}) {
    const keys = Object.keys(object);
    let result = '';
    for(let i = 0; i < keys.length; i++) {
        result += `&${keys[i]}=${object[keys[i]]}`;
    }
    result = result.slice(1);
    return result;
}

// Good
function querify(object = {}) {
    const keys = Object.keys(object);
    const result = keys.reduce((prev, current) => {
        prev += `&${current}=${object[current]}`;
        return prev;
    }, '').slice(1);
    return result;
}
```

### 避免使用 switch

```js
// Bad
function reducer(state = 0, {type}) {
    switch (type) {
        case 'INCREASE':
            return state + 1;
        case 'DECREASE':
            return state - 1;
        default:
            return state;
    }
}

// Good
function reducer(state = 0, {type}) {
    const mapping = {
        'INCREASE': state + 1,
        'DECREASE': state - 1,
    };
    const effective = Object.keys(mapping).includes(type);
    return effective ? mapping[type] : state;
}
```

### 封装 if 判断条件

下面是笔者写的 [**自动为背景图片添加宽高**](https://github.com/JustClear/postcss-background-image-auto-size) 的 PostCSS 插件中的 [代码片段](https://github.com/JustClear/postcss-background-image-auto-size/blob/master/src/index.ts#L53-L66)：

```js
// Bad
if (/background[^:]*.*url[^;]+/gi.test(ruleString)) {
    const [originURL, URL] = getImageURL(ruleString);
    // ...
}

// Good
const hasBackground = rule => /background[^:]*.*url[^;]+/gi.test(rule);
if (hasBackground(ruleString)) {
    const [originURL, URL] = getImageURL(ruleString);
    // ...
}
```

### 只做一件事

函数是最小可复用单元，所以如果一个函数做了多个事情的话，代表这个函数难以被复用，**So, just do one thing.**

```js
// Bad
function notify(users) {
    users.map(user => {
        const record = DB.find(user);
        if (record.isActive()) {
            sendMessage(user);
        }
    });
}

// Good
// judge activation only
function isActive(user) {
    const record = DB.find(user);
    return record.isActive();
}
function notify(users) {
    users.filter(isActive).forEach(sendMessage);
}
```

### 不用「否定」语法命名函数

```js
// Bad
const isNotSupport = () => {};
const canNotUpdate = () => {};

// Good
const isSupport = () => {};
const canUpdate = () => {};
```

## 使用 ES6+ 语法

### 解构

```js
// Bad
const first = items[0];
const second = items[1];
const name = me.name;
const age = me.age;

// Good
const [first, second] = items;
const { name, age } = me;

// Bad
function App(options) {
    track({
        name: options.name,
        version: options.version,
        env: options.env,
    });
}

// Good
// 解构函数参数
function App({name, version, env}) {
    track({
        name: name,
        version: version,
        env: env,
    });
}

// Best
function App({name, version, env}) {
    // 使用对象简写
    track({ name, version, env });
}
```

### 模板字符串

```js
// Bad
const greeting = name => 'Hello ' + name + '!';

// Good
const greeting = name => `Hello ${name}!`;
```

### 箭头函数

```js
// Bad
function greeting(name) {
    return `Hello ${name}!`;
}

// Good
const greeting = name => `Hello ${name}!`;
```

### 弃用回调函数

```js
// Bad
fetchCurrentUser((error, currentUser) => {
    if(error) throw Error;
    fetchArticles(currentUser.id, (error, articles) => {
        if(error) throw Error;
        // articles here...
    });
});

// Good
fetchCurrentUser
.then(currentUser => currentUser.id)
.then(fetchArticles)
.then(articles => {
    // articles here...
})
.catch(() => {
    throw Error;
});

// Best
try {
    const currentUser = await fetchCurrentUser();
    const articles = await fetchArticles(currentUser.id);
    // articles here...
} catch() {
    throw Error;
}
```

## 总结

长而具有描述性的名称，要比短而令人费解的名称好，也比描述性的长注释更好，好的代码是 **自注释** 的，不要担心变量名太长（打包工具压缩后都一样）。

代码不只是写给机器看的，也是写给人看的，所以从现在开始编写 **可读性强**、**易维护** 的代码吧。

最后友情提醒大家 **代码千万行，注释第一行。编程不规范，同事两行泪。**