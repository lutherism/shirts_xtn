var BaseCollection = require("colelctions/BaseCollection");
var Design = require("models/Design");
var Designs = BaseCollection.extend({
		model:Design,
		comparator: 'createdAt',

		url: function() {
			return globalApi + ""
		}
	});