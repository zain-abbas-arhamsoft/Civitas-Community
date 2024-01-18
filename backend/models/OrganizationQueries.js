const mongoose = require('mongoose')

/**
 * Organziation Query Schema
 * @private
 */
const OrganziationQuerySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    },
    contactInformation: { type: Array, required: true },
    organizationServiceFields: {
      type: Array,
      serviceId: { type: String },
      serviceTitle: { type: String } // 1 = Number, 2 = String, 3 = Text, 4 = Date
    },
    message: {
      type: String
    }
  },
  { timestamps: true }
)

/**
 * @typedef OrganziationQuery
 */

module.exports = mongoose.model('OrganizationQuery', OrganziationQuerySchema)
