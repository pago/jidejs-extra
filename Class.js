define(['jidejs/base/Util', 'jidejs/base/ObservableProperty'], function(_, ObservableProperty) {
	function Type() {
	}
	Type.prototype.name = '';
	Type.prototype.init = function(instance) {};
	Type.prototype.setup = function(instance) {};
	Type.prototype.dispose = function(instance) {};

	function Property(config) {
		if(!(this instanceof Property)) {
			return new Property(config);
		}
		this.name = config.name || '';
		this.initivalValue = config.value || null;
		this.converter = config.converter || null;
		this.bubbles = config.bubbles || false;
		this.cancelable = typeof config.cancelable !== 'undefined' ? config.cancelable : true;
	}
	Property.prototype = Object.create(Type.prototype);
	Property.prototype.constructor = Property;
	Property.prototype.setup = function(proto) {
		var name = this.name;
		Object.defineProperty(proto, name, {
			get: function() {
				return this[name+'Property'].get();
			},

			set: function(value) {
				this[name+'Property'].set(value);
			},

			enumerable: true, configurable: true
		});
	};
	Property.prototype.init = function(instance) {
		var name = this.name;
		instance[name+'Property'] = new ObservableProperty(
			instance, name, this.initialValue, this.converter, this.bubbles, this.cancelable
		);
	};
	Property.prototype.dispose = function(instance) {
		instance[this.name+'Property'].dispose();
	};

	/**
	 * Creates a new constructor function from the given definition object.
	 *
	 * @param {Object} definition The class definition
	 * @param {Object|Function?} definition.$extends The prototype from which the new class inherits.
	 * 					If a function is given, its prototype is used.
	 * @param {Array<Object>?} definition.$with An Array of objects that should be mixed in with this class.
	 * @param {Function?} definition.$init The constructor function of the class
	 * @param {Function?} definition.dispose The dispose implementation
	 * @return {Function}
	 */
	function Class(definition) {
		var $extends = definition.$extends || Object,
			$with = definition.$with || [],
			$init = definition.$init,
			dispose = definition.dispose,
			properties = [];

		if(_.isFunction($extends)) {
			$extends = $extends.prototype || Object;
		}

		function Class() {
			for(i = 0, len = properties.length; i < len; i++) {
				properties[i].init(this, arguments);
			}
			$init.apply(this, arguments);
		}
		Class.prototype = Object.create($extends);

		for(var i = 0, len = $with.length; i < len; i++) {
			mixin(Class.prototype, $with[i]);
		}

		Object.getOwnPropertyNames(definition).forEach(function(propertyName) {
			// ignore the $extends and $with properties
			if(propertyName === '$extends' || propertyName === '$with' || propertyName === '$init' || propertyName === 'dispose') return;

			var descriptor = Object.getOwnPropertyDescriptor(definition, propertyName);
			if(descriptor.value) {
				if(descriptor.value === Property) {
					properties.push(new Property({name: propertyName}));
				} else if(descriptor.value instanceof Type) {
					descriptor.value.name = propertyName;
					properties.push(descriptor.value);
				} else {
					descriptor.configurable = true; // explicitly make the property configurable so that it can be overriden
					Object.defineProperty(Class.prototype, propertyName, descriptor);
				}
			} else {
				descriptor.configurable = true; // explicitly make the property configurable so that it can be overriden
				Object.defineProperty(Class.prototype, propertyName, descriptor);
			}
		});

		for(i = 0, len = properties.length; i < len; i++) {
			properties[i].setup(Class.prototype);
		}

		Class.prototype.dispose = function() {
			for(i = 0, len = properties.length; i < len; i++) {
				properties[i].dispose(this);
			}
			if(dispose) dispose.call(this);
			else if($extends.dispose) $extends.dispose.call(this);
		};
		Class.prototype.constructor = Class;


		return Class;
	}

	Class.Type = Type;
	Class.Property = Property;

	function mixin(target, mixin) {
		var copyTarget = target;
		if(_.isFunction(copyTarget)) {
			copyTarget = target.prototype;
		}
		for(var i = 0, len = arguments.length; i < len; i++) {
			mixin = arguments[i];
			if(_.isFunction(mixin)) {
				mixin = mixin.prototype;
			}
			Object.getOwnPropertyNames(mixin).forEach(function(name) {
				if(!(name in copyTarget)) {
					var desc = Object.getOwnPropertyDescriptor(mixin, name);
					Object.defineProperty(copyTarget, name, desc);
				}
			});
		}
		return this;
	}

	return Class;
});