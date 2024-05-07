const db = require("../db");
const { catchAsync } = require("../alati/catchAsync");
const fs = require("fs");
const { greskaRes, uspjesnoRes } = require("../alati/respones.js");

exports.dohvatiProjekte = (req, res, next) => {
  const idKorisnika = req.user.id;

  // Provjeravamo da li postoji ID
  if (!idKorisnika) throw new Error("Nesto nije u redu...");

  // Izvrsavamo dohvatanje svih projekata odredjenog korisnika
  const query = `select * from slike where id_korisnika=${idKorisnika}`;
  db.query(query, (error, rezultatiProjekata) => {
    if (error) {
      greskaRes(res, 400, error.message);
    } else {
      const projekti = rezultatiProjekata;
      uspjesnoRes(res, 200, projekti);
    }
  });
};

exports.kreirajProjekat = (req, res, next) => {
  // Postavljanje vrijednosti novog projekta
  const projekat = {
    nazivProjekta: req.body.nazivProjekta,
    slika: req.body.slika,
    datum: new Date().toISOString().slice(0, 19).replace("T", " "),
    idKorisnika: req.user.id,
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
  const queryProjekat = `insert into slike(ime_projekta, slika, datum_kreiranja,id_korisnika) values("${projekat.nazivProjekta}",
  "${projekat.slika}","${projekat.datum}","${projekat.idKorisnika}");`;

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

    // Provjeravamo ispravnost unesenih vrijednosti (0-1)
    for (const [key, value] of Object.entries(podrazumjevano)) {
      if (value > 1 || value < 0) throw new Error("Vrijendosti nisu ispravne");
    }

    // Izvrsavamo kreiranje reda u filterima za novi projekat
    const queryFilteri = `insert into filteri(id_slike,svjetlost,kontrast,sjenke,bijele,crne,temperatura,tinta,vibranca,saturacija) values("${id}","${podrazumjevano.svjetlost}","${podrazumjevano.kontrast}",
    "${podrazumjevano.sjenke}","${podrazumjevano.bijele}","${podrazumjevano.crne}","${podrazumjevano.temperatura}","${podrazumjevano.tinta}","${podrazumjevano.vibranca}","${podrazumjevano.saturacija}")`;
    db.query(queryFilteri, (error, results) => {
      if (error) {
        greskaRes(res, 400, error.message);
      } else {
        uspjesnoRes(res, 200, id);
      }
    });
  });
};

exports.dohvatiProjekat = (req, res, next) => {
  const id = req.body.id;
  // Provjeravamo postoji li ID
  if (!id) throw new Error("Nesto nije u redu...");

  // Izvrsavamo dohvatanje projekta i njegovih filtera ako je ID ispravan
  const queryProjekat = `select * from slike where id=${id} and id_korisnika=${req.user.id}`;
  db.query(queryProjekat, (error, rezultatiProjetka) => {
    if (error) {
      return new Error(error.message);
    }

    const queryFilteri = `select svjetlost,kontrast,sjenke,bijele,crne,temperatura,tinta,vibranca,saturacija from filteri where id_slike=${id}`;
    db.query(queryFilteri, (error, rezultatiFiltera) => {
      if (error) {
        greskaRes(res, 400, error.message);
      } else {
        const data = { projekat: rezultatiProjetka, filteri: rezultatiFiltera };
        uspjesnoRes(res, 200, data);
      }
    });
  });
};
exports.sacuvajProjekat = (req, res, next) => {
  const projekat = req.body;

  // Provjeravamo jesu li vrijednosti filtera ispravne (0-2)
  for (const [key, value] of Object.entries(projekat)) {
    if (key != "id" && (value > 2 || value < 0))
      throw new Error("Vrijendosti nisu ispravne");
  }

  // Izvrsavamo ažuriranje nasega projekta
  const query = `update filteri set svjetlost="${projekat.svjetlost}",kontrast="${projekat.kontrast}",sjenke="${projekat.sjenke}",bijele="${projekat.bijele}",
  crne="${projekat.crne}",temperatura="${projekat.temperatura}",tinta="${projekat.tinta}",vibranca="${projekat.vibranca}",saturacija="${projekat.saturacija}" where id_slike=${projekat.id}`;

  db.query(query, (error, results) => {
    if (error) {
      greskaRes(res, 400, error.message);
    } else {
      const projekat = results;
      uspjesnoRes(res, 200, projekat);
    }
  });
};

exports.izbrišiProjekat = (req, res, next) => {
  const projekat = req.body;
  const idKorisnika = req.user.id;

  // Određivanje slike
  const querySlika = `select slika from slike where id = ${req.user.id}`;
  db.query(querySlika, (error, results) => {
    if (results.length === 0) throw new Error("Projekat ne postoji");
    projekat.slika = results[0].slika;

    // Brisanje tablice projekta
    const queryProjekat = `delete from slike where id = ${projekat.id} AND id_korisnika = ${idKorisnika};`;
    db.query(queryProjekat, (error, results) => {
      if (error) {
        greskaRes(res, 400, error.message);
      } else {
        // Brisanje tablice filtera
        const queryFilteri = `delete from filteri where id_slike = ${projekat.id};`;
        db.query(queryFilteri, (error, results) => {
          if (error) {
            greskaRes(res, 400, error.message);
          } else {
            // Brisanje slike
            fs.unlink(`../../public/slike/${projekat.slika}`, (err) => {
              if (err) {
                greskaRes(res, 400, error.message);
              } else {
                uspjesnoRes(res, 201);
              }
            });
          }
        });
      }
    });
  });
};
