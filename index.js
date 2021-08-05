const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/comics/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    console.log(req.params.characterId);
        console.log(response.data);
    res.json(response.data);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/comics", async (req, res) => {
    try {
        const response = await axios.get(`https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}`);
        console.log(response.data);
        res.json(response.data)
    } catch (err) {
        console.log(err.message);
    }
});



app.get("/characters", async (req, res) => {
    try {
        const response = await axios.get(`https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}`);
        console.log(response.data);
        res.json(response.data);
        
    } catch (err) {
        console.log(err.message);
    }
});



app.all("*", (req, res) => {
  res.status(404).json( "Page not found" );
});

app.listen(process.env.PORT, () => {
  console.log(`Server operational on port ${process.env.PORT}`);
});