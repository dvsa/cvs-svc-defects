def label = "jenkins-node-${UUID.randomUUID().toString()}"
podTemplate(label: label, containers: [
    containerTemplate(name: 'jnlp', image: '086658912680.dkr.ecr.eu-west-1.amazonaws.com/cvs/jnlp-agent:latest'),
    containerTemplate(name: 'node', image: '086658912680.dkr.ecr.eu-west-1.amazonaws.com/cvs/nodejs-builder:latest', ttyEnabled: true, command: 'cat'),])
    {
    node(label) {
        stage('checkout') {
            checkout scm
        }
            container('node'){
                stage ("npm deps") {
                    sh "npm install"
                }
                stage ("security") {
                    sh "npm run prepush && git log -p | scanrepo"
                }
                stage ("seed-table") {
                    sh "sls dynamodb seed --seed=cvs-local-defects"
                }

            //  stage("secrets-setup") {
            //     sh "git secrets --register-aws"
            //     sh "git secrets --scan"
            // }
                stage ("unit-test") {
                    sh "npm run test"
                }
                stage ("integration-test") {
                    sh "npm run test-i"
                }
        }
    }
})