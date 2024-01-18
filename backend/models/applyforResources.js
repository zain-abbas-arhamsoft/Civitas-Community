const mongoose = require("mongoose");

/**
 * Apply for Resources Schema
 * @private
 */
const applyForResources = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    message: { type: String },
    appointmentTime: { type: String },
    appointmentDay: { type: String },
    appointmentDate: { type: String },
    status: { type: Number, default: 0 }, // 0 means pending 1 means approved 2 means rejected
  },
  { timestamps: true }
);

/**
 * @typedef ApplyForResources
 */

module.exports = mongoose.model("ApplyforResources", applyForResources);
