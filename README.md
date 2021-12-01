# omg.js
[![](https://travis-ci.org/PengJiyuan/omg.svg?branch=master)](https://travis-ci.org/PengJiyuan/omg)
[![][npm-image]][npm-url]
[![][downloads-image]][downloads-url]

一个让你跳过canvas，直接绘图的 2d 绘图库，上手简单，接口简洁，功能丰富. 

[在线示例](https://omg.js.org)

[English Document](README_EN.md)

<div align=center>
  <img src=".github/demo1.gif" />
</div>

<div align=center>
  <img src=".github/demo2.gif" />
</div>

## 如何安装omg？

**NPM**    

`npm i omg.js`

**CDN**

https://unpkg.com/omg.js@4.0.0/dist/omg.min.js (你可以修改 @version 来改变引用的版本)

**下载**

[源代码](dist/omg.min.js)

## 使用方法

* ES6

```javascript
import omg from 'omg.js';

const stage = omg({
  ...
});

// Init
stage.init();
```

* 浏览器

```html
<script src="yourpath/omg.min.js"></script>
<script>
  var stage = omg({
    ...
  });
  stage.init();
</script>
```

## 示例

```javascript
import omg from 'omg.js';

const stage = omg({
  element: document.getElementById('canvas'),
  width: 500,
  height: 500,
  enableGlobalTranslate: true,
  enableGlobalScale: true,
  position: 'absolute', // 改变canvas.style.position
  images: [], // 预加载的图片列表，通常不用指定，因为使用接口绘制图片的时候，会自动预加载。
  prepareImage: true, // 是否开启预加载图片
  // 活着
  prepareImage: () => {
    // 如果prepareImage指定一个函数的话，也表示开启预加载图片，而且在加载完成后，会触发这个回调函数。
    hideLoading();
  }
});

// 在init之前，你可以通过`stage.extend(yourShape)`拓展自定义的图形。
stage.init();

const rect = stage.graphs.rectangle({
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

// 把图形添加到待绘制的列表中.
stage.addChild(rect);

// 绘制，并且绑定事件。
stage.show();
```

### 图形列表

**矩形**

```javascript
const rect = stage.graphs.rectangle({
  x: 0,
  y: 0,
  width: 110,
  height: 110,
  rotate: 45, // 如果指定了radius的话，rotate会出现异常(待修复)
  radius: {
    tl: 6, // 左上
    tr: 6, // 右上
    bl: 6, // 左下
    br: 6  // 右下
  },
  color: '#514022'
});
```

**折线**

```javascript
const polyline = stage.graphs.line({
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

**不规则多边形**
```javascript
const polygon = stage.graphs.polygon({
  matrix: [
    [310, 120],
    [360, 120],
    [348, 230],
    [250, 340],
    [146, 200]
  ],
  color: 'black',
  style: 'stroke',
  lineWidth: 4
});
```

**图片**

```javascript
const image = stage.graphs.image({
  x: 0,
  y: 0,
  width: 800,
  height: 500,
  src: './img/timg.jpg'
});

// 支持canvas绘制图片的所有接口.
const image3 = stage.graphs.image({
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

**文字**

```javascript
const text = stage.graphs.text({
  x: 300,
  y: 40,
  width: 150,
  height: 40, // x, y, width, height指定了一个矩形， 文字就在其中
  paddingTop: 8, // 用于调整文字在矩形中的位置
  center: true,  // 文字居中
  background: {
    color: 'blue', // 背景颜色
    img: './img/text_bg.png' // 背景图片
  }, // 给文字添加背景颜色(矩形)
  font: 'italic bold 20px arial,sans-serif', // 文字样式
  text: 'Hello stage', // 文字内容
  color: '#fff', // 文字颜色
  style: 'fill' // fill -- 填充， stroke -- 描边
});
```

**圆形**

```javascript
const arc = stage.graphs.arc({
  x: 400,
  y: 400,
  radius: 30,
  color: 'rgba(255, 255, 255, 0.5)',
  style: 'fill' // fill -- 填充， stroke -- 描边
});
```

**扇形**

```javascript
const arcb = stage.graphs.arc({
  x: 130,
  y: 380,
  radius: 100,
  startAngle: 45,
  endAngle: 165,
  color: '#512854',
  style: 'fill'
});
```

### 隐藏图形
```javascript
const arcb = stage.graphs.arc({
  ...,
  hide: true
});

// 或者

arcb.hide = true;
```

### 拓展图形

如果omg提供的默认图形不够用, 你可以轻松拓展自定义图形.
在`init`之前, 你可以通过 `extend` 方法来拓展自定义图形.


```javascript
const stage = omg({
  ...
});

const yourShape = function(settings, _this) {
  const draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;

    // 如果你想要自定义图形支持drag, scale, mousedown, mouseenter等事件，你必须添加这一行
    stage.ext.DefineScale.call(this, scale, 'moveX', 'moveY', 'matrix');

    const matrix = this.scaled_matrix;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    canvas.beginPath();

    matrix.forEach((point, i) => {
      i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
    });
    canvas.lineTo(matrix[0][0], matrix[0][1]);
    
    canvas.fillStyle = this.color;
    canvas.fill();
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, stage.ext.display(settings, _this), {
    type: 'polygon',
    draw: draw,
    lineWidth: settings.lineWidth || 1,
    matrix: settings.matrix
  });
};

// 在init之前，拓展自定义图形.
stage.extend({
  yourShape: yourShape
});

stage.init();

// 使用自定义图形
const shape = stage.graphs.yourShape({
  ...settings
});

stage.addChild(shape);

stage.show();

```

### 添加事件

#### 全局事件

给全局canvas添加的 (mousedown, mousemove) 事件.

```javascript
stage.mousedown(function(e) {
  console.log(stage.utils.getPos(e));
});

stage.mousemove(function(e) {
  console.log(stage.utils.getPos(e));
});
```

#### 给图形添加事件

所有pc端支持的事件:

* mousedown
* mouseup
* mouseenter
* mouseleave
* mousemove'
* drag
* dragend
* dragin
* dragout
* drop

所有移动端支持的事件:

* touchstart
* touchmove
* touchend
* tap

支持链式调用.

```javascript
/*
 * @cur: 当前图形.
 */
shape.on('mousedown', function( cur ) {
  console.log('you click rect');
}).on('mousemove', function( cur ) {
  console.log('you move!');
}).on('mouseleave', function( cur ) {
  console.log('you leave!');
}).drag(true).config(){...};
```

### config

```javascript
rect.config({
  zindex: 10,
  drag: true, // 图形开启拖拽
  changeIndex: true， // 当拖拽的时候，改变图形的顺序
  fixed: true, // 不受globalTranslate and globalScale 的影响。
});
```

### Group

你可以把一些图形添加到一个组里，这样你可以让这些图形表现的行为一致。

```javascript
const group = stage.group({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  title: {
    title: {
      text: 'Group Name',
      fontSize: 14,
      paddingTop: 12,
      paddingLeft: 14
    }
  },
  /**
   * @param {Object} background - 给组添加背景颜色
   */
  background: {
    color: '#000'
  },
  /**
   * @param {Object} border - 给组添加边框
   */
  border: {
    color: '#000',
  },
  zindex: 10
}).on('mousedown', function() {
  console.log('you clicked group');
});
```

* **方法** `group.add()`

把图形添加到组里. 组内图形的坐标原点是组的 (x, y) 坐标。

* **方法** `group.remove()`

从组内删除图形.

1. remove([Array])  -  删除多个图形
2. remove([Function])  -  删除的图形支持用filter过滤.

* **方法** `group.updateAllChildsPosition()`

更新组内所有子图形的坐标位置。如果组的坐标发生了改变，需要调用这个函数来保证组内的图形跟随移动。

### 添加到待绘制列表.

group和图形一样，都需要`addChild`来添加到stage。

```javascript
stage.addChild(rect);
stage.addChild(line);
stage.addChild(group);

// 或者

stage.addChild([rect, line, arc1, text1]);
```

### 从绘制列表移除.

```javascript
stage.removeChild(rect);

stage.removeChild([rect, arc, line]);

stage.removeFirstChild();

stage.removeLastChild();

stage.removeAllChilds();
```


### show()

绘制并且绑定事件.

```javascript
stage.show();
```
如果你通过`addChild`或`removeChild`新增了某些图形和事件或者移除了某些图形和事件，那么你需要通过以下方法重置事件。

```javascript
stage.show()
```
or
```javascript
stage.draw();
stage._events.triggerEvents();
```

### 绘制和重绘
```javascript
stage.draw();
stage.redraw();
```

### 重置

重置整个舞台，让所有图形的状态回归到初始值，会重置所有的拖拽位移和缩放.

```javascript
stage.reset();
```

### 动画

#### 全局动画

```javascript
function go() {
  rect.x++;
  line.y = line.y + 2;
  arc.radius++;
}

stage.animate(go);
```

#### 图形动画

[在线示例](https://omg.js.org/animation.html)

```javascript
/**
 * @param: {keys | Object}   -- 动画结束时的值，是个对象
 * @param: {config | Object} -- 动画的一些配置项
 */
shape.animateTo({
  x: 100,
  y: 100,
  width: 200,
  height: 200
}, {
  duration: 1000, // 动画持续事件，默认 500 毫秒
  delay: 500, // 动画延迟的事件，默认 0 毫秒
  easing: 'bounceOut', // 动画的补间类型，默认 'linear' （匀速）
  onStart: function(keys) {
    /**
     * @param: keys
     * keys是一个对象，存放着图形运动到当前的一些坐标和内部数据。
     * same below
     */
    console.log(keys.x, keys.y, keys.width, keys.height);
  },
  onUpdate: function(keys) {
    console.log(keys.x, keys.y, keys.width, keys.height);
  },
  onFinish: function(keys) {
    console.log(keys.x, keys.y, keys.width, keys.height);
  },
});
```

#### 补间动画类型
* linear
* quadIn
* quadOut
* quadInOut
* cubicIn
* cubicOut
* cubicInOut
* quartIn
* quartOut
* quartInOut
* quintIn
* quintOut
* quintInOut
* sineIn
* sineOut
* sineInOut
* bounceOut
* bounceIn
* bounceInOut

#### 清除动画
```javascript
stage.clearAnimation();
```

#### finishAnimation

如果舞台上的所有动画都结束后，会调用这个方法。

```javascript
stage.finishAnimation = () => {
  console.log('所有动画都结束了!');
};
```

### 自动缩放canvas

#### resize(opt)
* opt.width {Function} -- 缩放后的宽度
* opt.height {Function} -- 缩放后的高度
* opt.resize {Function} -- 在缩放后触发的回调函数

```javascript
world.resize({
  width: () => document.body.clientWidth,
  height: () => document.body.clientHeight,
  // 如果你传了resize, 需要调用update这个函数来更新canvas的尺寸。
  resize: (update) => {
    update();
  }
});
```

### FPS （帧率）

#### fpsOn

当舞台上有动画的时候，你可以通过调用`fpsOn`来开启获取帧率。

```javascript
stage.fpsOn(function(fps) {
  // fps即是帧率，每秒刷新一次
  console.log(fps);
});
```

#### 关闭帧率获取
```javascript
stage.fpsOff();
```

## [更新日志](./.github/CHANGELOG.md)

## [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/omg.js.svg
[npm-url]: https://npmjs.org/package/omg.js
[downloads-image]: https://img.shields.io/npm/dm/omg.js.svg
[downloads-url]: https://npmjs.org/package/omg.js
