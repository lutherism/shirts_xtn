	var BaseModel = Backbone.Epoxy.Model.extend({
		initialize: function(options) {

			BaseModel.__super__.initialize.apply(this, arguments);
		}
	});

	var Category = BaseModel.extend({
		idAttribute: "categoryId",
		defaults: {
			categoryId: "",
			type: "",
			name: "",
			family: "",
			url: "",
			products: []
		},
		computeds: {
			label: {
				deps: ['name'],
				get: function() {
					return this.get('name');
				}
			},
			value: {
				deps: ['categoryId'],
				get: function() {
					return this.get('categoryId');
				}
			}
		},
		url: function(options) {
			return globalApi + "/categories/" + this.id;
		}
	});

	var Product =  BaseModel.extend({
		idAttribute: 'id',
		defaults: {
			comments: "",
			description: "",
			name: "",
			type: "",
			properties: {},
			colors: [],
			additionalImages: [],
			image: {},
			available: true,
			url: "",
			productId: "",
			Artwork: ""
		},
		computeds: {
			label: {
				deps: ['name'],
				get: function() {
					return this.get('name');
				}
			},
			value: {
				deps: ['id'],
				get: function() {
					return this.get('id');
				}
			}
		},
		url: function() {
			return globalApi + "/products/" + this.id;
		}
	});

	var ProductOrder =  BaseModel.extend({
		idAttribute: 'id',
		defaults: {
			size: "",
			colors: [],
			color: "",
			selectedColor: {},
			additionalImages: [],
			image: {},
			quantity: 0,
			id: ""
		},
		url: function() {
			return globalApi + "/products/" + this.id;
		}
	});

	var QuoteOrder = BaseModel.extend({
		defaults: {
			type: "",
			designId: "",
			sides: {},
			products: [],
			address: {}
		},

		url: function(options) {
			return globalApi + "/quote";
		}
	});

	var Sides = BaseModel.extend({
		defaults: {
			front: 1,
			back: 0,
			right: 0,
			left: 0
		}
	});

	var OrderProduct = BaseModel.extend({
		defaults: {
			id: "",
			color: "",
			size: "",
			quantity: 1
		}
	});

	var Address = BaseModel.extend({
		defaults: {
			email: "",
			name: "",
			company: "",
			address1: "",
			address2: "",
			city: "",
			state: "",
			zip: 0,
			country: "US"
		}
	});

	var QuoteResponse = BaseModel.extend({
		defaults: {
			total: 0,
			warning: [],
			issues: [],
			orderIssues: [],
			orderToken: "",
			statusCode: 0,
			mode: ""
		}
	});

	var ProductType = BaseModel.extend({
		defaults: {
			name: "",
			style: 0,
			image: {},
			id: "",
			url: ""
		},
		url: function() {
			return globalApi + "/categories/" + this.id;
		}
	});


	var OrderResponse = BaseModel.extend({
		defaults: {
			total: 0,
			otherToken: "",
			createdAt: "",
			warnings: [],
			events: [],
			items: [],
			orderId: "",
			mode: ""
		},
		url: function() {
			return globalApi + "/order/" + this.id;
		}
	});

	var Design = BaseModel.extend({
		defaults: {
			name: "",
			type: "",
			sides: {},
			createdAt: "",
			designId: "",
			mode: ""
		},
		url: function() {
			return "http://api.fb.dev.metv.bz/sio";
		}
	});
