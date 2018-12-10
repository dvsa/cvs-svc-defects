const fs = require('fs')

function generateJsonFileConfig () {
  var BRANCH = (process.env.BRANCH) ? (process.env.BRANCH) : 'local'

  var localConfig = {}
  localConfig.COMPONENT = 'dft'
  localConfig.APP_PORT = 3001
  localConfig.APP_ENDPOINT = 'http://localhost:' + localConfig.APP_PORT + '/'
  localConfig.DYNAMODB_PORT = 8001
  localConfig.DYNAMODB_DOCUMENTCLIENT_PARAMS = {
    region: 'localhost',
    endpoint: 'http://localhost:' + localConfig.DYNAMODB_PORT + '/'
  }
  localConfig.DYNAMODB_TABLE_NAME = 'cvs-' + BRANCH + '-' + localConfig.COMPONENT + '-defects'

  var pipelineConfig = {}
  pipelineConfig.COMPONENT = 'dft'
  pipelineConfig.APP_PORT = null
  pipelineConfig.APP_ENDPOINT = null
  pipelineConfig.DYNAMODB_PORT = null
  pipelineConfig.DYNAMODB_DOCUMENTCLIENT_PARAMS = {}
  pipelineConfig.DYNAMODB_TABLE_NAME = 'cvs-' + BRANCH + '-' + pipelineConfig.COMPONENT + '-defects'

  var config = null

  switch (BRANCH) {
    case 'local':
      config = localConfig
      break
    default:
      config = pipelineConfig
  }
  fs.writeFile('src/config/config.json', JSON.stringify(config), (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Config file generated!')
  })
}

generateJsonFileConfig()
