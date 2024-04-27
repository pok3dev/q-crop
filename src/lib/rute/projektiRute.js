const express = require("express");
const projektiKontroleri = require("../kontroleri/projektiKontroleri");
const korisnikKontroleri = require("../kontroleri/korisnikKontroleri");
const slikeKontroleri = require("../kontroleri/slikeKontroleri");

const projektiRuter = express.Router();

projektiRuter.post(
  "/projekti/kreirajProjekat",
  korisnikKontroleri.auth,
  projektiKontroleri.kreirajProjekat
);

projektiRuter.post(
  "/projekti/dohvatiProjekat",
  projektiKontroleri.dohvatiProjekat
);

projektiRuter.post(
  "/projekti/dohvatiProjekte",
  projektiKontroleri.dohvatiProjekte
);

projektiRuter.patch(
  "/projekti/sacuvajProjekat",
  projektiKontroleri.sacuvajProjekat
);

projektiRuter.patch(
  "/projekti/sacuvajSliku",
  slikeKontroleri.postaviSliku,
  slikeKontroleri.filterSlike
);

projektiRuter.delete(
  "/projekti/izbrisiProjekat",
  projektiKontroleri.izbrišiProjekat
);

module.exports = projektiRuter;
