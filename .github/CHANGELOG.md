### v1.0.0
* 添加矩形，线的绘制
* 已on的形式给对象添加事件
* 全局拖拽位移和缩放
* 对象的拖拽位移

### v1.1.0
* 优化事件触发器，新增`dragin` `dragout` `drop`事件， 用于对象之间的交互， 模拟原生的drag and drop。
* 新增对象之间的**两两交互**，和原生drag，drop类似，不过简化为了dragin, dragout, drop， 这三个事件可以完美解决两两交互, **注意**这三个属性是作为contaner的一方添加。
* 结合**外部drag，drop**，和页面内交互。OMG作为一个全局变量，包含了一切需要的数据，何以直接结合外部drag，drop操作objects数组，然后重绘。
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
* 由于之前的设定， 只有一个全局变量OMG，而所有的信息，包括全局位置信息等都储存在着一个全局变量之中，导致无法绘制多个canvas，他们会共享一个全局变量。所以改版，支持多canvas绘制。

#### v1.3.1
* 绘制图形增添zindex, 默认为0, 可以为负数。
* addChild可以直接添加数组。

#### v1.3.4
*  新增绘制坐标系(coord.js)，只需提供x，y轴数据，即可自己选取合适的区间，绘制坐标系。

#### v1.3.5
*  增加颜色函数，包括十六进制颜色转rgb颜色， rgb颜色转hsl颜色， 仿less的lighten和darken函数...

#### v3.0.0-beta.0
*  重构代码。
*  添加autoscale，解决Retina屏模糊问题。
*  Event callback添加参数self, 可以在callback中直接操作当前shape
*  添加不规则图形的绘制。
*  添加点在不规则图形内的判断。

#### v3.0.0-beta.1
* config配置的时候不能传入false，bugfix。
* 添加全局mousedown, mousemove事件配置。
* stage添加removeChild, removeFirstChild, removeLastChild, removeAllChilds方法.

#### v3.0.0-beta.2
* 添加动画接口，包括全局动画和指定图形的补间动画（支持各种曲线缓动）。
* 优化动画接口，全局动画和图形补间动画在一个动画队列中，保证多个动画的有序进行。

#### v3.0.0-beta.3
* 添加fps开关.

#### v3.0.0
* 添加全局缩放功能，而且缩放之后不影响事件的触发。
* 添加resize函数
* 优化代码结构，将判断点在区域内的函数抽离到单独的文件中

#### v3.1.0
* 添加group的概念，group也可以当作图形来理解，但是可以添加子图形。子图形的参照起点坐标将会是group的起点。
* group添加remove函数，用于移除group中的子图形。
* group添加子组件新增updated判断和forceUpdate选项。
* 添加clip。绘制动画的时候（比如线）支持动画绘制（从左向右展开）。
* resize事件优化，canvas支持改变style.position。
* group支持添加title绘制。
* onmouseenter, onmouseleave事件优化
* 图形Rectangle新增border-radius。
* 图形text添加图片背景选项。
* 修复获取鼠标坐标点异常的问题。

#### v3.1.1
* 修复group的title不存在时的bug.
* 调整group及子图形的zindex的计算方法。
* group.remove增加function类型的参数。`group.remove(g => g.type === 'polygon')`.
* 增加`group.updateAllChildsPosition()`, 用于调用更新group的所有子图形的坐标.

#### v3.1.2
* 当shape的属性为hide时，在触发事件的时候将之忽略。

#### v3.1.3
* `gruop.add()`的时候不对child进行排序。
* 在初始化的时候，新增对 初始缩放比例(deviceScale), 最大缩放比例(maxDeviceScale), 最小缩放比例(minDeviceScale)的操作。

#### v3.1.4
* 初始化参数prepareImage 增加 函数类型，会在加载完图片之后触发，可用于在加载完图片之后隐藏loading层。
* 修复animateTo的onUpdate的触发顺序。


## ToDo

* 给时间触发添加顺序(index) (Done)
* 全局拖拽位移和缩放 -- (Done)
* 对象之间的两两交互，模拟drag, drop事件, 新增dragin, dragout, drop事件。(Done)
* 外部拖拽与页面内对象交互，像原生的drag，drop. (Done) -- 见demo源代码
* 浏览器兼容性测试
* 添加基本，常见的图形的绘制（Done）
* 增加group组件，几个图形可以放到一个group中，作为一个整体来添加事件和操作。(Done)