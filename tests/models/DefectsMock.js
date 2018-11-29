class DefectsMock {
  constructor (defectRecordsMock, numberOfrecords, numberOfScannedRecords, isDatabaseOn) {
    this.responseObject = {
      Items: defectRecordsMock,
      Count: numberOfrecords,
      ScannedCount: numberOfScannedRecords
    }
    this.isDatabaseOn = isDatabaseOn
  }

  getAll () {
    if (!this.isDatabaseOn) { return Promise.reject(this.responseObject) }

    return Promise.resolve(this.responseObject)
  }
}

module.exports = DefectsMock
