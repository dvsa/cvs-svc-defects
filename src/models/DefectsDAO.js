const AWS = require('aws-sdk')
const generateConfig = require('../config/generateConfig')
const config = generateConfig()
const dbClient = new AWS.DynamoDB.DocumentClient(config.DYNAMODB_DOCUMENTCLIENT_PARAMS)

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
