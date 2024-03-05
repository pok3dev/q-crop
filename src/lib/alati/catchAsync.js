exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((next) => {
      res.status(400).json({
        status: "Greska..",
        poruka: next.message,
      });
    });
  };
};
