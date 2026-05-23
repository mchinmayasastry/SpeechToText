const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("audio"), (req, res) => {
  res.json({
    success: true,
    message: "Audio uploaded successfully",
    file: req.file,
  });
});

module.exports = router;