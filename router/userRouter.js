const express = require("express");
const router = express.Router();
const { query } = require("../database");
const { createJWTToken, checkToken } = require("../helper");

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const uid = Date.now();
  const sql = `insert into users (uid, username, email, password, role, status) values (${uid}, '${username}', '${email}', '${password}', 2, 1)`;
  query(sql, (err, data) => {
    if (err) res.status(500).send(err);
    const get = `select uid, role from users`;
    query(get, (err, info) => {
      if (err) res.status(500).send(err);
      const responseData = { ...info[0] };
      const token = createJWTToken(responseData);
      responseData.token = token;
      return res.status(200).send(responseData);
    });
  });
});

router.post("/login", (req, res) => {
  const { user, password } = req.body;
  const sql = `select * from users where username = '${user}' and password = '${password}' and status = 1`;
  query(sql, (err, data) => {
    if (err) res.status(500).send(err);
    res.status(200).send(data);
  });
});

router.patch("/deactive", checkToken, (req, res) => {
  const sql = `select 
  id, uid, username, password, role, status
  from users where id = ${req.users.id}`;
  query(sql, (err, data) => {
    if (err) res.status(500).send(err);
    res.status(200).send(data);
    const user_uid = data[0].uid;
    query(`update users set status = 2 where uid = ${user_uid}`, (err) => {
      if (err) res.status(500).send(err);
      res.status(200).send({
        uid: `${user_uid}`,
        status: "deactive",
      });
    });
  });
});

router.patch("/activate", checkToken, (req, res) => {
  const sql = `select 
    id, uid, username, password, role, status
    from users where id = ${req.users.id}`;
  query(sql, (err, data) => {
    if (err) res.status(500).send(err);
    res.status(200).send(data);
    const user_uid = data[0].uid;
    const user_status = data[0].status;
    if (user_status !== 1 || 3) {
      query(`update users set status = 1 where uid = ${user_uid}`, (err) => {
        if (err) res.status(500).send(err);
        res.status(200).send({
          uid: `${user_uid}`,
          status: "active",
        });
      });
    }
  });
});

router.patch("/close", checkToken, (req, res) => {
  const sql = `select 
    id, uid, username, password, role, status
    from users where id = ${req.users.id}`;
  query(sql, (err, data) => {
    if (err) res.status(500).send(err);
    res.status(200).send(data);
    const user_uid = data[0].uid;
    query(`update users set status = 3 where uid = ${user_uid}`, (err) => {
      if (err) res.status(500).send(err);
      res.status(200).send({
        iud: `${user_uid}`,
        status: "closed",
      });
    });
  });
});

module.exports = router;
