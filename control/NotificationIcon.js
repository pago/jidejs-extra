define([
	'text!./NotificationIcon.html'
], function(NotificationIconTemplate) {
	var source = (function() {
		var div = document.createElement('div');
		div.innerHTML = NotificationIconTemplate;
		return div;
	}());

	var exports = {
		get info() {
			return source.querySelector('.info').cloneNode(true);
		},

		get warning() {
			return source.querySelector('.warning').cloneNode(true);
		},

		get error() {
			return source.querySelector('.error').cloneNode(true);
		},

		get success() {
			return source.querySelector('.success').cloneNode(true);
		}
	};

	return exports;
});