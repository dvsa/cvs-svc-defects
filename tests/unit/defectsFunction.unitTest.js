const LambdaTester = require('lambda-tester')
const GetDefectsFunction = require('../../src/functions/getDefects')

describe('getDefects', () => {
  it('should return a promise', () => {
    return LambdaTester(GetDefectsFunction)
      .expectResolve()
  })
})
