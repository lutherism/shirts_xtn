var BaseView = require("./models/BaseModel");
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