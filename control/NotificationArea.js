define([
	'jidejs-extra/Class',
	'jidejs/base/ObservableList',
	'jidejs/ui/Control',
	'jidejs/ui/Skin',

	'text!./NotificationArea.html'
], function(Class, ObservableList, Control, Skin, NotificationAreaTemplate) {
	var NotificationArea = Class({
		$extends: Control,
		$init: function(config) {
			config || (config = {});

			if(!config.children) this.children = new ObservableList();
			else this.children = ObservableList(config.children);
			delete config.children;

			Control.call(this, config);
		},

		edge: Class.Property({ value: 'inline' }),

		add: function(notification) {
			this.children.insertAt(0, notification);
		}
	});
	NotificationArea.Skin = Skin.create(Skin, {
		template: NotificationAreaTemplate,

		install: function() {
			Skin.prototype.install.call(this);

			var area = this.component;
			area.classList.add('jide-extra-notification-area');
			// Note: We need to dynamically add/remove class names, there is no binding for that
			// kind of task yet so we need to do it here
			this.managed(area.edgeProperty.subscribe(function(event) {
				area.classList.remove('edge-'+event.oldValue);
				area.classList.add('edge-'+event.value);
			}));
			area.classList.add('edge-'+area.edge);
			this.on({
				'notification:closed': this.handleNotificationClosed.bind(this)
			});
		},

		handleNotificationClosed: function(event) {
			var notification = event.source,
				area = this.component,
				index = area.children.indexOf(notification);
			if(index > -1) {
				area.children.removeAt(index);
				event.stopImmediatePropagation();
				event.stopPropagation();
			}
		}
	});
	NotificationArea.Edge = {
		INLINE: 'inline',
		TOP_LEFT: 'top-left',
		BOTTOM_LEFT: 'bottom-left',
		BOTTOM_RIGHT: 'bottom-right',
		TOP_RIGHT: 'top-right'
	};

	return NotificationArea;
});