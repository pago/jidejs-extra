define([
	'jidejs/base/Util',
	'jidejs-extra/control/NotificationArea',
	'jidejs-extra/control/Notification',
	'jidejs-extra/control/NotificationIcon'
], function(_, NotificationArea, Notificiation, NotificationIcon) {
	var exports = {},
		notificationArea = null;

	function initNotificationArea() {
		if(notificationArea === null) {
			notificationArea = new NotificationArea({
				edge: NotificationArea.Edge.TOP_RIGHT
			});
			document.body.appendChild(notificationArea.element);
		}
	}

	var add = exports.add = function(notification) {
		initNotificationArea();
		notificationArea.add(notification);
	};

	var addInfo = exports.addInfo = function(title, content, config) {
		config || (config = {});
		_.defaults(config, { type: 'info', title: title, content: content, showTime: 5000, closeable: true, icon: NotificationIcon.info });
		add(new Notificiation(config));
	};

	var addWarning = exports.addWarning = function(title, content, config) {
		config || (config = {});
		_.defaults(config, { type: 'warning', title: title, content: content, showTime: 5000, closeable: true, icon: NotificationIcon.warning });
		add(new Notificiation(config));
	};

	var addSuccess = exports.addSuccess = function(title, content, config) {
		config || (config = {});
		_.defaults(config, { type: 'success', title: title, content: content, showTime: 5000, closeable: true, icon: NotificationIcon.success });
		add(new Notificiation(config));
	};

	var addError = exports.addError = function(title, content, config) {
		config || (config = {});
		_.defaults(config, { type: 'error', title: title, content: content, showTime: 5000, closeable: true, icon: NotificationIcon.error });
		add(new Notificiation(config));
	};

	Object.defineProperty(exports, 'edge', {
		get: function() {
			initNotificationArea();
			return notificationArea.edge;
		},

		set: function(edge) {
			initNotificationArea();
			notificationArea.edge = edge;
		}
	});

	return exports;
});