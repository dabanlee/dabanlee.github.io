---
layout: 		post
title: 			React 中的函数式思想
excerpts: 		"函数式编程中一个核心概念之一就是纯函数，如果一个函数满足一下几个条件，就可以认为这个函数是纯函数了："
categories: 	note
---

> 题图：[React Illustration](https://link.zhihu.com/?target=https%3A//dribbble.com/shots/2484828-React-Illustration)

## 函数式编程简要概念

函数式编程中一个核心概念之一就是纯函数，如果一个函数满足一下几个条件，就可以认为这个函数是纯函数了：

- 它是一个函数（废话）；
- 当给定相同的输入（函数的参数）的时候，总是有相同的输出（返回值）；
- 没有副作用；
- 不依赖于函数外部状态。

当一个函数满足以上条件的时候，就可以认为这个函数是纯函数了。举个栗子：

```js
// 非纯函数
let payload = 0;
function addOne(number) {
    ++payload;
    return number + payload;
}
addOne(1); // 2
addOne(1); // 3
addOne(1); // 4

// 纯函数
function addOne(number) {
    return number + 1;
}
addOne(1); // 2
addOne(1); // 2
addOne(1); // 2
```

上面两个栗子中，第一个就是典型的非纯函数，当第一次执行 `addOne(1)` 其返回的值是 `2` 没有错，但是再次执行相同函数的时候，其返回的值不再是 `2` 了，而是变成了 `3` ，对比上面列出的满足纯函数的条件，就会发现：

- `addOne()` 给定相同的输入的时候没有返回相同的输出；
- `addOne()` 会产生副作用（会改变外部状态 `payload`）；
- `addOne()` 依赖的外部状态 `payload` 。

而第二个栗子就是一个纯函数，它既不依赖外部状态也不会产生副作用，且当给定相同输入的时候，总是返回相同的输出（执行任意多次 `addOne(1)` 总是返回 `2` ）。

以上对纯函数概念的一些简单理解。

## React 核心理念

官方给出的 React 的定义是：

> A JavaScript library for building user interfaces.

即专注于构建 `View` 层的一个库。`React` 的核心开发者之一的 Sebastian Markbåge 认为：

`UI` 只是把数据通过映射关系变成另一种形式的数据。给定相同的输入（数据）必然会有相同的输出（`UI`），即一个简单的纯函数。
React 中的函数式思想的具体体现

虽说 `View` 层可以当成是数据的另外一种展现形式，但在实际的 `React` 开发中，除了数据的展示以外，更重要的是还有数据的交互，举个栗子：

```js
import React, { Component } from 'react';
import { fetchPosts } from 'path/to/api';

export default class PostList extends Component {
    constructor() {
        this.state = {
            posts: [],
        };
    }
    componentDidMount() {
        fetchPosts().then(posts => {
            this.setState({
                posts: posts,
            });
        });
    }
    render() {
        return (
            <ul>
                { this.state.posts.map(post => <li key={post.id} onClick={this.toggleActive}>{ post.title }</li>) }
            </ul>
        );
    }
    toggleActive() {
        //
    }
}
```

这个一个典型的渲染列表的栗子，在这个栗子中除了渲染 `PostList` 外，还进行了数据的获取和事件的操作，也就意味着这个 `PostList` 组件不是一个「纯函数」。严格意义上来说这个组件还不是一个可复用的组件，比如说有这样一种业务场景，除了首页有 `PostList` 组件以外，在个人页面同样有个 `PostList` 组件，`UI` 一致但是交互逻辑不一致，这种情况下就无法复用首页的 `PostList` 组件了。为了解决这个问题，我们可以再次抽离一个真正意义上可复用的 `View` 层，它有一下几个特点：

- 给定相同的数据（由父组件通过 `props` 传递给子组件且是唯一数据来源），总是渲染相同的 `UI` 界面；
- 组件你内部不改变数据状态；
- 不处理交互逻辑。

可以发现，这个上面所列出的满足纯函数的条件非常相似，这种组件才算是真正意义上的可复用的组件，好了，Talk is cheap, show me the code:

```js
import React, { Component } from 'react';
import { fetchPosts } from 'path/to/api';

export default class PostListContainer extends Component {
    constructor() {
        this.state = {
            posts: [],
        };
    }
    componentDidMount() {
        fetchPosts().then(posts => {
            this.setState({
                posts,
            });
        });
    }
    render() {
        return (
            <PostList posts={this.state.posts} toggleActive={this.toggleActive}></PostList>
        );
    }
    toggleActive() {
        //
    }
}

//
export default class PostList extends Component {
    render() {
        return (<ul>{ this.props.posts.map(post => <li key={post.id} onClick={this.props.toggleActive}>{ post.title }</li>) }</ul>);
    }
}
```

通过这样改造之后，原本数据交互和 `UI` 展示耦合则组件就被分为了两个职责明确的新组建，即 `PostListContainer` 负责数据获取或点击等交互逻辑，而 `PostList` 则真正意义上的只负责纯粹的 `View` 层渲染。这种情况下的 `PostListContainer` 被称为 **`Container Component`（容器组件）**，`PostList` 则被称为 **`Presentational Container`（展示组件）**。再回到刚刚所假设的业务场景下，此时可以通过创建不同的 `Container Component` 来处理不同的交互逻辑，然后把最终的数据通过 `props` 传递给子组件 `PostList`，这样的话不管是首页还是个人都可以真正复用 `PostList` 这个 `Presentational Component` 了。

再回过头来思考一下前面提到的 Sebastian Markbåge 所认为的理念：

`UI` 只是把数据通过映射关系变成另一种形式的数据。给定相同的输入（数据）必然会有相同的输出（`UI`），即一个简单的纯函数。

我们可以把这句话高度抽象成一个函数：`data => View`，拿前面的 Presentational Component `PostList` 来说，其中 `this.props.posts` 就是 `data => View` 中的 `data`，而整个渲染结果就是 `View`，我们再单独分析一下这个组件：

```js
import React, { Component } from 'react';

export default class PostList extends Component {
    render() {
        return (<ul>{ this.props.posts.map(post => <li key={post.id} onClick={this.props.toggleActive}>{ post.title }</li>) }</ul>);
    }
}
```

其实会发现，尽管这个组件已经很简单了，`this.props.posts` 传入数据，然后渲染结果（同时还有绑定事件，但是没有事件处理的具体逻辑），没有再做其他操作了。但我们仔细思考的话，还是会发现有两个比较明显的问题，一个是写法上还是典型的面向对象的方式来写的；其次是该组件内部还有 `this` 关键字，为什么说在这里使用关键字 `this` 是不合适的呢，因为 `JavaScript` 严格来说并不是函数式编程语言，在 `JavaScript` 中 `this` 的指向又非常容易的被改变，所以依赖于 `this` 关键字的 data 是非常不稳定的。

好在以上两个问题再 `React` 的 `v0.14` 版本中得到了解决，在此次版本中 `React` 有一个新的特性叫 `Stateless Functional Components`。什么意思呢？我们把上面的 `PostList` 组件以 `Stateless Functional Components` 的方式来重新编写就会一目了然了：

```js
const PostList = props => (
    <ul>
        { props.posts.map(post => (<li key={ post.id } onClick={ props.toggleActive }>{ post.title }</li>)) }
    </ul>
);

// 参数解构
const PostList = ({ posts, toggleActive }) => (
    <ul>
        { posts.map(post => (<li key={ post.id } onClick={ toggleActive }>{ post.title }</li>)) }
    </ul>
);
```

我们会发现 `Stateless Functional Components` 完美的诠释了前面所提到的 `data => View` 这个理念，不仅数据输入不依赖于 `this` 关键字，且书写风格也更像函数式风格。

## 总结

在平时的开发中，应该避免数据交互逻辑与数据渲染的过于耦合，严格区分 `Container Component` 和 `Presentational Component` 的职责不仅可以更容易的复用组件，而且也容易定位问题的所在。

## 参考文章：

1. [Which Programming Languages Are Functional?](https://link.zhihu.com/?target=http%3A//blog.jenkster.com/2015/12/which-programming-languages-are-functional.html)
