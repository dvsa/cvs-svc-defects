'use strict'
const AWS = require('aws-sdk')
const Defects = require('../models/Defects')
const config = require('../config/config')

const dbClient = new AWS.DynamoDB.DocumentClient(
  (config.ENV === 'local') ? { region: config.OFFLINE.DYNAMODB_REGION, endpoint: config.OFFLINE.DYNAMODB_ENDPOINT } : {}
)

/**
 * Fetches the entire list of Defects from the database.
 * @returns Promise
 */
const getDefectList = () => {
  var defects = new Defects(dbClient)

  return defects.getAll()
}

module.exports = getDefectList
