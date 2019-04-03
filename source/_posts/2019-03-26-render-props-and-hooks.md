---
layout:         post
title:          'React Render Props and Hooks'
excerpts:       ''
# follow:         ['/images/follow.png', '更多干货请关注公众号 <span>前端小专栏：QianDuanXiaoZhuanLan</span>']
---

文章目录：

- 什么是 Render Props
- Render Props 的应用
- 什么是 React Hooks
- React Hooks 的应用
- 总结

## 什么是 Render Props

简而言之，只要一个组件中某个属性的值是函数，那么就可以说改组件使用了 Render Props 这种技术。听起来好像就那么回事儿，那到底 Render Props 有哪些应用场景呢，让我们还是从简单的例子讲起，假如我们要实现一个打招呼的组件，一开始可能会这么实现：

```js
const Greeting = props => (
    <div>
        <h1>{props.text}</h1>
    </div>
);

// 然后这么使用
<Greeting text="Hello 🌰！" />
```

但是如果在打招呼的时候同时还需要发送一个表情呢，然后可能会这么实现：

```js
const Greeting = props => (
    <div>
        <h1>{props.text}</h1>
        <p>{props.emoji}</p>
    </div>
);
// how to use
<Greeting text="Hello 🌰！" emoji="😳" />
```

然后如果还要加上链接呢，又要在 `Greeting` 组件的内部实现发送链接的逻辑，很明显这种方式违背了软件开发六大原则之一的 **开闭原则**，即每次修改都要到组件内部需修改。

> 开闭原则：对修改关闭，对拓展开放。

那有什么方法可以避免这种方式的修改呢，当然有，也就是接下来要讲的 **Render Props**，不过在此之前，我们先来看一个非常简单的求和函数：

```js
const sumOf = array => {
    const sum = array.reduce((prev, current) => {
        prev += current;
        return prev;
    }, 0);
    console.log(sum);
}
```

这个函数的功能非常简单，对数组求和并打印它。但是如果需要把 `sum` 通过 `alert` 显示出来，是不是又要到 `sumOf` 内部去修改呢，和上面的 `Greeting` 类似，是的，这两个函数存在相同的问题，就是当需求有变是，都需要要函数内部去修改。

对于第二个函数，你可能很快就能想出用 **回调函数** 去解决：

```js
const sumOf = (array, done) => {
    const sum = array.reduce((prev, current) => {
        prev += current;
        return prev;
    }, 0);
    done(sum);
}

sumOf([1, 2, 3], sum => {
    console.log(sum);
    // or
    alert(sum);
})
```

会发现回调函数很完美的解决了之前存在的问题，每次修改，我们只需要在 `sumOf` 函数的回调函数中去修改，而不需要到 `sumOf` 内部去修改。

反观 React 组件 `Greeting`，要解决前面遇到的问题，其实和 `sumOf` 的回调函数一样：

```js
const Greeting = props => {
    return props.render(props);
};
// how to use
<Greeting
    text="Hello 🌰！"
    emoji="😳"
    link="link here"
    render={(props) => (
    <div>
        <h1>{props.text}</h1>
        <p>{props.emoji}</p>
        <a href={props.link}></a>
    </div>
)}></Greeting>
```

类比之前的 `sumOf` 是不是非常的相似，简直就是一毛一样：

- `sumOf` 中通过执行回调函数 `done` 并把 `sum` 传入其中，此时只要在 `sumOf` 函数的第二个参数中传入一个函数即可获得 `sum` 的值，进而做一写定制化的需求
- `Greeting` 中通过执行回调函数 `props.render` 并把 `props` 传入其中，此时只要在 `Greeting` 组件的 `render` 属性中传入一个函数即可获得 `props` 的值并返回你所需要的 UI

值得一提的是，并不是只有在 `render` 属性中传入函数才能叫 Render Props，实际上任何属性只要它的值是函数，都可称之为 Render Props，比如上面这个例子把 `render` 属性名改成 `children` 的话使用上其实更为简便：

