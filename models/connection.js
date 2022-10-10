const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://JCCousin:Smcaen14@clustercousin.2kcjd.mongodb.net/Weatherapp';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database WeatherApp connected'))
  .catch(error => console.error(error));
