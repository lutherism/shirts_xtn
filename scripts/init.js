
	var templates = window.templates = {};
	var SPToken = window.SPToken = "f289fe831e42e2e7a9d53a85a0c35a59";
	var globalApi = window.globalApi = "https://:" + SPToken + "@api.scalablepress.com/v2";
	$('#templates').children('div').each(function () {
		templates[$(this).attr('id')] = Handlebars.compile($(this).html());
	});