const supertest = require('supertest')
const expect = require('expect')

const url = 'http://localhost:3000/'
const request = supertest(url)

describe('defects', () => {
  context('GET', () => {
    context('All defects', () => {
      it('should return all defects', (done) => {
        request
          .get('defects')
          .set('Context-Type', 'application/json')
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .end((err, res) => {
            if (err) throw err
            expect(res.body.length).toBeGreaterThan(0)
            done()
          })
      })
    })
  })
})
