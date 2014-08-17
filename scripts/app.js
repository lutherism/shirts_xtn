(function() {
var catagoryFull = new Catagories();
var productFull = new Products();
var ourShipping = new Address();
var ourDesign = new Design();
var shop = window.shop = new Shop({
	el: $('.app'),
	categories: catagoryFull,
	products: productFull,
	shipping: ourShipping,
	design: ourDesign
});
/*var designManager = window.designManager = new ProfileManager({
	model: ourDesign
});*/

catagoryFull.fetch({
	success: _.bind(function() {
		//Pre-select Ladies Short Sleve
		window.shop.optionSelected('ladies-short-sleeve');
		$('a[value="ladies-short-sleeve"]').parent().addClass('active');
	}, this)
});
shop.render();

function receiveMessage(event)
{
  shop.sendQuote(event)
}

window.addEventListener("message", _.bind(receiveMessage, this), false);

})();