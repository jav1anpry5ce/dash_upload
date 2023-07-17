const mysql = require("mysql2");
require("dotenv").config();

const DB_CONFIG = {
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.DBPORT,
  password: process.env.PASSWORD,
  database: process.env.DB,
};

let con;

const handleConnect = () => {
  con = mysql.createConnection(DB_CONFIG);

  con.connect((err) => {
    if (err) setTimeout(handleConnect, 5000);
  });

  con.on("error", (err) => {
    console.error(err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") handleConnect();
    else throw new Error(err);
  });
};

handleConnect();

const createAuthToken = (user, token) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO auth_token (user, token) VALUES (?, ?)`;
    con.query(sql, [user, token], (err) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
};

const updateAuthToken = (user, token) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE auth_token SET token='${token}' WHERE user='${user}'`;
    con.query(sql, (err) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
};

const create_or_update_auth_token = (user, token) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM auth_token`;
    try {
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        if (result.length > 0) {
          updateAuthToken(user, token)
            .then((res) => {
              return resolve(res);
            })
            .catch((err) => {
              console.log(err);
              return reject(err);
            });
        }
        createAuthToken(user, token)
          .then((res) => {
            return resolve(res);
          })
          .catch((err) => {
            return reject(err);
          });
      });
    } catch (err) {
      return reject(err);
    }
  });
};

const checkToken = (token) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM auth_token WHERE token='${token}'`;
    con.query(sql, (err, result) => {
      if (err) return reject(false);
      if (result.length > 0) return resolve(result[0]);
    });
  });
};

const createSharedLink = (token, folder) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO share (token, folder) VALUES(?, ?)`;
    con.query(sql, [token, folder], (err, result) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};

const getSharedLink = (token) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM share WHERE token='${token}'`;
    con.query(sql, (err, result) => {
      if (err) return reject(err);
      if (result.length > 0) return resolve(result[0]);
      return reject(null);
    });
  });
};

module.exports = {
  create_or_update_auth_token,
  checkToken,
  createSharedLink,
  getSharedLink,
};
