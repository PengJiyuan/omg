/* @flow */

import { display } from '../display';
import { COLOR } from '../data/default';
import {DefineScale} from '../data/define';
import * as utils from '../utils/helpers';
import clip from '../clip/index';

export default function(settings: Object, _this: Global): GraghShape {
  let totalLength;

  const draw = function() {
    const canvas = _this.canvas;
    const lineCap = settings.lineCap;
    const lineJoin = settings.lineJoin;
    const smooth = settings.smooth;
    const scale = _this.scale;

    if(this.matrix && this.matrix.length < 2) {
      throw 'The line needs at least two points';
    }

    if(!this.fixed) {
      DefineScale.call(this, scale, 'moveX', 'moveY', 'matrix', 'lineWidth');
    }

    const matrix = this.scaled_matrix;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }

    // clip path
    clip(this, canvas, scale);

    if(!this.hide) {
      canvas.beginPath();
      canvas.lineWidth = this.scaled_lineWidth;
      canvas.strokeStyle = this.color;
      canvas.lineDashOffset = this.offset;
      if(this.dash && utils.isArr(this.dash)) {
        canvas.setLineDash(this.dash);
      }
      if(lineCap) {
        canvas.lineCap = lineCap;
      }
      if(lineJoin) {
        canvas.lineJoin = lineJoin;
      }
      if(smooth) {
        let getCtrlPoint = function(ps, i, a, b) {
          let pAx, pAy, pBx, pBy;
          if(!a || !b) {
            a = 0.25;
            b = 0.25;
          }
          if( i < 1) {
            pAx = ps[0][0] + (ps[1][0] - ps[0][0]) * a;
            pAy = ps[0][1] + (ps[1][1] - ps[0][1]) * a;
          } else {
            pAx = ps[i][0] + (ps[i + 1][0] - ps[i - 1][0])*a;
            pAy = ps[i][1] + (ps[i + 1][1] - ps[i - 1][1])*a;
          }
          if(i > ps.length-3) {
            let last = ps.length - 1;
            pBx = ps[last][0] - (ps[last][0] - ps[last - 1][0]) * b;
            pBy = ps[last][1] - (ps[last][1] - ps[last - 1][1]) * b;
          } else {
            pBx = ps[i + 1][0] - (ps[i + 2][0] - ps[i][0]) * b;
            pBy = ps[i + 1][1] - (ps[i + 2][1] - ps[i][1]) * b;
          }
          return {
            pA:{x: pAx, y: pAy},
            pB:{x: pBx, y: pBy}
          };
        };
        for(let i = 0; i < matrix.length; i++) {
          if(i === 0) {
            canvas.moveTo(matrix[i][0], matrix[i][1]);
          } else {
            let cMatrix = getCtrlPoint(matrix, i - 1);
            canvas.bezierCurveTo(cMatrix.pA.x, cMatrix.pA.y, cMatrix.pB.x, cMatrix.pB.y, matrix[i].x, matrix[i].y);
          }
        }
      } else {
        matrix.forEach(function(point, i) {
          i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
        });
      }
      canvas.stroke();
      canvas.closePath();
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'line',
    draw: draw,
    totalLength: totalLength,
    lineWidth: settings.lineWidth || 1,
    dash: settings.dash,
    offset: settings.offset || 0,
    color: settings.color || COLOR,
    matrix: settings.matrix,
    scaled_matrix: settings.matrix
  });
}
