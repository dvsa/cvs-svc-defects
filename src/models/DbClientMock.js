const fs = require('fs')
const path = require('path')

class DbClientMock {
  constructor (dummyTableName) {
    this.dummyTableName = dummyTableName
  }

  scan (dummyTableName) {
    var dummyJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../tests/resources/defects.json'), 'utf8'))

    console.log('aici')
    return new Promise((resolve, reject) => {
      resolve(dummyJson)
    })
  }
}

module.exports = DbClientMock
