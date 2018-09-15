---
layout:         post
title:          'Swift 中如在两个页面中传值'
excerpts:       '介绍 Swift 中页面传值的几种常见方式'
categories:     swift
---

## Swift 中页面传值的几种常见方式

- 属性传值
- 代理传值
- 通知传值
- 单例传值
- 闭包传值

### 属性传值

假设现在有 `ViewA` 和 `ViewB` 两个页面，现在需要从 `ViewA` 页面带上数据跳转到 `ViewB` 页面并显示出来。

属性传值就是实现这种正向传值的最简单的一种页面传值的方式，具体的实现方式就是在 `ViewA` 跳转 `ViewB` 页面之前，先实例化 `ViewB`，把需要传递到 `ViewB` 的数据保存到 `ViewB` 实例的属性上，这样在跳转到 `ViewB` 页面的时候，就可以通过 `self.xxx` 获取到 `ViewA` 传过来的值了。具体代码如下：

```swift
// ViewA
class ViewA: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    func toViewB() {
        let viewB = ViewB()
        viewB.data = "data from ViewA"
        navigationController?.pushViewController(viewB, animated: true)
    }
}

// ViewB
class ViewB: UIViewController {
    var data: String?

    override func viewDidLoad() {
        super.viewDidLoad()

        print(data) // "data from ViewA"
    }
}
```

### 代理传值

代理传值比较适合传值回前一个页面的情况。

假设现在有 `ViewA` 和 `ViewB` 两个页面，现在需要从 `ViewB` 反向传值给 `ViewA`：

```swift
// ViewA
class ViewA: UIViewController, CustomDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    @objc func toViewB() {
        let viewB = ViewB()
        viewB.data = "data from ViewA"
        viewB.delegate = self
        navigationController?.pushViewController(viewB, animated: true)
    }

    func passValue(_ text: String) {
        print(text) // data from ViewB
    }
}

// ViewB

protocol CustomDelegate: NSObjectProtocol {
    func passValue(_ text: String)
}

class ViewB: UIViewController {
    weak var delegate: CustomDelegate?

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    @objc back() {
        delegate?.passValue("data from ViewB")
        navigationController?.popViewController(animated: true)
    }
}
```

### 通知传值

假如有 `A`, `B`, `C` 三个页面，现在需要从 `C` 页面传值到 `A` 页面，可以通过「通知传值」的方式实现：

```swift
class viewA: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // 添加通知
        NotificationCenter.default.addObserver(self, selector: #selector(notify), name: NSNotification.Name(rawValue: "notifyName"), object: nil)
    }

    @objc func notify(_ notification: Notification) {
        print(notification.object) // data from viewC
    }

    // 及时移除通知
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}

class viewC: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // 发送通知
        NotificationCenter.default.post(name: NSNotification.Name(rawValue: "notifyName"), object: "data from viewC")
    }
}
```

### 单例传值

### 闭包传值
