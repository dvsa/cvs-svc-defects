const config = {
  ENV: process.env.ENV,
  COMPONENT: process.env.COMPONENT,
  OFFLINE: {
    SERVERLESS_PORT: 3000,
    COMPONENT: 'dft',
    DYNAMODB_REGION: 'localhost',
    DYNAMODB_ENDPOINT: 'http://localhost:8000'
  }
}

module.exports = config
