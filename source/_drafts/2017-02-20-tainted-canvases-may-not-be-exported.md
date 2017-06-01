---
layout: 		post
title: 			Tainted canvases may not be exported
excerpt: 		"Canvas 在调用 toDataURL 方法的时候，会抛出一个 Uncaught SecurityError 异常"
categories: 	note
---

用 canvas 导出 Base64 的时候，浏览器出于安全性的考虑，在调用 canvas 的 `toDataURL` 方法的时候，会抛出一个安全异常 `Uncaught SecurityError`：

```js
let image = new Image();
image.src = `http://other-site.com/just.jpg`;
image.onload = function () {
    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        base64 = ``;

    canvas.width = image.width;
    canvas.height = image.height;

    // Uncaught SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);

    base64 = canvas.toDataURL(type);
};
image.onerror = function () {
    console.log(`图片加载失败`);
};
```

解决方案之一就是图片使用当前域下的图片，就不会抛出此安全异常了。但实际项目中会经常使用不同域下的图片资源，在这种情况下就应该把图片的 `crossOrigin` 属性的值设置为 `anonymous` 或者 `*`。

```js
let image = new Image();
image.crossOrigin = '*';
image.src = `http://other-site.com/just.jpg`;
```

**注意：**

- 图片的 `crossOrigin` 属性一定要在 `src` 属性之前设置，否则同样会抛出 `Uncaught SecurityError` 异常；
- canvas 的宽高也一定要设置，否则导出的 base64 图片的尺寸大小会变成 canvas 默认的尺寸大小 `150 * 300`，而不是原图的大小。
