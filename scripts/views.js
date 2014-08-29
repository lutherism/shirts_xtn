var BaseModel = require('./models/BaseModel');
Backbone.Epoxy.binding.addHandler('validate', {
		init: function ($boundEl, params, bindings, context) {
			this.validations = params.validations;

			for (var i = 0; i < this.validations.length; i++) {
				this.validations[i].id = _.uniqueId(this.validations[i].type);
			}

			this.$validationContainer = $boundEl.closest('.form-group');
		},

		get: function ($boundEl, value, evt) {

		},

		set: function ($boundEl, params) {
			for (var i = 0; i < this.validations.length; i++) {
				var type = this.validations[i].type;
				var validationParams = this.validations[i].params;
				var id = this.validations[i].id;

				var result = this['validate_' + type](params.value, validationParams);

				if (result === true) {
					this.clearFailedValidations(id);
				} else {
					var severity = 'danger';

					if (typeof result === 'object') {
						severity = result.severity;
						result = result.message;
					}
					this.clearFailedValidations(id);
					this.addFailedValidation(result, id, severity);
				}
			}
		},

		addFailedValidation: function (result, id, severity) {
			var existingError = this.getValidationError(id, severity);

			if (!existingError || !existingError.length) {
				if (severity === 'danger' || severity === 'error') {
					this.$validationContainer.addClass('has-error');
				}
			}
		},

		clearFailedValidations: function (id) {
			this.getValidationError(id).remove();

			// If there are no more validation messages, remove the error class
			if (0 === this.$validationContainer.find('.validation-message').length) {
				this.$validationContainer.removeClass('has-error');
			}
		},

		getValidationError: function (id, severity) {
			var query = '[data-id=' + id + ']';

			if (severity) {
				query += '[data-severity=' + severity + ']';
			}

			return this.$validationContainer.find(query);
		},

		validate_number: function (value, validationParams) {
			var result = true;

			if (value === null || value === undefined) {
				value = 0;
			}

			if (validationParams.max !== undefined && validationParams.max < value) {
				return 'Max ' + validationParams.max;
			}

			if (validationParams.min !== undefined && value < validationParams.min) {
				return 'Min ' + validationParams.min;
			}

			return result;
		},

		validate_length: function (value, validationParams) {
			var result = true;

			if (value === null || value === undefined) {
				value = '';
			}

			if (validationParams.max !== undefined) {
				if (validationParams.max < value.length) {
					return {
						message: 'Max length: ' + validationParams.max + ' (Currently: ' + value.length + ')',
						severity: validationParams.severity || 'error'
					};
				} else if (validationParams.min !== undefined && value.length < validationParams.min) {
					return {
						message: 'Min length: ' + validationParams.min + ' (Currently: ' + value.length + ')',
						severity: validationParams.severity || 'error'
					};
				} else {
					return {
						severity: 'info',
						message: 'Remaining: ' + (validationParams.max - value.length)
					};
				}
			}


			return result;
		},

		validate_regexMatch: function (value, validationParams) {
			var result = true;

			if (value === null || value === undefined) {
				value = '';
			}

			if (typeof validationParams.pass === 'string') {
				validationParams.pass = new RegExp(validationParams.pass, 'g');
			}

			if (typeof validationParams.fail === 'string') {
				validationParams.fail = new RegExp(validationParams.fail, 'g');
			}

			var passMatches = value.match(validationParams.pass);
			var failMatches = value.match(validationParams.fail);

			if (validationParams.pass && passMatches !== null && 0 === passMatches.length) {
				return validationParams.message || 'No matches for ' + validationParams.pass;
			} else if (validationParams.fail && failMatches !== null && 0 < failMatches.length) {
				return validationParams.message || 'Matched ' + validationParams.fail;
			}

			return result;
		}
	});

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
		this.model.on('sync', this.render, this);
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
		'.address-email input': 'value:email',
		'.address-name input': 'value:name',
		'.address-company input': 'value:company',
		'.address-address1 input': 'value:address1',
		'.address-address2 input': 'value:address2',
		'.address-city input': 'value:city',
		'.address-state input': 'value:state',
		'.address-zip input': 'value:zip',
		'label': 'classes:{"col-xs-2": true, "control-label":true}',
		'div.address': 'classes:{"col-xs-10": true}',
		'div.address input': 'classes:{"form-control":true}'
	},
	validation: {
		'.address-email input': {
			value: 'email',
			validations: [{
				type: 'length',
				params: {
					min: 1,
					max:100
				}
			}]
		},
		'.address-name input': {
			value: 'name',
			validations: [{
				type: 'length',
				params: {
					min: 1,
					max:100,
					severity: 'error'
				}
			}]
		},
		'.address-address1 input': {
			value: 'address1',
			validations: [{
				type: 'length',
				params: {
					min: 5,
					max:100,
					severity: 'error'
				}
			}]
		},
		'.address-city input': {
			value: 'city',
			validations: [{
				type: 'length',
				params: {
					min:1,
					max:100
				}
			}]
		},
		'.address-state input': {
			value: 'state',
			validations: [{
				type: 'length',
				params: {
					min: 1,
					max:100
				}
			}]
		},
		'.address-zip input': {
			value: 'zip',
			validations: [{
				type: 'length',
				params: {
					min: 1,
					max:100
				}
			}]
		}
	},
	render: function() {
		this.$el.html(templates.address());
		addressForm.__super__.render.apply(this, arguments);
		this.applyValidation();
		return this;
	},
	applyValidation: function () {
		if (!this.validation) {
			return;
		}

		var keys = _.keys(this.validation);

		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			var binding = this.bindings[key] ? this.bindings[key] + ',' : '';
			var curr = this.validation[key];

			binding += 'validate:{value: ' + curr.value + ', validations: ' + JSON.stringify(curr.validations) + '}';

			this.bindings[key] = binding;
		}

		this.applyBindings();
	}
});

