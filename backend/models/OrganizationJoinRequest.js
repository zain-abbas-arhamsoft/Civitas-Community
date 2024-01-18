const mongoose = require("mongoose");

/**
 * Organization Join Request Schema
 * @private
 */
const OrganizationJoinRequest = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organziation",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    referralCode: { type: String },
    status: { type: Number, default: 0 },
    notification: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/**
 * @typedef OrganizationJoinRequest
 */

module.exports = mongoose.model(
  "RequestToJoinOrganization",
  OrganizationJoinRequest
);
