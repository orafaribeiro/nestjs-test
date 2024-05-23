pipeline {
    environment {
        registry = '471112647960.dkr.ecr.us-east-2.amazonaws.com/my-api1'
        registryCredential = 'aws-access-key'
        dockerImage = ''
    }
    agent any

    stages {
        stage('update env') {
            steps {
                withCredentials([string(credentialsId: 'DATABASE_PASSWORD', variable: ''), string(credentialsId: 'DATABASE_USER', variable: ''), string(credentialsId: 'DATABASE_HOST', variable: ''), string(credentialsId: 'DATABASE_PORT', variable: ''), string(credentialsId: 'DATABASE_NAME', variable: '')]) {
                    sh 'echo $DATABASE_USER, $DATABASE_HOST'
                }
                // sh 'echo "DATABASE_URL=\"mysql://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE_NAME"\" >> ./app/.env'
            }
        }

        stage('Building image') {
            // Adicionar variáveis de ambiente no arquivo .env
            steps{
                // Como gerar um hash único?
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
                    sh 'kubectl --kubeconfig ./app/k8s/kubeconfig get pods'
                }*/
                /*withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh "$registryCredential"
                    // sh 'kubectl --kubeconfig ./app/k8s/kubeconfig get pods'
                    // sh 'sed -i "s/$IMAGE_TAG/$BUILD_NUMBER/g" ./app/k8s/deployment.yaml'
                    // sh 'kubectl apply -f ./app/k8s/deployment.yaml'
                }*/
                withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'aws-access-key', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {

                    sh 'aws eks list-clusters --region us-east-2'

                    withKubeConfig([credentialsId: 'kubeconfig']) {
                        sh 'kubectl get pods'
                        /*sh 'set IMAGE_TAG=$BUILD_NUMBER'
                        sh 'powershell -Command \'(gc ./app/k8s/deployment.yaml) -replace "IMAGE_TAG", "$BUILD_NUMBER"\''
                        // sh 'powershell -Command \'(gc ./app/k8s/deployment.yaml) -replace "IMAGE_TAG", "$BUILD_NUMBER" | Out-File -encoding ASCII ./app/k8s/deployment.yaml\''
                        sh 'type ./app/k8s/deployment.yaml'*/
                        // sh 'powershell.exe Start-Process -Verb runas -FilePath wsl'
                        // sh 'wsl chmod +x ./app/k8s/deployment.yaml'
                        // sh 'wsl sed -i "s/$IMAGE_TAG/$BUILD_NUMBER/g" ./app/k8s/deployment.yaml'
                        // sh 'wsl cat ./app/k8s/deployment.yaml'
                        // sh 'kubectl --kubeconfig ./app/k8s/kubeconfig get pods'
                        // sh 'kubectl --kubeconfig ./app/k8s/kubeconfig get pods'
                        // 'C:\\Program Files\\Git\\bin\\bash.exe git --version'
                        // sh 'sed -i "s/$IMAGE_TAG/$BUILD_NUMBER/g" ./app/k8s/deployment.yaml'
                        sh 'export BUILD_NUMBER=$BUILD_NUMBER'
                        sh "sed -i 's/IMAGE_TAG/'$BUILD_NUMBER'/g' ./app/k8s/deployment.yaml"
                        sh "cat ./app/k8s/deployment.yaml"
                        // sh 'envsubst < ./app/k8s/deployment.yaml | kubectl apply -f -'
                        // sh 'envsubst < ./app/k8s/deployment.yaml | cat -'
                        // sh 'cat ./app/k8s/deployment.yaml'
                        sh 'kubectl apply -f ./app/k8s/deployment.yaml'
                    }

                }
            }
        }
    }

}