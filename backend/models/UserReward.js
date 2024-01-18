const mongoose = require("mongoose");

const userRewardsSchema = new mongoose.Schema(
  {
    userRewardsId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming you have a User model
      ref: "User", // Reference to the User model
    },
    actionPerformed: {
      type: Number, //  Describes the action the user performed to receive payouts type = 1 // Signup
    },
    payoutAmount: {
      type: Number, // The payout amount for this referral
    },
    payoutDate: {
      type: Date, // Date when the payout was awarded
      default: Date.now,
    },
    status: {
      type: Number, //0 pending 1 for Approval and 2 for Reject
      default: 0,
    },
  },
  { timestamps: true }
);

const UserRewards = mongoose.model("UserRewards", userRewardsSchema);

module.exports = UserRewards;
