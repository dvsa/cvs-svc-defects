const config = {
  ENV: process.env.ENV,
  OFFLINE: {
    SERVERLESS_PORT: 3000,
    DYNAMODB_REGION: 'localhost',
    DYNAMODB_ENDPOINT: 'http://localhost:8000'
  }
}

module.exports = config
