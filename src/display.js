
	LCL.display = function(settings) {

		var settingsData = {

			startX: settings.startX,

			startY: settings.startY,

			width: settings.width,

			height: settings.height,

			fillColor: settings.fillColor

		};

		// bind event
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

		// whether pointer is inner this shape
		var isPointInner = function(x, y) {
			var that = this;
			var xRight = x > this.startX*LCL.scale + LCL.transX + this.moveX;
			var xLeft = x < (this.startX + this.width)*LCL.scale + LCL.transX + this.moveX;
			var yTop = y > this.startY*LCL.scale + LCL.transY + this.moveY;
			var yBottom = y < (this.startY + this.height)*LCL.scale + LCL.transY + this.moveY;

			switch(this.type) {
				case 'rectangle':
					return !!(xRight && xLeft && yTop && yBottom);
			}
		};

		// whether this shape can be dragged
		var drag = function(bool) {
			if(!bool || typeof bool !== 'boolean') {
				return;
			}
			this.enableDrag = true;
		};

		// when select this shape, whether it should be changed the index
		var changeIndex = function(bool) {
			if(!bool || typeof bool !== 'boolean') {
				return;
			}
			this.enableChangeIndex = true;
		};

		return Object.assign({}, settingsData, {

			hasEnter: false,

			rotate: 0,

			moveX: 0,

			moveY: 0,

			on: on,

			isPointInner: isPointInner,

			drag: drag,

			changeIndex: changeIndex

		});

	};

