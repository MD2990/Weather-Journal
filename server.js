// Setup empty JS object to act as endpoint for all routes
const projectData = {};

// Require Express to run server and routes
const express = require("express");

// .env file

const dotenv = require("dotenv").config();

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //Used to parse JSON bodies
//app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

app.get("/getData", function (req, res, next) {
  try {
    if (res.statusCode == 200) {
      return res.send(projectData);
    } else {
      res.status(404).send("No Data Found ...");
    }
  } catch (error) {
    next(error);
  }
});

// Post Route
app.post("/add", function (req, res, next) {
  try {
    if (!req.body.temp || !req.body.date || !req.body.feelings) {
      return res.status(400).send("Bad Request");
    }

    const { temp, date, feelings, icon } = req.body;

    projectData.temp = temp;
    projectData.date = date;
    projectData.feelings = feelings;
    projectData.icon = icon;
    res.status(200).json({ done: true });
  } catch (error) {
    next(error);
  }
});

// send api key
app.get("/apiKey", function (req, res, next) {
  try {
    res.status(200).json({ apiKey: process.env.API_KEY });
  } catch (error) {
    next(error);
  }
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Setup Server
const port = 8000;
app.listen(port, listening);
function listening() {
  console.log("server running");
  console.log(`running on localhost: ${port}`);
}
