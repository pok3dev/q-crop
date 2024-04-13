const sistemPretrage = (pretraga, imeProjekta) => {
  // trening -> Trening
  // 1. Mala velika slova
  pretraga = pretraga.toLowerCase();
  imeProjekta = imeProjekta.toLowerCase();
  if (imeProjekta.startsWith(pretraga)) {
    return true;
  }

  // 2. Različite riječi
  const riječi = imeProjekta
    .split(" ")
    .filter((item) => item.startsWith(pretraga));
  if (riječi.length !== 0) return true;

  // 3. Spojen naslov
  imeProjekta = imeProjekta.split(" ").join("");
  if (imeProjekta.startsWith(pretraga)) {
    return true;
  }
  // Ako je sve netačno, vrati false
  return false;
};

module.exports = sistemPretrage;
