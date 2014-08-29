var $ = require("../vendor/jquery");
var _ = require("../vendor/underscore-min");
var Backbone = require("../vendor/backbone");
var Epoxy = require("../vendor/backbone.epoxy.min");

var Products = require("./collections/Products");
var Catagories = require("./collections/Categories");
var Address = require("./models/Address");
var ProudctOrder = require("./models/ProductOrder");
var views = require("./views");

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-37375670-2']);
_gaq.push(['_trackPageview']);

(function() {	
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function() {
var catagoryFull = new Catagories();
var productFull = new Products();
var ourShipping = new Address();
var ourDesign = new Design();
var selection = new ProductOrder();
var shop = window.shop = new views.Shop({
	el: $('.app'),
	categories: catagoryFull,
	products: productFull,
	shipping: ourShipping,
	design: ourDesign,
	selection: selection
});
chrome.storage.sync.get('clickShirtData', _.bind(function(e) {
	console.log(e);
	ourShipping.set(_.pick(e.clickShirtData, 
		['address1',
		 'address2',
		 'name',
		 'country',
		 'zip',
		 'state', 
		 'city']
	));
	shop.productSelected(_.pick(e.clickShirtData, 
		['productId',
		'color',
		'size',
		'quantity',
		'selectedColor']
	));
	selection.fetch({replace:false});
}, this));
/*var designManager = window.designManager = new ProfileManager({
	model: ourDesign
});*/
var cats = [];
var catIds = [
	'mugs',
	'phone-cases',
	'long-sleeve-shirts',
	'short-sleeve-shirts'];
for (var cat in catIds) {
	var inst = new Category({categoryId: catIds[cat]});
	inst.fetch();
	cats.push(inst);
}
catagoryFull.add(cats);
//Pre-select Ladies Short Sleve
window.shop.optionSelected('short-sleeve-shirts');
$('a[value="short-sleeve-shirts"]').parent().addClass('active');
shop.render();
})();