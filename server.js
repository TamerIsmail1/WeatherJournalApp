// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();
/* Middleware*/
const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

const port = 5000;
// Setup Server
app.listen(port, () => {
  console.log(`Server is running on localhost using port: ${port}`);
});

function handleGetRequest(req, res) {
  //handling the get request with defined function
  res.send(projectData);
}

app.get("/GetRoute", handleGetRequest); //setup a get route on the local server to return data to the user from the endpoint

function handlePostRequest(req, res) {
  //handling the post request with defined function
  projectData = req.body;
}

app.post("/PostRoute", handlePostRequest); //setup a post route on local server to receive data from the user and save it to the endpoint
