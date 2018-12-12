const supertest = require('supertest')
const expect = require('chai').expect
const url = 'http://localhost:3001/'
const request = supertest(url)
const DefectsService = require('../../src/services/DefectsService')
const DefectsDAO = require('../../src/models/DefectsDAO')
var _ = require('lodash/core')

describe('defects', () => {
  describe('getDefects', () => {
    context('when database is populated', () => {
      var defectsService = null
      var mockData = null
      var defectsDAO = null

      before((done) => {
        defectsDAO = new DefectsDAO()
        defectsService = new DefectsService(defectsDAO)
        mockData = require('../resources/defects.json')
        defectsService.insertDefectList(mockData)
        done()
      })

      it('should return all defects in the database', (done) => {
        request.get('defects')
          .end((err, res) => {
            console.log()
            if (err) { expect.fail(err) }
            expect(res.statusCode).to.equal(200)
            expect(res.headers['access-control-allow-origin']).to.equal('*')
            expect(res.headers['access-control-allow-credentials']).to.equal('true')
            expect(_.isEqual(mockData, res.body)).to.equal(true)
            done()
          })
      })

      after((done) => {
        const mockDataKeys = [1, 3]
        defectsService.deleteDefectList(mockDataKeys)
        done()
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
  afterEach((done) => {
    setTimeout(done, 500)
  })
})
