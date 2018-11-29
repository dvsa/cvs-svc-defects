const expect = require('expect')
const DefectsMock = require('../../src/models/DefectsMock')
const DefectsService = require('../../src/services/DefectsService')
const HTTPResponseStatus = require('../../src/models/HTTPResponseStatus')

describe('getDefectList', () => {
  
  var defectsMock ;
  var defectsService;
  
  function createMock(data) {
    defectsMock = new DefectsMock(data);
    defectsService = new DefectsService(defectsMock);
  }

  it('Data with items', () => {
    createMock({Items: "myItems"});

    return defectsService.getDefectList()
      .then((items) => {
        expect(items).toEqual("myItems");
      })
  })

  it('Undefined data', () => {
    createMock({"": ""});

    return defectsService.getDefectList()
      .then(() => {
      }).catch((errorResponse) => {
        expect(errorResponse).toBeInstanceOf(HTTPResponseStatus);
        expect(errorResponse.statusCode).toEqual(404);
        expect(errorResponse.body).toEqual('No resources match the search criteria.');
      })
  })

  it('Undefined items', () => {
    createMock({Items: ""});

    return defectsService.getDefectList()
      .then(() => {
      }).catch((errorResponse) => {
        expect(errorResponse).toBeInstanceOf(HTTPResponseStatus);
        expect(errorResponse.statusCode).toEqual(404);
        expect(errorResponse.body).toEqual('No resources match the search criteria.');
      })
  })

  it('Empty data', () => {
    createMock({});

    return defectsService.getDefectList()
      .then(() => {
      }).catch((errorResponse) => {
        expect(errorResponse).toBeInstanceOf(HTTPResponseStatus);
        expect(errorResponse.statusCode).toEqual(404);
        expect(errorResponse.body).toEqual('No resources match the search criteria.');
      })
  })
})

