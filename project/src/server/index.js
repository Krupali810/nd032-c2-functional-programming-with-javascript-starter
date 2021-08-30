require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls
//Fetch NASA rover photos API
app.get("/roverImageInfo/:roverName", async (req, res) => {
  try {
    let roverPhotoReponse = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.roverName}/latest_photos?sol=30&api_key=1LJLNYrf5B7TC3TR1PUxEhFruR56SnNL5QL4MdNX`
    ).then((res) => res.json());
    res.send({ roverPhotoReponse });
  } catch (err) {
    console.log("error in fetching rover information", err);
  }
});

// example API call
app.get("/apod", async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=HPHAWcKBmhCBpwFBrv8rVznL1h1GSx7pVuH2daa6`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
