# LCL
Light Canvas Library --Beta [Demo](https://pengjiyuan.github.io/LCL)

## Install

**通过 npm**    

`npm install lcl --save`     

```javascript
var LCL = require('lcl');
console.log(LCL.version); // 1.1.0
```

**下载**    

下载源代码, 使用 `dist/lcl.min.js`    

```html
<script src="path/lcl.min.js"></script>
<script>
    console.log(LCL.version);// 1.1.0
</script>
```

## 使用

* **Stage**    

初始化舞台(Canvas)

```javascript 
  var stage = LCL.init({
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

  > 目前只支持画指定的图形，如需自定义图形可以拉下源代码之后在shapes中按照我给定的格式添加自定义图形。

矩形

```javascript
var rect = LCL.rectangle({
  startX: 0,
  startY: 0,
  width: 110,
  height: 110,
  fillColor: '#514022'
});
```

线条

```javascript
var line = LCL.line({
  startX: 200,
  startY: 100,
  endX: 400,
  endY: 420
});
```

图片

```javascript
// 简单图片， 只指定起始坐标和宽高
var image = LCL.image({
  startX: 0,
  startY: 0,
  width: 800,
  height: 500,
  src: './img/timg.jpg'
});

// 图片切割 (对照原生api)
var image3 = LCL.image({
  startX: 200,
  startY: 200,
  width: 97,
  height: 110,
  sliceX: 5,
  sliceY: 0,
  sliceWidth: 97,
  sliceHeight: 110,
  src: './img/action.png'
});
```

文字

```javascript
var text = LCL.text({
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
  type: 'fill' // fill -- 填充， stroke -- 描边
});
```

圆

```javascript
var arc = LCL.arc({
  x: 400,
  y: 400,
  radius: 30,
  color: 'rgba(255, 255, 255, 0.5)',
  type: 'fill' // fill -- 填充， stroke -- 描边
});
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
var stage = LCL.init({
  element: document.getElementById('canvas'),
  width: 500,
  height: 500,
  enableGlobalTranslate: true
});

var rect = LCL.rectangle({
  startX: 120,
  startY: 120,
  width: 200,
  height: 200,
  fillColor: '#'+(~~(Math.random()*(1<<24))).toString(16)
}).on('mousedown', function() {
  console.log('click rect2');
}).on('mouseenter', function() {
  rect2.fillColor = '#'+(~~(Math.random()*(1<<24))).toString(16);
  stage.redraw();
}).on('mouseleave', function() {
  rect2.fillColor = '#'+(~~(Math.random()*(1<<24))).toString(16);
  stage.redraw();
}).on('dragin', function() {
  console.log('drag in rect2');
  rect2.fillColor = '#ffffff';
  stage.redraw();
}).on('dragout', function() {
  console.log('drag out rect2');
  rect2.fillColor = '#'+(~~(Math.random()*(1<<24))).toString(16);
  stage.redraw();
}).on('drop', function() {
  console.log('you drop on the rect2!');
  rect2.fillColor = '#000';
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

## ToDo

* 给时间触发添加顺序(index) (Done)
* 全局拖拽位移和缩放 [由于坐标计算出现了问题，暂时放弃缩放] -- (Done)
* 对象之间的两两交互，模拟drag, drop事件, 新增dragin, dragout, drop事件。(Done)
* 外部拖拽与页面内对象交互，像原生的drag，drop. (Done) -- 见demo源代码
* 浏览器兼容性测试
* 添加基本，常见的图形的绘制（In progress）
* 增加group组件，几个图形可以放到一个group中，作为一个整体来添加事件和操作。

## [MIT](./LICENSE)