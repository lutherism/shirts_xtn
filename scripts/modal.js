chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.popCheckout) {
	 	var handler = StripeCheckout.configure({
			key: 'pk_live_P9WcuSbQ9Z6ChFCDEnFZ6dJH',
			image: request.popCheckout.artwork,
			closed: _.bind(function(e) {
				$('.uid_34gaJ490').remove();
			}, this),
			opened: _.bind(function(e) {
				$.getJSON(chrome.extension.getURL("templates/image-placing.json"), _.bind(function(json) {
					var options;
					if (json[request.popCheckout.productId]) {
						options = json[request.popCheckout.productId];
					} else {
						options = json.default;	
					}
					var popup = document.createElement('div');
					$(popup).attr("style", options.container_style);
					$(popup).addClass("uid_34gaJ490");
					var productImage;
					var productImages = request.popCheckout.selectedColor.images
					for (var i = 0; i < productImages.length; i ++) {
						if (productImages[i].label === "Front") {
							productImage = productImages[i].url;
						}
					}
					productImage = productImage || request.popCheckout.productImage
					$(popup).append('<img class="popupShirtImage" src="' + productImage + '"></img>');
					$(popup).prepend('<img class="selectedArtwork" src="' + request.popCheckout.artwork + '"></img>');
					$('body').prepend(popup);
					$('.popupShirtImage').attr('style', options.image_style);
					$('.selectedArtwork').attr('style', options.sample_style);
					$(popup).append('<small style="position:absolute; right: 10px; bottom: 10px">Simulated</small>')
				}, this));
			}, this),
			token: _.bind(function(token) {
				if (token.email) {
					chrome.storage.sync.set({clickShirtStripe: token}, _.bind(function() {
						$.ajax({
							type: 'POST',
							data: _.extend(request.popCheckout, token),
							url: "http://shirts-api.openrobot.net",
							success: _.bind(function(data){
								console.log(data);
								
							}, this),
							error: _.bind(function(data){
								alert("Error, please contact alex@showvine.com");
								$('.uid_34gaJ490').remove();
							}, this)
						});
					}, this));
				}
			}, this)
		});
		// Open Checkout with further options
		handler.open({
			name: 'ClickShirt',
			description: request.popCheckout.quantity + " " +
						 request.popCheckout.color + 
						 ' printed product(s). ($25.00 ea)',
			amount: 2500 * request.popCheckout.quantity
		});
	} else {
		alert('You must select a shirt, color, and size from the ClickShirt app, top right.')
	}
});