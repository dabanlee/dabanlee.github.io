---
layout:         post
title:          '如何用 React 做服务端渲染'
excerpts:       '服务端渲染的一些优缺点这里就不说了，相信大家都已经非常清楚地知道了，本文意在讲述如何将一个简单的浏览器端渲染的 `React SPA` 循序渐进地升级为支持服务端渲染。'
---

> Photo by [Stage 7 Photography](https://unsplash.com/@stage7photography)

服务端渲染的一些优缺点这里就不说了，相信大家都已经非常清楚地知道了，本文意在讲述如何将一个简单的浏览器端渲染的 `React SPA` 循序渐进地升级为支持服务端渲染。

## 初始化一个普通的单页应用（浏览器端渲染）

在搭建服务端渲染应用之前我们现在搭建一个基于浏览器端渲染的单页应用，该单页应用包含简单的路由功能。

```sh
mkdir react-ssr
cd react-ssr
yarn init
```

依赖安装：

```sh
yarn add react react-dom react-router-dom
```

首先创建 App 的入口文件 `src/App.jsx`：

```js
import React from 'React';
import { Switch, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Post from './pages/Post';

export default () => (
    <div>
        <Switch>
            <Route exact path="/" component={ Home } />
            <Route exact path="/post" component={ Post } />
        </Switch>
    </div>
)
```

其次创建两个页面组件 `src/pages/Home.jsx` 和 `src/pages/Post.jsx`：

```js
// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
    <div>
        <h1>Page Home.</h1>
        <Link to="/post">Link to Post</Link>
    </div>
);

// Post.jsx
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {},
        };
    }
    componentDidMount() {
        setTimeout(() => this.setState({
            post: {
                title: 'This is title.',
                content: 'This is content.',
                author: '大板栗.',
                url: 'https://github.com/justclear',
            },
        }), 2000);
    }
    render() {
        const post = this.state.post;
        return (
            <div>
                <h1>Page Post</h1>
                <Link to="/">Link to Home</Link>
                <h2>{ post.title }</h2>
                <p>By: { post.by }</p>
                <p>Link: <a href={post.url} target="_blank">{post.url}</a></p>
            </div>
        );
    }
};
```

然后创建 `webpack` 的入口文件 `src/index.jsx`：

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
    <BrowserRouter>
        <App></App>
    </BrowserRouter>
    , document.getElementById('root'));
```

`package.json`：

```json
{
    "scripts": {
        "build:client": "NODE_ENV=development webpack -w",
    },
}
```

到此，一个最简单的基于 React 带路由跳转的单页应用就完成了，下面是效果：

![React-Client-Side-Rendering](/images/posts/react-server-side-rendering/react-csr.gif)

## 加入服务端渲染功能

顾名思义，要加入服务端渲染功能，就必须要有一个服务器，为了方便起见，这里就以 `express` 框架为例（当然你也可以使用 [`koa`](https://github.com/koajs/koa), [`fastify`](https://github.com/fastify/fastify), [`restify`](https://github.com/restify/node-restify) 等等你所有熟悉的框架）：

```sh
yarn add express
```

首先创建服务端代码的入口文件 `server/index.js`：

```js
import fs from 'fs';
import path from 'path';
import express from 'express';

import React from 'react';
import { StaticRouter } from "react-router-dom";
import { renderToString } from 'react-dom/server';
import App from '../src/App';

const app = express();

app.get('/*', (req, res) => {
    const renderedString = renderToString(
        <StaticRouter>
            <App></App>
        </StaticRouter>
    );

    fs.readFile(path.resolve('index.html'), 'utf8', (error, data) => {
        if (error) {
            res.send(`<p>Server Error</p>`);
            return false;
        }

        res.send(data.replace('<div id="root"></div>', `<div id="root">${renderedString}</div>`));
    })
});

