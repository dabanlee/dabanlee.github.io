---
layout:         post
title:          'React 中的高阶组件及其应用场景'
excerpts:       ''
---

关键词：高阶函数、高阶组件、属性代理、反向继承、装饰器模式、受控组件

**本文目录:**

- 什么是高阶组件
- React 中的高阶组件
    - 属性代理（Props Proxy）
    - 反向继承（Inheritance Inversion）
- 高阶组件存在的问题
- 高阶组件的约定
- 高阶组件的应用场景
- 装饰者模式？高阶组件？AOP？
- 总结
- 拓展阅读

## 什么是高阶组件

在解释什么是高阶组件之前，可以先了解一下什么是 **高阶函数**，因为它们的概念非常相似，下面是 **高阶函数** 的定义：

> 如果一个函数 **接受一个或多个函数作为参数或者返回一个函数** 就可称之为 **高阶函数**。

下面就是一个简单的高阶函数：

```js
function withGreeting(greeting = () => {}) {
    return greeting;
}
```

**高阶组件** 和 **高阶函数** 的定义非常相似：

> 如果一个函数 **接受一个或多个组件作为参数并且返回一个组件** 就可称之为 **高阶组件**。

下面就是一个简单的高阶组件：

```js
function HigherOrderComponent(WrappedComponent) {
    return <WrappedComponent />;
}
```

所以你可能会发现，当高阶组件中返回的组件是 **无状态组件（PureComponent）** 时，该高阶组件其实就是一个 **高阶函数**，因为 `PureComponent` 本身就是一个纯函数。

## React 中的高阶组件

React 中的高阶组件主要有两种形式：**属性代理** 和 **反向继承**。

### 属性代理（Props Proxy）

最简单的属性代理实现：

```js
// 无状态
function HigherOrderComponent(WrappedComponent) {
    return props => <WrappedComponent {...props} />;
}
// or
// 有状态
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}
```

可以发现，属性代理其实就是 **一个函数接受一个 `WrappedComponent` 组件作为参数并且返回一个继承了 `React.Component` 的类，且在该类的 `render()` 方法中返回被传入的 `WrappedComponent` 组件**。

那我们可以利用属性代理类型的高阶组件做一些什么呢？

因为属性代理类型的高阶组件返回的是一个标准的 `React.Component` 组件，所以在 React 标准组件中可以做什么，那在属性代理类型的高阶组件中就也可以做什么，比如：

- 操作 `props`
- 抽离 `state`
- 通过 `ref` 访问到组件实例
- 用其他元素包裹传入的组件 `WrappedComponent`

#### 操作 props

为 `WrappedComponent` 添加新的属性：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        render() {
            const newProps = {
                name: '大板栗',
                age: 18,
            };
            return <WrappedComponent {...this.props} {...newProps} />;
        }
    };
}
```

#### 抽离 state

利用 `props` 和回调函数把 `state` 抽离出来：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                name: '',
            };
        }
        onChange = () => {
            this.setState({
                name: '大板栗',
            });
        }
        render() {
            const newProps = {
                name: {
                    value: this.state.name,
                    onChange: this.onChange,
                },
            };
            return <WrappedComponent {...this.props} {...newProps} />;
        }
    };
}
```

如何使用：

```js
const NameInput = props => (<input name="name" {...props.name} />);
export default HigherOrderComponent(NameInput);
```

这样就将 `input` 转化成受控组件了。

#### 通过 ref 访问到组件实例

有时会有需要访问 DOM element （使用第三方 `DOM` 操作库）的时候就会用到组件的 `ref` 属性。它只能声明在 Class 类型的组件上，而无法声明在函数类型的组件上。

`ref` 的值可以是字符串（**不推荐使用**）也可以是一个回调函数，如果是回调函数的话，它的执行时机是：

- 组件被挂载后（`componentDidMount`），回调函数立即执行，回调函数的参数为该组件的实例。
- 组件被卸载（`componentDidUnmount`）或者原有的 `ref` 属性本身发生变化的时候，此时回调函数也会立即执行，且回调函数的参数为 `null`。

