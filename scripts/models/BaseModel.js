var $ = require("../vendor/jquery");
var _ = require("../vendor/underscore");
var Backbone = require("../vendor/backbone");
var Epoxy = require("../vendor/backbone.epoxy.min");
var BaseModel = Backbone.Epoxy.Model.extend({
	initialize: function(options) {

		BaseModel.__super__.initialize.apply(this, arguments);
	}
});
return BaseModel;