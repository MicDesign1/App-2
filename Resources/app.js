'use strict';
var api = require("api");
var geo = require("geo");

var win = Ti.UI.createWindow({
	backgroundImage : '/images/skyb.jpg',
	exitOnClose : true,
	title : 'Weather App',
	height : Ti.UI.FILL,
	top : 0
});

if (Ti.Network.online){
	console.log("yes, we are online");
	geo.getGeo();
} else {
	console.log("I'm sorry you are not online");
}

var osname = Ti.Platform.osname;
if (osname === 'iphone' || osname === 'ipad') {
	var win1 = Titanium.UI.iOS.createNavigationWindow({
		window : win
	});

	// Create a Button.
	var reload = Ti.UI.createButton({
		title : 'Reload',
		systemButton : Ti.UI.iPhone.SystemButton.REFRESH
	});

	reload.addEventListener('click', function() {
		getCurrentPosition();
	});

	win.setRightNavButton(reload);

} else if (Ti.Platform.name === "android") {

	win.addEventListener("android:back", function(e) {
		var dialogexit = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Confirm', 'Cancel'],
			message : 'Would you like to exit from app?',
			title : 'Exit'
		});
		dialogexit.addEventListener('click', function(e) {
			if (e.index === e.source.cancel) {
				return false;
			} else {
				Ti.API.info('app:applicationclosed');

				//win.exitOnClose = true;
				win.close({
					transition : Titanium.UI.iPhone.AnimationStyle.CURL_UP
				});

			}

		});
		dialogexit.show();

	});

	win.addEventListener("open", function(e) {
		var activity = win.getActivity();

		activity.actionBar.displayHomeAsUp = false;
		activity.actionBar.logo = '/images/menu-icon.png';
		activity.actionBar.onHomeIconItemSelected = function() {

		};

		activity.onCreateOptionsMenu = function(e) {
			var item,
			    menu;
			menu = e.menu;
			menu.clear();
			item = menu.add({
				title : "Reload",
				icon : '/images/reload.png',
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
			});
			item.addEventListener("click", function(e) {
				getCurrentPosition();
			});

		};
	});

	win.addEventListener("focus", function(e) {
		win.getActivity().invalidateOptionsMenu();
	});
}
var view2 = Ti.UI.createView({
	top: "10%",
	bottom: 30,
	backgroundGradient: {
        type: 'linear',
        startPoint: { x: '0%', y: '50%' },
        endPoint: { x: '100%', y: '50%' },
        colors: [ { color: 'red', offset: 0.0}, { color: 'blue', offset: 0.55 }],
        
   },
	layout : "vertical",
	opacity : 0.40
	
});

var view = Ti.UI.createView({
	top : "10%",
	width: "90%",
	bottom: 10,
	right: 0,
	layout : "vertical",
    height: Ti.UI.SIZE
	
});


/****var view = Ti.UI.createScrollView({
	bottom : 30,
	backgroundColor : "#BAE0E8",
	layout : "vertical",
	width : '90%',
	right : 0,

});****/

win.add(view2);
win.add(view);

var networkStatus = Ti.UI.createLabel({
	color : 'red',
	height : Ti.UI.SIZE,
	width : Ti.UI.FILL,
	top : 5,
	textAlign : 'center'
});

//view.add(networkStatus);

var tempBox = Ti.UI.createView({
	height : 50,
	layout : "horizontal",
	width : Ti.UI.FILL,
	top : 10
});

view.add(tempBox);

var iconBox = Ti.UI.createView({
	height : 50,
	//layout : "vertical",
	width : Ti.UI.SIZE,
	left : 20,
	center : {
		x : '50%',
		y : '50%'
	}

});

tempBox.add(iconBox);
var icon = Ti.UI.createImageView({
	//left : 40,
	width : 25,
	height : 25
});
iconBox.add(icon);

var cond = Ti.UI.createLabel({
	bottom : "0",
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	fontSize : 10
	}
});

iconBox.add(cond);
var temp = Ti.UI.createLabel({
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 48,
		color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	fontFamily : "Helvetica Neue"
	},
	textAlign : Ti.UI.TEXT_STYLE_HEADLINE,
	height : 50,
	left : 10,
	width : Ti.UI.SIZE
});

tempBox.add(temp);

var temp_unit = Ti.UI.createLabel({
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	text : '°F',
	font : {
		fontSize : 12,
		fontFamily : "Helvetica Neue"
	},
	textAlign : Ti.UI.TEXT_STYLE_HEADLINE,
	height : 50,
	left : 0,
	top : 0
});

tempBox.add(temp_unit);

var windBox = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : "horizontal",
	width : Ti.UI.FILL,
	left : 10

});

view.add(windBox);

var wind = Ti.UI.createLabel({
	text : "Wind: .....................",
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	width : Ti.UI.SIZE,
	left : 10,
	top : 10,
	font : {
		fontSize : 12,
		fontFamily : "Helvetica Neue"
	}
});

