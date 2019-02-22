---
layout: 		post
title: 			CSS 设计指南 学习笔记 一
excerpts: 		"本篇文章是对这几天看完 Charles Wyke-Smit 的 《CSS 设计指南》 后的一些学习笔记与心得。"
categories: 	CSS
follow:         ['/images/follow.png', '更多干货请关注公众号 <span>前端小专栏</span>']
---

由于 CSS 作用的对象是 HTML ,所以作者在这章主要先讲了一些基本的 HTML 标签的用法和结构。

### 1.2 HTML 文档剖析

作者在这节主要讲了一个 HTML 页面所需的最基本的文档结构如下：

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<!-- 这里是网页内容 -->
</body>
</html>
```

首先 `<!DOCTYPE html>` 是 HTML5 中新的文档类型声明语法，相比 HTML4 的冗长文档类型声明语法来说 HTML5 是大大的简化了。

#### 1.2.2 块级元素和行内元素

作者在这一节介绍了两个比较重要的概念————块级元素和行内元素，默认情况下块级元素会始终占居一行，而行内元素并不会。除了 table 元素的 display 属性比较特殊以外，基本上所有的 HTML 元素的 display 的属性值要么是 block，要么是 inline。作者的一个思想是，无论你想了解哪个 HTML 元素，第一个要问的问题就是：它是块级元素还是行内元素，然后在编写标记的时候预想到这个元素在初始状态下是如何定位的，这样才能进一步想好将来怎么用 CSS 重新定位它，因为块级元素和行内元素在定位上有很大的区别，后面的拓展会详细说明。

块级元素盒子（一个很重要的概念————盒模型，后面会详细说明）会扩展到与父元素同宽，这也是为什么块级元素会占居一行的原因了，因为所有块级元素的父元素都是 body，而它的默认宽度就是浏览器的视口（viewport）大小，所以默认情况下块级元素的宽度也和浏览器的视口一样宽，这样以来，一个块级元素旁边也就没有空间来容纳另一个块级元素了。

相比于块级元素会扩展到与父元素同宽，然而行内元素的行为却是恰恰相反，它会尽量的「收缩包裹」其内容（也是盒模型的概念），这也就是为什么几个行内元素会并排显示在一行直到它们排满一行才会另起一行，而每个块级元素会直接另起一行的原因了。

拓展：

作者在这一节中并没有对块级元素和行内元素的一些其他特性进行详细的解释，在这里笔者对它们的一些特性知识进行拓展。首先先列出一些常见的块级元素和行内元素：

```html
<!-- 常见的块级元素 -->
div, form, table, header, aside, section, article, figure, figcaption, h1~h6, nav, p, pre, blockqoute, canvas, ol, ul, dl

