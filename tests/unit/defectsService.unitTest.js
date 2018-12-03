const expect = require('chai').expect
const DefectsDtoMock = require('../models/DefectsDtoMock')
const DefectsService = require('../../src/services/DefectsService')
const HTTPResponseStatus = require('../../src/models/HTTPResponseStatus')

describe('getDefectList', () => {
  var defectsDtoMock = new DefectsDtoMock()

  context('when db call returns data', () => {
    it('should return a populated response', () => {
      defectsDtoMock.defectRecordsMock = { item: 'testItem' }
      defectsDtoMock.numberOfrecords = 1
      defectsDtoMock.numberOfScannedRecords = 1
      var defectsService = new DefectsService(defectsDtoMock)

      return defectsService.getDefectList()
        .then((returnedRecords) => {
          expect(returnedRecords).to.not.equal(undefined)
          expect(returnedRecords).to.not.equal({})
          expect(returnedRecords).to.equal(defectsDtoMock.defectRecordsMock)
          expect(returnedRecords.length).to.be.equal(defectsDtoMock.defectRecordsMock.length)
        })
    })
  })

  context('when db returns empty data', () => {
    it('should return 404-No resources match the search criteria', () => {
      defectsDtoMock.defectRecordsMock = {}
      defectsDtoMock.numberOfrecords = 0
      defectsDtoMock.numberOfScannedRecords = 0
      var defectsService = new DefectsService(defectsDtoMock)

      return defectsService.getDefectList()
        .then(() => {
          expect.fail()
        }).catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPResponseStatus)
          expect(errorResponse.statusCode).to.equal(404)
          expect(errorResponse.body).to.equal('No resources match the search criteria.')
        })
    })
  })
  context('when db return undifined data', () => {
    it('should return 404-No resources match the search criteria if db return null data', () => {
      defectsDtoMock.defectRecordsMock = undefined
      defectsDtoMock.numberOfrecords = 0
      defectsDtoMock.numberOfScannedRecords = 0
      var defectsService = new DefectsService(defectsDtoMock)

      return defectsService.getDefectList()
        .then(() => {
          expect.fail()
        }).catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPResponseStatus)
          expect(errorResponse.statusCode).to.equal(404)
          expect(errorResponse.body).to.equal('No resources match the search criteria.')
        })
    })
  })

  context('when db does not return response', () => {
    it('should return 500-Internal Server Error', () => {
      defectsDtoMock.isDatabaseOn = false
      var defectsService = new DefectsService(defectsDtoMock)

      return defectsService.getDefectList()
        .then(() => {
          expect.fail()
        })
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPResponseStatus)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })
})
