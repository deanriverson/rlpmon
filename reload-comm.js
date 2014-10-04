console.log('executing reload-comm');

module.exports = {
	prop: "Hello",

	func: function() {
		console.log('prop', this.prop);
	}
}