<!-- 常见的行内元素 -->
span, a, img, label, input, select, textarea, br, i, em, strong, small, button, sub, sup, code
```

之前作者提到过无论你想了解哪个 HTML 元素，第一个要问的问题就是：它是块级元素还是行内元素，因为它们在盒模型上的表现有很大的不同，不过在了解它们的不同之前我们还得先知道另外一个概念————[替换元素](http://www.w3.org/TR/html5/rendering.html#replaced-elements)和[非替换元素](http://www.w3.org/TR/html5/rendering.html#non-replaced-elements)，其中替换元素就是指浏览器是根据元素的属性来判断具体要显示的内容的元素，比如 `img` 标签，浏览器是根据其 `src` 的属性值来读取这个元素所包含的内容的，常见的替换元素还有 `input` 、`textarea`、 `select`、 `object`、 `iframe` 和 `video` 等等，这些元素都有一个共同的特点，就是浏览器并不直接显示其内容，而是通过其某个属性的值来显示具体的内容，比如浏览器会根据 `input` 中的 `type` 的属性值来判断到底应该显示单选按钮还是多选按钮亦或是文本输入框。而对于非替换元素，比如 `p`、`label` 元素等等，浏览器这是直接显示元素所包含的内容。看到这里你应该大概的知道了什么是替换元素和非替换元素了。

对着两个概念有了大概的了解后就可以对 `block` 和 `inline` 在盒模型上的表现差异进行了解了，首先是 `margin` ，[W3C](http://www.w3.org/TR/CSS2/box.html#margin-properties) 对其所支持了元素对象是这么定义的：

> Applies to: all elements except elements with table display types other than table-caption, table and inline-table

英语不是很好，没太明白这句话的意思，我的理解就是所有元素都支持 `margin` 除了 `display` 属性值为 `table-caption` 和 `table-inline` 以外的所有表格显示类型比如 `table-row-group`、 `table-cell`、 `table-row` 和 `table-header-group`等等,但是为了验证我的理解，我发先 `display` 属性值为 `table` 的元素也支持，可能是我对原文标准的理解有误。但还有一个要特别注意的是 `margin-top` 和 `margin-bottom` 两个属性比较特殊，它们对非替换行内元素没有效果，下面是 W3C 上对于 `margin-top` 和 `margin-bottom` 支持对象的介绍：

> Applies to: all elements except elements with table display types other than table-caption, table and inline-table
>
> These properties have no effect on non-replaced inline elements.

前面一句和之前对 `margin` 的描述是一样的，这毫无疑问，下面这句话的意思是这些（ `margin-top` 和 `margin-bottom` ）属性对非替换行内元素没有效果比如 `a` 和 `span`，注意这里是**非替换行内元素**而不单单是非替换元素或者是行内元素。比如 `img` 就是一个行内元素， `margin-top` 和 `margin-bottom` 对它是有效果的，因为它是一个替换元素而不是非替换元素，所以对于「 `margin-top` 和 `margin-bottom` 对行内元素没有效果」这种说法是不对的。

而对于 `padding` 的支持对象，W3C 是这么描述的：

> all elements except table-row-group, table-header-group, table-footer-group, table-row, table-column-group and table-column

上面这句话的意思是除了表格显示类型为 `table-row-group`、 `table-header-group`、 `table-footer-group`、 `table-row`, `table-column-group` 和 `table-column` 的元素不支持，其他所有的元素都支持。

但这里有些特殊情况需要注意的是，对行内元素比如 `span` 和 `img` 设置左右内边距的效果是可见可，但是对行内元素设置上下内边距在有些情况下是不可见的，这些情况又要分为是否为替换元素和是否设置了背景色，为了能更直观的了解这些概念，我在这里做了个表格：


padding-top 和 padding-bottom 对于行内元素是否可见：

<table>
	<thead>
		<tr>
			<th></th>
			<th>替换元素（e.g: input）</th>
			<th>非替换元素（e.g: span）</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>设置背景色</td>
			<td>可见，影响行高，会撑开父元素</td>
			<td>可见，不影响行高，不会撑开父元素</td>
		</tr>
		<tr>
			<td>没有设置背景色</td>
			<td>可见，影响行高，会撑开父元素</td>
			<td>不可见，不影响行高，不会撑开父元素</td>
		</tr>
	</tbody>
</table>

所以对于「 `padding-top` 和 `padding-bottom` 对行内元素没有效果」这种说法也是不对的，因为它们只是对于没有设置背景色的行内非替换元素效果不可见而已，而对于行内替换元素来说，不管是否设置了背景色都是有效果了，并且会把父元素撑开。

说了这么多 `block` 和 `inline-block` 的区别，其实除了这两个常见的 `display` 属性以外还有一个属性也是非常常见的，那就是 `inline-block` ，没错，这就是前面两种情况的结合体，它既有 `block` 的特性又有 `inline` 的特性，比如把一个 `display` 属性值为 `block` 或者 `inline` 的元素属性值设置成 `inline-block` 后，既可以用只对行内元素有效的 `text-align: center;` 声明对其进行居中以外，还可以用 `padding-top` 和 `padding-bottom` 对元素设置上下内边距而无需对其设置背景色，并且能把父元素撑开。

对于块级元素和行内元素的拓展就暂时到这，如果有不明白或者不对的地方也欢迎指出。

### 1.3 文档对象模型

作者在这一小节只要介绍了 HTML 结构所对应的文档对象模型（DOM,Document Object Model）,DOM 是从浏览器的视角来观察页面中的元素以及每个元素的属性，由此可以得出这些元素的一个家族树。通过 DOM 可以很清晰的看出文档中每个元素之间的关系。比如下面的 HTML 代码的 DOM 的家族树就如下图：

```html
<body>
	<section>
		<h1>The Document Object Model</h1>
		<p>The page's HTML markup structure defines the DOM.</p>
	</section>
