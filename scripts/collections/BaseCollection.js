var $ = require("../vendor/jquery");
var _ = require("../vendor/underscore-min");
var Backbone = require("../vendor/backbone");
var Epoxy = require("../vendor/backbone.epoxy.min");
var BaseModel = require("../models/BaseModel");
var BaseCollection = Backbone.Collection.extend({
	model: BaseModel,
	initialize: function(options) {

		BaseCollection.__super__.initialize.apply(this, arguments);
	}
});