app.listen(3000);
```

其次配置打包服务端代码的 `webpack` 配置 `webpack.server.js`：

```js
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './server/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve('server/build'),
    },
    target: 'node',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/,
        }],
    },
};
```

`package.json`：

```json
{
    "scripts": {
        "build:server": "NODE_ENV=development webpack -w --config webpack.server.js",
        "start": "nodemon server/build/app.js"
      },
}
```

> 注：如果使用服务端渲染的话，文档建议需要把 `src/index.jsx` 中的 `ReactDOM.render` 换成 `ReactDOM.hydrate`，因为下个主版本 `ReactDOM.render` 将不再支持服务端渲染。

> [react-dom docs](https://reactjs.org/docs/react-dom.html): Using ReactDOM.render() to hydrate a server-rendered container is deprecated and will be removed in React 17. Use hydrate() instead.

最后 `npm start` 后会看到如下页面：

![React-Server-Side-Rendering](/images/posts/react-server-side-rendering/react-ssr-0.jpg)

咋一看和浏览器端渲染的结果一样，但是如果我们分别查看两个页面的源代码的话，就会发现区别：

![React-Client-Side-Rendering-Source](/images/posts/react-server-side-rendering/react-csr.jpg)
![React-Server-Side-Rendering-Source](/images/posts/react-server-side-rendering/react-ssr-1.jpg)

会很明显的发现第二张服务器端渲染的页面源代码中的 `<div id="root"></div>` 中多了一些代码，仔细观察的话会发现其实就是 `Home.jsx` 所渲染的代码。

至此，我们已经实现了 `React` 服务端渲染的功能了。

不过此时如果你点击页面中的 **Link to Post** 链接的话，会发现路由跳转 `/post` 后渲染的还是 `Home.jsx` 的内容，这是因为我们没有在服务端中做对应的 **路由匹配**。

## 服务端匹配路由

`react-router-dom` 路由模块提供一个 `matchPath` 方法来匹配路由。

在匹配路由之前我们先来做一件事，就是把路由抽离成 `src/routes.js`：

```js
// routes.js
import Home from './pages/Home';
import Post from './pages/Post';

export default [{
    path: '/',
    exact: true,
    component: Home
}, {
    path: '/post',
    exact: true,
    component: Post,
}];

```

然后在 `server/index.js` 中引入：

```js
// ...
import { StaticRouter, matchPath } from 'react-router-dom';
import routes from '../src/routes';
// ...

app.get('/*', (req, res) => {
    const currentRoute = routes.find(route => matchPath(req.url, route)) || {};
    // ...
    const renderedString = renderToString(
        <StaticRouter location={ req.url }>
            <App></App>
        </StaticRouter>
    );
});
```

通过数组的 `find` 方法配合 `matchPath` 方法匹配出当前路由的信息，然后在 `<StaticRouter></StaticRouter>` 组件中加上 `location` 的属性并传入当前的路由 `req.url`，此时如果重新点击页面中的 **Link to Post** 链接的话，`/post` 路由下的组件就能正常渲染了：

![React-Server-Side-Rendering-Match-Path](/images/posts/react-server-side-rendering/react-ssr-math-path.gif)

此时你可能又会发现，跟之前的浏览器端渲染相比，跳转到 `Post` 页面后，并没有获取到 `componentDidMount` 中定义的异步数据，这是因为 `componentDidMount` 生命周期函数只会在浏览器环境下才会执行，所以服务端是不会执行该函数的，所以也就无法获取到数据了，这显然不是我们想要的结果。我们期望的样子是路由跳转后能和浏览器端渲染一样，可以正常获取这些异步数据。

那我们如何在服务端中获取这些数据后再返回给浏览器呢？

## 服务端异步获取数据

新建一个 `src/helpers/fetchData.js` 辅助函数来获取数据：

```js
export default () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            title: 'This is title.',
            content: 'This is content.',
            author: '大板栗.',
            url: 'https://github.com/justclear',
        }), 2000);
    })
};
```

实现的思路是，在匹配路由的时候就判断当前路由所包含的组件是否需要加载数据，如果需要，则去加载：

```js
// ...
app.get('/*', (req, res) => {
    const currentRoute = routes.find(route => matchPath(req.url, route)) || {};
    const promise = currentRoute.fetchData ? currentRoute.fetchData() : Promise.resolve(null);

    promise.then(data => {
        // data here...
    }).catch(console.log);
});
```

这里的逻辑就是判断 `src/routes.js` 中的路由对象中 `fetchData` 这个 `key` 是否有值，如果 `fetchData` 被三目运算判断为 `true`，则认为该路由需要获取数据，所以接下来我们要给 `path` 为 `/post` 的路由对象加上 `fetchData`，表示对应的 `Post` 组件需要异步获取数据：

```js
// src/routes.js
import Home from './pages/Home';
import Post from './pages/Post';

