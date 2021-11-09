const express = require("express");
const axios = require("axios");
const cors = require("cors");
const formidable = require("express-formidable");
const md5 = require("md5");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@cluster0.dmyft.mongodb.net/marvel",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
    }
  )
  .then(() => console.log("Mongoose connect OK"))
  .catch((err) => console.log("Mongoose error connection" + err));

const app = express();
app.use(formidable());
app.use(cors());

//IMPORT ROUTES
const userRoutes = require("./routes/user");
app.use(userRoutes);

//const ts = "1"; //"IL0v3Marv3lUniv3rsE5inc3IwasB0rn";
const publicKey = process.env.MARVEL_PUBLIC_KEY;
const privateKey = process.env.MARVEL_PRIVATE_KEY;
const hash = md5(`1${privateKey}${publicKey}`);
console.log(hash);

app.get("/comics/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.MARVEL_API_KEY}`
      //`https://gateway.marvel.com/v1/public/characters/${req.params.characterId}?ts=1&apikey=${publicKey}&hash=${hash}`
    );
    res.json(response.data);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/comics", async (req, res) => {

    try {
      

        const response = await axios.get(
          `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}`
          //`https://gateway.marvel.com/v1/public/comics?ts=1&apikey=${publicKey}&hash=${hash}`
        );
        res.json(response.data)
    } catch (err) {
        console.log(err.message);
    }
});



app.get("/characters", async (req, res) => {
    try {
        const response = await axios.get(
          `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}`
          //`https://gateway.marvel.com/v1/public/characters?ts=1&apikey=${publicKey}&hash=${hash}`
        );
  
        res.json(response.data);
        
    } catch (err) {
        console.log(err.message);
    }
});



app.all("*", (req, res) => {
  res.status(404).json( "Page not found" );
});

app.listen(4000 , () => {
  console.log(`Server operational on port ${process.env.PORT}`);
});