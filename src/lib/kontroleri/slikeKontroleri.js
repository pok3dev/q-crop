const db = require("../db");
const { catchAsync } = require("../alati/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const { uspjesnoRes, greskaRes } = require("../alati/respones.js");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // Provjeravamo da li je zadati fajl slika
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Molimo postavite sliku...", 400), false);
  }
};

// Podesavanja za multer
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.filterSlike = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // Ako slika (req.file) postoji, provlačimo sliku kroz par filtera te je spremamo na zadatu lokaciju
  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .resize(500)
    .jpeg({ quality: 90 })
    .toFile(`../../public/slike/${req.file.originalname.split(".")[0]}.jpeg`);

  req.body.slika = req.file.filename;

  uspjesnoRes(res, 200);
});

exports.postaviSliku = upload.single("slika");

exports.obrisiSliku = catchAsync(async (req, res, next) => {
  const nazivSlike = req.body.nazivSlike;

  // Izvrsavamo brisanje slike na zadatoj lokaciji
  fs.unlink(`../../public/slike/${nazivSlike}`, (err) => {
    if (err) {
      greskaRes(res, 400, err.message);
    } else {
      uspjesnoRes(res, 204);
    }
  });
});
