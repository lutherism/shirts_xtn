var $ = require("../vendor/jquery");
var _ = require("../vendor/underscore-min");
var Backbone = require("../vendor/backbone");
var Epoxy = require("../vendor/backbone.epoxy.min");
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