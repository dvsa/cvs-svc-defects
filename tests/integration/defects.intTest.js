const supertest = require('supertest')
const expect = require('chai').expect
const url = 'http://localhost:3000/'
const request = supertest(url)
const DefectsService = require('../../src/services/DefectsService')
const DefectsDto = require('../../src/models/DefectsDto')
var _ = require('lodash/core')

describe('defects', () => {
  describe('getDefects', () => {
    context('when database is populated', () => {
      var defectsService = null
      var mockData = null
      var defectsDto = null

      before((done) => {
        defectsDto = new DefectsDto()
        defectsService = new DefectsService(defectsDto)
        mockData = require('../resources/defects.json')
        defectsService.insertDefectList(mockData).catch((error) => { console.log(error) })
        done()
      })

      it('should return all defects in the database', (done) => {
        request.get('defects')
          .end((err, res) => {
            if (err) { expect.fail() }
            expect(res.statusCode).to.equal(200)
            expect(_.isEqual(mockData, res.body)).to.equal(true)
            done()
          })
      })

      after((done) => {
        const mockDataKeys = [1, 3]
        defectsService.deleteDefectList(mockDataKeys).catch((error) => { console.log(error) })
        setTimeout(done)
      })
    })

    context('when database is empty,', () => {
      it('should return error code 404', (done) => {
        request.get('defects').expect(404, done)
      })
    })
  })

  beforeEach((done) => {
    setTimeout(done, 500)
  })
})
