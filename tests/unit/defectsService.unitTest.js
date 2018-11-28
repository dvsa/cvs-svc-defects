const assert = require('assert')
const Defects = require('../../src/models/Defects')
const DbClientMock = require('../../src/models/DbClientMock')

describe('defectsService', () => {
  it('should fetch all defects from the database', async () => {
    var dbClientMock = new DbClientMock('DummyTable')

    var defects = new Defects(dbClientMock)

    await defects.getAll()
      .then(() => {
        assert.ok(true, 'Defects retrieved successfully.')
      })
      .catch((error) => {
        assert.fail(error)
      })
  })
})
