const db = require("../db");
const { catchAsync } = require("../alati/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Molimo postavite sliku...", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.filterSlike = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .resize(500)
    .jpeg({ quality: 90 })
    .toFile(`../../public/slike/${req.file.originalname.split(".")[0]}.jpeg`);

  req.body.slika = req.file.filename;

  res.status(200).json({
    status: "Uspješno",
  });
});

exports.postaviSliku = upload.single("slika");

exports.obrisiSliku = catchAsync(async (req, res, next) => {
  const nazivSlike = req.body.nazivSlike;
  fs.unlink(`../../public/slike/${nazivSlike}`, (err) => {
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
});
