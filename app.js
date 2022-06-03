const express = require('express')
const dotenv = require('dotenv')
 dotenv.config();
 const mongoose = require('mongoose')

const app = express();
app.use(express.json());


const token = require('./routes/routes.js')
app.use('/token',token);

mongoose.connect(
  process.env.mongoURI,
  (err) => {
   if(err) console.log(err) 
   else console.log("mongoose is connected");
  }
);



app.listen(8000,( ) => {
    console.log('server running at port 8000')
});