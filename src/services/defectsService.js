'use strict'

const AWS = require('aws-sdk')
const HTTPResponseStatus = require('../models/HTTPResponseStatus')
const config = require('../config/config')

const dbClient = new AWS.DynamoDB.DocumentClient(
  (config.ENV === 'local') ? { region: config.OFFLINE.DYNAMODB_REGION, endpoint: config.OFFLINE.DYNAMODB_ENDPOINT } : {}
)

/**
 * Fetches the entire list of Defects from the database.
 * @returns Promise
 */
const getDefectList = () => {
  let TableName;
  (config.ENV === 'local') ? (TableName = `cvs-${config.ENV}-${config.OFFLINE.COMPONENT}-defects`) : (TableName = `cvs-${config.ENV}-${config.COMPONENT}-defects`);
  const params = {
    TableName: TableName
  }

  return dbClient.scan(params)
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

module.exports = getDefectList
