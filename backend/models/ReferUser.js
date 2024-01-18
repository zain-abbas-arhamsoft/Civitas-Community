const mongoose = require('mongoose')

/**
 * ReferUser Schema
 * @private
 */
const referUserSchema = new mongoose.Schema(
  {
    referTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    referBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
)

/**
 * @typedef referUser
 */

module.exports = mongoose.model('referUser', referUserSchema)
