const winston = require('winston');
const config = require('config');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');

class Db {
  constructor () {
    this.DB_PATH = path.join(__dirname, `../db/my.db`);
    this.DB_SQL_PATH = path.join(__dirname, `../db/mydb.sql`);
    this.init();
  }

  init() {
    try {
      console.log("Db Path", this.DB_PATH);
      this.db = new sqlite3.Database(this.DB_PATH);
      const initSQL = fs.readFileSync(this.DB_SQL_PATH, `utf-8`);
      this.db.exec(initSQL);
    } catch (error) {
      console.error(`Error in database`, error);
    }
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log(`Error running sql: ${sql} `);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log(`Error running sql: ${sql} `);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log(`Error running sql: ${sql} `);
          console.log(err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  async getPassword(userName) {
    const result = await this.all(
      `SELECT Password FROM Users where UserName="${userName}"`
    );
    return result;
  }
  async addUserDetails(userName, password, email, firstName, lastName, country, gender) {
    let placeholders = '(?,?,?,?,?,?,?)';
    const sql = `INSERT INTO Users(UserName, Password, Email, FirstName,LastName,Country,Gender) VALUES ${placeholders}`;
    const result = await this.run(sql, [userName, password, email, firstName, lastName, country, gender]);
    if (result != null && result.changes > 0) {
      return true;
    }
    return false;
  }
}

module.exports = new Db();
