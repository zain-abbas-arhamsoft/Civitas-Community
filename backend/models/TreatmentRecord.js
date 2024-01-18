const mongoose = require("mongoose");

/**
 * Treatment Record Schema
 * @private
 */
const TreatmentRecordSchema = new mongoose.Schema(
  {
    file: { type: String },
    name: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

/**
 * @typedef TreatmentRecord
 */

module.exports = mongoose.model("TreatmentRecord", TreatmentRecordSchema);
