const express = require("express");
const bodyParser = require("body-parser");
const korisnikRuter = require("./rute/korisnikRute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./db");
const slikeRuter = require("./rute/slikeRute");
const projektiRuter = require("./rute/projektiRute");

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    credentials: true, //access-control-allow-credentials:true
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// app.use(korisnikRuter.bind(db));

app.listen(3001, () => {
  console.log("Upaljen...");
});

app.use(korisnikRuter);
app.use(slikeRuter);
app.use(projektiRuter);
