("use strict");
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const db = require("./queries");

const router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Express.js + PostgreSQL!</h1>");
  res.end();
});

// const getCentroids = async () => {
//   return { message: "all OK" };
// };

router.get("/getDissemAreas", (req, res) => {
  db.getDissemAreas().then((response) => {
    return res.json(response);
  });
});

router.get("/getPopulationByDissemAreasIntersected", (req, res) => {
  db.getPopulationByDissemAreasIntersected().then((response) => {
    return res.json(response);
  });
});

router.post("/spitPopulation", (req, res) => {
  db.spitPopulation(req.body.geometry).then((response) => {
    return res.json(response);
  });
});

router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