windBox.add(wind);

var wind_dir = Ti.UI.createLabel({
	text : "Wind direction: .....................",
	width : Ti.UI.SIZE,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	left : 10,
	top : 10,
	font : {
		fontSize : 12,
		fontFamily : "Helvetica Neue"
	}
});

windBox.add(wind_dir);

var border = Ti.UI.createView({
	width : Ti.UI.FILL,
	backgroundColor : 'red',
	height : 2,
	top : 5
});

view.add(border);

var addressLabel = Ti.UI.createLabel({
	text : 'Current Address',
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 14
	},
	top : 5,
	left : 10,
	textAlign : 'left'
});

view.add(addressLabel);

var addressBox = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : "horizontal",
	width : Ti.UI.FILL,
	left : 20

});

view.add(addressBox);

var city = Ti.UI.createLabel({
	text : "City: ",
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	top : "10",
	font : {
		fontSize : 12,
		fontFamily : "Helvetica Neue"
	}

});
addressBox.add(city);

var state = Ti.UI.createLabel({
	width : Ti.UI.FILL,
	text : "   State: ",
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	top : "10",
	left : 0,
	font : {
		fontSize : 12,
		fontFamily : "Helvetica Neue"
	}
});

addressBox.add(state);

var lat = Ti.UI.createLabel({
	text : "Latitude: ",
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	top : 10,
	left : 10,
	font : {
		fontSize : 12,
		fontFamily : "Helvetica Neue"
	}

});

addressBox.add(lat);
var lon = Ti.UI.createLabel({
	text : "Longitude: ",
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	top : "10",
	left : 10,
	font : {
		fontSize : 12,
		fontFamily : "Helvetica Neue"
	}

});
addressBox.add(lon);

//view.add(city);

var tempborder = Ti.UI.createView({
	width : Ti.UI.FILL,
	backgroundColor : 'red',
	height : 2,
	top : 5
});

view.add(tempborder);

var tempLabel = Ti.UI.createLabel({
	text : 'Temperature Info.',
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	fontSize : 14
	},
	top : 5,
	left : 10,
	textAlign : 'left'
});

view.add(tempLabel);

var tempatureBox = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : "horizontal",
	width : Ti.UI.FILL,
	left : 10

});

view.add(tempatureBox);

var today_tempatureBox = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : "horizontal",
	width : '50%',
	left : 0
});

tempatureBox.add(today_tempatureBox);

var todayLabel = Ti.UI.createLabel({
	text : 'Today',
	width : Ti.UI.FILL,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12,
		fontWeight : 'bold'
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

today_tempatureBox.add(todayLabel);

var todayHighLabel = Ti.UI.createLabel({
	text : 'High: ...',
	width : Ti.UI.SIZE,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

today_tempatureBox.add(todayHighLabel);

var todayLowLabel = Ti.UI.createLabel({
	text : 'Low: ....',
	width : Ti.UI.SIZE,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12
	},
	top : 5,
	left : 10,
	textAlign : 'left'
});

today_tempatureBox.add(todayLowLabel);

var tomorrows_tempatureBox = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : "horizontal",
	width : '50%',
	left : 0

});

tempatureBox.add(tomorrows_tempatureBox);

var tomorrows_Label = Ti.UI.createLabel({
	text : 'Tomorrows',
	width : Ti.UI.FILL,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12,
		fontWeight : 'bold'
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

tomorrows_tempatureBox.add(tomorrows_Label);

var tomorrowsHighLabel = Ti.UI.createLabel({
	text : 'High: ...',
	width : Ti.UI.SIZE,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

tomorrows_tempatureBox.add(tomorrowsHighLabel);

var tomorrowsLowLabel = Ti.UI.createLabel({
	text : 'Low: ....',
	width : Ti.UI.SIZE,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12
	},
	top : 5,
	left : 10,
	textAlign : 'left'
});

tomorrows_tempatureBox.add(tomorrowsLowLabel);

var otherborder = Ti.UI.createView({
	width : Ti.UI.FILL,
	backgroundColor : 'red',
	height : 2,
	top : 5
});

view.add(otherborder);

var tempLabel = Ti.UI.createLabel({
	text : "Moon Phase & Yesterday Info.",
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 14
	},
	top : 5,
	left : 10,
	textAlign : 'left'
});

view.add(tempLabel);

var moonBox = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : "horizontal",
	width : Ti.UI.FILL,
	left : 10

});

view.add(moonBox);

var moonPhaseBox = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : "horizontal",
	width : '50%'

});

moonBox.add(moonPhaseBox);

