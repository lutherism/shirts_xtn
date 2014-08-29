chrome.contextMenus.create({
	title: 'Print a Shirt...',
	contexts: ["image"],
	onclick: function(a, b) {
		chrome.storage.sync.get('clickShirtData', _.bind(function(e) {
			if (e.clickShirtData	) {
			e.clickShirtData.artwork = a.srcUrl;
				e.clickShirtData.fromUrl = true;
				chrome.tabs.query({active: true, currentWindow: true}, _.bind(function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {popCheckout: e.clickShirtData}, _.bind(function(response) {
						
					}, this));
				}, this));
			} else {
				alert('You must select a shirt, color, and size from the ClickShirt app, top right.')
			}
		}, this));
	}
});