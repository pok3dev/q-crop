const db = require("../db");
const { catchAsync } = require("../alati/catchAsync");
const bcrypt = require("bcrypt");

exports.dohvatiKorisnika = catchAsync(async (req, res, next) => {
  const pravaŠifraQuery = `select šifra from korisnici where mejl="${req.body.mejl}"`;

  db.query(pravaŠifraQuery, async (error, results) => {
    if (results.length === 0) {
      return res.status(400).json({
        status: "Greška...",
        poruka: "Podaci su neispravni",
      });
    }
    const pravaŠifra = results[0].šifra;

    const login = {
      mejl: req.body.mejl,
      šifra: (await bcrypt.compare(req.body.šifra, pravaŠifra))
        ? pravaŠifra
        : null,
    };
    const query = `select * from korisnici where mejl="${login.mejl}" AND šifra="${login.šifra}"`;
    db.query(query, (error, results) => {
      if (error) {
        return res.status(400).json({
          status: "Greška...",
          poruka: error.message,
        });
      }
      if (results.length === 1) {
        res.status(200).json({
          status: "uspjesno",
          korisnik:
            results.length === 1 ? results[0] : "Korisnik ne postoji...",
        });
      } else {
        res.status(403).json({
          status: "Greška...",
          poruka: "Podaci su neispravni",
        });
      }
    });
  });
});

exports.registrujKorisnika = catchAsync(async (req, res, next) => {
  const korisnik = {
    ime: req.body.ime,
    prezime: req.body.prezime ? req.body.prezime : null,
    mejl: req.body.mejl,
    šifra: await bcrypt.hash(req.body.šifra, 12),
  };
  if (!korisnik || !korisnik.ime || !korisnik.mejl || !korisnik.šifra)
    throw new Error("Korisnik nije unijeo podatke...");
  db.query(
    `insert into korisnici(ime,prezime,mejl,šifra) value ("${korisnik.ime}", "${korisnik.prezime}","${korisnik.mejl}","${korisnik.šifra}");`,
    (error, results) => {
      if (error) {
        res.status(400).json({
          status: "Greška...",
          poruka: error.message,
        });
      } else
        res.status(200).json({
          status: "uspjesno",
          korisnik,
        });
    }
  );
});

exports.izbrišiKorisnika = catchAsync(async (req, res) => {
  const pravaŠifraQuery = `select šifra from korisnici where mejl="${req.body.mejl}"`;
  db.query(pravaŠifraQuery, async (error, results) => {
    if (error || results.length === 0) {
      return res.status(400).json({
        status: "greška",
        poruka: "Neispravni podaci...",
      });
    }
    const provjera = await bcrypt.compare(req.body.šifra, results[0].šifra);
    const login = {
      mejl: req.body.mejl,
      šifra: provjera ? results[0].šifra : null,
    };
    query = `delete from korisnici where mejl="${login.mejl}" AND šifra="${login.šifra}"`;
    if (provjera)
      db.query(query, (error, results) => {
        if (error) {
          return res.status(400).json({
            status: "greška",
            poruka: error.message,
          });
        }
        res.status(204).json({});
      });
    else {
      return res.status(400).json({
        status: "greška",
        poruka: "Neispravni podaci2...",
      });
    }
  });
});
