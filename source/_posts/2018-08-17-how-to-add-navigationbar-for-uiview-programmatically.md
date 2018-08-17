---
layout:         post
title:          '如何用纯代码给 UIView 加上 UINavigationBar'
excerpts:       ''
categories:     swift
---

![Compare](/images/posts/how-to-add-navigationbar-for-uiview-programmatically/compare.jpg)

Talk is cheap, show me the code:

```swift
import UIKit

class ViewController: UIViewController {

    var navigationBar: UINavigationBar!
    var buttonBack : UIBarButtonItem!
    var dock: UIView!

    override func viewDidLoad() {
        super.viewDidLoad()

        initNavBar()
    }

    func initNavBar() {
        navigationBar = UINavigationBar(frame: CGRect(x:0, y:20, width: UIScreen.main.bounds.size.width, height:44))
        self.view.addSubview(navigationBar!)

        buttonBack = UIBarButtonItem(title: "返回", style: .done, target: self, action: #selector(back))
        navigationItem.leftBarButtonItems = [buttonBack]
        buttonBack.image = UIImage(named: "back")
        navigationItem.title = "Title"
        navigationBar?.pushItem(navigationItem, animated: true)
    }

    @objc func back() {
        print("back")
    }
}
```
