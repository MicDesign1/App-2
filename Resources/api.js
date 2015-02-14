var weatherApi = function(lat, lon, callback) {
	console.log(lat);
	console.log(lon);
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);

			Ti.API.info('this.responseText' + JSON.stringify(json));
			var forecastday = json.forecast.simpleforecast.forecastday;
			var yesterday = json.history.dailysummary[0];

			var weatherData = {
				full : json.current_observation.display_location.full,
				city : json.current_observation.display_location.city,
				country_name : json.current_observation.display_location.country,
				temperature : {
					fahrenheit : json.current_observation.temp_f,
					celsius : json.current_observation.temp_e
				},
				temp : json.current_observation.temperature_string,
				time : json.current_observation.observation_time,
				cond : json.current_observation.weather,
				wind : json.current_observation.wind_string,
				wind_dir : json.current_observation.wind_dir,
				lat : json.current_observation.display_location.latitude,
				lon : json.current_observation.display_location.longitude,
				state : json.location.state,
				img : json.current_observation.icon_url,
				high_temp_today : forecastday[0].high,
				low_temp_today : forecastday[0].low,

				date_tomorrows : forecastday[1].date,
				high_temp_tomorrows : forecastday[1].high,
				low_temp_tomorrows : forecastday[1].low,

				date_yesterday : yesterday.date,
				high_temp_yesterday : {
					fahrenheit : yesterday.maxtempi,
					celsius : yesterday.maxtempm
				},
				low_temp_yesterday : {
					fahrenheit : yesterday.mintempi,
					celsius : yesterday.mintempm
				},
				rainfall : yesterday.rain,
				moon_phase : json.moon_phase.phaseofMoon

			};

			console.log("json.history: " + JSON.stringify(json.moon_phase));
			console.log("weatherData weatherData: " + JSON.stringify(weatherData));
			Ti.App.Properties.setObject('weatherData', weatherData);

			callback(weatherData);
		},
		onerror : function() {
			Ti.API.info("api error!");

			var weatherData = Ti.App.Properties.getObject('weatherData');

			callback(weatherData);
		},
		timeout : 5000
	});
	var url = "http://api.wunderground.com/api/2063aac72fddc41c/geolookup/conditions/forecast/yesterday/astronomy/q/" + lat + "," + lon + ".json";
	Ti.API.info('url  ' + url);
	xhr.open("GET", url);

	xhr.send();

};

exports.weather = weatherApi;

exports.translateErrorCode = function(code) {
	if (code == null) {
		return null;
	}
	switch (code) {
	case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
		return "Location unknown";
	case Ti.Geolocation.ERROR_DENIED:
		return "Access denied";
	case Ti.Geolocation.ERROR_NETWORK:
		return "Network error";
	case Ti.Geolocation.ERROR_HEADING_FAILURE:
		return "Failure to detect heading";
	case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
		return "Region monitoring access denied";
	case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
		return "Region monitoring access failure";
	case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
		return "Region monitoring setup delayed";
	}
};

exports.wind_direction = function(dir) {
	var data = [];
	data['ENE'] = 'East-northeast';
	data['ESE'] = 'East-southeast';
	data['NE'] = 'Northeast';
	data['NNE'] = 'North-northeast';
	data['NNW'] = 'North-northwest';
	data['NW'] = 'Northwest';
	data['SE'] = 'Southeast';
	data['SSE'] = 'South-southeast';
	data['SSW'] = 'South-southwest';
	data['SW'] = 'Southwest';

	data['WNW'] = 'West-northwest';
	data['WSW'] = 'West-southwest';

	return data[dir] ? data[dir] : dir;
};
