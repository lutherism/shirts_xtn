chrome.contextMenus.create({
	title: 'Get this printed. $25',
	contexts: ["image"],
	onclick: function(a, b) {
		var windows = chrome.extension.getViews();
		var subView, found = false;
		for (var i = 0; i < windows.length; i++) {
			subView = windows[i];
			subView.postMessage(a, "*");
			found = true;
		}
		if (!found) {
			alert('You must select a shirt and enter an address!');
		}
	}
});