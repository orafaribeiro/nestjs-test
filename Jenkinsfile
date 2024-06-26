// def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true)

pipeline {
    environment {
        // registry = '471112647960.dkr.ecr.us-east-2.amazonaws.com/my-api1'
        registry = credentials('AMAZON_ECR')
        registryCredential = 'aws-access-key'
        dockerImage = ''
    }
    agent any

    stages {
        stage('veryfing hash') {
            steps {
                sh "echo ${env.GIT_COMMIT}"
            }
        }

        stage('update env') {
            steps {
                withCredentials([
                    string(credentialsId: 'DATABASE_PASSWORD', variable: 'DATABASE_PASSWORD'),
                    string(credentialsId: 'DATABASE_USER', variable: 'DATABASE_USER'),
                    string(credentialsId: 'DATABASE_HOST', variable: 'DATABASE_HOST'),
                    string(credentialsId: 'DATABASE_PORT', variable: 'DATABASE_PORT'),
                    string(credentialsId: 'DATABASE_NAME', variable: 'DATABASE_NAME')
                ]) {
                    // sh 'echo $DATABASE_USER, $DATABASE_HOST, $DATABASE_PASSWORD'
                    sh 'echo "DATABASE_URL=\"mysql://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE_NAME"\" >> ./app/.env'
                }
            }
        }

        stage('Building image') {
            steps{
                // Como gerar um hash único?
                script {
                    dockerImage = docker.build(registry + ":${env.GIT_COMMIT}", '-f ./app/Dockerfile ./app')
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
                withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'aws-access-key', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {

                    sh 'aws eks list-clusters --region us-east-2'
                    withKubeConfig([credentialsId: 'kubeconfig']) {
                        sh 'kubectl get pods'                        
                        sh 'export BUILD_NUMBER=$BUILD_NUMBER'
                        sh "sed -i 's/IMAGE_TAG/'${env.GIT_COMMIT}'/g' ./app/k8s/deployment.yaml"
                        sh "cat ./app/k8s/deployment.yaml"
                        sh 'kubectl apply -f ./app/k8s/deployment.yaml'
                    }

                }
            }
        }
    }

}