const fs = require('fs')

function generateJsonFileConfig () {
  var BRANCH = process.env.BRANCH

  var localConfig = {}
  localConfig.COMPONENT = 'dft'
  localConfig.APP_PORT = 3001
  localConfig.APP_ENDPOINT = 'http://localhost:' + localConfig.APP_PORT + '/'
  localConfig.DYNAMODB_REGION = 'localhost'
  localConfig.DYNAMODB_PORT = 8001
  localConfig.DYNAMODB_ENDPOINT = 'http://localhost:' + localConfig.DYNAMODB_PORT + '/'
  localConfig.DYNAMODB_TABLE_NAME = 'cvs-' + BRANCH + '-' + localConfig.COMPONENT + '-defects'

  var pipelineConfig = {}
  pipelineConfig.COMPONENT = 'dft'
  pipelineConfig.APP_PORT = null
  pipelineConfig.APP_ENDPOINT = null
  pipelineConfig.DYNAMODB_REGION = null
  pipelineConfig.DYNAMODB_PORT = null
  pipelineConfig.DYNAMODB_ENDPOINT = null
  pipelineConfig.DYNAMODB_TABLE_NAME = 'cvs-' + BRANCH + '-' + pipelineConfig.COMPONENT + '-defects'

  var config = null

  switch (BRANCH) {
    case 'pipeline':
      config = pipelineConfig
      break
    default:
      config = localConfig
  }

  fs.writeFile('config.json', JSON.stringify(config), (err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Config file generated!')
  })
}

generateJsonFileConfig()
