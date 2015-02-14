var api = require("api");

var getGeo = function() {
	Ti.Geolocation.purpose = "This app needs to use your Geolocation.";
	Ti.Geolocation.getCurrentPosition(function(e) {
		console.log(e);
		if (Ti.Platform.osname === "android") {
			console.log("android:");
		    api.weather(21.397314, -157.743042);
		} else {
			console.log("ios:");
			api.weather(e.coords.latitude, e.coords.longitude);
		}
	});
};

exports.getGeo = getGeo;


