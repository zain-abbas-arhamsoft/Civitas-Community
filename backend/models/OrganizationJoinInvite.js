const mongoose = require("mongoose");

/**
 * Organization Join Invite Schema
 * @private
 */
const OrganizationJoinInvite = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: Number, default: 0 }, //0 = Pending, 1 =Approved, 2 = Rejected
  },
  { timestamps: true }
);

/**
 * @typedef OrganizationJoinInvite
 */

module.exports = mongoose.model(
  "InvitationToJoinOrganization",
  OrganizationJoinInvite
);