</body>
```

![DOM](/images/posts/stylin-with-css-note/dom.png)

上面是一个非常简单的 DOM 结构图，由此你可以和直观的看出 HTML 文档流中每个元素之间的关系，比如到底是父子元素还是兄弟元素。

### 1.4 小结

作者在本章主要讲解了 HTML 标签是怎么为内容提供结构的，以及每个元素会在屏幕上生成什么样子的盒子，比如是行内盒子还是块级盒子，最后又简单的讲解了什么是 DOM ，它是浏览器中文档的模型，而 CSS 可以修改 DOM 中的元素样式属性，从而修改页面本身的布局和外观。

## 第二章 CSS 工作原理

在本章中作者主要讲解了 CSS 如何对 HTML 添加样式的，并且解释了层叠的工作机制比如当元素的同一个属性被多次设置样式后到底应该选择何种样式，这就要靠 CSS 的层叠机制来决定最终应用哪种样式了。

每个 HTML 元素都有一组样式属性，这些属性涉及元素在文档流中显示时的不同方面，比如在文档流中的位置、边框、背景、颜色等等。CSS 就是一种先选择 HTML 元素，然后设定选中元素 CSS 属性的机制。CSS 选择符和要应用的样式构成一条 CSS 规则。

### 2.2 上下文选择器

上下文选择器的格式如下：

	标签1 标签2 ｛ 声明｝

其中标签2就是我们要选择的目标，而且只有在标签1是标签2的祖先元素（不一定是父级元素）的情况下才会被选中。上下文选择器严格来讲应该叫「后代组合式选择器（Descendant Comninator Selector）」。

还有一点要注意的是，上下文选择器以空格作为分隔符，而分组选择器则以逗号作为分隔符，不要弄混。

### 2.3 特殊的上下文选择器

前面一节作者介绍的上下文选择器是以某个祖先元素作为上下文的，只要目标元素在 DOM 结构「上游」存在这么一个祖先元素即可，无论这个祖先元素和目标元素隔了多少层级都没有关系，但有的时候我们需要比「某个祖先元素」更具体的上下文，这时候我们就可以使用一些特殊的选择器了，比如自选择器 `>`、 紧邻兄弟选择器 `+`、一般兄弟选择器 `~` 和通用选择器 `*`。

#### 2.3.1 子选择器 >

	标签1 > 标签2

这里的标签2必须是标签1的子元素，也就是说标签1必须是标签2的父元素，而不能是标签2的任何其他祖先元素。

#### 2.3.2 紧邻兄弟选择器 +

	标签1 + 标签2

在这里标签2必须紧跟在兄弟标签1的后面，否则无效。

#### 2.3.3 一般兄弟选择器 ~

	标签1 ~ 标签2

在这里标签2必须跟（不一定要紧跟，只需在标签1的后面即可）在其兄弟标签1后面。

#### 2.3.4 通用选择器 *

通用选择器 `*` 是一个是一个通配符，代表文档流中的任意元素，不过通用选择器 `*` 通常会搭配一些其他选择器来使用，比如：

```css
section > * {}
```

代表 `section` 的所有子元素，不过一般情况下很少通过通配符来选择某个元素下的所有子元素，因为这涉及到浏览器性能问题，它会影响网页的渲染时间，我们写的时候是从左到右写的，但是浏览器渲染却是从右到左的，就上面这段代码来说，浏览器会先遍历所有的元素，然后在找出哪些元素的父元素是 `section`，另外举一个例子，有选择器：

```css
div.container #main > .article {}
```

浏览器在渲染时，先把所有类中包含 `article` 的元素取出来组成一个集合，然后对每一个集合中的元素进行遍历，如果元素的父元素的 `id` 不为 `main` 则把元素从集合中删去。 再然后从这个元素的父元素开始向上找，没有找到一个标签名为 `div` 并且类名中有 `container` 的元素，就把元素从集合中删去，直到匹配所有的条件，所以在能不使用通配符的情况就尽量不要使用它。

### 2.4 ID 和类选择器

作者在这一节介绍了 `id` 和 `class` 选择器，为我们选择元素提供了另一种手段，利用它们可以不考虑元素在文档流中的层次结构，只要在元素中添加了 `id` 和 `class` 属性和值，我们就可以通过它们的值来找到目标元素。

> 可以给 `id` 和 `class` 属性设定任何值，但不能以数字或者特殊符号开头。

#### 2.4.3 什么时候用 id，什么时候用 class

`id` 的用途是在页面中唯一地标识元素，所以每个页面中每一个 `id` 属性值都是独一无二的。而 `class` 的目的是为了标识一组具有相同特征的元素，也就是说一个页面中可以出现多个相同的类。

对于什么时候用 `id` 这个问题作者的观点是：

> 每一个顶级区域都应该添加一个 `id`，从而得到非常明确的上下文关系，以便编写 CSS 时只选择嵌套在相应区域内的标签。

对于什么时候使用 `class`，由于 `class` 的目的是为了标识一组具有相同特征的元素，所以如果当页面中有一组元素具有某种相同的特征，就应该毫不犹豫的时候 `class` 了。

但是这里也应该注意不要乱用类，避免造成类泛滥，例如：

```html
<nav>
	<ul>
		<li class="boy"><a href="#">Alan</a></li>
		<li class="girl"><a href="#">Andrew</a></li>
		<li class="boy"><a href="#">Angela</a></li>
		<li class="boy"><a href="#">Angus</a></li>
		<li class="girl"><a href="#">Anne</a></li>
		<li class="girl"><a href="#">Annette</a></li>
	</ul>
