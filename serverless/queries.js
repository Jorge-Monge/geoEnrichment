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

let geometry =
  "POLYGON ((-114.09745931625366 51.08600294526029, -114.08872604370117 51.08600294526029, -114.08872604370117 51.09089545623681, -114.09745931625366 51.09089545623681, -114.09745931625366 51.08600294526029))";
let queryGeom = `
WITH userdata AS (SELECT ST_TRANSFORM(ST_SetSRID(ST_GeomFromText('${geometry}'), 4326), 3857) AS geom)
, calculation AS (
    SELECT dissem_area_uid,
        population,
        100 * ROUND(ST_AREA(ST_INTERSECTION(da.geom, userdata.geom)))/ROUND(ST_AREA(da.geom)) AS percentage_intersected
    FROM public.statscan_dissemination_areas da, userdata
    WHERE ST_INTERSECTS(da.geom, userdata.geom)
)
SELECT dissem_area_uid, ROUND(population*percentage_intersected) FROM calculation
;`;

const getPopulationByDissemAreasIntersected = async () => {
  try {
    const res = await pool.query(queryGeom);
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
        population,
        ST_Y(ST_CENTROID(ST_TRANSFORM(geom, 4326))) AS latitude,
        ST_X(ST_CENTROID(ST_TRANSFORM(geom, 4326))) AS longitude
        FROM public.statscan_dissemination_areas
        ORDER BY id ASC
        LIMIT 100`
    );
    return res.rows;
  } catch (err) {
    return { error: err.stack };
  }
};

const buildQuery = (geometry_parameter) => {
  return `
  WITH userdata AS (SELECT ST_TRANSFORM(ST_SetSRID(ST_GeomFromText('${geometry_parameter}'), 4326), 3857) AS geom)
  , calculation AS (
      SELECT dissem_area_uid,
          population,
          100 * ROUND(ST_AREA(ST_INTERSECTION(da.geom, userdata.geom)))/ROUND(ST_AREA(da.geom)) AS percentage_intersected
      FROM public.statscan_dissemination_areas da, userdata
      WHERE ST_INTERSECTS(da.geom, userdata.geom)
  )
  SELECT dissem_area_uid AS "Dissemination Area ID", ROUND(population*percentage_intersected) AS "Population" FROM calculation
  ;`;
};

const spitPopulation = async (WKT_geometry) => {
  try {
    const res = await pool.query(buildQuery(WKT_geometry));
    return res.rows;
    //return buildQuery(WKT_geometry);
  } catch (err) {
    return { error: err.stack };
  }
};

module.exports = {
  get10FirstParks,
  getCentroids,
  getDissemAreas,
  getPopulationByDissemAreasIntersected,
  spitPopulation,
};
