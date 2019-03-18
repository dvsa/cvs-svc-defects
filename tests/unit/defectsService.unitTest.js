const expect = require('chai').expect
const DefectsDAOMock = require('../models/DefectsDAOMock')
const DefectsService = require('../../src/services/DefectsService')
const HTTPError = require('../../src/models/HTTPError')
const fs = require('fs')
const path = require('path')

describe('getDefectList', () => {
  var defectsDAOMock = new DefectsDAOMock()

  context('when db call returns data', () => {
    it('should return a populated response', () => {
      defectsDAOMock.defectRecordsMock = [{ imNumber: '1' }]
      defectsDAOMock.numberOfrecords = 1
      defectsDAOMock.numberOfScannedRecords = 1
      var defectsService = new DefectsService(defectsDAOMock)

      return defectsService.getDefectList()
        .then((returnedRecords) => {
          expect(returnedRecords).to.not.equal(undefined)
          expect(returnedRecords).to.not.equal({})
          expect(returnedRecords).to.eql(defectsDAOMock.defectRecordsMock)
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

describe('insertDefectList', () => {
  const defectsDAOMock = new DefectsDAOMock()

  context('when db does not return response', () => {
    it('should return 500-Internal Server Error', () => {
      defectsDAOMock.isDatabaseOn = false
      const defectsService = new DefectsService(defectsDAOMock)
      const defectsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/defects.json'), 'utf8'))
      const mockData = [defectsData[0]]

      return defectsService.insertDefectList(mockData)
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal Server Error')
        })
    })
  })

  context('when inserting a valid defects array', () => {
    it('should return 200', () => {
      defectsDAOMock.isDatabaseOn = true
      const defectsService = new DefectsService(defectsDAOMock)
      const defectsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/defects.json'), 'utf8'))
      const mockData = defectsData[0]

      return defectsService.insertDefectList(mockData)
        .then((result) => {
          expect(Object.keys(result).length).to.equal(0)
          expect(result.constructor).to.equal(Object)
        })
    })
  })
})

describe('deleteDefectList', () => {
  const defectsDAOMock = new DefectsDAOMock()

  context('when db does not return response', () => {
    it('should return 500-Internal Server Error', () => {
      defectsDAOMock.isDatabaseOn = false
      const defectsService = new DefectsService(defectsDAOMock)
      const defectsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/defects.json'), 'utf8'))
      const mockData = [defectsData[0]].id

      return defectsService.deleteDefectList(mockData)
        .catch((errorResponse) => {
          expect(errorResponse).to.be.instanceOf(HTTPError)
          expect(errorResponse.statusCode).to.be.equal(500)
          expect(errorResponse.body).to.equal('Internal ServerError')
        })
    })
  })

  context('when deleting a valid defects array', () => {
    it('should return 200', () => {
      defectsDAOMock.isDatabaseOn = true
      const defectsService = new DefectsService(defectsDAOMock)
      const defectsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../resources/defects.json'), 'utf8'))
      const mockData = defectsData[0].id

      return defectsService.deleteDefectList(mockData)
        .then((result) => {
          expect(Object.keys(result).length).to.equal(0)
          expect(result.constructor).to.equal(Object)
        })
    })
  })
})
