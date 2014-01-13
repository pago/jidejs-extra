define([
	'jidejs/base/Class',
	'jidejs/base/ObservableProperty',
	'jidejs/ui/Control',
	'jidejs/ui/Skin',
	'text!./Switch.html'
], function(
	Class, ObservableProperty,
	Control, Skin,
	SwitchTemplate
) {
	function Switch(config) {
		installer(this);
		Control.call(this, config || {});
		this.classList.add('jide-extra-switch');
	}
	Class(Switch).extends(Control).def({
		checkedText: null,
		uncheckedText: null
	});
	var installer = ObservableProperty.install(Switch, 'checked', 'checkedText', 'uncheckedText');

	Switch.Skin = Skin.create(Skin, {
		template: SwitchTemplate,

		toggleCheckedState: function() {
			var toggle = this.component;
			toggle.checked = !toggle.checked;
		}
	});

	return Switch;
});