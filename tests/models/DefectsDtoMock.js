class DefectsDtoMock {
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
}

module.exports = DefectsDtoMock