</nav>
```

上面这个例子就是一个典型的类泛滥。

#### 2.4.4 id 和 class 的小结

对于什么时候用 id 和什么时候用 class，我想每个人都有不同的看法，这里写说一下笔者的观点，笔者认为能不实用 `id` 就尽量不使用 `id`，实际情况是笔者基本不在 CSS 中使用 `id`，因为在 CSS 的层叠机制中，`id` 的权重是 `class` 的10倍，其实很多情况下对某个元素设置某个不一样的样式来覆盖之前的样式并没有效果就是因为之前的样式权重太高，而为了达到效果就要编写权重更高的选择器，所以只有在某个元素需要被 JavaScript 找到的时候才会在某个元素中添加 `id` ，以便可以通过 `document.getElementById()` 方法来快速获取需要的元素。

### 2.5 属性选择器

属性选择器包括属性名选择器和属性值选择器，它们是通过元素的属性和值来获取元素的：

	标签名[属性名]
	标签名[属性名="属性值"]

例如：

```css
img[title] {border: 2px solid blue;}
a[target="_blank"] {background-image: url(_blank.png);}
```

上面第一段代码意思是，如果某个 `img` 标签带有 `title` 这个属性，那么就为它添加一个宽度为 2px 的蓝色实线边框。第二段代码的意思是，如果某个 `a` 标签带有 `target` 这个属性，并且这个属性的值为 `_blank` 那么就为这个元素添加一个背景图。

拓展：

其实除了以上两种属性选择器，还有其他几种属性选择器作者并没有列出来，这里这几种其他的属性选择器作一个简单的介绍：

- 标签名[name^="value"]  让你匹配属性为 `name` 并且属性值以 `value` 开始的标签，如:a[href^= "http://"]则匹配所有具有 `href` 属性并且属性值以 `http://` 开始的标签。

- 标签名[name$="value"]  让你匹配属性为 `name` 并且属性值以 `value` 结束的标签，如:a[href$=".com"]则匹配所有具有 `href` 属性并且属性值以 `http://` 结束的标签。

- 标签名[name*="value"]  让你匹配属性为 `name` 并且属性值包含 `value` 的标签，如:a[href*= "renren"]则匹配所有具有 `href` 属性并且属性值包含 `http://` 的标签。

