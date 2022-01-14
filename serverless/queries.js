const Pool = require("pg").Pool;
const pool = new Pool({
  user: "user",
  host: "host",
  database: "database",
  password: "password",
  port: 5432,
});

const get10FirstParks = (request, response) => {
  pool.query(
    "SELECT * FROM parks_protected_areas LIMIT 10",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getCentroid = (request, response) => {
  pool.query(
    'SELECT name AS "Park Name", ST_Y(ST_CENTROID(ST_TRANSFORM(geometry, 4326))) AS latitude, ST_X(ST_CENTROID(ST_TRANSFORM(geometry, 4326))) AS longitude FROM parks_protected_areas LIMIT 10',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

module.exports = { get10FirstParks, getCentroid };
