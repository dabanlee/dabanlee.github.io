---
layout:         post
title:          'Swift 中如何使用图片选择器'
excerpts:       'UIImagePickerController 的使用'
categories:     swift
---

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
