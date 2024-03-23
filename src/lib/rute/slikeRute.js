const express = require("express");
const slikeKontroleri = require("../kontroleri/slikeKontroleri");

const slikeRuter = express.Router();

slikeRuter.post(
  "/slike/postaviSliku",
  slikeKontroleri.postaviSliku,
  slikeKontroleri.filterSlike
);
slikeRuter.delete("/slike/obrisiSliku", slikeKontroleri.obrisiSliku);

module.exports = slikeRuter;
