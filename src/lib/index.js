const express = require("express");
const bodyParser = require("body-parser");
const korisnikRuter = require("./rute/korisnikRute");
const db = require("./db");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// app.use(korisnikRuter.bind(db));


app.listen(3001, () => {
    console.log("Upaljen...");
});

app.use(korisnikRuter);