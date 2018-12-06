const fs = require('fs')

function generateJsonFileConfig () {
  var BRANCH = (process.env.BRANCH) ? process.env.ENV : 'local'

  var localConfig = {}
  localConfig.COMPONENT = 'dft'
  localConfig.APP_PORT = 3001
  localConfig.APP_ENDPOINT = 'http://localhost:' + localConfig.APP_PORT + '/'
  localConfig.DYNAMODB_REGION = 'localhost'
  localConfig.DYNAMODB_PORT = 8001
  localConfig.DYNAMODB_ENDPOINT = 'http://localhost:' + localConfig.DYNAMODB_PORT + '/'
  localConfig.DYNAMODB_TABLE_NAME = 'cvs-' + BRANCH + '-' + localConfig.COMPONENT + '-defects'

  var prodConfig = {}
  prodConfig.COMPONENT = 'dft'
  prodConfig.APP_PORT = null
  prodConfig.APP_ENDPOINT = null
  prodConfig.DYNAMODB_REGION = null
  prodConfig.DYNAMODB_PORT = null
  prodConfig.DYNAMODB_ENDPOINT = null
  prodConfig.DYNAMODB_TABLE_NAME = 'cvs-' + BRANCH + '-' + prodConfig.COMPONENT + '-defects'

  var branchConfig = {}
  branchConfig.COMPONENT = 'dft'
  branchConfig.APP_PORT = null
  branchConfig.APP_ENDPOINT = null
  branchConfig.DYNAMODB_REGION = null
  branchConfig.DYNAMODB_PORT = null
  branchConfig.DYNAMODB_ENDPOINT = null
  branchConfig.DYNAMODB_TABLE_NAME = 'cvs-' + BRANCH + '-' + branchConfig.COMPONENT + '-defects'

  var config = null

  switch (BRANCH) {
    case 'local':
      config = localConfig
      break
    case 'prod':
      config = prodConfig
      break
    default:
      config = branchConfig
  }

  fs.writeFile('./config.json', JSON.stringify(config), (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Config file generated!')
  })
}

generateJsonFileConfig()
