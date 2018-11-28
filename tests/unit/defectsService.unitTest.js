const assert = require('assert')
const DefectsMock = require('../../src/models/DefectsMock')
const DefectsService = require('../../src/services/DefectsService')

describe('DefectsService', () => {
  it('should return populated payload when receiving data from db call', () => {
    const populatedMockData = require('../resources/defects.json')
    var defectsMock = new DefectsMock(populatedMockData)
    var defectsService = new DefectsService(defectsMock)

    defectsService.getDefectList()
      .then((data) => {
        if (data.Items) { assert.ok(true, 'Defects retrieved successfully.') }
      })
      .catch((error) => {
        assert.fail(error)
      })
  })

  it('should throw 404-No resources match the search criteria -- if no results are returned from db call', () => {
    const emptyData = {}
    var defectsMock = new DefectsMock(emptyData)
    var defectsService = new DefectsService(defectsMock)

    defectsService.getDefectList()
      .then(() => {
        assert.fail()
      })
      .catch((error) => {
        assert.fail()
        console.log(error)
        if (error.statusCode === '405' || error.body === 'Bo resources match the search criteria.') { assert.ok() }
      })
  })
})
