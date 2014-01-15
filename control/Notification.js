define([
	'jidejs-extra/Class',
	'jidejs/base/Observable',
	'jidejs/ui/Control',
	'jidejs/ui/Skin',

	'text!./Notification.html'
], function(
	Class, Observable,
	Control, Skin,

	NotificationTemplate
) {
	var Property = Class.Property;

	var Notification = Class({
		$extends: Control,

		$init: function(config) {
			Control.call(this, config || {});
		},

		title: Property({ value: '' }),
		content: Property({ value: '' }),
		type: Property({ value: 'info' }),
		icon: Property,
		closeable: Property({ value: true }),
		showTime: 0
	});
	Notification.Skin = Skin.create(Skin, {
		template: NotificationTemplate,
		install: function() {
			var notification = this.component;
			this.isVisible = Observable(true);
			Skin.prototype.install.call(this);
			notification.classList.add('jide-extra-notification');

			this.managed(notification.typeProperty.subscribe(function(event) {
				notification.classList.remove(event.oldValue);
				notification.classList.add(event.value);
			}));
			notification.classList.add(notification.type);

			if(notification.showTime) {
				this.timeoutId = setTimeout(this.closeNotification.bind(this), notification.showTime);
			}
		},

		closeNotification: function() {
			this.component.emit('notification:closed');
			this.isVisible.set(false);
			clearTimeout(this.timeoutId);
		}
	});

	return Notification;
});