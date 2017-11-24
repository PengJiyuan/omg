<!-- <img src=".github/logo.png" /> -->

# omg.js
[![](https://travis-ci.org/PengJiyuan/omg.js.svg?branch=master)](https://travis-ci.org/PengJiyuan/omg.js)
[![][npm-image]][npm-url]
[![][downloads-image]][downloads-url]

Oh my goodness! Awesome Canvas Render Library. [Demo](https://pengjiyuan.github.io/omg.js)

## Install

**NPM**    

`npm install omg.js --save`

```javascript
const OMG = require('omg.js');
console.log(OMG); // ...
```

**DOWNLOAD**    

[Source Code](dist/omg.min.js)

```html
<script src="path/omg.min.js"></script>
<script>
  console.log(OMG);// ...
</script>
```

## Example

```javascript
import omg from 'omg.js';

const stage = omg({
  element: document.getElementById('canvas'),
  width: 500,
  height: 500,
  enableGlobalTranslate: true
});

const rect = stage.rectangle({
  x: 120,
  y: 120,
  width: 200,
  height: 200,
  color: '#'+(~~(Math.random()*(1<<24))).toString(16)
}).on('mousedown', function() {
  console.log('click rect2');
}).on('mouseenter', function() {
  rect.color = '#'+(~~(Math.random()*(1<<24))).toString(16);
  stage.redraw();
}).on('mouseleave', function() {
  rect.color = '#'+(~~(Math.random()*(1<<24))).toString(16);
  stage.redraw();
}).on('dragin', function() {
  console.log('drag in rect2');
  rect.color = '#ffffff';
  stage.redraw();
}).on('dragout', function() {
  console.log('drag out rect2');
  rect.color = '#'+(~~(Math.random()*(1<<24))).toString(16);
  stage.redraw();
}).on('drop', function() {
  console.log('you drop on the rect2!');
  rect.color = '#000';
  stage.redraw();
}).config({
  drag: true,
  changeIndex: true
});

stage.addChild(rect);

stage.show();
```

## Usage
```javascript
import omg from 'omg.js';

// Init
const stage = omg({
  element: document.getElementById('canvas'),
  width: 500,
  height: 500,
  enableGlobalTranslate: true // 等同于 stage.globalTranslate(true)
});

stage.getVersion(); // v x.x.x
```

Enable global drag.

```javascript
 stage.globalTranslate(true);
```

### Shapes

**Rectangle**

```javascript
const rect = stage.rectangle({
  x: 0,
  y: 0,
  width: 110,
  height: 110,
  color: '#514022'
});
```

**Line**

```javascript
const line = stage.line({
  x: 200,
  y: 100,
  endX: 400,
  endY: 420
});
```

**Polyline**
```javascript
const polyline = stage.line({
  matrix: [
    [10, 180],
    [40, 50],
    [80, 180],
    [90, 80],
    [110, 100],
    [140, 50],
    [260, 180]
  ]
});
```

**Polygon**
```javascript
const polygon = stage.polygon({
  matrix: [
    [310, 120],
    [360, 120],
    [348, 230],
    [250, 340],
    [146, 200]
  ],
  color: 'black',
  type: 'stroke',
  lineWidth: 4
});
```

**Image**

```javascript
const image = stage.image({
  x: 0,
  y: 0,
  width: 800,
  height: 500,
  src: './img/timg.jpg'
});

// For more detail, check canvas api.
const image3 = stage.image({
  x: 200,
  y: 200,
  width: 97,
  height: 110,
  sliceX: 5,
  sliceY: 0,
  sliceWidth: 97,
  sliceHeight: 110,
  src: './img/action.png'
});
```

**Text**

```javascript
const text = stage.text({
  x: 300,
  y: 40,
  width: 150,
  height: 40, // x, y, width, height指定了一个矩形， 文字就在其中
  paddingTop: 8, // 用于调整文字在矩形中的位置
  center: true,  // 文字居中
  backgroundColor: 'blue', // 给文字添加背景颜色(矩形)
  font: 'italic bold 20px arial,sans-serif', // 文字样式
  text: 'Hello stage', // 文字内容
  color: '#fff', // 文字颜色
  type: 'fill' // fill -- 填充， stroke -- 描边
});
```

**Circle**

```javascript
const arc = stage.arc({
  x: 400,
  y: 400,
  radius: 30,
  color: 'rgba(255, 255, 255, 0.5)',
  type: 'fill' // fill -- 填充， stroke -- 描边
});
```

**Sector**

```javascript
const arcb = stage.arc({
  x: 130,
  y: 380,
  radius: 100,
  startAngle: 45,
  endAngle: 165,
  color: '#512854',
  style: 'fill'
});
```

**Coordinate System**

```javascript
const coord = stage.coord({
  x: 0, // 坐标系的左上起点的x坐标
  y: 0, // 坐标系的左上起点的y坐标
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

### Add Event

Global event (mousedown, mousemove) for whole omg.

```javascript
stage.mousedown(function(e) {
  console.log(stage.utils.getPos(e));
});

stage.mousemove(function(e) {
  console.log(stage.utils.getPos(e));
});
```

Support chain call.

```javascript
shape.on('mousedown', function(){
  console.log('you click rect');
}).on('mousemove', function() {
  console.log('you move!');
}).on('mouseleave', function() {
  console.log('you leave!');
}).drag(true).config(){...};
```

### config

```javascript
rect.config({
  drag: true, // 允许形状(对象)被拖拽  
  changeIndex: true， // 在形状被选中的时候允许改变个形状展示的顺序
  fixed: true, // 免受globalTranslate的影响
  bg: true // 作为bg的话无法绑定事件，可触发globalTranslate
});
```

### Add shapes to stage.

```javascript
stage.addChild(rect);
stage.addChild(line);

// or

stage.addChild([rect, line, arc1, text1]);
```

### Remove shapes from stage.

```javascript
stage.removeChild(rect);

stage.removeChild([rect, arc, line]);

stage.removeFirstChild();

stage.removeLastChild();
```

### Draw

```javascript
stage.show();
```

### Animation

```javascript
function go() {
  rect.rotate++;
  line.rotate = line1.rotate + 2;
  stage.redraw();
}

const a = stage.animate(go);
```

### Stop animation

```javascript
stage.stop(a);
```

## [CHANGELOG](./.github/CHANGELOG.md)

## [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/omg.js.svg
[npm-url]: https://npmjs.org/package/omg.js
[downloads-image]: https://img.shields.io/npm/dm/omg.js.svg
[downloads-url]: https://npmjs.org/package/omg.js
