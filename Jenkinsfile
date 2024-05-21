pipeline {
    environment {
        registry = '471112647960.dkr.ecr.us-east-2.amazonaws.com/my-api1'
        registryCredential = 'aws-access-key'
        dockerImage = ''
    }
    agent any

    stages {
        stage('Building image') {
            steps{
                script {
                    dockerImage = docker.build('--pull', '--rm', '-f "./app/Dockerfile"', '-t ' + registry + ":$BUILD_NUMBER", 'app')
                }
            }
        }

        stage('Deploy image') {
            steps{
                script{
                    docker.withRegistry("https://" + registry, "us-east-2:" + registryCredential) {
                        dockerImage.push()
                    }
                }
            }
        }
    }

}