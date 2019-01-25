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

    }
}


