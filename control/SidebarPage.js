define([
	'jidejs-extra/Class',
	'jidejs/base/Observable',
	'jidejs/base/DOM',
	'jidejs/ui/Control',
	'jidejs/ui/Skin',

	'text!./SidebarPage.html'
], function(
	Class, Observable, DOM,
	Control, Skin,
	SidebarPageTemplate
) {
	var Property = Class.Property;
	var SidebarPage = Class({
		$extends: Control,

		$init: function(config) {
			Control.call(this, config || {});
			this.classList.add('jide-extra-sidebar-page');
		},

		sidebar: Property,
		content: Property,
		title: Property
	});
	SidebarPage.Skin = Skin.create(Skin, {
		template: SidebarPageTemplate,
		isSidebarVisibleProperty: false,

		install: function() {
			this.isSidebarVisibleProperty = Observable(false);
			Skin.prototype.install.call(this);
		},

		get sidebarWidth() {
			return this.isSidebarVisible ? DOM.measure(this['x-sidebar']).width : 0;
		},

		get isSidebarVisible() {
			return this.isSidebarVisibleProperty.get();
		},

		set isSidebarVisible(value) {
			this.isSidebarVisibleProperty.set(value);
		},

		toggleSidebarVisibility: function() {
			this.isSidebarVisible = !this.isSidebarVisible;
		}
	});
	return SidebarPage;
});