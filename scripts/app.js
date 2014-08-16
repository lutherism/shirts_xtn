(function() {
var catagoryFull = new Catagories();
var productFull = new Products();
var ourShipping = new Address();
var app = new App({
	el: $('.app'),
	categories: catagoryFull,
	products: productFull,
	shipping: ourShipping
});

app.render()

})();