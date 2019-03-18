const HTTPError = require('../../src/models/HTTPError')

class DefectsDAOMock {
  constructor () {
    this.defectRecordsMock = null
    this.numberOfrecords = null
    this.numberOfScannedRecords = null
    this.isDatabaseOn = true
  }

  getAll () {
    const responseObject = {
      Items: this.defectRecordsMock,
      Count: this.numberOfrecords,
      ScannedCount: this.numberOfScannedRecords
    }

    if (!this.isDatabaseOn) { return Promise.reject(responseObject) }

    return Promise.resolve(responseObject)
  }

  createMultiple (payload) {
    if (!this.isDatabaseOn) { return Promise.reject(new HTTPError(500, 'Internal Server Error')) }
    return Promise.resolve({ UnprocessedItems: {} })
  }

  deleteMultiple (payload) {
    if (!this.isDatabaseOn) { return Promise.reject(new HTTPError(500, 'Internal Server Error')) }
    return Promise.resolve({ UnprocessedItems: {} })
  }
}

module.exports = DefectsDAOMock
