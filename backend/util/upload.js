const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Get the absolute path to the 'next/assets/' directory
const uploadsDir = path.join(__dirname, "../uploads/");
const imagesDir = path.join(uploadsDir, "images");
const filesDir = path.join(uploadsDir, "files");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Make uploads directory if it does not exist
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir);
    // Determine where to store the file based on its type
    if (file.fieldname === "image") {
      cb(null, imagesDir);
    } else {
      cb(null, filesDir);
    }
  },
  filename: function (req, file, cb) {
    var fileExtension = file.mimetype.split("/")[1];
    cb(null, +Date.now() + "." + fileExtension);
  },
});

const upload = multer({ storage });
exports.cpUpload = upload.fields([{ name: "file", maxCount: 1 }]);

exports.logoUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);
exports.imageUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "form990", maxCount: 1 },
  { name: "annualReports", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);
exports.applicationUpload = upload.array("resources", 15);
