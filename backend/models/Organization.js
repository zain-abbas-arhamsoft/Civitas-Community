const mongoose = require("mongoose");

/**
 * Organziation Schema
 * @private
 */
const OrganziationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Organizationtype" }],
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    websiteAboutOrganization: { type: String },
    serviceProvided: { type: String },
    hoursOfOperation: { type: String },
    logo: { type: String },
    organizationCode: { type: String },
    phone: { type: String }, // Now added
    EIN: { type: Number },
    rulingYear: { type: Date },
    role: { type: String },
    file: { type: String }, // Form 990
    annualReports: { type: String },
    street1: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    lat: { type: Number },
    lon: { type: Number },
    missionStatement: { type: String },
    referralCode: { type: String },
    headOfOrganization: { type: String },
    headOfFinancials: { type: String },
  },
  { timestamps: true }
);

/**
 * @typedef Organziation
 */

module.exports = mongoose.model("Organization", OrganziationSchema);
