(function() {
var catagoryFull = new Catagories();
var productFull = new Products();
var ourShipping = new Address();
var app = window.app = new App({
	el: $('.app'),
	categories: catagoryFull,
	products: productFull,
	shipping: ourShipping
});

catagoryFull.fetch({
	success: _.bind(function() {
		//Pre-select Ladies Short Sleve
		window.app.optionSelected('ladies-short-sleeve');
		$('a[value="ladies-short-sleeve"]').parent().addClass('active');
	})
});
app.render()

})();