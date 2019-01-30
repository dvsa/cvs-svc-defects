const expect = require('chai').expect
const DefectsDAOMock = require('../models/DefectsDAOMock')
const DefectsService = require('../../src/services/DefectsService')
const HTTPError = require('../../src/models/HTTPError')

describe('getDefectList', () => {
  var defectsDAOMock = new DefectsDAOMock()

  context('when db call returns data', () => {
    it('should return a populated response', () => {
      defectsDAOMock.defectRecordsMock = { item: 'testItem' }
      defectsDAOMock.numberOfrecords = 1
      defectsDAOMock.numberOfScannedRecords = 1
      var defectsService = new DefectsService(defectsDAOMock)

      return defectsService.getDefectList()
        .then((returnedRecords) => {
          expect(returnedRecords).to.not.equal(undefined)
          expect(returnedRecords).to.not.equal({})
          expect(returnedRecords).to.equal(defectsDAOMock.defectRecordsMock)
          expect(returnedRecords.length).to.be.equal(defectsDAOMock.defectRecordsMock.length)
        })
    })
  })

  context('when db returns empty data', () => {
    it('should return 404-No resources match the search criteria', () => {
      defectsDAOMock.defectRecordsMock = {}
      defectsDAOMock.numberOfrecords = 0
      defectsDAOMock.numberOfScannedRecords = 0
      var defectsService = new DefectsService(defectsDAOMock)

      return defectsService.getDefectList()
        .then(() => {
          expect.fail()
        }).catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.equal(404)
          expect(errorResponse.body).to.equal('No resources match the search criteria.')
        })
    })
  })
  context('when db return undifined data', () => {
    it('should return 404-No resources match the search criteria if db return null data', () => {
      defectsDAOMock.defectRecordsMock = undefined
      defectsDAOMock.numberOfrecords = 0
      defectsDAOMock.numberOfScannedRecords = 0
      var defectsService = new DefectsService(defectsDAOMock)

      return defectsService.getDefectList()
        .then(() => {
          expect.fail()
        }).catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.equal(404)
          expect(errorResponse.body).to.equal('No resources match the search criteria.')
        })
    })
  })

  context('when db does not return response', () => {
    it('should return 500-Internal Server Error', () => {
      defectsDAOMock.isDatabaseOn = false
      var defectsService = new DefectsService(defectsDAOMock)

      return defectsService.getDefectList()
        .then(() => {
          expect.fail()
        })
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })
})
