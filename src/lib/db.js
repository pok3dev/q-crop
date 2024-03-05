const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
console.log(`${process.env.HOST}`);
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.KORISNIK,
  password: process.env.SIFRA,
  database: process.env.BAZA,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Povezan sa bazom...");
});

module.exports = db;
