
  ;(function() {// eslint-disable-line  

    var coord = function(settings) {

      var _this = this;

      var draw = function() {
        var canvas = _this.canvas,
          startX = this.startX = settings.startX,
          startY = this.startY = settings.startY,
          width = settings.width,
          height = settings.height,
          xAxis = settings.xAxis,
          //yAxis = settings.yAxis,
          series = settings.series,
          boundaryGap = settings.boundaryGap,
          title = settings.title;

        canvas.save();
        canvas.translate(-0.5, -0.5);
        canvas.translate(this.moveX, this.moveY);
        if(this.fixed) {
          canvas.translate(-_this.transX, -_this.transY);
        }
        if(this.backgroundColor) {
          canvas.save();
          canvas.fillStyle = this.backgroundColor;
          canvas.fillRect(startX, startY, width, height);
          canvas.restore();
        }

        // get max xAxis or yAxis
        function getMaxMin(isX) {
          var max, min, maxArray = [], minArray = [];
          series.forEach(function(item) {
            var ma = [];
            item.data.forEach(function(i) {
              if(isX) {
                ma.push(i[0]);
              } else {
                xAxis.data && xAxis.data.length > 0 ? ma.push(i) : ma.push(i[1]);
              }
            });
            maxArray.push(Math.max.apply(null, ma));
            minArray.push(Math.min.apply(null, ma));
          });
          max = Math.max.apply(null, maxArray);
          min = Math.min.apply(null, minArray);

          return {
            max: max,
            min: min
          };
        }

        var margin = width / 10;
        var count, space, length, gapLength, upCount, downCount, ygl;

        // draw title
        canvas.font = '24px serif';
        canvas.textAlign = 'left';
        canvas.textBaseline = 'top';
        canvas.fillText(title, margin / 2, 10);

        // draw yAxis
        var maxY = getMaxMin(false).max,
          minY = getMaxMin(false).min,
          gm = _this.utils.calculateCoord(maxY, minY),
          gap = gm.gap;
          //retMax = gm.max;

        length = height - 2 * margin;
        //count = Math.round(retMax / gap);

        upCount = maxY > 0 ? Math.ceil(maxY / gap) : 0;
        downCount = minY < 0 ? Math.ceil( Math.abs(minY) / gap) : 0;
        count = upCount + downCount;
        gapLength = Math.floor( length / count ),
        space = count,
        ygl = gapLength;

        // coordinate origin
        canvas.translate(startX + margin, startY + height - margin - downCount * gapLength);

        // yAxis
        canvas.beginPath();
        canvas.moveTo(0, 0 + downCount * gapLength);
        canvas.lineTo(0, -(height - margin*2) + downCount * gapLength);
        canvas.stroke();
        canvas.closePath();

        for(var ii = 0; ii <= upCount; ii++) {
          canvas.beginPath();
          canvas.moveTo(0, -gapLength * ii);
          canvas.lineTo(-5, -gapLength * ii);
          canvas.stroke();
          canvas.closePath();
          // draw grid
          canvas.save();
          canvas.strokeStyle = '#ccc';
          canvas.beginPath();
          canvas.moveTo(0, -gapLength * ii);
          canvas.lineTo(width - margin*2, -gapLength * ii);
          canvas.stroke();
          canvas.restore();
          canvas.closePath();
          // draw label
          canvas.save();
          canvas.font = '15px serif';
          canvas.textAlign = 'right';
          canvas.textBaseline = 'middle';
          canvas.fillText( _this.utils.formatFloat(gap*ii, 1), -15, -gapLength * ii);
          canvas.restore();
        }

        for(var iii = 0; iii <= downCount; iii++) {
          canvas.beginPath();
          canvas.moveTo(0, gapLength * iii);
          canvas.lineTo(-5, gapLength * iii);
          canvas.stroke();
          canvas.closePath();
          // draw grid
          canvas.save();
          canvas.strokeStyle = '#ccc';
          canvas.beginPath();
          canvas.moveTo(0, gapLength * iii);
          canvas.lineTo(width - margin*2, gapLength * iii);
          canvas.stroke();
          canvas.restore();
          canvas.closePath();
          // draw label
          canvas.save();
          canvas.font = '15px serif';
          canvas.textAlign = 'right';
          canvas.textBaseline = 'middle';
          canvas.fillText( _this.utils.formatFloat(-gap*iii, 1), -15, gapLength * iii);
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
          count = xAxis.data.length;
          space = boundaryGap ? count : count -1;
          length = width - margin * 2;
          gapLength = length / space;

          xAxis.data.forEach(function(item, index) {
            canvas.beginPath();
            canvas.moveTo(gapLength * (index + 1), 0);
            canvas.lineTo(gapLength * (index + 1), 5);
            canvas.save();
            canvas.font = '15px serif';
            canvas.textAlign = 'center';
            canvas.textBaseline = 'top';
            boundaryGap ? canvas.fillText(item, gapLength * index + gapLength / 2, 5 + downCount * ygl) : canvas.fillText(item, gapLength * index, 5 + downCount * ygl);
            canvas.restore();
            canvas.stroke();
            canvas.closePath();
          });

        }
        //else {
        //   var maxX = getMaxMin(true).max,
        //     minX = getMaxMin(true).min;

        // }

        canvas.restore();
      };

      return Object.assign({}, _this.display(settings), {
        type: 'coord',
        draw: draw
      });
    };

    LCL.prototype.coord = coord;

  })();