'use strict'
const HTTPResponseStatus = require('../models/HTTPResponseStatus')

/**
 * Fetches the entire list of Defects from the database.
 * @returns Promise
 */
class DefectsService {
  constructor (defects) {
    this.defects = defects
  }

  getDefectList () {
    return this.defects.getAll()
      .then(data => {
        if (data === undefined || data.Items === undefined || data.Count === 0) { throw new HTTPResponseStatus(404, 'No resources match the search criteria.') }
        return data.Items
      })
      .catch(error => {
        if (!error.statusCode) {
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }

        throw new HTTPResponseStatus(error.statusCode, error.body)
      })
  }
}

module.exports = DefectsService