```js
const Greeting = props => {
    return props.children(props);
};
// how to use
<Greeting text="Hello 🌰！" emoji="😳" link="link here">
{(props) => (
    <div>
        <h1>{props.text}</h1>
        <p>{props.emoji}</p>
        <a href={props.link}></a>
    </div>
)}
</Greeting>
```

这样就可以直接在 `Greeting` 标签内写函数了，比起之前在 `render` 中更为直观。

所以，**React 中的 Render Props 你可以把它理解成 JavaScript 中的回调函数**。

## Render Props 的应用

上面简单介绍了什么是 Render Props，那么在实际开发中 Render Props 具体有什么实际应用呢，简单来讲 Render Props 所解决的问题和 **高阶组件** 所解决的问题类似，都是为了 **解决代码复用的问题**。

> 如果对高阶组件不熟悉的话，可以看一下笔者之前写的关于高阶组件的文章，公众号后台回复「190201」即可。

简单实现一个「开关」功能的组件：

```js
class Switch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            on: props.initialState || false,
        };
    }
    toggle() {
        this.setState({
            on: !this.state.on,
        });
    }
    render() {
        return (
            <div>{this.props.children({
                on,
                toggle: this.toggle,
            })}</div>
        );
    }
}
// how to use
const App = () => (
    <Switch initialState={false}>{({on, toggle}) => {
        <Button onClick={toggle}>Show Modal</Button>
        <Modal visible={on} onSure={toggle}></Modal>
    }}</Switch>
);
```

这是一个简单的 **复用显隐模态弹窗逻辑** 的组件，比如要显示 `OtherModal` 就直接替换 `Modal` 就行了，达到复用「开关」逻辑代码的目的。

Render Props 更像是 **控制反转（IoC）**，它只负责定义接口或数据并通过函数参数传递给你，具体怎么使用这些接口或者数据完全取决于你。

> **如果对控制反转不熟悉的话，可以看一下笔者之前写的关于控制反转的文章，公众号后台回复「190311」即可。**

### Render Props VS HOC

前面提到过 Render Props 所解决的问题和 **高阶组件** 所解决的问题类似，都是为了 **解决代码复用的问题**，那它们有什么区别呢，让我们来简单分析一下它们各自的特点：

#### HOC

**缺点：**

- 由于可能会多次嵌套高阶组件，而我们又很难确保每个高阶组件中的属性名是不同的，所以 **属性容易被覆盖**。
- 当在使用高阶组件的时候，高阶组件相当于一个 **黑盒**，我们必须去看如何实现才能去使用它：

**优点：**

- 可以使用 `compose` 方法合并多个高阶组件然后在使用
```js
// 不要这么使用
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))；
// 可以使用一个 compose 函数组合这些高阶组件
// lodash, redux, ramda 等第三方库都提供了类似 `compose` 功能的函数
const enhance = compose(withRouter, connect(commentSelector))；
const EnhancedComponent = enhance(WrappedComponent)；
```
- 调用方便（ES6 + 装饰器语法）
```js
@withData   
class App extends React.Component {}
```

#### Render Props

- 缺点
    - 嵌套过深也会形成 **地狱回调**
- 优点
    - 解决了 HOC 的缺点

Render Props 和 HOC 并不是非此即彼的关系，明白它们各自的优缺点之后，我们就可以在合适的场景下使用适合的方式去实现了。

## 什么是 React Hooks

React Hooks 是 React 16.8 版本推出的新特性，让函数式组件也可以和类风格组件一样拥有（类似）「生命周期」，进而更好的在函数式组件中发挥 React 的特性。

React 团队推出 Hooks 的目的和前面提到的 **高阶组件**、**Render Props** 一样，都是为了代码复用。

在了解 React Hooks 之前我们先拿前面 Render Props 的 `Switch` 例子做个对比：