- 标签名[name|="value"]  让你匹配属性为 `name` 或者以 `name-` 开始的标签，如:p[lang|= "en"]则匹配具有 `lang` 属性的 `p` 标签，不管其属性值是 `en` 还是 `en-us` 。

- 标签名[name~="value"]  让你匹配属性为 `name` 并且其属性值是具有多个空格分隔的值，其中一个值为 `value`，如有：
    ```html
<a title="I'm title for learn more">Learn More</a>
    ```

	就可以用 p[title~="learn"] 来选择这个元素。

你应该注意到了这些属性选择器与前面两种属性选择器之间的差别了，通过这些属性选择器我们可以很容易的做出许多意想不到的效果，比如：

```css
a[href$=".pdf"] {background-image: url(pdf.png);}
```

比如上面这段代码就为链接是 pdf 文档连接的 `a` 标签添加一个表示这个链接是 pdf 文档的图片，而其他 `href` 属性的值不是以 `.pdf` 结尾的 `a` 标签就不会应用这条样式声明，让用户很清楚的判断这是一个什么类型的链接。

### 2.6 伪类

伪类这个叫法源自它们与类相似，但实际上并没有类会附加到标记中的标签上，伪类分为两种：

- UI（User Interface，用户界面）伪类：会在 HTML 元素处于某个状态时（比如鼠标指针位于连接上），为该元素应用 CSS 样式。

- 结构化伪类：会在标记中纯在某种结构上的关系时（比如某个元素是一组元素的第一个或者最有一个元素），为相应的元素应用 CSS 样式。

#### 2.6.1 UI 伪类

1. 链接伪类

	- link: 链接就在那儿等着用户点击。

	- visited:用户此前点击过这个链接。

	- hover:鼠标指针正悬停在连接上。

	- active:链接正在i被点击（鼠标在元素上按下，还没有释放）。

	注意以上几种链接伪类要按一定的顺序才有效果，为了方便记忆作者是这么建议的："LoVe?HA!"，大写字母就是每个伪类的第一个字母，其实也可以这么记： "LoVe,HAte"，其实都差不多就是了。

	> 一个冒号（:）表示伪类，两个冒号（::）表示 CSS3 新增的伪元素。

2. :focus 伪类

	表单中的文本字段在用户单击它时会获得焦点，例如：

		input:focus {border: 1px solid blud;}

	这段代码的意思就是当用户单击表单中的文本字段的时候，为该 `input` 标签添加宽度为 1px 的蓝色实线边框，需要注意的是，伪类的冒号要紧跟着标签名，之间不能有空格，否则该声明无效。

3. :target 伪类

	如果用户点击一个指向页面中其他元素的链接，则哪个元素就是目标（target），可以用 `:target` 伪类选中它，比如：

		<a href="#more-info">More Information</a>

	位于页面其他地方、`id` 为 `more-info` 的那个元素就是目标元素，该元素可能是这样的：

		<h2 id="more=info">This is the information you are looking for.</h2>

	那么 CSS 规则如下：

		#more-info:target {background: #eee;}

	此时会在用户点击链接转向 `id` 为 `more-info` 的元素时，该目标元素的背景就会变成浅灰色。

#### 2.6.2 结构化伪类

1. `first-child`, `last-child` 和 `nth-child(n)`

		e:first-child
		e:last-child

	`first-child` 和 `last-child` 分别代表一组同胞元素中的第一个元素和最后一个元素，而 `nth-child(n)` 则代表一组同胞元素中的任何一个元素，其中 `n` 表示一个整数（也可以是 odd-奇数 或 even-偶数）或者也可以是一个算数表达式（2n + 1），例如：

		<ul>
			<li>My Fast Pony</li>
			<li>Steady Trotter</li>
			<li>Slow Ol' Nag</li>
		</ul>

		ul li:first-child {color: black;}
		ul li:nth-child(2) {color: red;}
		ul li:last-child {color: blue;}

	上面的 HTML 应用了上面的 CSS 规则后，无序列表的第一个元素字体颜色就会变成黑色，第二个元素变成红色，最后一个元素就变成蓝色。

### 2.7 伪元素

顾名思义，伪元素就是文档中若有实无的元素，下面是几个比较常用的伪元素。

