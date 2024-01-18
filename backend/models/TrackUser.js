const mongoose = require('mongoose')
/**
 * Track Users Schema
 * @private
 */

const TrackUsersSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }
})
/**
 * @typedef trackUsers
 */

module.exports = mongoose.model('TrackUser', TrackUsersSchema)
