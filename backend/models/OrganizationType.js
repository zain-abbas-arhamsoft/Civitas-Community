const mongoose = require('mongoose')

/**
 * OrganizationType Schema
 * @private
 */

const OrganizationTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: Boolean, default: true }
  },
  { timestamps: true }
)

/**
 * @typedef OrganizationType
 */

module.exports = mongoose.model('Organizationtype', OrganizationTypeSchema)