1. ::first-letter 伪元素，比如：

		p::first-letter {font-size: 300%;}

	这样 `p` 标签的第一个字母大小就会变成原来的 3 倍了，而其他元素则不会。

2. ::first-line 伪元素：可以选中文本段落的第一行。
3. ::before 和 ::after 伪元素

		e::before
		e::after

	可用在特定元素前面或后面添加特殊内容，比如：

		<p class="age">25</p>

		.age::before { content: "Age: ";}
		.age::after { content: " years";}

	这里需要注意的是，对于 `::before` 和 `::after` 伪元素，其 `content` 属性是必须的，还有就是搜索引擎不会取得伪元素的信息（因为它在文档流中并不存在），因此不要通过伪元素添加一些对搜索引擎来说是重要的内容。

拓展：

其实伪元素前面冒号可以是两个也可以是一个，但是为了区别伪类，笔者建议大家还是使用两个冒号。还有一个要注意的是，比如通过 `::before` 和 `::after` 伪元素为 `class` 为 `pseudo-element` 添加两个伪元素，则生成的两个伪元素分别处于 `pseudo-element` 元素的内部，也就是说是 `pseudo-element` 元素的子元素，并且分别位于 `pseudo-element` 元素的内容的最前面和最后面，代码如下：

```html
<div class="pseudo-element">
	<p>Pseudo Element</p>
</div>

<style>
.pseudo-element::after,
.pseudo-element::before {
	content: "";
}
</style>
```

![Pseudo Element](/images/posts/stylin-with-css-note/pseudo-element.png)

如上图所示，生成的两个伪元素分别处于 `pseudo-element` 元素的内部，并且分别位于 `pseudo-element` 元素的内容 `p` 标签的前面和后面，而不是如下图所示的位于 `pseudo-element` 元素外部的前面和后面：

![Pseudo Element](/images/posts/stylin-with-css-note/pseudo-element-2.png)

### 2.9 层叠

层叠就是层叠样式表中的层叠，是一种样式在文档层次中逐层叠加的过程，目的是让浏览器面对某个标签特定属性值的多个来源确定最终使用哪个值。

层叠是 CSS 的核心机制，理解了它才能以最经济的方式写出最容易改动的 CSS,让文档外观在达到设计要求的同时，也给用户留下一些空间，让他们能根据需要更改文档的显示效果。

#### 2.9.1 样式来源

作者在这一节中介绍了样式的几种来源：

- 浏览器默认样式表

- 用户样式表

- 作者链接样式表

- 作者嵌入样式

- 作者行内样式

作者在书中是这么描述的：

> 浏览器会按照上面的顺序依次检查每个来源的样式，并在有定义的情况下，更新对每个标签属性值的设定，整个检查更新过程结束后，再将每个标签以最终设定的样式显示出来。

#### 2.9.4 计算特指度

作者在这一节主要介绍了特指度的计算方法，相比作者个计算方式，笔者个人还是比较喜欢自己之前的计算方式，虽然差不多，如下：

首先规定四个等级：A - B - C - D

1. A 等级代表内联样式：例如 `style=" "`，权值为：1000；
2. B 等级代表 ID 选择器：例如 `#main`，权值为：100；
3. C 等级代表类、伪类和属性选择器： `.class` 和 `[title]`，权值为：10；
4. D 等级代表元素（标签）名或者伪元素选择器：例如 `p` 和 `::after`，权值为：1。

计算完每个值后再将每个值加起来，哪个值大哪个值的权重就高。

例如:

```css
body #main .class a[title]::after {}
```

我们先分析它由哪些选择器构成，上面这条规则有一个 `id` 选择器（`#main`），一个类选择器（`.class`），一个属性选择器（`[title]`）、一个伪元素选择器(`::after`)和两个标签名选择器（`body` 和 `a`），所以它的权重就等于：

	 100 × 1 + 10 × 2 + 1 × 3 = 123

还有一点要注意的是，权重值 001(12) 与 0020 相比，任然是 0020 的权重更高，对于权重一样的情况，则后声明的样式更高。

### 2.10 小结

作者在本章介绍了 CSS 的一些规则，比如各种选择器的使用，层叠机制，还有权重的计算。
