const express = require("express");
const bodyParser = require("body-parser");
const korisnikRuter = require("./rute/korisnikRute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const slikeRuter = require("./rute/slikeRute");
const projektiRuter = require("./rute/projektiRute");
const xss = require("xss-clean");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    credentials: true, //access-control-allow-credentials:true
  })
);
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    "Previše zahtjeva sa ove IP adrese, pokušajte ponovo za sat vremena...",
});
app.use("/api", limiter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(xss());
app.use(compression());

app.listen(3001, () => {
  console.log("Upaljen...");
});

app.use(korisnikRuter);
app.use(slikeRuter);
app.use(projektiRuter);
