const AWS = require('aws-sdk')
const config = require('../config/config.json')
const dbClient = new AWS.DynamoDB.DocumentClient(
  { region: config.DYNAMODB_REGION,
    endpoint: config.DYNAMODB_ENDPOINT
  })

class DefectsDAO {
  constructor () {
    this.tableName = config.DYNAMODB_TABLE_NAME
  }

  getAll () {
    return dbClient.scan({ TableName: this.tableName }).promise()
  }

  createMultiple (defectItems) {
    var params = this.generatePartialParams()

    defectItems.forEach(defectItem => {
      params.RequestItems[this.tableName].push(
        {
          PutRequest:
            {
              Item: defectItem
            }
        })
    })

    return dbClient.batchWrite(params).promise()
  }

  deleteMultiple (primaryKeysToBeDeleted) {
    var params = this.generatePartialParams()

    primaryKeysToBeDeleted.forEach(key => {
      params.RequestItems[this.tableName].push(
        {
          DeleteRequest:
          {
            Key:
            {
              imNumber: key
            }
          }
        }
      )
    })

    return dbClient.batchWrite(params).promise()
  }

  generatePartialParams () {
    return {
      RequestItems:
      {
        [this.tableName]: []
      }
    }
  }
}

module.exports = DefectsDAO
