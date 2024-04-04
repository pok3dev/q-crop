const express = require("express");
const projektiKontroleri = require("../kontroleri/projektiKontroleri");
const slikeKontroleri = require("../kontroleri/slikeKontroleri");

const projektiRuter = express.Router();

projektiRuter.post(
  "/projekti/kreirajProjekat",
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

module.exports = projektiRuter;
