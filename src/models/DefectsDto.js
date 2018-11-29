const AWS = require('aws-sdk')
const config = require('../config/config')
const dbClient = new AWS.DynamoDB.DocumentClient(
  (config.ENV === 'local') ? { region: config.OFFLINE.DYNAMODB_REGION, endpoint: config.OFFLINE.DYNAMODB_ENDPOINT } : {})

class Defects {
  constructor () {
    (config.ENV === 'local') ? (this.tableName = `cvs-${config.ENV}-${config.OFFLINE.COMPONENT}-defects`) : (this.tableName = `cvs-${config.ENV}-${config.COMPONENT}-defects`)
  }

  getAll () {
    return dbClient.scan({ TableName: this.tableName }).promise()
  }
}

module.exports = Defects
