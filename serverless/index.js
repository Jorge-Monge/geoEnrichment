const express = require("express");
const bodyParser = require("body-parser");
const db = require("./queries");

exports.handler = async (event, context) => {
  try {
    const app = express();
    const port = 3000;

    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );

    app.get("/", (request, response) => {
      response.json({ info: "Node.js, Express, and Postgres API" });
    });

    app.get("/get10FirstParks", db.get10FirstParks);

    app.get("/getCentroid", db.getCentroid);

    app.listen(port, () => {
      console.log(`App running on port ${port}.`);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(),
    };
  } catch (err) {
    return { statusCode: 422, body: err.stack };
  }
};