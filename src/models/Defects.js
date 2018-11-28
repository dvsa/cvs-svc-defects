const HTTPResponseStatus = require('../models/HTTPResponseStatus')
const config = require('../config/config')

class Defects {
  constructor (dbClient) {
    this.dbClient = dbClient;
    (config.ENV === 'local') ? (this.tableName = `cvs-${config.ENV}-${config.OFFLINE.COMPONENT}-defects`) : (this.tableName = `cvs-${config.ENV}-${config.COMPONENT}-defects`)
  }

  getAll () {
    console.log(this.dbClient.scan({ TableName: this.tableName }))

    return this.dbClient.scan({ TableName: this.tableName })
      .promise()
      .then((result) => {
        if (result.$response.error) {
          throw new HTTPResponseStatus(result.$response.error.statusCode, result.$response.error.message)
        }

        if (result.Count === 0 || result.Items === undefined) {
          throw new HTTPResponseStatus(404, { error: 'No resources match the search criteria.' })
        }

        return result.Items
      })
  }
}

module.exports = Defects
