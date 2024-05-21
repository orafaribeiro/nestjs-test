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
                script {
                    docker.withRegistry("https://" + registry, "ecr:us-east-2:" + registryCredential) {
                        dockerImage.push()
                    }
                }
            }
        }

        stage('Deploy Kubernetes') {
            steps{
                /*withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'kubeconfig', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {
                    bat 'kubectl --kubeconfig ./app/k8s/kubeconfig get pods'
                }*/
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    // bat "$registryCredential"
                    sh 'kubectl get pods'
                    // sh 'sed -i "s/$IMAGE_TAG/$BUILD_NUMBER/g" ./app/k8s/deployment.yaml'
                    // sh 'kubectl apply -f ./app/k8s/deployment.yaml'
                }
            }
        }
    }

}