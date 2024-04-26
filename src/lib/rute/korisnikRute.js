const express = require("express");
const korisnikKontroleri = require("../kontroleri/korisnikKontroleri");

const korisnikRuter = express.Router();

korisnikRuter.get("/korisnik/jelUlogovan", korisnikKontroleri.jelUlogovan);
korisnikRuter.post(
  "/korisnik/dohvatiKorisnika",
  korisnikKontroleri.dohvatiKorisnika
);
korisnikRuter.post(
  "/korisnik/registrujKorisnika",
  korisnikKontroleri.registrujKorisnika
);
korisnikRuter.delete(
  "/korisnik/obrisiKorisnika",
  korisnikKontroleri.izbrišiKorisnika
);

module.exports = korisnikRuter;
