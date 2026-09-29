function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(err.errors).map((item) => item.message)
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with the same unique value already exists"
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
}

module.exports = errorHandler;
