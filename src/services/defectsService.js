'use strict'
const HTTPResponseStatus = require('../models/HTTPResponseStatus')

/**
 * Fetches the entire list of Defects from the database.
 * @returns Promise
 */
class DefectsService {
  constructor (defectsDto) {
    this.defectsDto = defectsDto
  }

  getDefectList () {
    return this.defectsDto.getAll()
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

  insertDefectList (defectItems) {
    return this.defectsDto.createMultiple(defectItems)
      .then(data => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) { throw new HTTPResponseStatus(500, 'Internal Server Error') }
      })
  }

  deleteDefectList (defectItemKeys) {
    return this.defectsDto.deleteMultiple(defectItemKeys)
      .then((data) => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) { throw new HTTPResponseStatus(500, 'Internal ServerError') }
      })
  }
}

module.exports = DefectsService
