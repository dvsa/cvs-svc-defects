'use strict'

const HTTPError = require('../models/HTTPError')
/**
 * Fetches the entire list of Defects from the database.
 * @returns Promise
 */
class DefectsService {
  constructor (defectsDAO) {
    this.defectsDAO = defectsDAO
  }

  getDefectList () {
    return this.defectsDAO.getAll()
      .then(data => {
        if (data.Count === 0) {
          throw new HTTPError(404, 'No resources match the search criteria.')
        }

        return data.Items
          .map((defect) => {
            delete defect.id
            return defect
          })
          .sort((first, second) => first.imNumber - second.imNumber)
      })
      .catch(error => {
        if (!(error instanceof HTTPError)) {
          console.error(error)
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }
        throw new HTTPError(error.statusCode, error.body)
      })
  }

  insertDefectList (defectItems) {
    return this.defectsDAO.createMultiple(defectItems)
      .then(data => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal Server Error')
        }
      })
  }

  deleteDefectList (defectItemKeys) {
    return this.defectsDAO.deleteMultiple(defectItemKeys)
      .then((data) => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal ServerError')
        }
      })
  }
}

module.exports = DefectsService
