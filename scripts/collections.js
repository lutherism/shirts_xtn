	var BaseCollection = Backbone.Collection.extend({
		model: BaseModel,
		initialize: function(options) {

			BaseCollection.__super__.initialize.apply(this, arguments);
		}
	})
	var Catagories = BaseCollection.extend({
		model: Category,

		url: function() {
			return globalApi + "/categories"
		}
	});

	var Products = BaseCollection.extend({
		model: Product,

		url: function() {
			return globalApi + "/products/"
		}
	});

	var OrderCollection = BaseCollection.extend({
		model: OrderResponse,
		url: function() {
			return globalApi + "/order"
		}
	});
