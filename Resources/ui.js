var win = Ti.UI.createWindow({
	backgroundImage : '/images/skyb.jpg'
});

var view = Ti.UI.createView({
	height : "80%",
	backgroundColor : "#BAE0E8",
	layout : "vertical"

});

var networkStatus = Ti.UI.createLabel({
	color : 'red',
	height : Ti.UI.SIZE,
	width : Ti.UI.FILL,
	top : 5,
	textAlign : 'center'
});

view.add(networkStatus);

Ti.Network.addEventListener('change', function(e) {
	Ti.API.info('eeeee ' + JSON.parse(e));
	if (!e.online) {
		networkStatus.text = 'You are not connected';
	}else{
		networkStatus.text = '';
	}

});

var temp = Ti.UI.createLabel({
	text : "Temp: ",
	top : "10",
	font : {
		fontSize : 26,
		fontFamily : "Helvetica Neue"
	},
	textAlign : Ti.UI.TEXT_STYLE_HEADLINE,
	width : "80%",
	height : Ti.UI.SIZE

});

var icon = Ti.UI.createImageView({
	image : "",
	top : "10"
});

var cond = Ti.UI.createLabel({
	text : "Condition: ",
	top : "10"

});

var wind = Ti.UI.createLabel({
	text : "Wind: ",
	width : "70%",
	top : "20"

});

var city = Ti.UI.createLabel({
	text : "City: ",
	top : "10"

});

var time = Ti.UI.createLabel({
	text : "Time: ",
	top : "10",
	width : "70%"

});

var lat = Ti.UI.createLabel({
	text : "Latitude: ",
	top : "20"

});

var lon = Ti.UI.createLabel({
	text : "Longitude: ",
	top : "10"

});

var state = Ti.UI.createLabel({
	text : "State: ",
	top : "10"

});

exports.buildUI = function(obj) {
	console.log("obj: " + JSON.stringify(obj));

	temp.text = "Temp: " + obj.temp;
	icon.image = obj.img;
	cond.text = "Conditions: " + obj.cond;
	wind.text = "Wind: " + obj.wind;
	city.text = "City: " + obj.city;
	time.text = "Time: " + obj.time;
	lat.text = "Latitude: " + obj.lat;
	lon.text = "Longitude: " + obj.lon;
	state.text = "State:" + obj.state;
	win.open();

};

view.add(temp);
view.add(icon);
view.add(cond);
view.add(wind);
view.add(city);
view.add(time);
view.add(lat);
view.add(lon);
view.add(state);
win.add(view);
