const AWS = require('aws-sdk')
const config = require('../config/config')
const dbClient = new AWS.DynamoDB.DocumentClient(
  (config.ENV === 'local') ? { region: config.OFFLINE.DYNAMODB_REGION, endpoint: config.OFFLINE.DYNAMODB_ENDPOINT } : {})

class DefectsDAO {
  constructor () {
    (config.ENV === 'local') ? (this.tableName = `cvs-${config.ENV}-${config.OFFLINE.COMPONENT}-defects`) : (this.tableName = `cvs-${config.ENV}-${config.COMPONENT}-defects`)
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
