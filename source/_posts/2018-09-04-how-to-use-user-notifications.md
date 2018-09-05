---
layout:         post
title:          '如何使用 UserNotifications 做本地消息通知'
excerpts:       ''
categories:     swift
---

## 最终效果

![Notification](/images/posts/how-to-use-user-notifications/notification-1.jpg)
![Notification](/images/posts/how-to-use-user-notifications/notification-2.jpg)

## 请求通知权限

```swift
import UserNotifications

UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { (allowed, error) in
    if !allowed {
        // User prohibited notification authority
    }
}
```

上面这段代码就是请求通知权限的代码，把它放在你想要请求权限的地方即可，这里我把它放在 `AppDelegate.swift` 中，其实实际项目中放在这里请求是比较不合理的，这里做 DEMO 就无所谓了。

![Permission Request](/images/posts/how-to-use-user-notifications/request.jpg)

## 创建通知消息

### 通知消息的内容

这里创建一个简单的消息通知，当打开 App 的时候，在 5 秒后触发一条通知。

```swift
import UIKit
import UserNotifications

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // notification content
        let content = UNMutableNotificationContent()
        content.title = "大板栗"
        content.subtitle = "这是副标题"
        content.badge = 1
        content.body = "这是通知消息的主要内容"
        content.sound = UNNotificationSound(named: "sound")

        // The unique identifier for this notification request.
        // It can be used to replace or remove a pending notification request or a delivered notification.
        let identify = "io.justx.openApp"
        // The trigger that will or did cause the notification to be delivered. No trigger means deliver now.
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 5, repeats: false)
        let request = UNNotificationRequest(identifier: identify, content: content, trigger: trigger)

        // add request to notification center
        UNUserNotificationCenter.current().add(request) { error in
            if error == nil {
                //
            }
        }
    }
}
```

通知消息的内容 `UNMutableNotificationContent` 主要包含这几个属性：

- `.title`: 标题
- `.subtitle`: 副标题
- `.badge`: 角标
- `.body`: 消息主体内容
- `.sound`: 通知消息时的声音

### 通知消息的标识符

每条消息请求有一个请求标识符，它是一个字符串，且必须是唯一的，它可以用来替换或移除一个 `pending` 状态的请求。

```swift
let identify = "io.justx.openApp"
```

### 通知消息的触发器

通知消息还需要一个「触发器」来告知通知中心「什么时候」应该触发消息，如果不指定这个「触发器」的话，则表示立即发出这条请求消息。

`UserNotifications` 提供了三种「触发器」：

    - `UNTimeIntervalNotificationTrigger`: 一段时间后触发
    - `UNCalendarNotificationTrigger`: 指定时间触发
    - `UNLocationNotificationTrigger`: 指定位置范围触发

**一点时间后触发**：

```swift
let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 5, repeats: false)
```

`timeInterval` 表示「秒」，不是「毫秒」，`repeat` 表示是否重复。

**指定时间触发**：

```swift
var dateComponents = DateComponents()
components.year = 2018
components.month = 09
components.day = 05
components.hour = 20
components.minute = 13
components.second = 14

let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: false)
```

上面代码表示通知会在 `2018年9月5日20点13分14秒` 的时候被触发。而下面代码则表示通知会在 `每周六的上午8点30分` 的时候被触发。


```swift
var dateComponents = DateComponents()
components.weekday = 7 // 周六
components.hour = 8 // 早上 8 点
components.second = 30 // 30 分

let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
```

**指定位置范围触发**：

通知消息除了可以从「时间维度」上定义被触发的时间，还可以从「空间维度」来表示什么时候应该被触发。

首先需要定义一个「坐标」和「区域」，其次定义「进入」还是「离开」此区域的时候触发消息通知，具体代码如下：

```swift
// 定义一个坐标
let coordinate = CLLocationCoordinate2D(latitude: 52.10, longitude: 51.11)
// 定义一个以该坐标为圆心，半径为 1000 米的「区域」
let region = CLCircularRegion(center: coordinate, radius: 1000, identifier: "center")
region.notifyOnEntry = true  // 进入此范围时触发消息通知
region.notifyOnExit = false  // 离开此范围时不触发消息通知
let trigger = UNLocationNotificationTrigger(region: region, repeats: true)
```

### 通知消息的请求

通知消息的「内容」、「标识符」和「触犯器」定义好后，就可以生成相应的「通知请求」了：

```swift
let request = UNNotificationRequest(identifier: identify, content: content, trigger: trigger)
```

### 把通知消息的请求添加到消息中心

每条消息通知其实都是一个「请求」，当我们定义好「请求」后，还需要把它添加到「消息中心」才能够生效：

```swift
// add request to notification center
UNUserNotificationCenter.current().add(request) { error in
    if error == nil {
        //
    }
}
```
