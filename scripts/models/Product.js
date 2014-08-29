var $ = require("../vendor/jquery");
var _ = require("../vendor/underscore-min");
var Backbone = require("../vendor/backbone");
var Epoxy = require("../vendor/backbone.epoxy.min");
var BaseModel = require("../models/BaseModel");
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