---
layout:         post
title:          '在 Swift 中如何对视图进行自动布局约束'
excerpts:       ''
categories:     swift
---

## 使用 NSLayoutConstraint 对视图进行自动布局约束

![Dock Vertical](/images/posts/how-to-autolayout-the-view-in-swift/dock-0.jpg)
![Dock Horizontal](/images/posts/how-to-autolayout-the-view-in-swift/dock-1.jpg)

假如要做如上图类似 iPhone 底部 Dock 栏效果的约束，纯代码可以这么实现：

```swift
import UIKit

class ViewController: UIViewController {
    var dock: UIView!

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = UIColor(red: 240/255, green: 240/255, blue: 240/255, alpha: 1)

        dock = UIView()
        dock.backgroundColor = UIColor.white
        dock.layer.cornerRadius = 13
        view.addSubview(dock)
        initDockConstraint()
    }

    func initDockConstraint() {
        let leading = NSLayoutConstraint(item: dock, attribute: .leading, relatedBy: .equal, toItem: view, attribute: .leading, multiplier: 1, constant: 20)
        let trailing = NSLayoutConstraint(item: dock, attribute: .trailing, relatedBy: .equal, toItem: view, attribute: .trailing, multiplier: 1, constant: -20)
        let bottom = NSLayoutConstraint(item: dock, attribute: .bottom, relatedBy: .equal, toItem: view, attribute: .bottom, multiplier: 1, constant: -20)
        let height = NSLayoutConstraint(item: dock, attribute: .height, relatedBy: .equal, toItem: nil, attribute: .notAnAttribute, multiplier: 1, constant: 60)

        dock.translatesAutoresizingMaskIntoConstraints = false

        height.isActive = true
        bottom.isActive = true
        leading.isActive = true
        trailing.isActive = true
    }
}
```

`NSLayoutConstraint` 函数详解：

```swift
NSLayoutConstraint(
    item: viewOne, // 要添加约束的视图本身
    attribute: .leading, // 要添加约束的属性，比如对左边距进行约束
    relatedBy: .equal, // 大于等于 小于等于 等于
    toItem: viewTwo, // 相对于另外一个空间
    attribute: .leading, // 相对于另外一个空间的属性，比如左边距
    multiplier: 1, // 乘以多少
    constant: 0, // 加上多少
)

// viewOne.attribute = viewTwo.attribute * multiplier + constant
// eg. dock.leading = view.leading * 1 + 20
```

你可能会发现，为了添加一组约束，要写非常非常多的代码，那有没有什么方法可以简化约束的代码量呢，答案是肯定的。上面的方式是 Swift 中原生的方法，而 Swift 生态中又有非常多优秀的第三方库，其中用得比较多的自动布局库叫做 `SnapKit`。下面我们将展示如何使用 `SnapKit` 来重构上面的代码：

```swift
import UIKit
import SnapKit

class ViewController: UIViewController {
    // ...

    func initDockConstraint() {
        dock.snp.makeConstraints { (make) in
            make.leading.equalTo(view).offset(20)
            make.trailing.bottom.equalTo(view).offset(-20)
            make.height.equalTo(60)
        }
    }
}
```

可以发现代码量少了非常多。

## 参考资料

1. [SnapKit](https://github.com/SnapKit/SnapKit)
