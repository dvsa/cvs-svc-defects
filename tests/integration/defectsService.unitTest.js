const expect = require('chai').expect
const DefectsMock = require('../models/DefectsMock')
const DefectsService = require('../../src/services/DefectsService')
const HTTPResponseStatus = require('../../src/models/HTTPResponseStatus')

describe('getDefectList', () => {
  it('should return a populated response in case db call returns data', () => {
    const defectRecordsMock = { item: 'testItem' }
    var defectsMock = new DefectsMock(defectRecordsMock, 1, 1, true)
    var defectsService = new DefectsService(defectsMock)

    return defectsService.getDefectList()
      .then((returnedRecords) => {
        expect(returnedRecords).to.not.equal(undefined)
        expect(returnedRecords).to.not.equal({})
        expect(returnedRecords).to.equal(defectRecordsMock)
        expect(returnedRecords.length).to.be.equal(defectRecordsMock.length)
      })
  })

  it('should return 404-No resources match the search criteria if db returns empty data', () => {
    const defectRecordsMock = {}
    var defectsMock = new DefectsMock(defectRecordsMock, 0, 0, true)
    var defectsService = new DefectsService(defectsMock)

    return defectsService.getDefectList()
      .then(() => {
        expect.fail()
      }).catch((errorResponse) => {
        expect(errorResponse).to.be.instanceOf(HTTPResponseStatus)
        expect(errorResponse.statusCode).to.equal(404)
        expect(errorResponse.body).to.equal('No resources match the search criteria.')
      })
  })

  it('should return 404-No resources match the search criteria if db return null data', () => {
    const defectRecordsMock = undefined
    var defectsMock = new DefectsMock(defectRecordsMock, 0, 0, true)
    var defectsService = new DefectsService(defectsMock)

    return defectsService.getDefectList()
      .then(() => {
        expect.fail()
      }).catch((errorResponse) => {
        expect(errorResponse).to.be.instanceOf(HTTPResponseStatus)
        expect(errorResponse.statusCode).to.equal(404)
        expect(errorResponse.body).to.equal('No resources match the search criteria.')
      })
  })

  it('should return 500-Internal Server Error if db not returning response', () => {
    var defectsMock = new DefectsMock(null, 0, 0, false)
    var defectsService = new DefectsService(defectsMock)

    return defectsService.getDefectList()
      .then(() => {})
      .catch((errorResponse) => {
        expect(errorResponse).to.be.instanceOf(HTTPResponseStatus)
        expect(errorResponse.statusCode).to.be.equal(500)
        expect(errorResponse.body).to.equal('Internal Server Error')
      })
  })
})