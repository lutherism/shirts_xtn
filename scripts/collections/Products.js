var $ = require("../vendor/jquery");
var _ = require("../vendor/underscore-min");
var Backbone = require("../vendor/backbone");
var Epoxy = require("../vendor/backbone.epoxy.min");
var BaseCollection = require("./BaseCollection");
var Product = require("../models/Product");
var Products = BaseCollection.extend({
		model: Product,
		comparator: 'available',

		url: function() {
			return globalApi + "/products/"
		}
	});