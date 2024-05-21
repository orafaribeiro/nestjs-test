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
                    dockerImage = docker.build(registry + ":$BUILD_NUMBER", '-f ./app/Dockerfile ./app')
                }
            }
        }

        stage('Deploy image') {
            steps{
                script{
                    docker.withRegistry("https://" + registry, "ecr:us-east-2:" + registryCredential) {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy Kubernetes') {
            environment {
                tag_version = "$BUILD_NUMBER"
            }
            steps{
                script{
                    withKubeConfig([credentialId: '4cc18070-d9cf-455d-bb5d-88f8f8d57acd']) {
                        sh 'sed -i "s/$IMAGE_TAG/$BUILD_NUMBER/g" ./app/k8s/deployment.yaml'
                        sh 'kubectl apply -f ./app/k8s/deployment.yaml'
                    }
                }
            }
        }
    }

}