import { display } from '../display';
import utils from '../utils/helpers';

export default function(settings, _this) {
  let canvas = _this.canvas,
    x = this.x = settings.x,
    y = this.y = settings.y,
    width = settings.width,
    height = settings.height,
    xAxis = settings.xAxis,
    //yAxis = settings.yAxis,
    series = settings.series,
    boundaryGap = settings.boundaryGap,
    title = settings.title,
    subTitle = settings.subTitle;

  let TO_TOP = 20;

  let margin = width <= 300 ? width / 5 : width / 10;
  let xCount, yCount, xSpace, ySpace, xLength, yLength, xGapLength, yGapLength, upCount, downCount, ygl;

  // yAxis
  let maxY = utils.getMaxMin(false, series, xAxis).max,
    minY = utils.getMaxMin(false, series, xAxis).min,
    gm = utils.calculateCoord(maxY, minY),
    gap = gm.gap;
  //retMax = gm.max;

  yLength = height - 2 * margin;
  //count = Math.round(retMax / gap);

  upCount = maxY > 0 ? Math.ceil(maxY / gap) : 0;
  downCount = minY < 0 ? Math.ceil( Math.abs(minY) / gap) : 0;
  yCount = upCount + downCount;
  yGapLength = Math.round( yLength / yCount ),
  ySpace = yCount,
  ygl = yGapLength;

  // xAxis
  if(xAxis.data && xAxis.data.length > 0) {
    xCount = xAxis.data.length;
    xSpace = boundaryGap ? xCount : xCount -1;
    xLength = width - margin * 2;
    xGapLength = xLength / xSpace;
  }

  let draw = function() {

    canvas.save();
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    if(this.backgroundColor) {
      canvas.save();
      canvas.fillStyle = this.backgroundColor;
      canvas.fillRect(x, y, width, height);
      canvas.restore();
    }

    // draw title
    canvas.save();
    canvas.font = width <= 300 ? '18px serif' : '24px serif';
    canvas.textAlign = 'left';
    canvas.textBaseline = 'top';
    canvas.fillText(title, margin / 2, 10);
    canvas.restore();
    canvas.save();
    canvas.fillStyle = '#666666';
    canvas.font = width <= 300 ? '10px serif' : '14px serif';
    canvas.textAlign = 'left';
    canvas.textBaseline = 'top';
    canvas.fillText(subTitle, margin / 2 + 4, 40);
    canvas.restore();


    // draw yAxis

    // coordinate origin
    canvas.translate(x + margin, y + margin + upCount * yGapLength + TO_TOP);

    // yAxis
    canvas.beginPath();
    canvas.moveTo(0, 0 + downCount * yGapLength);
    canvas.lineTo(0, -(height - margin*2) + downCount * yGapLength - 5);
    canvas.stroke();
    canvas.closePath();

    for(let ii = 0; ii <= upCount; ii++) {
      canvas.beginPath();
      canvas.moveTo(0, -yGapLength * ii);
      canvas.lineTo(-5, -yGapLength * ii);
      canvas.stroke();
      canvas.closePath();
      // draw grid
      canvas.save();
      canvas.strokeStyle = '#ccc';
      canvas.beginPath();
      canvas.moveTo(0, -yGapLength * ii);
      canvas.lineTo(width - margin*2, -yGapLength * ii);
      canvas.stroke();
      canvas.restore();
      canvas.closePath();
      // draw label
      canvas.save();
      canvas.font = '12px serif';
      canvas.textAlign = 'right';
      canvas.textBaseline = 'middle';
      canvas.fillText( utils.formatFloat(gap*ii), -10, -yGapLength * ii);
      canvas.restore();
    }

    for(let iii = 0; iii <= downCount; iii++) {
      canvas.beginPath();
      canvas.moveTo(0, yGapLength * iii);
      canvas.lineTo(-5, yGapLength * iii);
      canvas.stroke();
      canvas.closePath();
      // draw grid
      canvas.save();
      canvas.strokeStyle = '#ccc';
      canvas.beginPath();
      canvas.moveTo(0, yGapLength * iii);
      canvas.lineTo(width - margin*2, yGapLength * iii);
      canvas.stroke();
      canvas.restore();
      canvas.closePath();
      // draw label
      canvas.save();
      canvas.font = '12px serif';
      canvas.textAlign = 'right';
      canvas.textBaseline = 'middle';
      if(iii !== 0) {
        canvas.fillText( utils.formatFloat(-gap*iii), -10, yGapLength * iii);
      }
      canvas.restore();
    }

    // xAxis
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(width - margin*2, 0);
    canvas.stroke();
    canvas.closePath();

    // draw xAxis
    if(xAxis.data && xAxis.data.length > 0) {

      xAxis.data.forEach(function(item, index) {
        canvas.beginPath();
        canvas.moveTo(xGapLength * (index + 1), 0);
        canvas.lineTo(xGapLength * (index + 1), 5);
        canvas.save();
        canvas.font = '15px serif';
        canvas.textAlign = 'center';
        canvas.textBaseline = 'top';
        boundaryGap ? canvas.fillText(item, xGapLength * index + xGapLength / 2, 5 + downCount * ygl) : canvas.fillText(item, xGapLength * index, 5 + downCount * ygl);
        canvas.restore();
        canvas.stroke();
        canvas.closePath();
      });

    }

    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    xLength: xLength,
    yLength: yLength,
    xSpace: xSpace,
    ySpace: ySpace,
    xGapLength: xGapLength,
    yGapLength: yGapLength,
    upCount: upCount,
    downCount: downCount,
    gap: gap,
    margin: margin,
    TO_TOP: TO_TOP,
    boundaryGap: boundaryGap,
    backgroundColor: settings.backgroundColor || '#F3F3F3'
  });
}
