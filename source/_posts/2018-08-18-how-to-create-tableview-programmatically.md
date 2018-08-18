---
layout:         post
title:          '如何用纯代码创建 TableView'
excerpts:       ''
categories:     swift
---

![](/images/posts/how-to-create-tableview-programmatically/tableview.md)

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
