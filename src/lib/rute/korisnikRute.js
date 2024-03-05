const express = require("express");
const korisnikKontroleri = require("../kontroleri/korisnikKontroleri");

const korisnikRuter = express.Router();

korisnikRuter.get("/dohvatiKorisnika", korisnikKontroleri.dohvatiKorisnika);
korisnikRuter.post(
  "/registrujKorisnika",
  korisnikKontroleri.registrujKorisnika
);
korisnikRuter.delete("/obrisiKorisnika", korisnikKontroleri.izbrišiKorisnika);

module.exports = korisnikRuter;