如何在 **高阶组件** 中获取到 `WrappedComponent` 组件的实例呢？答案就是可以通过 `WrappedComponent` 组件的 `ref` 属性，该属性会在组件 `componentDidMount` 的时候执行 `ref` 的回调函数并传入该组件的实例：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        executeInstanceMethod = (wrappedComponentInstance) => {
            wrappedComponentInstance.someMethod();
        }
        render() {
            return <WrappedComponent {...this.props} ref={this.executeInstanceMethod} />;
        }
    };
}
```

**注意：不能在无状态组件（PureComponent）上使用 `ref` 属性，因为无状态组件没有实例。**

#### 用其他元素包裹传入的组件 `WrappedComponent`

给 `WrappedComponent` 组件包一层背景色为 `#fafafa` 的 `div` 元素：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        render() {
            return (
                <div style={{ backgroundColor: '#fafafa' }}>
                    <WrappedComponent {...this.props} {...newProps} />
                </div>
            );
        }
    };
}
```

### 反向继承（Inheritance Inversion）

最简单的反向继承实现：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            return super.render();
        }
    };
}
```

反向继承其实就是 **一个函数接受一个 `WrappedComponent` 组件作为参数并且返回一个继承了该传入 `WrappedComponent` 组件的类，且在该类的 `render()` 方法中返回 `super.render()` 方法**。

会发现其属性代理和实反向继承的实现有些类似的地方，比如属性代理中继承的是 `React.Component` 和 `render()` 中返回的是 `WrappedComponent`，反向继承中继承的是传入的组件 `WrappedComponent` 和 `render()` 中返回的是 `super.render()`。

反向继承可以用来做什么：

- 操作 `state`
- 渲染劫持（Render Highjacking）

#### 操作 state

高阶组件中可以读取、编辑和删除 `WrappedComponent` 组件实例中的 `state`。甚至可以增加更多的 `state` 项，但是 **非常不建议这么做** 因为这可能会导致 `state` 难以维护及管理。

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            return (
                <div>
                    <h2>Debugger Component Logging...</h2>
                    <p>state:</p>
                    <pre>{JSON.stringify(this.state, null, 4)}</pre>
                    <p>props:</p>
                    <pre>{JSON.stringify(this.props, null, 4)}</pre>
                    {super.render()}
                </div>
            );
        }
    };
}
```

在这个例子中利用高阶函数中可以读取 `state` 和 `props` 的特性，对 `WrappedComponent` 组件做了额外元素的嵌套，把 `WrappedComponent` 组件的 `state` 和 `props` 都打印了出来，

#### 渲染劫持

之所以称之为 **渲染劫持** 是因为高阶组件控制着 `WrappedComponent` 组件的渲染输出，通过渲染劫持我们可以：

- 有条件地展示元素树（`element tree`）
- 操作由 `render()` 输出的 React 元素树
- 在任何由 `render()` 输出的 React 元素中操作 `props`
- 用其他元素包裹传入的组件 `WrappedComponent` （同 **属性代理**）

##### 条件渲染

通过 `props.isLoading` 这个条件来判断渲染哪个组件。

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            if(this.props.isLoading) {
                return <Loading />;
            } else {
                return super.render();
            }
        }
    };
}
```

##### 修改由 render() 输出的 React 元素树

修改元素树：

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends WrappedComponent {
        render() {
            const tree = super.render();
            const newProps = {};
            if (tree && tree.type === 'input') {
                newProps.value = 'something here';
            }
            const props = {
                ...tree.props,
                ...newProps,
            };
            const newTree = React.cloneElement(tree, props, tree.props.children);
            return newTree;
        }
    };
}
```

## 高阶组件存在的问题

- 静态方法丢失
- `refs` 属性不能透传
- 反向继承不能保证完整的子组件树被解析

### 静态方法丢失

因为原始组件被包裹于一个容器组件内，也就意味着新组件会没有原始组件的任何静态方法：

```js
// 定义静态方法
WrappedComponent.staticMethod = function() {}
// 使用高阶组件
const EnhancedComponent = HigherOrderComponent(WrappedComponent);
// 增强型组件没有静态方法
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

所以必须将静态方法做拷贝：

```js
function HigherOrderComponent(WrappedComponent) {
    class Enhance extends React.Component {}
    // 必须得知道要拷贝的方法
    Enhance.staticMethod = WrappedComponent.staticMethod;
    return Enhance;
}
```