var mookmknLabel = Ti.UI.createLabel({
	text : 'Moon Phase',
	width : Ti.UI.FILL,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12,
		fontWeight : 'bold'
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

moonPhaseBox.add(mookmknLabel);

var moon_phaseLabel = Ti.UI.createLabel({
	text : 'High: ...',
	width : Ti.UI.FILL,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

moonPhaseBox.add(moon_phaseLabel);

var rainfkLabel = Ti.UI.createLabel({
	text : 'Rainfall',
	width : Ti.UI.FILL,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12,
		fontWeight : 'bold'
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

moonPhaseBox.add(rainfkLabel);

var rainfallLabel = Ti.UI.createLabel({
	text : 'High: ...',
	width : Ti.UI.SIZE,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

moonPhaseBox.add(rainfallLabel);

var yester_tempatureBox = Ti.UI.createView({
	height : Ti.UI.SIZE,
	layout : "horizontal",
	width : '50%',
	left : 0

});

moonBox.add(yester_tempatureBox);

var yester_Label = Ti.UI.createLabel({
	text : 'Yesterday\'s',
	width : Ti.UI.FILL,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12,
		fontWeight : 'bold'
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

yester_tempatureBox.add(yester_Label);

var yesterdayHighLabel = Ti.UI.createLabel({
	text : 'High: ...',
	width : Ti.UI.SIZE,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12
	},
	top : 5,
	left : 0,
	textAlign : 'left'
});

yester_tempatureBox.add(yesterdayHighLabel);

var yesterdayLowLabel = Ti.UI.createLabel({
	text : 'Low: ....',
	width : Ti.UI.SIZE,
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	font : {
		fontSize : 12
	},
	top : 5,
	left : 10,
	textAlign : 'left'
});

yester_tempatureBox.add(yesterdayLowLabel);

var time = Ti.UI.createLabel({
	color : '#fff',
	shadowColor: '#000',
	shadowOffset: {x:1,y:1},
	right : 10,
	bottom : 0,
	font : {
		fontSize : 10,
		fontFamily : "Helvetica Neue"
	}

});
win.add(time);

var buildUI = function(obj) {
	console.log("obj: " + JSON.stringify(obj));
	win.title = obj.full;
	temp.text = obj.temperature.fahrenheit;
	icon.image = obj.img;
	cond.text = obj.cond;
	wind.text = "Wind: " + obj.wind;
	wind_dir.text = 'Wind direction: ' + api.wind_direction(obj.wind_dir);
	city.text = "City: " + obj.city;
	time.text = "Time: " + obj.time;
	lat.text = "Lat: " + obj.lat;
	lon.text = "Long: " + obj.lon;
	state.text = (obj.state ? ("   State:" + obj.state) : '') + ' ' + obj.country_name;

	todayHighLabel.text = 'High: ' + obj.high_temp_today.fahrenheit + ' °F';

	todayLowLabel.text = 'Low: ' + obj.low_temp_today.fahrenheit + ' °F';

	tomorrowsHighLabel.text = 'High: ' + obj.high_temp_tomorrows.fahrenheit + ' °F';

	tomorrowsLowLabel.text = 'Low: ' + obj.low_temp_tomorrows.fahrenheit + ' °F';

	moon_phaseLabel.text = obj.moon_phase;

	yesterdayHighLabel.text = 'High: ' + obj.high_temp_yesterday.fahrenheit + ' °F';

	yesterdayLowLabel.text = 'Low: ' + obj.low_temp_yesterday.fahrenheit + ' °F';

	rainfallLabel.text = obj.rainfall + ' mm';
};

var currentLocation = function(e) {

	if (!e.success || e.error) {
		networkStatus.text = 'error: ' + (e.code) + ' ' + JSON.stringify(e.error);
		Ti.API.info("Code translation: " + api.translateErrorCode(e.code));
		Ti.API.info('error ' + JSON.stringify(e.error));
		e = Ti.App.Properties.getString('e');
		Ti.API.info('e.error ' + JSON.stringify(e));
	}
	var data = {};
	if ( e instanceof Object) {
		Ti.App.Properties.setString('e', e);
		data.longitude = e.coords.longitude;
		data.latitude = e.coords.latitude;
		data.altitude = e.coords.altitude;
		data.heading = e.coords.heading;
		data.accuracy = e.coords.accuracy;
		data.speed = e.coords.speed;
		data.timestamp = e.coords.timestamp;
		data.altitudeAccuracy = e.coords.altitudeAccuracy;
		Ti.API.info('speed ' + data.speed);
	} else {
		data.longitude = '-122.41825867';
		data.latitude = '37.77500916';
	}
	Titanium.API.info('geo - current location:   long ' + data.longitude + ' lat ' + data.latitude);

	return data;
};

var getCurrentPosition = function() {
	Ti.Geolocation.locationServicesAuthorization = Titanium.Geolocation.AUTHORIZATION_ALWAYS;
	if (Ti.Geolocation.locationServicesEnabled === true) {
		Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
		Titanium.Geolocation.getCurrentPosition(function(e) {

			var position = currentLocation(e);
			api.weather(position.latitude, position.longitude, buildUI);

		});
	} else {
		alert('Please Enable Location Services  ');

	}
};

getCurrentPosition();

if (osname === 'android') {
	win.open();
} else {
	win1.open();
}