import fetchData from './helpers/fetchData';

export default [{
    path: '/',
    exact: true,
    component: Home
}, {
    path: '/post',
    exact: true,
    component: Post,
    fetchData,
}];
```

此时当路由匹配到 `/post` 的时候，就会执行 `currentRoute.fetchData()` 这个 `promise`，获取到数据后就可以渲染 `Post` 组件了：

```js
promise.then(data => {
    const context = {
        data,
    };
    const renderedString = renderToString(
        <StaticRouter context={context} location={req.url}>
            <App></App>
        </StaticRouter>
    );

    res.send(template());

    function template() {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>React Server Side Rendering</title>
            </head>
            <body>
                <div id="root">${renderedString}</div>
                <script>window.__ROUTE_DATA__ = ${JSON.stringify(data)}</script>
                <script src="dist/app.js"></script>
            </body>
            </html>

        `;
    }
}).catch(console.log);
```

拿到数据 `data` 后应该传给 `<StaticRouter></StaticRouter>` 组件中的 `context` 属性中，这样就可以在组件自身的 `props.staticContext` 上获取到相应的数据，另外你还需要把 `JSON.stringify(data)` 赋值给 `window.__ROUTE_DATA__`，`__ROUTE_DATA__` 可以按你想要的方式命名，方便我们在组件内部通过判断 `window.__ROUTE_DATA__` 的值来采取不同的获取数据的策略。

不过此时如果你点击 **Link to Post** 的话，你可能会发现页面打不开了：

![React-Server-Side-Rendering-Error](/images/posts/react-server-side-rendering/react-ssr-error.gif)

这是因为请求 `/dist/app.js` 被当成了普通的路由了，没有被当成一个静态资源来返回有效的 `JavaScript` 代码，解决方案就是在 `server/index.js` 中加入一样代码：

```js
// ...
const app = express();
app.use(express.static('dist'));
// ...
```

然后把 `template` 函数中的 `<script src="dist/app.js"></script>` 改成 `<script src="/app.js"></script>`：

![React-Server-Side-Rendering-Success](/images/posts/react-server-side-rendering/react-ssr-success.jpg)

现在 `/app.js` 可以正确地返回了 `JavaScript` 代码了。

现在服务端已经把获取的 `data` 通过 `window.__ROUTE_DATA__ = JSON.stringify(data)` 的方式返回给浏览器端了，我们现在需要在 `Post.jsx` 组件内部来使用这个状态：

```js
// ...
export default class Post extends Component {
    constructor(props) {
        super(props);
        if (props.staticContext && props.staticContext.data) {
            this.state = {
                post: props.staticContext.data
            };
        } else {
            this.state = {
                post: {},
            };
        }
    }
    componentDidMount() {
        if (window.__ROUTE_DATA__) {
            this.setState({
                post: window.__ROUTE_DATA__,
            });
            delete window.__ROUTE_DATA__;
        } else {
            fetchData().then(data => {
                this.setState({
                    post: data,
                });
            })
        }
    }
    // ...
};
```

![React-Server-Side-Rendering-Final](/images/posts/react-server-side-rendering/react-ssr-final.gif)

你会发现当 `/post` 路由是由浏览器端打开的时候，组件会去判断 `window.__ROUTE_DATA__` 是否有值，此时会发现 `window.__ROUTE_DATA__` 为 `null`，所以会去执行 `fetchData` 来获取数据，所以你会看到进入 `/post` 后等待了 2 秒才显示数据。而直接刷新此页面的话，就无需等待，直接可看到结果。

## 总结

现在 **`React` 服务端渲染** 支持算是基本完成了，当然这还远远不够，实际项目中运用的话肯定会复杂很多，比如通过 [Webpack Dynamic Imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) 和 [react-loadable](https://github.com/jamiebuilds/react-loadable) 等工具来优化代码以及如何配合 `Redux` 来使用等等等等。

本文的目的是让一些对 **React Server Side Rendering** 技术还不太了解或者没什么概念的同学对服务端渲染有个初步的了解。

如需查看完整的项目，请移步 [Github](https://github.com/JustClear/react-ssr)。
