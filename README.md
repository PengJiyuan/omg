# LCL
Light Canvas Library --Beta [Demo](https://pengjiyuan.github.io/LCL)

## Install

**By npm**    

`npm install lcl --save`     

```javascript
var LCL = require('lcl');
console.log(LCL); // [Object]...
```

**Download**    

download and use `dist/lcl.min.js`    

```html
<script src="path/lcl.min.js"></script>
<script>
    console.log(LCL);// [Object]...
</script>
```

## Usage

* **Stage**    

init the stage

```javascript 
  var stage = LCL.init({
    element: document.getElementById('canvas'),
    width: 500,
    height: 500,
    changeIndex: true // allow event order
  });
```
global scale

```javascript
 stage.scaleCanvas(true);
```

global drag (to be improved)

```javascript
 stage.dragCanvas(true);
```

* **Draw Shapes**

Rectangle

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

* **Add Event**

Support chain call 

```javascript
rect.on('mousedown', function(){
  console.log('you click rect');
}).on('mousemove', function() {
  console.log('you move!');
}).on('mouseleave', function() {
  console.log('you leave!');
});
```

Allow the Shape to be dragged    

```javascript
  rect.drag(true);
```

* **add Shapes to Stage**

```javascript
stage.addChild(rect);
stage.addChild(line);
```

* **Show**

```javascript
stage.show();
```

* **Animate**

```javascript
function go() {
  rect.rotate++;
  line.rotate = line1.rotate + 2;
  stage.redraw();
}

var a = stage.animate(go);
```

* **Stop the animate**

```javascript
stage.stop(a);
```

## ToDo

* Event Z-index (Done)
* Browser compatibility test
* global scale and translate...

## [MIT](./LICENSE)