但是这么做的一个缺点就是必须知道要拷贝的方法是什么，不过 React 社区实现了一个库 `hoist-non-react-statics` 来自动处理，它会**自动拷贝所有非 React 的静态方法**：

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function HigherOrderComponent(WrappedComponent) {
    class Enhance extends React.Component {}
    hoistNonReactStatic(Enhance, WrappedComponent);
    return Enhance;
}
```

### refs 属性不能透传

一般来说高阶组件可以传递所有的 `props` 给包裹的组件 `WrappedComponent`，但是有一种属性不能传递，它就是 `ref`。与其他属性不同的地方在于 React 对其进行了特殊的处理。

如果你向一个由高阶组件创建的组件的元素添加 `ref` 引用，那么 `ref` 指向的是最外层容器组件实例的，而不是被包裹的 `WrappedComponent` 组件。

那如果有一定要传递 `ref` 的需求呢，别急，React 为我们提供了一个名为 `React.forwardRef` 的 API 来解决这一问题（在 React 16.3 版本中）：

```js
function withLogging(WrappedComponent) {
    class Enhance extends WrappedComponent {
        componentWillReceiveProps() {
            console.log('Current props', this.props);
            console.log('Next props', nextProps);
        }
        render() {
            const {forwardedRef, ...rest} = this.props;
            // 把 forwardedRef 赋值给 ref
            return <WrappedComponent {...rest} ref={forwardedRef} />;
        }
    };

    // React.forwardRef 方法会传入 props 和 ref 两个参数给其回调函数
    // 所以这边的 ref 是由 React.forwardRef 提供的
    function forwardRef(props, ref) {
        return <Enhance {...props} forwardRef={ref} />
    }

    return React.forwardRef(forwardRef);
}
const EnhancedComponent = withLogging(SomeComponent);
```

### 反向继承不能保证完整的子组件树被解析

React 组件有两种形式，分别是 class 类型和 function 类型（无状态组件）。

我们知道反向继承的渲染劫持可以控制 `WrappedComponent` 的渲染过程，也就是说这个过程中我们可以对元素树、`state`、`props` 或 `render()` 的结果做各种操作。

但是如果渲染元素树中包含了 function 类型的组件的话，这时候就不能操作组件的子组件了。

## 高阶组件的约定

高阶组件带给我们极大方便的同时，我们也要遵循一些 **约定**：

- `props` 保持一致
- 你不能在函数式组件上使用 `ref` 属性，因为它没有实例
- 不要改变原始组件 `WrappedComponent`
- 透传不相关 `props` 属性给被包裹的组件 `WrappedComponent`
- 不要再 `render()` 方法中使用高阶组件
- 使用 `compose` 组合高阶组件
- 包装显示名字以便于调试

### props 保持一致

高阶组件在为子组件添加特性的同时，要尽量保持原有组件的 `props` 不受影响，也就是说传入的组件和返回的组件在 `props` 上尽量保持一致。

### 不要改变原始组件 WrappedComponent

不要在高阶组件内以任何方式修改一个组件的原型，思考一下下面的代码：

```js
function withLogging(WrappedComponent) {
    WrappedComponent.prototype.componentWillReceiveProps = function(nextProps) {
        console.log('Current props', this.props);
        console.log('Next props', nextProps);
    }
    return WrappedComponent;
}
const EnhancedComponent = withLogging(SomeComponent);
```

会发现在高阶组件的内部对 `WrappedComponent` 进行了修改，一旦对原组件进行了修改，那么就失去了组件复用的意义，所以请通过 **纯函数** 返回新的组件：

```js
function withLogging(WrappedComponent) {
    return class extends React.Component {
        componentWillReceiveProps() {
            console.log('Current props', this.props);
            console.log('Next props', nextProps);
        }
        render() {
            // 透传参数，不要修改它
            return <WrappedComponent {...this.props} />;
        }
    };
}
```

这样优化之后的 `withLogging` 是一个 **纯函数**，并不会修改 `WrappedComponent` 组件，所以不需要担心有什么副作用，进而达到组件复用的目的。

### 透传不相关 props 属性给被包裹的组件 WrappedComponent

```js
function HigherOrderComponent(WrappedComponent) {
    return class extends React.Component {
        render() {
            return <WrappedComponent name="name" {...this.props} />;
        }
    };
}
```

### 不要在 render() 方法中使用高阶组件

```js
class SomeComponent extends React.Component {
    render() {
        // 调用高阶函数的时候每次都会返回一个新的组件
        const EnchancedComponent = enhance(WrappedComponent);
        // 每次 render 的时候，都会使子对象树完全被卸载和重新
        // 重新加载一个组件会引起原有组件的状态和它的所有子组件丢失
        return <EnchancedComponent />;
    }
}
```

### 使用 compose 组合高阶组件

```js
// 不要这么使用
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))；
// 可以使用一个 compose 函数组合这些高阶组件
// lodash, redux, ramda 等第三方库都提供了类似 `compose` 功能的函数
const enhance = compose(withRouter, connect(commentSelector))；
const EnhancedComponent = enhance(WrappedComponent)；
```

因为按照 **约定** 实现的高阶组件其实就是一个纯函数，所以可以通过 `compose` 方法来组合它们。

### 包装显示名字以便于调试

高阶组件创建的容器组件在 React Developer Tools 中的表现和其它的普通组件是一样的。为了便于调试，可以选择一个显示名字，传达它是一个高阶组件的结果。

```js
const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || 'Component';
function HigherOrderComponent(WrappedComponent) {
    class HigherOrderComponent extends React.Component {/* ... */}
    HigherOrderComponent.displayName = `HigherOrderComponent(${getDisplayName(WrappedComponent)})`;
    return HigherOrderComponent;
}
```

实际上 [`recompose`](https://github.com/acdlite/recompose/blob/master/docs/API.md#getdisplayname) 库实现了类似的功能，懒的话可以不用自己写：

```js
import getDisplayName from 'recompose/getDisplayName';
HigherOrderComponent.displayName = `HigherOrderComponent(${getDisplayName(BaseComponent)})`;
// Or, even better:
import wrapDisplayName from 'recompose/wrapDisplayName';
HigherOrderComponent.displayName = wrapDisplayName(BaseComponent, 'HigherOrderComponent');
```

## 高阶组件的应用场景

不谈场景的技术就是在耍流氓，所以接下来说一下如何在业务场景中使用高阶组件。

### 页面复用

高阶组件最常用的一个场景之一就是页面复用。

### 页面鉴权

条件渲染

### 性能追踪

借助父组件子组件生命周期规则捕获子组件的生命周期

### 统计上报

## 装饰者模式？高阶组件？AOP？

可能你已经发现了，高阶组件其实就是装饰器模式在 React 中的实现：通过给函数传入一个组件（函数或类）后在函数内部对该组件（函数或类）进行功能的增强（不修改传入参数的前提下），最后返回这个组件（函数或类），即允许向一个现有的组件添加新的功能，同时又不去修改该组件，属于 **包装模式(Wrapper Pattern)** 的一种。

什么是装饰者模式：**在不改变对象自身的前提下在程序运行期间动态的给对象添加一些额外的属性或行为**。

> 相比于使用继承，装饰者模式是一种更轻便灵活的做法。

使用装饰者模式实现 **AOP**：

> 面向切面编程（AOP）和面向对象编程（OOP）一样，只是一种编程范式，并没有规定说要用什么方式去实现 AOP。

```js
// 在需要执行的函数之前执行某个新添加的功能函数
Function.prototype.before = function(before = () => {}) {
    return () => {
        before.apply(this, arguments);
        return this.apply(this, arguments);
    };
}
// 在需要执行的函数之后执行某个新添加的功能函数
Function.prototype.after = function(after = () => {}) {
    return () => {
        const result = after.apply(this, arguments);
        this.apply(this, arguments);
        return result;
    };
}
```

可以发现其实 `before` 和 `after` 就是一个 **高阶函数**，和高阶组件非常类似。

面向切面编程（**AOP**）主要应用在 **与核心业务无关但又在多个模块使用的功能比如权限控制、日志记录、数据校验、异常处理等领域**。

类比一下 **AOP** 你应该就知道高阶组件通常是处理哪一类型的问题了吧。

## 总结

React 中的 **高阶组件** 其实是一个非常简单的概念，但又非常实用。在实际的业务场景中合理的使用高阶组件，**可以提高代码的复用性和灵活性**。

最后的最后，再对高阶组件进行一个小小的总结：

- 高阶组件 **不是组件**，**是** 一个把某个组件转换成另一个组件的 **函数**
- 高阶组件的主要作用是 **代码复用**
- 高阶组件是 **装饰器模式在 React 中的实现**

## 拓展阅读

常用高阶组件库：

- [react-redux](https://github.com/reduxjs/react-redux) 中的 `connect` 方法
- [recompose](https://github.com/acdlite/recompose)
- [relay](https://github.com/facebook/relay)