```js
class Switch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            on: props.initialState || false,
        };
    }
    toggle() {
        this.setState({
            on: !this.state.on,
        });
    }
    render() {
        return (
            <div>{this.props.children({
                on,
                toggle: this.toggle,
            })}</div>
        );
    }
}
// how to use
const App = () => (
    <Switch initialState={false}>{({on, toggle}) => {
        <Button onClick={toggle}>Show Modal</Button>
        <Modal visible={on} onSure={toggle}></Modal>
    }}</Switch>
);
// use hooks
const App = () => {
    const [on, setOn] = useState(false);
    return (
        <div>
            <Button onClick={() => setOn(true)}>Show Modal</Button>
            <Modal visible={on} onSure={() => setOn(false)}></Modal>
        </div>
    );
}
```

通过对比我们很容易发现 Hooks 版本只用了几个简单的 API (`useState`, `setOn`, `on`) 就干掉了 `Switch` 类组件 20 行代码，极大的减少了代码量。

代码量减少只是 Hooks 所带来的好处之一，而它更重要的目的是 **状态逻辑复用**。（高阶组件和 Render Props 也是一样，状态逻辑复用其实就是代码复用的更具体的说法）

**Hooks 的几个优点**：

- 虽然 Hooks 的目的和高阶组件、Render Props 一样，都是为了代码复用，但是 Hooks 较高阶组件和 Render Props 更为简单明了，且不会造成嵌套地狱。
- 能更容易的把 UI 和状态分离
- 一个 Hooks 中可以引用另外的 Hooks
- 解决类组件的痛点
    - `this` 指向容易错误
    - 分割在不同声明周期中的逻辑使得代码难以理解和维护
    - 代码复用成本高（高阶组件容易使代码量剧增）

## React Hooks 的应用

React 官方提供了以下几个常用的钩子：

- 基础钩子：`useState`、`useEffect` 、`useContext`
- 附加钩子：`useReducer`、`useCallback`、`useMemo`、`useRef`、`useImperativeHandle`、`useLayoutEffect`、`useDebugValue`

### useEffect

`useEffect` 钩子的作用正如其名 —— 为了处理比如 **订阅**、**数据获取**、**DOM 操作** 等等一些副作用。它的作用与 `componentDidMount`, `componentDidUpdate` 和 `componentWillUnmount` 这些生命周期函数类似。

比如我们要监听输入框 `input` 的输入，用 `useEffect` 我们可以这么实现：

```js
function Input() {
    const [text, setText] = useState('')
    function onChange(event) {
        setText(event.target.value)
    }
    useEffect(() => {
        // 类似于 componentDidMount 和 componentDidUpdate 两个生命周期函数
        const input = document.querySelector('input')
        input.addEventListener('change', onChange);
        return () => {
            // 类似于 componentWillUnmount
            input.removeEventListener('change', onChange);
        }
    })
    return (
        <div>
            <input onInput={onChange} />
            <p>{text}</p>
        </div>    
    )
}
```

`useEffect` 钩子的用法就是把函数作为第一个参数传入 `useEffect` 中，在该传入的函数中我们就可以做一些 **有副作用** 的事情了，比如操作 DOM 等等。

如果传入 `useEffect` 方法的函数返回了一个函数，该 **返回的函数** 会在组件即将卸载时调用，我们可以在这里做一些比如清除 timerID 或者取消之前发布的订阅等等一些清除操作，下面这么写可能比较直观：

```js
useEffect(function didUpdate() {
    // do something effects
    return function unmount() {
         // cleaning up effects
    }
})
```

当 `useEffect` 只传入一个参数时，**每次 `render` 之后都会执行 `useEffect` 函数**：

```js
useEffect(() => {
    // render 一次，执行一次
    console.log('useEffect');
})
```

当 `useEffect` 传入第二个参数是数组时，**只有当数组的值（依赖）发生变化时，传入回调函数才会执行**，比如下面这种情况：

> 虽然 React 的 diff 算法在 DOM 渲染时只会更新变化的部分，但是却无法识别到 `useEffect` 内的变化，所以需要开发者通过第二个参数告诉 React 用到了哪些外部变量。

```js
useEffect(() => {
    document.title = title
}, [title])
```

