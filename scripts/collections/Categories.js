var $ = require("../vendor/jquery");
var _ = require("../vendor/underscore-min");
var Backbone = require("../vendor/backbone");
var Epoxy = require("../vendor/backbone.epoxy.min");
var BaseCollection = require("./collections/BaseCollection");
var Category = require("../models/Category");
var Catagories = BaseCollection.extend({
		model: Category,
		comparator: 'family',

		url: function() {
			return globalApi + "/categories"
		}
	});