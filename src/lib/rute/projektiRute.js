const express = require("express");
const projektiKontroleri = require("../kontroleri/projektiKontroleri");

const projektiRuter = express.Router();

projektiRuter.post(
  "/projekti/kreirajProjekat",
  projektiKontroleri.kreirajProjekat
);
projektiRuter.post(
  "/projekti/dohvatiProjekat",
  projektiKontroleri.dohvatiProjekat
);
projektiRuter.patch(
  "/projekti/sacuvajProjekat",
  projektiKontroleri.sacuvajProjekat
);

module.exports = projektiRuter;
