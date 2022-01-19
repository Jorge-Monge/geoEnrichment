const user = process.env.PGDB_USER;
const host = process.env.PGDB_HOST;
const database = process.env.PGDB_DATABASE;
const password = process.env.PGDB_PASSWORD;
const port = 5432;

const Pool = require("pg").Pool;
const pool = new Pool({ user, host, database, password, port });

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

const getCentroids = async () => {
  try {
    const res = await pool.query(
      'SELECT name AS "Park Name", ST_Y(ST_CENTROID(ST_TRANSFORM(geometry, 4326))) AS latitude, ST_X(ST_CENTROID(ST_TRANSFORM(geometry, 4326))) AS longitude FROM parks_protected_areas'
    );
    return res.rows;
  } catch (err) {
    return { error: err.stack };
  }
};

const getDissemAreas = async () => {
  try {
    const res = await pool.query(
      `SELECT id AS "ID",
        dissem_area_uid AS "Dissemination Area ID",
        population AS "Population",
        ST_Y(ST_CENTROID(ST_TRANSFORM(geometry, 4326))) AS latitude,
        ST_X(ST_CENTROID(ST_TRANSFORM(geometry, 4326))) AS longitude
        FROM public.statscan_dissemination_areas
        LIMIT 100`
    );
    return res.rows;
  } catch (err) {
    return { error: err.stack };
  }
};

module.exports = { get10FirstParks, getCentroids, getDissemAreas };
