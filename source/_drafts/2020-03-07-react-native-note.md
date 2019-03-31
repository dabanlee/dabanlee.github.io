---
layout:         post
title:          'React Native 笔记'
excerpts:       ''
# follow:         ['/images/follow.png', '更多干货请关注公众号 <span>前端小专栏：QianDuanXiaoZhuanLan</span>']
---

## 使用笔记

### React Native + React Navigation + Redux

```js
// src/App.js
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import store from './store';

import Detail from './pages/Detail';
import Home from './pages/Home';

const AppNavigator = createStackNavigator({
    Home,
    Detail,
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
}

// src/reducers/index.js
const initialState = {
    count: 1,
};

export default function (state = initialState, {type, count}) {
    const mapping = {
        'CHANGE_OPACITY': {
            ...state,
            count,
        },
    };
    const effective = Object.keys(mapping).includes(type);
    return effective ? mapping[type] : state;
}

// src/actions/index
export function INCREASE(count) {
    return {
        type: 'INCREASE',
        count,
    };
}

// src/store/index.js
import { createStore } from 'redux';
import reducers from '../reducers';

export default createStore(reducers);
```

## 问题记录

- 安装 `react-navigation` 报错
    - 原因是 `react-navigation` 3.0 后需要依赖 `react-native-gesture-handler` 包
    - 相关 `issue` 
        - https://github.com/react-navigation/react-navigation/issues/5250
        - https://github.com/react-navigation/react-navigation/issues/5244#issuecomment-439730726
    - 解决方法：`yarn add react-native-gesture-handler && react-native link` 然后删除 App 重新编译

- 