因为 `useEffect` 回调内部用到了外部的 `title` 变量，所以如果需要仅当 `title` 值改变时才执行回调的话，只需在第二个参数中传入一个数组，并把内部所依赖的变量写在数组中，此时如果 `title` 值改变了的话，`useEffect` 回调内部就可以通过传入的依赖判断是否需要执行回调。

所以如果给 `useEffect` 第二个参数传入一个空数组的话，`useEffect` 的回调函数只会在首次渲染之后执行一次：

```js
useEffect(() => {
    // 只会在首次 render 之后执行一次
    console.log('useEffect')
}, [])
```

### useContext

React 中有个 `context` 的概念，让我们可以 **跨组件共享状态，无需通过 `props` 层层传递**，一个简单的例子：

> redux 就是利用 React 的 `context` 的特性实现跨组件数据共享的。

```js
const ThemeContext = React.createContext();
function App() {
    const theme = {
        mode: 'dark',
        backgroundColor: '#333',
    }
    return (
        <ThemeContext.Provider value={theme}>
            <Display />
        </ThemeContext.Provider>
    )
}

function Display() {
    return (
        <ThemeContext.Consumer>
            {({backgroundColor}) => <div style={{backgroundColor}}>Hello Hooks.</div>}
        </ThemeContext.Consumer>
    )
}
```

下面是 `useContext` 版本：

```js
function Display() {
    const { backgroundColor } = useContext(ThemeContext);
    return (<div style={{backgroundColor}}>Hello Hooks.</div>)
}
```

嵌套版 `Consumer`：

```js
function Header() {
    return (
        <CurrentUser.Consumer>
            {user =>
                <Notifications.Consumer>
                    {notifications =>
                        <header>
                            Hello {user.name}!
                            You have {notifications.length} notifications.
                        </header>
                    }
                </Notifications.Consumer>
            }
        </CurrentUser.Consumer>
    );
}
```

用 `useContext` 拍平：

```js
function Header() {
    const user = useContext(CurrentUser)
    const notifications = useContext(Notifications)
    return (
        <header>
            Hello {user.name}!
            You have {notifications.length} notifications.
        </header>
    )
}
```

emm... 这效果有点类似用 `async` 和 `await` 改造地狱回调的感觉。

以上就是 React 的基础 Hooks。对于其他官方提供的 Hooks 如果感兴趣建议直接阅读文档，本文就不一一介绍了。

### 使用中需要注意的点

React Hooks 在带给我们方便的同时，我们也需要遵循它们的一些约定，不然效果只会变得适得其反：

- 避免在 **循环、条件判断、嵌套函数** 中调用 **Hooks**，保证调用顺序的稳定；
- 只有 **函数定义组件** 和 **Hooks** 可以调用 **Hooks**，避免在 **类组件** 或者 **普通函数** 中调用；
- 不能在 `useEffect` 中使用 `useState`，React 会报错提示；
- 类组件不会被替换或废弃，不需要强制改造类组件，两种方式能并存

## 总结

Render Props 的一个核心思想就是在组件内部通过调用 `this.props.children()` （当然可以是其他任意值是函数属性名）把组件内部的一些状态传递出去（参考回调函数），然后在组件外部对应属性的函数中通过函数的参数来获取组件内部的状态，进而在该函数中处理相应的 UI 或逻辑。而 Hooks 有点像是 Render Props 的 **拍平版** （参考前面 `useContext`）栗子。

目前为止，介绍了 React 代码复用的三种方式：

- **Render Props**
- **Hooks**
- **HOC**（公众号后台回复「**190201**」阅读 HOC 相关文章）

通过对比发现，**Hooks** 的方式的优势最大，解决解决了另外两种方式的一些痛点，所以建议使用。

**相关阅读：**

- **React 中的高阶组件及其应用场景（公众号后台回复「190201」）**
- **前端中的 IoC 理念（公众号后台回复「190311」）**
- **(中篇)中高级前端大厂面试秘籍，寒冬中为您保驾护航，直通大厂（公众号后台回复「190325」）**