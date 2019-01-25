def label = "jenkins-node-${UUID.randomUUID().toString()}"
podTemplate(label: label, containers: [
    containerTemplate(name: 'jnlp', image: '086658912680.dkr.ecr.eu-west-1.amazonaws.com/cvs/jnlp-agent:latest'),
    containerTemplate(name: 'node', image: '086658912680.dkr.ecr.eu-west-1.amazonaws.com/cvs/nodejs-builder:latest', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'dynamodb-local', image: 'amazon/dynamodb-local', command: 'java -jar /home/dynamodblocal/DynamoDBLocal.jar -inMemory -sharedDb -port 8001', ports: [portMapping(name: 'dynamodb-local', containerPort: 8001),])]) 
    {
    node(label) {
        stage('checkout') {
            checkout scm
        }
        stage('db-setup'){        
            container('node'){
                sh "apk add -U make bash"
                sh "npm install --save-dev json-dynamo-putrequest"
            }

            sh "aws dynamodb create-table --attribute-definitions AttributeName=imNumber,AttributeType=N --table-name cvs-local-defects --key-schema AttributeName=imNumber,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --region eu-west-1  --endpoint-url http://localhost:8001"
            
            container('node'){
                sh "cat tests/resources/defects.json | json-dynamo-putrequest cvs-local-defects --beautify >test.json"
            }

            sh "aws dynamodb batch-write-item --request-items file://test.json --region=eu-west-1"        
        }
        container('node'){
            // stage("secrets-setup") {
            //     sh "git secrets --register-aws"
            //     sh "git secrets --scan"
            // }
            stage ("security"){
                sh "git log -p | scanrepo"
            }
            stage ("npm deps") {
                sh "npm install"
            }
            stage ("unit-test") {
                sh "npm run prepush"
            }
            stage ("integration-test") {
                sh "npm run test-i"
            }
        }
    }
}


