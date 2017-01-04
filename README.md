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

line

```javascript
var line = LCL.line({
  startX: 200,
  startY: 100,
  endX: 400,
  endY: 420
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

允许形状(对象)被拖拽    

```javascript
  rect.drag(true);
```

在形状被选中的时候允许改变个形状展示的顺序     

```javascript
  rect.changeIndex(true);
```

* **config**

```javascript
  rect.config({
    drag: true,
    changeIndex: true
  });
  
  //equals
  
  rect.drag(true);
  rect.changeIndex(true);
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

## ToDo

* 给时间触发添加顺序(index) (Done)
* 全局拖拽位移和缩放 [由于坐标计算出现了问题，暂时放弃缩放] (Done)
* 对象之间的两两交互，模拟drag, drop事件, 新增dragin, dragout, drop事件。(Done)
* 外部拖拽与页面内对象交互，像原生的drag，drop. (Done) -- 见demo源代码
* 浏览器兼容性测试
* 添加基本，常见的图形的绘制

## [MIT](./LICENSE)
