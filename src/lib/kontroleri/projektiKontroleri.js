const db = require("../db");
const { catchAsync } = require("../alati/catchAsync");
const fs = require("fs");
const { error } = require("console");

// const sql = (req, query) => {
//   db.query(query, (error, rezultatiProjekata) => {
//     if (error) {
//       res.status(400).json({
//         status: "Greška",
//         poruka: error.message,
//       });
//     } else {
//       res.status(200).json({
//         status: "Uspješno",
//         projekti: rezultatiProjekata,
//       });
//     }
//   });
// }

exports.dohvatiProjekte = (req, res, next) => {
  const idKorisnika = req.body.idKorisnika;
  if (!idKorisnika) throw new Error("Nesto nije u redu...");
  const query = `select * from slike where id_korisnika=${idKorisnika}`;
  db.query(query, (error, rezultatiProjekata) => {
    if (error) {
      res.status(400).json({
        status: "Greška",
        poruka: error.message,
      });
    } else {
      res.status(200).json({
        status: "Uspješno",
        projekti: rezultatiProjekata,
      });
    }
  });
};

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

exports.izbrišiProjekat = (req, res, next) => {
  const projekat = req.body;
  // Određivanje slike
  const querySlika = `select slika from slike where id = ${projekat.id}`;
  db.query(querySlika, (error, results) => {
    if (results.length === 0) throw new Error("Projekat ne postoji");
    projekat.slika = results[0].slika;
    // Brisanje tablice projekta
    const queryProjekat = `delete from slike where id = ${projekat.id} AND id_korisnika = ${projekat.idKorisnika};`;
    db.query(queryProjekat, (error, results) => {
      if (error) {
        res.status(400).json({
          status: "Greška",
          poruka: error.message,
        });
      } else {
        // Brisanje tablice filtera
        const queryFilteri = `delete from filteri where id_slike = ${projekat.id};`;
        db.query(queryFilteri, (error, results) => {
          if (error) {
            res.status(400).json({
              status: "Greška",
              poruka: error.message,
            });
          } else {
            // Brisanje slike
            fs.unlink(`../../public/slike/${projekat.slika}`, (err) => {
              if (err) {
                res.status(400).json({
                  status: "Greška",
                  poruka: err.message,
                });
              } else {
                res.status(201).json({
                  status: "Uspješno",
                });
              }
            });
          }
        });
      }
    });
  });

  // db.query(query, (error, results) => {
  //   if (error) {
  //     res.status(400).json({
  //       status: "Greška",
  //       poruka: error.message,
  //     });
  //   } else
  //     res.status(200).json({
  //       status: "Uspješno",
  //       projekat: results,
  //     });
  // });
};

exports.sacuvajSliku = async (req, res, next) => {
  if (!req.file)
    return res.status(400).json({
      status: "Greška",
    });
  // await sharp(req.file.buffer)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`../../public/slike/${req.file.originalname.split(".")[0]}.jpeg`);

  // req.body.slika = req.file.filename;

  res.status(200).json({
    status: "Uspješno",
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
