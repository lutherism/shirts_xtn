var BaseModel = reqiure("./models/BaseModel");
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