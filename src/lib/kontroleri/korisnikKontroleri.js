const db = require("../db");
const { catchAsync } = require("../alati/catchAsync");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { greskaRes, uspjesnoRes } = require("../alati/respones.js");
const { useParams } = require("next/navigation");

const kreirajToken = (korisnik, statusKod, req, res) => {
  // Kreiranje tokena
  const id = korisnik[0].id;
  const token = jwt.sign({ id }, process.env.JWT_TAJNA, {
    expiresIn: process.env.JWT_ROK + "d",
  });

  // Kreiranje kolačića
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + process.env.JWT_ROK * 24 * 60 * 60 * 1000),
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });

  const data = { token, korisnik };
  uspjesnoRes(res, statusKod, data);
};

exports.dohvatiKorisnika = catchAsync(async (req, res, next) => {
  // 1. Izvrsavamo prvi query da vidimo postoji li mejl
  const mejlQuery = `select šifra from korisnici where mejl="${req.body.mejl}"`;
  db.query(mejlQuery, async (error, results) => {
    if (results.length === 0) {
      return greskaRes(res, 400, "Podaci su neispravni");
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
        return greskaRes(res, 400, error.message);
      }

      // 3. Ako je šifra ispravna dobicemo korisnika te ćemo kreirati token
      if (results.length === 1) {
        kreirajToken(results, 200, req, res);
      } else {
        greskaRes(res, 403, "Podaci su neispravni");
      }
    });
  });
});

exports.odjava = catchAsync(async (req, res, next) => {
  // Izvrsavamo odjavljivanje jednostavnom promjenom kolacica na junk vrijednost
  res.cookie("jwt", "odjava", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });
  uspjesnoRes(res, 200);
});

exports.auth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) throw new Error("Prijavite se....");

  // 1. Desifruj token
  const dekodiran = await jwt.verify(token, process.env.JWT_TAJNA);

  // 2. Ako postoji, vrati korisnika
  const query = `select * from korisnici where id="${dekodiran.id}"`;
  db.query(query, (error, results) => {
    if (results.length === 1) {
      req.user = results[0];
      next();
    } else {
      throw new Error("Korisnik ne postoji...");
    }
  });
});

exports.jelUlogovan = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // 1. Desifruj token
    const dekodiran = await jwt.verify(req.cookies.jwt, process.env.JWT_TAJNA);

    // 2. Ako postoji, vrati korisnika
    if (dekodiran) {
      const query = `select * from korisnici where id="${dekodiran.id}"`;
      db.query(query, (error, results) => {
        if (results.length === 0) {
          greskaRes(res, 404, "Korisnik vise ne postoji");
        } else {
          const korisnik = results[0];
          uspjesnoRes(res, 200, korisnik);
        }
      });
    } else {
      greskaRes(res, 401, "Prvo se ulogujte...");
    }
  } else {
    greskaRes(res, 401, "Prvo se ulogujte...");
  }
});

exports.registrujKorisnika = catchAsync(async (req, res, next) => {
  const korisnik = {
    ime: req.body.ime,
    prezime: req.body.prezime ? req.body.prezime : null,
    mejl: req.body.mejl,
    šifra: await bcrypt.hash(req.body.šifra, 12),
  };

  // Provjeravamo da li su unijeti svi potrebni podaci
  if (!korisnik || !korisnik.ime || !korisnik.mejl || !korisnik.šifra)
    throw new Error("Korisnik nije unijeo podatke...");

  // Izvrsavamo dodavanje reda u tabelu korisnika
  db.query(
    `insert into korisnici(ime,prezime,mejl,šifra) value ("${korisnik.ime}", "${korisnik.prezime}","${korisnik.mejl}","${korisnik.šifra}");`,
    (error, results) => {
      if (error) {
        error.message.startsWith("ER_DUP_ENTRY")
          ? (error.message = "Mejl već postoji")
          : null;
        greskaRes(res, 400, error.message);
      } else uspjesnoRes(res, 200, korisnik);
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
          greskaRes(400, error.message);
        }
        uspjesnoRes(204);
      });
    else {
      greskaRes(400, "Neispravni podaci...");
    }
  });
});
