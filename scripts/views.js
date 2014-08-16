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
var PillView = BaseView.extend({
	tagName: 'li',
	events: {
		'click a': 'pillClicked'
	},
	initialize: function(options) {
		PillView.__super__.initialize.apply(this, arguments);
		this.render();
	},
	render: function() {
		this.$el.html(templates.Pill({
			model: this.model.toJSON({computed: true})
		}));
		PillView.__super__.render.apply(this, arguments);
	},
	pillClicked: function(e) {
		this.$el.siblings().each(function () {
			$(this).removeClass('active');
		});
		this.$el.addClass('active');
		var value = $(e.currentTarget).val();
		this.model.collection.trigger('option_selected', this.model);
	}
});
var PillListView = BaseView.extend({
	itemView: PillView,
	className:"nav nav-pills",
	render: function() {
		this.$el.html(templates.PillList());
		PillListView.__super__.render.apply(this);
	}
})
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
		return this;
	}
});

var Thumbnail = BaseView.extend({
	className:"col-xs-6 col-md-3 productModel",
	events: {
		'click i': 'toggleInfo'
	},
	bindings: {
		'.thumbnail': 'toggle:not(info)',
		'.panel': 'toggle:info',
		'.fa-check-circle': 'toggle:available'
	},
	initialize: function(options) {
		this.viewModel = new BaseModel({
			info: false
		});
		this.model.fetch({
			success: _.bind(this.render, this)
		});
		Thumbnail.__super__.initialize.apply(this, arguments);
	},
	render: function() {
		this.$el.html(templates.ProductModelView({product: this.model.toJSON()}));
		Thumbnail.__super__.render.apply(this, arguments);
	},
	getDetails: function() {
		this.model.fetch({
			success: _.bind(function(){
				this.viewModel.set('info', true);
				//this.render();
			}, this)
		});
	},
	toggleInfo: function() {
		this.viewModel.set('info', !this.viewModel.get('info'));
		//this.render();
	}
});

var ImageArray = BaseView.extend({
	itemView: Thumbnail,
	render: function() {
		this.$el.html(templates.ImageContainer());
		ImageArray.__super__.render.apply(this);
	}
});

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
		App.__super__.initialize.apply(this. arguments);
	},

	render: function() {
		this.$el.html(templates.App());
		this.$catagorySelect = this.$el.find('.category-pills');
		this.$addressForm = this.$el.find('.address-form');
		this.$images = this.$el.find('.image-container');
		this.buildSubviews();
		App.__super__.render.apply(this, arguments);
	},

	buildSubviews: function (){
		this.categoryDropDown = new PillListView({
			collection: this.categories,
			el: this.$catagorySelect
		});
		this.categoryDropDown.render();

		this.addressWiget = new addressForm({
			model: this.shipping,
			el: this.$addressForm
		});
		this.addressWiget.render();

		this.imageArray = new ImageArray({
			collection: this.products,
			el: this.$images
		});

		this.categories.on('option_selected', this.optionSelected, this);
	},

	optionSelected: function(e) {
		this.catSelection = this.categories.get(e);
		this.catSelection.fetch({
			success: _.bind(this.gotProducts, this)
		});
	},

	gotProducts: function() {
		this.products.reset(this.catSelection.get('products'));
		this.products.trigger('update');
		this.imageArray.render();
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
			data: data,
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