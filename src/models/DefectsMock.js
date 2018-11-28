class DefectsMock {
  constructor (jsonMock) {
    this.jsonMock = jsonMock
  }

  getAll () {
    return Promise.resolve(this.jsonMock)
  }
}

module.exports = DefectsMock
