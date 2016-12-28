
// Source: src/header.js
;(function(){

// Source: src/core.js

	var LCL = {

		version: '1.0.0',

		modules: {},

		scenes: {},

		ctx: null,

		core: function(config) {
			console.log(Object.prototype.toString.call(config))
			if(Object.prototype.toString.call(config) !== '[object Object]') {
				console.warn('no canvas element!')
				return;
			}
			this.element = config.element,

			this.canvas = LCL.ctx = this.element.getContext('2d');



		},

		init: function(config) {
			return new LCL.core(config);
		},

		registerModule: function(moduleName, module) {
			LCL.modules[moduleName] = module;
		},

		registerGroup: function(groupName, group) {
			LCL.modules.scene[groupName] = group;
		},

		createScene: function(name) {
			LCL.scenes[name] = {
				name: name,
				scene: LCL.modules.scene
			};
			return new LCL.modules.scene();
		}

	};

// Source: src/scene.js

	function scene() {

		this.groups = {};

	}

	scene.prototype = {

		createGroup: function(name) {
			this.groups[name] = {
				name: name
			};

			return new LCL.modules.scene.group();
		}

	};

	LCL.registerModule('scene', scene);

	function group() {
		this.ctx = LCL.ctx;
		this.x = 0;
		this.y = 0;
	}

	group.prototype = {

		translate: function() {
			var arg = arguments;
			return this.ctx.translate(arg[0] + this.x, arg[1] + this.y);
		},

		save: function() {
			return this.ctx.save();
		},

		restore: function() {
			return this.ctx.restore();
		},

		moveTo: function() {
			var arg = arguments;
			return this.ctx.moveTo(arg[0] + this.x, arg[1] + this.y);
		},

		lineTo: function() {
			var arg = arguments;
			return this.ctx.lineTo(arg[0], arg[1]);
		},

		stroke: function() {
			return this.ctx.stroke();
		}
	};

	LCL.registerGroup('group', group);


// Source: src/footer.js
	
	if(typeof exports === 'object' && typeof module === 'object') {
		module.exports = LCL;
	} else {
		window.LCL = LCL;
	}
})();