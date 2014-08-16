(function() {
var BaseView = Backbone.Epoxy.View.extend({
	initialize: function(options) {
		this.options = options || {};
		BaseView.__super__.initialize.apply(this);
	},

	render: function() {
		this.applyBindings();
		this.delegateEvents();
		BaseView.__super__.render.apply(this);
	}

});
var dropDown = BaseView.extend({
	events: {
		'click button': 'findCatagories',
		'change select': 'categoryPicked'
	},
	bindings: {
		'select': 'options:collection, optionsDefault:defaultOption',
		'h2': 'html:titleLabel'
	},
	initialize: function(options) {
		this.options = options || {};

		this.collection = this.options.collection;
		this.viewModel = new BaseModel({
			collection: this.collection,
			defaultOption: this.options.defaultOption,
			titleLabel: this.options.titleLabel
		})
		dropDown.__super__.initialize.apply(this, arguments);
	},

	render: function() {
		this.$el.html(templates.dropDown());

		dropDown.__super__.render.apply(this, arguments);
		return this;
	},

	categoryPicked: function(e) {
		var value = $(e.currentTarget).val();
		this.trigger('option_selected', value);
		//this.on('change select', this.categoryPicked, this);
	}
});
var addressForm = BaseView.extend({
	bindings: {
		'.address-name input': 'value:name',
		'.address-company input': 'value:company',
		'.address-address1 textarea': 'value:address1',
		'.address-address2 input': 'value:address2',
		'.address-city input': 'value:city',
		'.address-state input': 'value:state',
		'.address-zip input': 'value:zip',
		'.address-country input': 'value:country',
		'label': 'classes:{"col-xs-2": true, "control-label":true}',
		'div.address': 'classes:{"col-xs-10": true}',
		'div.address input': 'classes:{"form-control":true}'
	},	
	render: function() {
		this.$el.html(templates.address());
		addressForm.__super__.render.apply(this, arguments);
	}
})
var App = BaseView.extend({
	events: {
		'click button': 'handleQuote'
	},
	bindings: {
		'img': 'attr:{"src":img}'
	},
	initialize: function(options) {
		this.options = options || {};
		this.categories = this.options.categories;
		this.products = this.options.products;
		this.shipping = this.options.shipping;
		this.viewModel = new BaseModel({
			img:""
		});

		this.categoryDropDown = new dropDown({
			collection: this.categories,
			defaultOption: {
				label: "Select a Category",
				value: ""
			},
			titleLabel: "Categories"
		});
		this.categoryDropDown.render();
		this.categories.fetch({
			success: _.bind(function() {
				this.categoryDropDown.render()
			}, this)
		});

		this.productDropDown = new dropDown({
			collection: this.products,
			defaultOption: {
				label: "Select a Category",
				value: ""
			},
			titleLabel: "Products"
		});

		this.addressWiget = new addressForm({
			model:this.shipping
		});
		this.addressWiget.render();

		this.categoryDropDown.on('option_selected', this.optionSelected, this);
		this.productDropDown.on('option_selected', this.productSelected, this);
		App.__super__.initialize.apply(this. arguments);
	},

	render: function() {
		this.$el.html(this.categoryDropDown.el);
		this.$el.append(this.productDropDown.el);
		this.$el.append('<div class="thumbnail"><img></div>');
		this.$el.append(this.addressWiget.el);
		this.$el.append('<button class="btn btn-md btn-success pull-right">Quote</button>');
		App.__super__.render.apply(this, arguments);
	},

	optionSelected: function(e) {
		this.catSelection = this.categories.get(e);
		this.catSelection.fetch({
			success: _.bind(this.gotProducts, this)
		});
	},

	gotProducts: function() {
		this.products.reset(this.catSelection.get('products'));
		this.productDropDown.render();
	},

	productSelected: function(e) {
		this.prodSelection = this.products.get(e);
		this.viewModel.set('img', this.prodSelection.get('image').url);
	},
	handleQuote: function(e) {
		var data = {};
		data.products = [this.prodSelection.toJSON()];
		data.address = this.shipping.toJSON();
		data.type = 'dtg';
		data.sides = {front:1};
		data.design = "53ed3a23b3730f0e27a66513";

		$.ajax({
			type: 'POST',
			url: globalApi + '/quote',
			success: _.bind(function(data){
				alert(JSON.stringify(data));
			}, this),
			headers :{
				"Authorization": "Basic " + btoa(":" + SPToken)
			}
		});
	}
});

var catagoryFull = new Catagories();
var productFull = new Products();
var ourShipping = new Address();
var app = new App({
	el: $('.app'),
	categories: catagoryFull,
	products: productFull,
	shipping: ourShipping
});

app.render();
})();