var Thumbnail = BaseView.extend({
	className:"col-xs-6 col-md-3 productModel",
	events: {
		'click .fa-circle': 'pickColor'
	},
	bindings: {
		//'.thumbnail': 'toggle:not(info)',
		//'.panel': 'toggle:info',
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
	},
	pickColor: function(e) {
		var product = this.model.toJSON();
		var color = this.model.get('colors')[$(e.currentTarget).data('color')];
		this.model.collection.trigger('option_selected', _.extend(product, {
				selectedColor: color,
				color: color.name,
				sizes: color.sizes
			})
		);
		$('html, body').animate({
		   scrollTop: $('.product-selection').offset().top
		}, 'slow');
	}
});

var ImageArray = BaseView.extend({
	itemView: Thumbnail,
	render: function() {
		this.$el.html(templates.ImageContainer());
		ImageArray.__super__.render.apply(this);
	}
});

var SelectedProduct = BaseView.extend({
	className: 'selectedProduct',
	bindings: {
		'.size-select': 'options:sizes',
		'.qty-select': 'options:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], optionsDefault:1'
	},
	events: {
		'click .close': 'closeButton',
		'click .fa-circle': 'pickColor',
		'change .size-select': 'sizeSelect',
		'change .qty-select': 'qtySelect'
	},
	render: function() {
		this.$el.html(templates.SelectedProductView({
			product: this.model.toJSON({
				computed: true
			})
		}));
		this.$el.show();
		SelectedProduct.__super__.render.apply(this, arguments);
	},
	closeButton: function() {
		this.model.destroy();
		this.$el.hide();
	},
	pickColor: function(e) {
		var product = this.model.toJSON();
		var color = this.model.get('colors')[$(e.currentTarget).data('color')];
		this.collection.trigger('option_selected', _.extend(product, {
				selectedColor: color,
				color: color.name,
				sizes: color.sizes
			})
		);
		$('html, body').animate({
		   scrollTop: $('.product-selection').offset().top
		}, 'slow');
	},
	sizeSelect: function(e) {
		var size = $(e.currentTarget).val();
		this.model.set('size', size);
	},
	qtySelect: function(e) {
		var qty = $(e.currentTarget).val();
		this.model.set('quantity', qty);
	}
});

var Shop = BaseView.extend({
	events: {
		'click .btn-save': 'handleQuote'
	},
	bindings: {
		'img': 'attr:{"src":img}'
	},
	initialize: function(options) {
		this.options = options || {};
		this.categories = this.options.categories;
		this.products = this.options.products;
		this.shipping = this.options.shipping;
		this.prodSelection = this.options.selection;
		this.viewModel = new BaseModel({
			img:""
		});
		Shop.__super__.initialize.apply(this. arguments);
	},

	render: function() {
		this.$el.html(templates.App());
		this.$catagorySelect = this.$el.find('.category-pills');
		this.$addressForm = this.$el.find('.address-form');
		this.$images = this.$el.find('.image-container');
		this.$selection = this.$el.find('.product-selection');
		this.buildSubviews();
		Shop.__super__.render.apply(this, arguments);
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

		this.productSelection = new SelectedProduct({
			collection: this.products,
			el: this.$selection
		});

		this.categories.on('option_selected', this.optionSelected, this);
		this.products.on('option_selected', this.productSelected, this);
		this.on('sendQuote', this.sendQuote, this);
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
		this.prodSelection.set(e);
		this.productSelection.model = this.prodSelection;
		this.productSelection.render();
	},
	handleQuote: function() {
		var order = _.extend({}, _.pick(this.prodSelection.toJSON(), 
			['productId',
			'color',
			'size',
			'quantity',
			'selectedColor']));
		order = _.extend({}, order, _.pick(this.shipping.toJSON(),
			['address1',
			 'address2',
			 'name',
			 'country',
			 'zip',
			 'state', 
			 'city']));
		order.type = 'dtg';
		order.sides = {front:1};
		order.placeOrder = 1;
		order.width = 12;
		order.artwork = "http://google.com/default.png";
		order.productImage = this.prodSelection.get('image').url;

		this.quote = _.extend({}, order);
		// Save it using the Chrome extension storage API.
		chrome.storage.sync.set({clickShirtData: order}, _.bind(function() {
			this.viewModel.set('saving_user', false);
		}, this));
	},
	sendQuote: function(link) {
		var link = link.data;
		if (link.srcUrl) {
			this.quote.Artwork = link.srcUrl;
			$.ajax({
				type: 'POST',
				data: this.quote,
				url: postApi,
				success: _.bind(function(data){
					alert(JSON.stringify(data));
				}, this)
			});
		}
	}
});