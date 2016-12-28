
	LCL.display = function(settings) {

		var settingsData = {

			startX: settings.startX,

			startY: settings.startY,

			width: settings.width,

			height: settings.height,

			fillColor: settings.fillColor

		};

		var on = function(eventTypes, callback) {

			if(!eventTypes) {
				throw 'no eventTypes defined!';
			}

			if(!callback || typeof callback !== 'function') {
				throw 'you need defined a callback!';
			}

			this.events = this.events || [];

			var eTypes = eventTypes.split(' '), that = this;

			eTypes.forEach(function(event) {
				if(~LCL.eventTypes.indexOf(event)) {
					that.events.push({
						eventType: event,
						callback: callback
					});
				} else {
					console.warn(event + ' is not in eventTypes!');
				}
			});

			return this;

		};

		var isPointInner = function(x, y) {
			var that = this;
			var xRight = x > that.startX*LCL.scale + LCL.transX + this.moveX;
			var xLeft = x < (that.startX + that.width)*LCL.scale + LCL.transX + this.moveX;
			var yTop = y > that.startY*LCL.scale + LCL.transY + this.moveY;
			var yBottom = y < (that.startY + that.height)*LCL.scale + LCL.transY + this.moveY;

			switch(this.type) {
				case 'rectangle':
					return !!(xRight && xLeft && yTop && yBottom);
			}
		};

		var drag = function(bool) {
			if(!bool || typeof bool !== 'boolean') {
				return;
			}
			this.enableDrag = true;
		}

		return Object.assign({}, settingsData, {

			hasEnter: false,

			rotate: 0,

			moveX: 0,

			moveY: 0,

			events: this.events,

			on: on,

			isPointInner: isPointInner,

			drag: drag

		});

	};

