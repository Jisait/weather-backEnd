var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');
const City = require('../models/cities');

/* GET users listing. */
router.post('/addCity', (req, res) => {
  var newCity = JSON.parse(req.body.cityName)
  console.log("test", newCity)
  City.findOne({ cityName: { $regex: new RegExp(req.body.cityName, 'i') } }).then(dbData => {

		if (dbData === null) {
			// Request OpenWeatherMap API for weather data
   
			fetch(`https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=b32adf5ea623f6d0eb59b7ac7c274368&units=metric&lang=fr`)
				.then(response => response.json())
				.then(apiData => {
          console.log("vouyos", apiData)
					// Creates new document with weather data
					const newCity = new City({
						cityName: apiData.name,
						main: apiData.weather[0].main,
						description: apiData.weather[0].description,
						tempMin: apiData.main.temp_min,
						tempMax: apiData.main.temp_max,
						temp: apiData.main.temp,
						humidity: apiData.main.humidity,
						windSpeed: apiData.wind.speed,
						windDeg: apiData.wind.deg,
						icon: `${apiData.weather[0].icon.substring(0, 2)}.png`
					});

					// Finally save in database
					newCity.save().then(newDoc => {
						res.json({ result: true, weather: newDoc });
					});
				});
		} else {
			// City already exists in database
			res.json({ result: false, error: 'City already saved' });
		}
	});
});

router.get('/getCities', (req, res) => {
City.find().then(data => {
  console.log(data);
  res.json({result: data})
 });
})

router.delete('/:cityName', (req, res) => {
	console.log(req.params.cityName)
	City.deleteOne({ cityName: req.params.cityName }).then(deletedDoc => {
		if (deletedDoc.deletedCount > 0) {
			City.find().then(data => {
				res.json({ result: true, weather: data });
			});
		} else {
			res.json({ result: false, error: 'City not found' });
		}
	});
});


module.exports = router;
