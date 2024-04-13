const sistemSortiranja = (projekti, opcija, poredak) => {
  // PO DATUMU
  if (opcija === "Datum" && poredak) {
    return projekti.sort(
      (a, b) => Date.parse(a.datumKreiranja) - Date.parse(b.datumKreiranja)
    );
  }
  if (opcija === "Datum" && !poredak) {
    return projekti.sort(
      (a, b) => Date.parse(b.datumKreiranja) - Date.parse(a.datumKreiranja)
    );
  }
  // PO ABECEDI
  if (opcija === "Abc" && poredak) {
    return projekti.sort((a, b) => a.imeProjekta.localeCompare(b.imeProjekta));
  }
  if (opcija === "Abc" && !poredak) {
    return projekti.sort((a, b) => b.imeProjekta.localeCompare(a.imeProjekta));
  }
};

module.exports = sistemSortiranja;
