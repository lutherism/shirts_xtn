(function() {
var templates = {};
$('#templates').children('div').each(function () {
	templates[this.attr('id')] = Handlebars.compile(this);
});
var main = Backbone.View.extend({
	initialize: function(options) {
		main.__super__.initialize.apply(this);
	},

	render: function() {
		this.$el.html(templates.App());

		main.__super__.render.apply(this);
		return this;
	}
});

var app = new main({
	el: $('body') 
});
app.render();
})();