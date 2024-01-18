const mongoose = require("mongoose");

/**
 * Verify Organization Invite Schema
 * @private
 */
const verifyOrganization = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verificationCode: { type: String },
    verificationType: { type: Number }, // 0 means Email 1 means phone 2 means Mail Code
    status: { type: Number, default: 0 }, //0 = Pending, 1 =Approved, 2 = Rejected
  },
  { timestamps: true }
);

/**
 * @typedef verifyOrganization
 */

module.exports = mongoose.model("verifyOrganization", verifyOrganization);
