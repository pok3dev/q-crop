const db = require("../db");
const { catchAsync } = require("../alati/catchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const kreirajToken = (korisnik, statusKod, req, res) => {
  // 1. Kreiranje tokena
  const id = korisnik[0].id;
  const token = jwt.sign({ id }, process.env.JWT_TAJNA, {
    expiresIn: process.env.JWT_ROK + "d",
  });
  // 2. Kreiranje kolačića
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + process.env.JWT_ROK * 24 * 60 * 60 * 1000),
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });
  // 3. Json odgovor
  res.status(statusKod).json({
    status: "Uspješno",
    token,
    korisnik,
  });
};

exports.dohvatiKorisnika = catchAsync(async (req, res, next) => {
  // 1. Izvrsavamo prvi query da vidimo postoji li mejl
  const mejlQuery = `select šifra from korisnici where mejl="${req.body.mejl}"`;
  db.query(mejlQuery, async (error, results) => {
    if (results.length === 0) {
      return res.status(400).json({
        status: "Greška",
        poruka: "Podaci su neispravni",
      });
    }
    // 2. Ako mejl postoji u sistemu, vršimo provjeru šifre pomocu bcrypt paketa zbog enkripcije
    const pravaŠifra = results[0].šifra;
    const login = {
      mejl: req.body.mejl,
      šifra: (await bcrypt.compare(req.body.šifra, pravaŠifra))
        ? pravaŠifra
        : null,
    };
    const query = `select id,mejl from korisnici where mejl="${login.mejl}" AND šifra="${login.šifra}"`;
    db.query(query, (error, results) => {
      if (error) {
        return res.status(400).json({
          status: "Greška",
          poruka: error.message,
        });
      }
      // 3. Ako je šifra ispravna dobicemo korisnika te ćemo kreirati token
      if (results.length === 1) {
        kreirajToken(results, 200, req, res);
      } else {
        res.status(403).json({
          status: "Greška",
          poruka: "Podaci su neispravni",
        });
      }
    });
  });
});

exports.jelUlogovan = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // 1. Desifruj token
    const dekodiran = await jwt.verify(req.cookies.jwt, process.env.JWT_TAJNA);
    // 2. Ako postoji, vrati korisnika
    if (dekodiran) {
      const query = `select * from korisnici where id="${dekodiran.id}"`;
      console.log("AKTIVIRAN");
      db.query(query, (error, results) => {
        if (results.length === 0) {
          res.status(400).json({
            status: "Greška",
            poruka: "Korisnik više ne postoji...",
          });
        } else {
          res.status(200).json({
            status: "Uspješno",
            korisnik: results[0],
          });
        }
      });
    } else {
      res.status(404).json({
        status: "Greška",
        poruka: "Prvo se ulogujte...",
      });
    }
  } else {
    res.status(404).json({
      status: "Greška",
      poruka: "Prvo se ulogujte...",
    });
  }
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
        error.message.startsWith("ER_DUP_ENTRY")
          ? (error.message = "Mejl već postoji")
          : null;
        res.status(400).json({
          status: "Greška",
          poruka: error.message,
        });
      } else
        res.status(200).json({
          status: "Uspješno",
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
        status: "Greška",
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
            status: "Greška",
            poruka: error.message,
          });
        }
        res.status(204).json({});
      });
    else {
      return res.status(400).json({
        status: "Greška",
        poruka: "Neispravni podaci2...",
      });
    }
  });
});
