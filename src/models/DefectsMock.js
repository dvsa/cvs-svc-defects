class DefectsMock {
  constructor (defectRecordsMock, numberOfrecords, numberOfScannedRecords) {
    this.responseObject = {
      Items: defectRecordsMock,
      Count: numberOfrecords,
      ScannedCount: numberOfScannedRecords
    }
  }

  getAll () {
    return Promise.resolve(this.responseObject)
  }
}

module.exports = DefectsMock
