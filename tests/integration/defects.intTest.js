const supertest = require('supertest')
const expect = require('chai').expect
const url = 'http://localhost:3000/'
const request = supertest(url)
const DefectsService = require('../../src/services/DefectsService')
const DefectsDto = require('../../src/models/DefectsDto')

describe('defects', () => {
  describe('getDefects', () => {
    context('when database is populated', () => {
      it('should return all defects in the database', (done) => {
        var defectsDto = new DefectsDto()
        var defectsService = new DefectsService(defectsDto)
        const mockData = require('../resources/defects.json')
        defectsService.insertDefectList(mockData)
        request.get('defects')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200)
            done()
          })
      })
    })
  })
})
