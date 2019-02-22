---
layout: 		post
title: 			CSS 设计指南 学习笔记 二
excerpts: 		"本篇文章是对这几天看完 Charles Wyke-Smit 的 《CSS 设计指南》 后的一些学习笔记与心得。"
categories: 	CSS
follow:         ['/images/follow.png', '更多干货请关注公众号 <span>前端小专栏</span>']
---

本篇文章是笔者的 《CSS 设计指南》 学习笔记的第二部分，由于最近都在准备期末考的事，所以都没来得及对 《CSS 设计指南》 进行一些总结，没有看之前第一部分的话也可以从[这里](http://www.cleardesign.me/stylin-with-css-note-1)传送过去。

## 第三章 定位元素

### 3.1 理解盒模型

其实 HTML 页面中每个元素其实都是一个「盒子」，默认情况下这些盒子的边框不可见，背景也是透明的，所以我们不能直接的看到页面中盒子的结构，但是我们可以借助一些 Web Developer 工具条可以方便地显示盒子的边框和背景，让我们能很直观的看到这些盒子的结构。

每个盒子都有三组属性：

- 外边距(margin)： 可以设置盒子与相邻盒子之间的距离。

- 边框(border)： 可以设置边框的宽度、样式和颜色。

- 内边距(padding)：可以设置盒子内容区和边框之间的距离。

一个盒子有四条边，所以这些属性也各有四个属性，分别是上(top)、右(right)、下(bottom)和左(left)，为了更直观的了解盒模型的结构，这里放上一张盒模型的结构图：

![盒模型](/images/posts/stylin-with-css-note/2.1.png)

尽管这三组属性共有 12 个属性值，但我们也可以对它们进行简写，这里以 `margin` 为例：

```css
{
	margin-top: 1px;
	margin-right: 1px;
	margin-botton: 1px;
	margin-left: 1px;
}
```

缩写后的代码如下:

```css
{
	margin: 1px 1px 1px 1px;
}
```

缩写的顺序是上 -> 右 -> 下 -> 左，顺时针的方向。相对的边的值相同，则可以省掉，代码如下:

```css
{
	margin:1px;// 四个方向的边距相同，等同于margin:1px 1px 1px 1px
	margin:1px 2px;// 上下边距都为1px，左右边距均为2px，等同于margin:1px 2px 1px 2px
	margin:1px 2px 3px;// 右边距和左边距相同，等同于margin:1px 2px 3px 2px;
	margin:1px 2px 1px 3px;// 注意，这里虽然上下边距都为1px，但是这里不能缩写。
}
```

#### 3.1.1 盒子的边框(border)

边框(border)有四个相关属性：

- 宽度(border-width)：可以使用 thin、 medium 和 thick 等文本值，也可以使用**除百分比和负值以外**的任何绝对值。

- 样式(border-style)：有 none、 hidden、 dotted、 dashed、 solid、 double、 groove、 ridge、 inset 和 outset 等文本值。

- 颜色(border-color)：可以使用任何颜色值，包括 rgb、 hsl、十六进制颜色值和颜色关键字。

- 圆角(border-radius)：属于 CSS3 新增属性，可使用百分比、相对值和绝对值。

> CSS 推荐标准并没有明确规定 border-width 的几个文本值的确切宽度，所以实际宽度会因浏览器而异。

> border-radius 不影响盒子的定位。

#### 3.1.2 盒子的内边距(padding)

内边距是盒子内容区与盒子边框之间的距离。在没有设置内边距的情况下，内容紧挨着边框：

![内边距](/images/posts/stylin-with-css-note/2.2.png)

设置内边距后，内容区与边框有一定的距离(padding 的大小)：

![内边距](/images/posts/stylin-with-css-note/2.3.png)

#### 3.1.3 盒子外边距(margin)

与内边距和边框相比，外边距就要显得复杂的多了，首先是外边距叠加，**垂直方向上的外边距会叠加**，例如有三个段落应用了如下规则：

```css
p {
	height:50px;
	border:1px solid #000;
	background: #fff;
	margin-top: 50px;
	margin-bottom: 30px;
}
```

由于第一段的下边距与第二段的上边距相邻，你可能会觉得它们两个盒子边框之间的外边距只和是 80px，但实际上是 50px，像这样上下外边距相遇时，它们会相互重叠，直到一个外边距碰到另一个盒子的边框。就上面例子而言，第二段较宽的上外边距会碰到第一段的边框，也就是说较宽的外边距决定两个盒子之间的距离。

![](/images/posts/stylin-with-css-note/2.4.png)

#### 3.1.5 外边距的单位

在设置段落文本外边距时应该注意，为了避免因增大字号导致段落间外边距不变引起的整体不协调的问题，在设置段落的上下外边距是应该使用 `em` 单位，这样当字体大小调整时，段落的上下外边距也会根据字体的大小来调整距离，这样页面的整体布局就会比较协调一致，而左右外边距则可以用 `px` 绝对单位，确保左右外边距不会因字体大小的调整而发生改变，比如可以这么设置：

```css
p {
	font-size: 1em;
	margin: .75em 30px;
}
```

这样段落垂直距离就会始终保持字体高度的四分之三的高度，水平外边距不会因字体的调整而发生改变了。

### 3.2 盒子有多大

作者在本章介绍了块级元素和行内元素的不同行为。

#### 3.2.1 没有宽度的盒子

作者在这一节中专门提到了一个 「没有宽度」的概念：没有显式地设置元素的 `width` 属性。如果不设置块级元素的 `width` 属性，那么这个属性的默认值就是 `auto` ，结果就是会让元素的宽度扩展到与父元素同宽，对于块级元素和行内元素更具体的介绍请看笔者的上一篇文章[CSS 设计指南 学习笔记 一](http://www.cleardesign.me/stylin-with-css-note-1)。

盒模型结论一：

> 没有设置宽度的元素始终会扩展到填满其父元素的宽度为止，添加水平外边距、水平边框和水平内边距都会导致内容宽度的减少，减少量等于水平外边距、水平边框和水平内边距的和。

#### 3.2.2 有宽度的盒子

盒模型结论二：

> 为设定了宽度的盒子添加外边距、边框和内边距，会导致盒子扩展的更宽，实际上，盒子的 `width` 属性设定的只是盒子内容区的宽度，而不是盒子要占据的( margin-left + border-left + padding-left + width + padding-right + border-right + margin-right )水平宽度。

所以一定要记住的是，给设定了 `width` 的元素添加外边距、边框和内边距所展示的行为与默认的 `auto` 状态下的行为会有截然不同的表现。

拓展：

但是与布局相关的元素大部分都同时设置了 `margin`、 `border`、 `padding` 和 `width`，这就导致了在布局时的各种计算保证总宽度( margin-left + border-left + padding-left + width + padding-right + border-right + margin-right )保持不变，这样不仅麻烦，有的时候还比较容易出错，为了解决这一问题， CSS3 新增了一个 `box-sizing` 属性，通过它可以将设置了 `width` 的元素也设定成具有默认的 `auto` 状态下的行为。这样就省去了许多计算 `width` 的时间，同时也不会出错，而且它的浏览器支持情况也是一片大好（ 除了 IE 6 和 IE 7 不支持，其他个别老版本的浏览器需要添加浏览器私有前缀才支持 ）。

可以这样使用这个属性：

```css
* {
	-webkit-box-sizing: border-box;
	   -moz-box-sizing: border-box;
			box-sizing: border-box;
}
```

![Browser Supported](/images/posts/stylin-with-css-note/2.5.png)

### 3.3 浮动与清除

浮动和清除是页面布局的一大利剑，分别是 `float` 和 `clear`，浮动可以让原来上下堆叠的块级元素变成左右并列，可以实现文字绕图片排列效果。浮动的元素会脱离常规的文档流，原来紧跟其后的元素会在空间允许的情况下向上提升到与浮动元素平起平坐。如果浮动元素后面有两个段落，而你只想让第一段与浮动元素并列（就算旁边还能放下第二段，也不想让它上来），就可以使用 `clear` 属性清除浮动。

#### 3.3.2 围住浮动元素的三种方法

浮动元素脱离了文档流，所以我们看不到包含它的父元素了，这种情况有时候并不是我们想要的，所以作者在本章介绍了如何围住浮动元素的三种方法。

方法一：为父元素添加 `overflow: hidden;` 强制它包围浮动元素。

这种方法在某些情况下也不适用，比如通过浮动设置的水平排列的菜单，对其父元素设置 `overflow: hidden;` 后，尽管父元素围住了它，但是如果菜单有下拉选项的话，当鼠标移动到上面的时候下拉菜单并不会显示，因为设置了 `overflow: hidden;`，所以超出父元素范围的内容都被隐藏掉了。

方法二：同时浮动父元素

父元素设置浮动后，不管其子元素是否是浮动，父元素都会紧紧地包围住它的子元素，因此需要用 `width: 100%;` 再让父元素的宽度与浏览器容器同宽。同样，尽管父元素围住了它，但是这样会导致页面中出现大量的浮动元素，而浮动元素有往往不好控制，并不利于页面的布局。

方法三：添加非浮动的清除元素

第三种强制父元素包含其浮动的子元素的方式就是给父元素的最后添加一个非浮动的子元素，然后清除该子元素，因此父元素一定会包含这个子元素以及前面的浮动元素：

```html
<section>
	<p>It's fun to float</p>
	<div class="clearfix"></div>
</section>
```

```css
p {
	float: left;
}

.clearfix {
	clear:both;
}
```

尽管这个方法能解决上面提到的两种方法中的问题，但它还不是最好的方法，因为它会在文档中添加无意义的标签，这违反了标签语义化的规则，对搜索引擎并不友好。所以如果你要清楚浮动但既不想浮动父元素又不想对父元素设置 `overflow: hidden;` 也不想增加无意义的标签的话，可以使用伪元素来清除浮动：

```css
.clearfix::after {
	content: " ";
	display: table;
	clear: both;
}
```

然后在父元素中添加 `clearfix` 类，因为搜索引擎并不会抓取伪元素，所以这种方法并没有增加无意义的标签，这里应该注意的是，CSS3 标准是用两个冒号来区别伪元素和伪类，而 CSS2.1 中不管是伪元素还是伪类都是用单个冒号表示，然而 IE8 并不支持双冒号的伪元素，所以问题就来了，如果你要遵循 CSS3 的标准使用双冒号的话就不兼容 IE8 了，如果使用但冒号的话又不符合 CSS3 标准规范，当然现在大多数还是使用但冒号的，选择哪种还是看个人的选择。

### 3.4 定位

CSS 布局的核心是 `position` 属性，对元素应用这个属性可以相对于它在常规文档流中的位置重新定位，`position` 属性有 4 个值： `static`、 `relative`、 `absolute` 和 `fixed`。

#### 3.4.1 静态定位(static)

静态定位下的块级元素会在默认文档流中上下堆叠，想要突破 `static` 定位提供的这种按顺序布局元素的方式，就必须对元素的 `position` 属性的值改为其他三个值。

#### 3.4.1 相对定位(relative)

所谓的相对定位就是相对于元素原来的位置（static 状态下的位置）进行定位，也就是说在不设置 `top`、 `right`、 `bottom` 或 `left` 的话，和它在默认(static)情况下的表现是相同的，但是如果对它设置了 `top`、 `right`、 `bottom` 或 `left` 的话，就会相对与它默认的位置进行定位。相对定位的元素可以遮住静态(static)定位的元素。可以给 `top` 和 `left` 属性设定负值，把元素向上和向左移动。

#### 3.4.2 绝对定位(absolute)

绝对定位跟静态定位和相对定位是绝对不一样的，静态定位和相对定位并不会脱离文档流，会占居原来的位置，而绝对定位会把元素彻底从文档流中拿出来，然后再相对于其他元素（这里的其他元素指的是定位上下文，默认是 `body` 元素）定位。

绝对定位的一个重要的概念就是**定位上下文**，把元素的 `position` 属性设定为 `relative`、 `absolute` 或 `fixed` 后，继而可以使用 `top`、 `right`、 `bottom` 和 `left` 属性，相对于「另一个元素」移动该元素的位置。这里的「另一个元素」就是该元素的定位上下文。

绝对定位的默认定位上下文是 `body`，这是因为 `body` 是标记中所有元素的唯一的祖先元素，而实际上，绝对定位元素的任何祖先元素都可以成为该绝对定位元素的定位上下文，只要把相应的祖先元素的 `position` 属性的值设定为 `relative` 即可。

#### 3.4.3 固定定位

从完全脱离文档流的角度说，固定定位与绝对定位类似。但不同之处在于，固定定位的定位上下文是视口（浏览器窗口），因此它不会随页面的滚动而移动。最常见的情况是用它来创建不随页面滚动而移动的导航元素。

### 3.5 显示属性

`display` 属性的值很多，但常用的除了前面提到的控制块级元素、行内元素和行内块级元素的 `block`、 `inline` 和 `inline-block` 以外，还有一个比较常用的就是 `none`，把元素的 `display` 属性的值设定为 `none` 后，该元素及所包含在其中的元素，都不会在页面中显示。他们原先战局的所有空间都会被「回收」，就好像相关元素根本不存在一样。

与此类似的属性还有 `visibility`，这个属性常用的两个值是 `visible`(默认值) 和 `hidden`，把元素的 `visibility` 属性的值设定成 `hidden` ，元素会被隐藏，但它还会占据页面中原来的空间位置。

笔者觉得有点类似定位中 `absolute` 和 `relative` 的感觉，就是 `absolute` 定位的元素的原来的位置会被「回收」（脱离文档流），就好像元素根本不存在一样（指的是原来占据的位置不存在一样），`relative` 定位的元素还会占据页面中原来的空间位置。

### 3.6 背景

背景支持为元素添加背景颜色也背景图片。

#### 3.6.1 CSS 背景属性

CSS 规定以下与背景相关属性：

```css
{
	background-color: ; // 背景颜色
	background-image: url(); // 背景图片
	background-repeat: ; // 背景重复
	background-position: ; // 背景位置
	background-size: ; // 背景尺寸 CSS3 新增属性
	background-attachment: ; // 背景粘附
	background-clip: ; // 背景
	background-origin: ; // 背景
}
```

#### 3.6.5 背景位置

	background-position：关键字 px em 百分比；

用于控制背景位置的 `background-position` 属性，是所有背景属性中最复杂的。`background-position` 有 5 个关键字值： `top`、 `right`、 `bottom`、 `left` 或 `center`，这些关键字值任意两个组合起来都可以作为该属性的值。比如 `top` `right` 表示把图片放在元素的右上角位置，`center` `center` 表示把图片放在元素的中心位置。除了这些关键字值以外还可以用百分比、`px` 和 `em` 等单位。

拓展

要是只设置一个值，则将其用来设定水平位置，而垂直位置会被设为 `center`。

在使用**关键字**和**百分比**的情况下，情况有点特殊，设定的值会同时应用于元素和图片，也就是说，如果设定了 `80%` `20%`，则图片水平 `80%` 的位置与元素 `33%` 的位置对齐，垂直方向也一样，如下图：

![background-position](/images/posts/stylin-with-css-note/2.6.png)

其他单位数值就不一样了，如果用像素单位来设定位置：

	background-position: 80px 20px;

那么图片的左上角会被放在距元素左边 `80px` 上边 `20px` 的地方。

#### 3.6.6 背景尺寸

`background-size` 是 CSS3 新增的属性，但却的到了浏览器很好的支持，这个属性用来控制背景图片的尺寸，可以给它设定的值及含义如下：

- `50%`：缩放图片，使其填充背景区的一半。

- `100px` `50px`：把图片调整到 `100px` 宽，`50px` 高。

- `cover`：拉大图片，使其完全填满背景区，并保持宽高比例。

- `contain`：缩放图片，使其恰好适应整个背景区域，并保持宽高比例。

#### 3.6.7 背景粘附

`background-attachment` 属性控制滚动元素内的背景图片是否随元素滚动而移动，这个属性默认是 `scroll`，即背景图片随元素移动，如果把它的值改为 `fixed`，那么背景图片不会随元素滚动而移动。

### 3.6.8 简写背景属性

```
background:
	[background-color]
	[background-image]
	[background-repeat]
	[background-attachment]
	[background-position] / [ background-size]
	[background-origin]
	[background-clip];
```

声明中少些了哪个属性（比如没写 `no-repeat`），就会使用相应属性的默认值（`repeat`）。

#### 3.6.9 其他 CSS3 背景属性

CSS3 新增的一些背景属性：

- `background-clip`：控制背景绘制区域的范围，比如可以让背景颜色和背景图片只出现在内容区，而不出现在内边距区域，默认情况下背景绘制区域是扩展到边框外边界的。

- `background-origin`：控制背景定位区域的原点，可以设定为元素盒子左上角以外的位置。

- `background-break`：控制分离元素（比如跨越多行的行内元素盒子）的显示效果。

`background-size`、 `background-clip` 和 `background-origin` 的浏览器支持情况还是挺不错的：

![Browser Supported](/images/posts/stylin-with-css-note/2.7.png)

#### 3.6.10 多背景图片

CSS3 还可以给元素背景条件多个背景图片：

```css
p {
	background-image: 	url(img/1.png), url(img/2.png), url(img/3.png);
	background-position:20% 20%, 30px 50px, center center;
	background-repeat:	repeat, no-repeat, repeat;
}
```

在 CSS 中，我们把每张图片的声明都单独放在了一行，以逗号分隔，以便看清他们的位置、重复的设定值等等。要注意的是，代码中先列出的图片显示在上方，或者说更接近前景，还有就是对每张背景图设置重复或者位置的时候，也要用逗号一一对应隔开。

#### 3.6.11 背景渐变

渐变就是在一定长度内两种或多种颜色之间自然过度。渐变分两种，一种是线性渐变，一种是径向渐变。线性渐变是从元素的一端延伸到另一端，径向渐变则是从元素的一点向四周发散，下面来看一个简单的线性渐变例子：

```html
<div class="gradient effect-1"></div>
<div class="gradient effect-2"></div>
<div class="gradient effect-3"></div>
```

```css

.gradient {
	width: 200px;
	height: 200px;
	margin: 0 20px;
}
/* 默认为从上到下 */
.effect-1 {
	background: -webkit-linear-gradient(#45b29a, #fff);
	background:    -moz-linear-gradient(#45b29a, #fff);
	background: 	 -o-linear-gradient(#45b29a, #fff);
	background: 		linear-gradient(#45b29a, #fff);
}
.effect-2 {
	background: -webkit-linear-gradient(left, #45b29a, #fff);
	background:    -moz-linear-gradient(left, #45b29a, #fff);
	background: 	 -o-linear-gradient(left, #45b29a, #fff);
	background: 		linear-gradient(to right, #45b29a, #fff);
}
.effect-3 {
	background: -webkit-linear-gradient(45deg, #45b29a, #fff);
	background:    -moz-linear-gradient(45deg, #45b29a, #fff);
	background: 	 -o-linear-gradient(45deg, #45b29a, #fff);
	background: 		linear-gradient(45deg, #45b29a, #fff);
}
```

![Gradient](/images/posts/stylin-with-css-note/2.8.png)

上面展示了三种简单的渐变效果，默认情况下渐变方向是从上到下的如图一，例 2 起点关键字 `left` 意思是渐变方向从左到右，例 3 中的 `45deg` （顺时钟旋转 45 度）相当于把起点从默认的中上设定到了又上。

##### 3.6.11.1 渐变点

渐变点就是渐变方向上的点，可以在这些点上设定颜色和不透明度。可以添加任意多个渐变点：

```html
<div class="gradient effect-1"></div>
<div class="gradient effect-2"></div>
<div class="gradient effect-3"></div>
<div class="gradient effect-4"></div>
```

```css
.gradient {
	width: 200px;
	height: 200px;
	margin: 0 20px;
}
/* 50% 处有一个渐变点 */
.effect-1 {
	background: -webkit-linear-gradient(#45b29a, #fff 50%, #45b29a);
	background:    -moz-linear-gradient(#45b29a, #fff 50%, #45b29a);
	background: 	 -o-linear-gradient(#45b29a, #fff 50%, #45b29a);
	background: 		linear-gradient(#45b29a, #fff 50%, #45b29a);
}
/* 20% 和 80%处有一个渐变点 */
.effect-2 {
	background: -webkit-linear-gradient(#45b29a 20%, #fff 50%, #45b29a 80%);
	background:    -moz-linear-gradient(#45b29a 20%, #fff 50%, #45b29a 80%);
	background: 	 -o-linear-gradient(#45b29a 20%, #fff 50%, #45b29a 80%);
	background: 		linear-gradient(#45b29a 20%, #fff 50%, #45b29a 80%);
}
/* 25%、50% 和 75% 处有一个渐变点 */
.effect-3 {
	background: -webkit-linear-gradient(#45b29a, #fff 25%, #45b29a 50%, #fff 75%, #45b29a);
	background:    -moz-linear-gradient(#45b29a, #fff 25%, #45b29a 50%, #fff 75%, #45b29a);
	background: 	 -o-linear-gradient(#45b29a, #fff 25%, #45b29a 50%, #fff 75%, #45b29a);
	background: 		linear-gradient(#45b29a, #fff 25%, #45b29a 50%, #fff 75%, #45b29a);
}
/* 为同一个渐变点设定两种颜色可以的到突变的效果 */
.effect-4 {
	background: -webkit-linear-gradient(#45b29a, #fff 25%, #45b29a 25%%, #45b29a 75%, #fff 75%, #45b29a);
	background:    -moz-linear-gradient(#45b29a, #fff 25%, #45b29a 25%%, #45b29a 75%, #fff 75%, #45b29a);
	background: 	 -o-linear-gradient(#45b29a, #fff 25%, #45b29a 25%%, #45b29a 75%, #fff 75%, #45b29a);
	background: 		linear-gradient(#45b29a, #fff 25%, #45b29a 25%%, #45b29a 75%, #fff 75%, #45b29a);
}
```

![Gradient](/images/posts/stylin-with-css-note/2.9.png)

例 1，如果不是使用百分比或其他值声明渐变点的位置，三种颜色会均匀分布于整个渐变。

例 2，演示了起点和终点不是 0% 和 100% 时的情形。此时，在第一个渐变点(20%)之前，是第一个渐变点声明的实色，而在该点之后，则是从该颜色到下一个渐变点颜色的过度。同样，在最后一个渐变点(80%)之后，该渐变点的颜色会以实色扩展到元素结束。

例 3，简单展示了相同颜色在几个渐变点之间变来变去的效果。

例 4，展示了在同一个渐变点声明两种不同颜色，能实现一种突变的效果。

##### 3.6.11.2 径向渐变

在创建径向渐变的时候，可以使用参数指定形状、位置、尺寸、颜色和不透明度：

```html
<div class="gradient effect-1"></div>
<div class="gradient effect-2"></div>
<div class="gradient effect-3"></div>
```

```css
.gradient {
	width: 300px;
	height: 200px;
	margin: 0 20px;
}
.effect-1 {
	background: -webkit-radial-gradient(#fff, #45b29a);
	background:    -moz-radial-gradient(#fff, #45b29a);
	background: 	 -o-radial-gradient(#fff, #45b29a);
	background: 		radial-gradient(#fff, #45b29a);
}
.effect-2 {
	background: -webkit-radial-gradient(circle, #fff, #45b29a);
	background:    -moz-radial-gradient(circle, #fff, #45b29a);
	background: 	 -o-radial-gradient(circle, #fff, #45b29a);
	background: 		radial-gradient(circle, #fff, #45b29a);
}
.effect-3 {
	background: -webkit-radial-gradient(50px 30px, circle, #fff, #45b29a);
	background:    -moz-radial-gradient(50px 30px, circle, #fff, #45b29a);
	background: 	 -o-radial-gradient(50px 30px, circle, #fff, #45b29a);
	background: 		radial-gradient(50px 30px, circle, #fff, #45b29a);
}
```

![Gradient](/images/posts/stylin-with-css-note/2.10.png)

例 1，展示了默认的渐变形状，即渐变效果会填充元素，这里是矩形，如果元素是正方形，那渐变就是圆形：

![Gradient](/images/posts/stylin-with-css-note/2.11.png)

例 2，设定了关键字 `circle`，于是渐变形状变得均匀，并在元素最近的边达到终点，形成了圆形渐变。而长边剩下的区域则填充了终点的颜色。

例 3，位置参数 `50px 30px` 把渐变的圆心放到了靠近左上角的位置。

## 总结

本章的内容不少，都是一些很重要的概念，比如盒模型、定位元素、浮动与清除浮动和元素背景属性。

到目前为止，也对 《CSS 设计指南》 的重点知识进行了总结，当然可能有些地方总结的不够好，如有不对的地方欢迎指出和讨论急。
