---
layout:         post
title:          'Swift 中无法滑动返回的解决方案'
excerpts:       ''
---

通常使用导航控制器 `navigationController` 跳转到另一页面时，除了可以点击左上角的返回按钮，还可以通过在屏幕左侧向右滑动来返回到上一层。但如果自定义了 `self.navigationItem.leftBarButtonItems` 后会发现，滑动返回（swipe back）失效了。

## 让滑动返回继续有效

1. 解决办法是让 `ViewController` 实现 `UIGestureRecognizerDelegate` 协议。
2. 当这样做还不够，虽然滑动返回功能又恢复了，但这时还会出现另一个问题：即在一级视图（根视图）中，我们用手势滑动一下，然后进入二级视图，会发现画面卡住死在那里了。

```swift
import UIKit
 
class ViewController: UIViewController, UIGestureRecognizerDelegate {
     
    override func viewDidLoad() {
        super.viewDidLoad()
         
        // 启用滑动返回
        self.navigationController?.interactivePopGestureRecognizer!.delegate = self
    }
     
    // 是否允许手势
    func swipeBack(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        if (gestureRecognizer == self.navigationController?.interactivePopGestureRecognizer) {
            // 只有二级以及以下的页面允许手势返回
            return self.navigationController!.viewControllers.count > 1
        }
        return true
    }
     
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
```

## 与 `webview` 手势冲突造成无法滑动返回

> `webview` 如果没加载页面则没有这个问题

正常情况下通过上面的设置后就可以滑动返回了，但有时我们在页面内放置了一个 `webview` 并加载网页进来后，会发现滑动返回的功能又失效了。

**问题原因**：由于 `webview` 加载的这个页面自身内部需要用到手势操作，或者 `webview` 放大之后需要一些滑动查看操作，于是便造成事件冲突。

**解决办法**：新建了一个 tap手势，设置代理，同时实现允许多个手势并发的代理方法

```swift
import UIKit
 
class ViewController: UIViewController, UIGestureRecognizerDelegate {
     
    override func viewDidLoad() {
        super.viewDidLoad()
         
        // 启用滑动返回
        self.navigationController?.interactivePopGestureRecognizer!.delegate = self

        // 新建一个滑动手势
        let tap = UISwipeGestureRecognizer(target:self, action:nil)
        tap.delegate = self
        self.webView.addGestureRecognizer(tap)
    }

    //返回 true 表示所有相同类型的手势辨认都会得到处理
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }
     
    // 是否允许手势
    func swipeBack(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        if (gestureRecognizer == self.navigationController?.interactivePopGestureRecognizer) {
            // 只有二级以及以下的页面允许手势返回
            return self.navigationController!.viewControllers.count > 1
        }
        return true
    }
     
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
```

## 参考

1. [自定义导航栏leftBarButtonItems导致滑动返回失效问题解决](http://www.hangge.com/blog/cache/detail_1092.html)