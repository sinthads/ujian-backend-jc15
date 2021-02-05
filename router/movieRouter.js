const express = require("express");
const { query } = require("../database");
const router = express.Router();

router.get("/get/all", (req, res) => {
  const sql = `select 
  m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description,
  ms.status, l.location, st.time
  from movies m
  join movie_status ms on ms.id = m.status
  join schedules s on s.movie_id = m.id
  join show_times st on st.id = s.time_id
  join locations l on l.id = s.location_id`;
  query(sql, (err, data) => {
    if (err) res.status(500).send(err);
    res.status(200).send(data);
  });
});

router.get("/get?:status", (req, res) => {
  const get = `select 
    m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description,
    ms.status, l.location, st.time
    from movies m
    join movie_status ms on ms.id = m.status
    join schedules s on s.movie_id = m.id
    join show_times st on st.id = s.time_id
    join locations l on l.id = s.location_id
    where ms.status = '${req.query.status}'`;
  query(get, (err, data) => {
    if (err) res.status(500).send(err);
    res.status(200).send(data);
  });
});

module.exports = router;
