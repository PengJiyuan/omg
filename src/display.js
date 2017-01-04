
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
			// rotate the x and y coordinates 
			var cX = this.startX + this.width/2 + LCL.transX + this.moveX, cY = this.startY + this.height/2 + LCL.transY + this.moveY;
			var oX = (x - cX)*Math.cos((Math.PI/180)*(-this.rotate)) - (y - cY)*Math.sin((Math.PI/180)*(-this.rotate)) + cX;
			var oY = (x - cX)*Math.sin((Math.PI/180)*(-this.rotate)) + (y - cY)*Math.cos((Math.PI/180)*(-this.rotate)) + cY;
			var xRight = oX > this.startX + LCL.transX + this.moveX;
			var xLeft = oX < this.startX + this.width + LCL.transX + this.moveX;
			var yTop = oY > this.startY + LCL.transY + this.moveY;
			var yBottom = oY < this.startY + this.height + LCL.transY + this.moveY;

			switch(this.type) {
				case 'rectangle':
					return !!(xRight && xLeft && yTop && yBottom);
			}
		};

		var config = function(obj) {
			if(Object.prototype.toString.call(obj) !== '[object Object]') {
				return;
			}
			if(obj.drag) {
				this.enableDrag = true;
			}
			if(obj.changeIndex) {
				this.enableChangeIndex = true;
			}
			return this;
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

			isDragging: false,

			hasEnter: false,

			hasDraggedIn: false,

			rotate: 0,

			moveX: 0,

			moveY: 0,

			on: on,

			isPointInner: isPointInner,

			config: config,

			drag: drag,

			changeIndex: changeIndex

		});

	};

