const mongoose = require("mongoose");
const filter = require("../util/filter");

/**
 * User Schema
 * @private
 */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    referralCode: {
      type: String,
      unique: true,
    },
    totalPayout: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    wallet: {
      type: String,
    },
    contactPrefernce: {
      type: Array,
    },
    phone: {
      type: String,
    },
    biography: {
      type: String,
      default: "",
      maxLength: [250, "Must be at most 250 characters long"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    image: { type: String },
  },
  { timestamps: true }
);
UserSchema.pre("save", function (next) {
  if (filter.isProfane(this.username)) {
    throw new Error("Username cannot contain profanity");
  }

  if (this.biography.length > 0) {
    this.biography = filter.clean(this.biography);
  }

  next();
});
/**
 * @typedef User
 */
module.exports = mongoose.model("User", UserSchema);
