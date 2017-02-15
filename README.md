<img src="assets/logo.png" />



# LCL
[![Build Status](https://travis-ci.org/PengJiyuan/LCL.svg?branch=master)](https://travis-ci.org/PengJiyuan/LCL)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

Light Canvas Library [Demo](https://pengjiyuan.github.io/LCL)

## Install

**通过 npm**    

`npm install lcl --save`     

```javascript
var LCL = require('lcl');
console.log(LCL); // ...
```

**下载**    

下载源代码, 使用 `dist/lcl.min.js`    

```html
<script src="path/lcl.min.js"></script>
<script>
    console.log(LCL);// ...
</script>
```

## 使用

1.3.0改版， 支持多canvas绘制， 使用方法基本没变，只添加一个world角色。

* **Stage**    

初始化

var world = new LCL();

初始化舞台(Canvas)

```javascript 
  var stage = world.init({
    element: document.getElementById('canvas'),
    width: 500,
    height: 500,
    enableGlobalTranslate: true // 等同于 stage.globalTranslate(true)
  });
```

全局拖拽位移

```javascript
 stage.globalTranslate(true);
```

* **添加形状**

由 __LCL.shape__ 改为 __world.shape [ new LCL().shape ]__ 

> 目前只支持画指定的图形，如需自定义图形可以拉下源代码之后在shapes中按照我给定的格式添加自定义图形。

矩形

```javascript
var rect = world.rectangle({
  startX: 0,
  startY: 0,
  width: 110,
  height: 110,
  fillColor: '#514022'，
  zindex: 2 // 设置图形的z-index
});
```

线条

```javascript
var line = world.line({
  startX: 200,
  startY: 100,
  endX: 400,
  endY: 420，
  zindex: 3
});
```

图片

```javascript
// 简单图片， 只指定起始坐标和宽高
var image = world.image({
  startX: 0,
  startY: 0,
  width: 800,
  height: 500,
  src: './img/timg.jpg',
  zindex: 1
});

// 图片切割 (对照原生api)
var image3 = world.image({
  startX: 200,
  startY: 200,
  width: 97,
  height: 110,
  sliceX: 5,
  sliceY: 0,
  sliceWidth: 97,
  sliceHeight: 110,
  src: './img/action.png',
  zindex: 10
});
```

文字

```javascript
var text = world.text({
  startX: 300,
  startY: 40,
  width: 150,
  height: 40, // startX, startY, width, height指定了一个矩形， 文字就在其中
  paddingTop: 8, // 用于调整文字在矩形中的位置
  center: true,  // 文字居中
  backgroundColor: 'blue', // 给文字添加背景颜色(矩形)
  font: 'italic bold 20px arial,sans-serif', // 文字样式
  text: 'Hello World', // 文字内容
  color: '#fff', // 文字颜色
  type: 'fill' // fill -- 填充， stroke -- 描边,
  zindex: 4
});
```

圆

```javascript
var arc = world.arc({
  x: 400,
  y: 400,
  radius: 30,
  color: 'rgba(255, 255, 255, 0.5)',
  type: 'fill' // fill -- 填充， stroke -- 描边,
  zindex: 2
});
```

扇形

```javascript
var arcb = world.arc({
  x: 130,
  y: 380,
  radius: 100,
  startAngle: 45,
  endAngle: 165,
  color: '#512854',
  style: 'fill'
});
```

坐标系

```javascript
world.coord({
  startX: 0, // 坐标系的左上起点的x坐标
  startY: 0, // 坐标系的左上起点的y坐标
  width: 800, // 坐标系的宽度
  height: 600, // 坐标系的高度
  xAxis: {
    data: ["C#", "PHP", "JS", "C", "C++"] // 坐标系的横坐标
  },
  yAxis: {}, // 暂不支持
  series: [{
    data: [-0.11358, -0.622, 0.33, 0.44, 0.5555] // 要展示的数据，不过这个仅仅用来构建y轴区间，不展示数据
  }],
  boundaryGap: true, // 横坐标展示在区间中心还是左侧
  backgroundColor: '#F3F3F3' // 坐标系的背景颜色
})
```

* **给添加的形状(对象)添加事件**

支持链式调用  

```javascript
rect.on('mousedown', function(){
  console.log('you click rect');
}).on('mousemove', function() {
  console.log('you move!');
}).on('mouseleave', function() {
  console.log('you leave!');
}).drag(true).config(){...};
```

* **config**

```javascript
  rect.config({
    drag: true, // 允许形状(对象)被拖拽  
    changeIndex: true， // 在形状被选中的时候允许改变个形状展示的顺序
    fixed: true, // 免受globalTranslate的影响
    bg: true // 暂时没效果
  });
  
  //equals
  
  rect.drag(true);
  rect.changeIndex(true);
  rect.fixed(true);
  rect.bg(true);
```

* **将画的形状添加到舞台中，没有这步的话无法渲染**

```javascript
stage.addChild(rect);
stage.addChild(line);

// or

stage.addChild([rect, line, arc1, text1]);
```

* **渲染**

```javascript
stage.show();
```

* **动画**

```javascript
function go() {
  rect.rotate++;
  line.rotate = line1.rotate + 2;
  stage.redraw();
}

var a = stage.animate(go);
```

* **停止动画**

```javascript
stage.stop(a);
```

## 示例代码

```javascript
var stage = world.init({
  element: document.getElementById('canvas'),
  width: 500,
  height: 500,
  enableGlobalTranslate: true
});

var rect = world.rectangle({
  startX: 120,
  startY: 120,
  width: 200,
  height: 200,
  fillColor: '#'+(~~(Math.random()*(1<<24))).toString(16)
}).on('mousedown', function() {
  console.log('click rect2');
}).on('mouseenter', function() {
  rect.fillColor = '#'+(~~(Math.random()*(1<<24))).toString(16);
  stage.redraw();
}).on('mouseleave', function() {
  rect.fillColor = '#'+(~~(Math.random()*(1<<24))).toString(16);
  stage.redraw();
}).on('dragin', function() {
  console.log('drag in rect2');
  rect.fillColor = '#ffffff';
  stage.redraw();
}).on('dragout', function() {
  console.log('drag out rect2');
  rect.fillColor = '#'+(~~(Math.random()*(1<<24))).toString(16);
  stage.redraw();
}).on('drop', function() {
  console.log('you drop on the rect2!');
  rect.fillColor = '#000';
  stage.redraw();
}).config({
  drag: true,
  changeIndex: true
});

stage.addChild(rect);

stage.show();
```

## History

### v1.0.0
* 添加矩形，线的绘制
* 已on的形式给对象添加事件
* 全局拖拽位移和缩放
* 对象的拖拽位移

### v1.1.0
* 优化事件触发器，新增`dragin` `dragout` `drop`事件， 用于对象之间的交互， 模拟原生的drag and drop。
* 新增对象之间的**两两交互**，和原生drag，drop类似，不过简化为了dragin, dragout, drop， 这三个事件可以完美解决两两交互, **注意**这三个属性是作为contaner的一方添加。
* 结合**外部drag，drop**，和页面内交互。LCL作为一个全局变量，包含了一切需要的数据，何以直接结合外部drag，drop操作objects数组，然后重绘。
* 优化事件触发的顺序(order)， 支持改变对象绘制的顺序。
* 对象添加属性链式调用。XX.on(..).on(..).config(...).drag(...)...
* 优化点在形状内的判断，添加形状旋转后的判断...

#### v1.1.1
* 添加scripts文件，新增release脚本，自动化更新版本，提交代码。
* 添加eslint， 和pre-commit脚本。

### v1.2.0
* config添加fixed, bg 。 `fixed:ture` --> globalTranslate对当前对象无效
* 暂时移除rotate
* 添加图片加载器
* 添加 drag,dragend事件， 用于对象在拖拽和拖拽结束的时候触发，drop事件的callback添加item回调， `on('drop', function(item) {console.log(item)})` item是被拖拽的对象。
* 添加图形 arc,text,image..
* 优化Event

### v1.3.0
* 由于之前的设定， 只有一个全局变量LCL，而所有的信息，包括全局位置信息等都储存在着一个全局变量之中，导致无法绘制多个canvas，他们会共享一个全局变量。所以改版，支持多canvas绘制。

#### v1.3.1
* 绘制图形增添zindex, 默认为0, 可以为负数。
* addChild可以直接添加数组。

#### v1.3.4
*  新增绘制坐标系(coord.js)，只需提供x，y轴数据，即可自己选取合适的区间，绘制坐标系。

#### v1.3.5
*  增加颜色函数，包括十六进制颜色转rgb颜色， rgb颜色转hsl颜色， 仿less的lighten和darken函数...
## ToDo

* 给时间触发添加顺序(index) (Done)
* 全局拖拽位移和缩放 [由于坐标计算出现了问题，暂时放弃缩放] -- (Done)
* 对象之间的两两交互，模拟drag, drop事件, 新增dragin, dragout, drop事件。(Done)
* 外部拖拽与页面内对象交互，像原生的drag，drop. (Done) -- 见demo源代码
* 浏览器兼容性测试
* 添加基本，常见的图形的绘制（In progress）
* 增加group组件，几个图形可以放到一个group中，作为一个整体来添加事件和操作。

## [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/lcl.svg
[npm-url]: https://npmjs.org/package/lcl
[downloads-image]: https://img.shields.io/npm/dm/lcl.svg
[downloads-url]: https://npmjs.org/package/lcl
