// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./queries");

// exports.handler = async (event, context) => {
//   try {
//     const app = express();
//     const port = 3000;

//     app.use(bodyParser.json());
//     app.use(
//       bodyParser.urlencoded({
//         extended: true,
//       })
//     );

//     app.get("/", (request, response) => {
//       response.json({ info: "Node.js, Express, and Postgres API" });
//     });

//     app.get("/get10FirstParks", db.get10FirstParks);

//     app.get("/getCentroid", db.getCentroid);

//     app.listen(port, () => {
//       console.log(`App running on port ${port}.`);
//     });

//     return {
//       statusCode: 200,
//       body: JSON.stringify(),
//     };
//   } catch (err) {
//     return { statusCode: 422, body: err.stack };
//   }
// };

("use strict");
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const db = require("./queries");

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Express.js + PostgreSQL!</h1>");
  res.end();
});

const getCentroids = async () => {
  return { message: "all OK" };
};

router.get("/getCentroids", (req, res) => {
  const res = await getCentroids();
  return res;
});

router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
