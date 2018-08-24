---
layout:         post
title:          'Swift 中各个 UI 控件的使用'
excerpts:       ''
categories:     swift
---

## UITableView

![UITableView](/images/posts/the-usage-of-ui-components-in-swift/tableview.jpg)

```swift
import UIKit

struct Options {
    var name: String
}

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    var tableView: UITableView!

    let options = [
        [Options(name: "Option 1", Options(name: "Option 2", Options(name: "Option 3", Options(name: "Option 4"],
        [Options(name: "Option 5", Options(name: "Option 6", Options(name: "Option 7"],
        [Options(name: "Option 8", Options(name: "Option 9", Options(name: "Option 10", Options(name: "Option 11"],
        [Options(name: "Option 12", Options(name: "Option 13", Options(name: "Option 14", Options(name: "Option 15"]
    ]

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = UIColor(red: 240/255, green: 240/255, blue: 240/255, alpha: 1)

        initTableView()
    }

    func initTableView() {
        tableView = UITableView()
        tableView.frame = view.bounds

        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cellOption")

        view.addSubview(tableView)
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return options[section].count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cellOption", for: indexPath)
        let sections = options[indexPath.section]

        tableView.backgroundColor = UIColor.clear
        tableView.separatorColor = UIColor.clear

        cell.textLabel?.text = sections[indexPath.row].name
        cell.backgroundColor = indexPath.row % 2 == 0 ? UIColor.white :UIColor(red: 250/255, green: 250/255, blue: 250/255, alpha: 1)

        return cell
    }

    func numberOfSections(in tableView: UITableView) -> Int {
        return options.count
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 50
    }

    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 30
    }

    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let headerView = UIView()
        headerView.backgroundColor = UIColor.clear

        return headerView
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
}
```


## UINavigationBar

![Compare](/images/posts/the-usage-of-ui-components-in-swift/compare.jpg)

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

## UIImagePickerController

```swift
import UIKit

class ViewController: UIViewController, UICollectionViewDelegate, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    var imageView: UIImageView!
    var button: UIButton!
    var tap: UIGestureRecognizer!
    var picker: UIImagePickerController!

    override func viewDidLoad() {
        super.viewDidLoad()

        imageView = UIImageView()
        imageView.frame = CGRect(x: 0, y: 0, width: UIScreen.main.bounds.size.width, height: UIScreen.main.bounds.size.height - 60)
        view.addSubview(imageView)

        tap = UITapGestureRecognizer(target: self, action: #selector(pickImage))
        view.addGestureRecognizer(tap)

        button = UIButton()
        button.frame = CGRect(x: 0, y: UIScreen.main.bounds.size.height - 60, width: UIScreen.main.bounds.size.width, height: 60)
        button.addTarget(self, action: #selector(pickImage), for: UIControlEvents.touchUpInside)

        view.addSubview(button)
    }

    @objc func pickImage() {
        print("open image library")
        picker = UIImagePickerController()
        picker.delegate = self
        picker.sourceType = .photoLibrary

        present(picker, animated: true, completion: nil)
    }

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        print("did finish pick")
        imageView.image = info[UIImagePickerControllerOriginalImage] as? UIImage

        dismiss(animated: true, completion: nil)
    }

    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        print("cancel")
        dismiss(animated: true, completion: nil)
    }
}
```

## UISwitch

```swift
import UIKit

class ViewController: UIViewController {
    var buttonSwitch: UISwitch!

    override func viewDidLoad() {
        super.viewDidLoad()

        buttonSwitch = UISwitch()
        // default to `true`
        buttonSwitch.isOn = true;
        buttonSwitch.addTarget(self, action: #selector(switchDidChange), for: .valueChanged)
        self.view.addSubview(buttonSwitch);
    }

    @objc func switchDidChange() {
        print(buttonSwitch.isOn)
    }
}
```
