exports.greskaRes = (res, status = 400, poruka) => {
  res.status(status).json({
    status: "Greška",
    poruka: poruka,
  });
};

exports.uspjesnoRes = (res, status = 200, data) => {
  if (data) {
    res.status(status).json({
      status: "Uspješno",
      data: data,
    });
  } else {
    res.status(status).json({
      status: "Uspješno",
    });
  }
};
