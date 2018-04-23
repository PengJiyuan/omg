/* @flow */

/**
 * A group is a container that can be inserted into child nodes
 */

import { display } from '../display';
import { COLOR, LINE_WIDTH, RADIUS} from '../data/default';
import { DefineScale, DefineMatrix } from '../data/define';
// import getBounding from './bounding';
import * as utils from '../utils/helpers';

type groupSettings = {
  background: {color: string},
  border: {color: string, lineWidth: number},
  radius: {
    tl: number,
    tr: number,
    bl: number,
    br: number
  } | void,
  title: string
}

export default function(settings: groupSettings, _this: Global) {
  const draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;

    DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY');
    DefineMatrix.call(this, this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);

    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }

    canvas.beginPath();
    const matrix = this.scaled_matrix;
    const radius = this.radius;

    canvas.moveTo(matrix[0][0] + radius.tl * scale, matrix[0][1]);
    canvas.lineTo(matrix[1][0] - radius.tr * scale, matrix[0][1]);
    canvas.quadraticCurveTo(matrix[1][0], matrix[0][1], matrix[1][0], matrix[0][1] + radius.tr * scale);
    canvas.lineTo(matrix[1][0], matrix[2][1] - radius.br * scale);
    canvas.quadraticCurveTo(matrix[1][0], matrix[2][1], matrix[1][0] - radius.br * scale, matrix[2][1]);
    canvas.lineTo(matrix[0][0] + radius.bl * scale, matrix[2][1]);
    canvas.quadraticCurveTo(matrix[0][0], matrix[2][1], matrix[0][0], matrix[2][1] - radius.bl * scale);
    canvas.lineTo(matrix[0][0], matrix[0][1] + radius.tl * scale);
    canvas.quadraticCurveTo(matrix[0][0], matrix[0][1], matrix[0][0] + radius.tl * scale, matrix[0][1]);

    if(utils.isObj(this.background)) {
      const bg = this.background;
      if(bg.color) {
        canvas.fillStyle = bg.color || COLOR;
        canvas.fill();
      }
    } else if(utils.isObj(this.border)) {
      const border = this.border;
      canvas.strokeStyle = border.color || COLOR;
      canvas.lineWidth = border.lineWidth || LINE_WIDTH;
      canvas.stroke();
    }
    canvas.closePath();
    const title = this.title;
    if(title && typeof title === 'object') {
      const size = title.fontSize || 14;
      const paddingTop = title.paddingTop || 4;
      const paddingLeft = title.paddingLeft || 2;
      canvas.fillStyle = title.color || '#000';
      canvas.textBaseline = 'top';
      canvas.font = `normal 400 ${size * scale}px ${title.fontFamily || 'arial,sans-serif'}`;
      canvas.fillText(title.text, this.scaled_x + paddingLeft * scale, this.scaled_y + paddingTop * scale);
    }
    canvas.restore();
  };

  // update child's moveX and moveY
  const updateChild = function(child) {
    if(!child.updated || child.forceUpdate) {
      child.updated = true;
      child.moveX = child.parent.x + child.parent.moveX;
      child.moveY = child.parent.y + child.parent.moveY;
      child.enableChangeIndex = false;
      child.fixed = false;
      child.drag = false;
    }
  };

  const updateAllChildsPosition = function() {
    this.children.forEach(child => {
      child.moveX = child.parent.x + child.parent.moveX;
      child.moveY = child.parent.y + child.parent.moveY;
    });
  };

  /**
   * @param {Array} childs
   */
  const add = function(childs) {
    if(!utils.isArr(childs)) {
      throw 'The parameter must be an array';
    }
    if(!~this._.objects.indexOf(this)) {
      throw 'before add, please addChild the parent!';
    }

    childs.forEach(child => {
      if(child.isShape) {
        child.parent = this;
        this._.groupRecords += 0.0000000001;
        child.zindex = this.zindex + this._.groupRecords;
        updateChild(child);
        // group暂时不添加拖拽
        this.enableDrag = false;
        this.children.push(child);
      }
    });
    utils.insertArray(this._.objects, this._.objects.indexOf(this) + 1, 0, childs);
    this._.objects.sort((a, b) => a.zindex - b.zindex);
    this._._objects = utils.reverse(this._.objects);
  };

  const remove = function(childs) {
    let list = childs;
    if(typeof childs === 'function') {
      list = this.children.filter(childs);
    } else if(!utils.isArr(childs)) {
      list = [childs];
    }
    list.forEach(child => {
      const index = this.children.indexOf(child);
      if(~index) {
        child.parent = null;
        this.children.splice(index, 1);
        this._.objects = this._.objects.filter(o => o !== child);
        this._._objects = utils.reverse(this._.objects);
      }
    });
  };

  return Object.assign({}, display(settings, _this), {
    type: 'group',
    draw,
    background: settings.background,
    border: settings.border,
    radius: settings.radius || RADIUS,
    title: settings.title,
    children: [],
    add,
    remove,
    updateAllChildsPosition
  });
}
