var templates = window.templates = {};
var SPToken = window.SPToken = "f842fa58fdbb40e8af3846a098e0f38b";
var globalApi = window.globalApi = "https://:" + SPToken + "@api.scalablepress.com/v2";
var postApi = window.postApi = "http://shirts-api.openrobot.net";
$('#templates').children('div').each(function () {
	templates[$(this).attr('id')] = Handlebars.compile($(this).html());
});