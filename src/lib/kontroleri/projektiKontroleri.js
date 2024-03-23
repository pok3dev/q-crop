const db = require("../db");
const { catchAsync } = require("../alati/catchAsync");
const fs = require("fs");
const { query } = require("express");

exports.kreirajProjekat = (req, res, next) => {
  // Postavljanje vrijednosti novog projekta
  const projekat = {
    nazivProjekta: req.body.nazivProjekta,
    slika: req.body.slika,
    datum: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  if (
    !projekat ||
    !projekat.nazivProjekta ||
    !projekat.slika ||
    !projekat.datum
  ) {
    throw new Error("Korisnik nije unijeo podatke...");
  }
  // Kreiranje projekta u bazi podataka
  const queryProjekat = `insert into slike(ime_projekta, slika, datum_kreiranja) values("${projekat.nazivProjekta}","${projekat.slika}","${projekat.datum}");`;
  db.query(queryProjekat, (error, results) => {
    if (error) {
      return new error(error.message);
    }
    // Kreiranje filtera u bazi podataka [1, 1, 0, 1, 0],[0, 0, 1, 1],
    const id = results.insertId;
    console.log(id);
    const podrazumjevano = {
      svjetlost: 1,
      kontrast: 1,
      sjenke: 0,
      bijele: 1,
      crne: 0,
      temperatura: 0,
      tinta: 0,
      vibranca: 1,
      saturacija: 1,
    };
    for (const [key, value] of Object.entries(podrazumjevano)) {
      if (value > 1 || value < 0) throw new Error("Vrijendosti nisu ispravne");
    }
    const queryFilteri = `insert into filteri(id_slike,svjetlost,kontrast,sjenke,bijele,crne,temperatura,tinta,vibranca,saturacija) values("${id}","${podrazumjevano.svjetlost}","${podrazumjevano.kontrast}",
    "${podrazumjevano.sjenke}","${podrazumjevano.bijele}","${podrazumjevano.crne}","${podrazumjevano.temperatura}","${podrazumjevano.tinta}","${podrazumjevano.vibranca}","${podrazumjevano.saturacija}")`;
    db.query(queryFilteri, (error, results) => {
      if (error) {
        res.status(400).json({
          status: "Greška",
          poruka: error.message,
        });
      } else {
        res.status(200).json({
          status: "Uspješno",
          id: id,
        });
      }
    });
  });
};

exports.dohvatiProjekat = (req, res, next) => {
  const id = req.body.id;
  if (!id) throw new Error("Nesto nije u redu...");
  console.log(id);
  const queryProjekat = `select * from slike where id=${id}`;
  db.query(queryProjekat, (error, rezultatiProjetka) => {
    if (error) {
      return new error(error.message);
    }
    const queryFilteri = `select svjetlost,kontrast,sjenke,bijele,crne,temperatura,tinta,vibranca,saturacija from filteri where id_slike=${id}`;
    db.query(queryFilteri, (error, rezultatiFiltera) => {
      if (error) {
        res.status(400).json({
          status: "Greška",
          poruka: error.message,
        });
      } else {
        res.status(200).json({
          status: "Uspješno",
          projekat: rezultatiProjetka,
          filteri: rezultatiFiltera,
        });
      }
    });
  });
};
exports.sacuvajProjekat = (req, res, next) => {
  const projekat = req.body;
  console.log(projekat);
  for (const [key, value] of Object.entries(projekat)) {
    if (key != "id" && (value > 2 || value < 0))
      throw new Error("Vrijendosti nisu ispravne");
  }
  const query = `update filteri set svjetlost="${projekat.svjetlost}",kontrast="${projekat.kontrast}",sjenke="${projekat.sjenke}",bijele="${projekat.bijele}",
  crne="${projekat.crne}",temperatura="${projekat.temperatura}",tinta="${projekat.tinta}",vibranca="${projekat.vibranca}",saturacija="${projekat.saturacija}" where id_slike=${projekat.id}`;

  db.query(query, (error, results) => {
    if (error) {
      res.status(400).json({
        status: "Greška",
        poruka: error.message,
      });
    } else
      res.status(200).json({
        status: "Uspješno",
        projekat: results,
      });
  });
};
// exports.registrujKorisnika = catchAsync(async (req, res, next) => {
//     const korisnik = {
//       ime: req.body.ime,
//       prezime: req.body.prezime ? req.body.prezime : null,
//       mejl: req.body.mejl,
//       šifra: await bcrypt.hash(req.body.šifra, 12),
//     };
//     if (!korisnik || !korisnik.ime || !korisnik.mejl || !korisnik.šifra)
//       throw new Error("Korisnik nije unijeo podatke...");
//     db.query(
//       `insert into korisnici(ime,prezime,mejl,šifra) value ("${korisnik.ime}", "${korisnik.prezime}","${korisnik.mejl}","${korisnik.šifra}");`,
//       (error, results) => {
//         if (error) {
//           error.message.startsWith("ER_DUP_ENTRY")
//             ? (error.message = "Mejl već postoji")
//             : null;
//           res.status(400).json({
//             status: "Greška",
//             poruka: error.message,
//           });
//         } else
//           res.status(200).json({
//             status: "Uspješno",
//             korisnik,
//           });
//       }
//     );
//   });
