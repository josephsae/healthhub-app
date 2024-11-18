pipeline {
    agent any

    environment {
        DB_USERNAME = 'healtcare_db_user'
        DB_PASSWORD = '1lNR2y84HYyEftDx0Ha5ZuMtyV8Puyrv'
        DB_DATABASE = 'healthub_db'
        DB_HOST_PORT = '5432'
        API_HOST_PORT = '4000'
        API_CONTAINER_PORT = '4000'
        APP_HOST_PORT = '3000'
        ENV = 'staging'
        API_JWT_SECRET = '123password'
        API_URL = 'http://localhost:4000'
        DB_HOST = 'db'
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                git branch:'main', url: 'https://github.com/josephsae/healthhub-app.git'
            }
        }
        
        stage('Build Docker Services') {
            steps {
                echo 'Building Docker services...'
                sh '/usr/local/bin/docker-compose -f docker-compose.yml build'
            }
        }

        stage('Run Backend Tests') {
            steps {
                echo 'Running backend tests...'
                sh '/usr/local/bin/docker-compose run --rm backend npm test'
            }
        }

        stage('Deploy Services') {
            steps {
                echo 'Deploying services...'
                sh '/usr/local/bin/docker-compose -f docker-compose.yml -f docker-compose.yml up -d'
            }
        }

        stage('Validate Deployment') {
            steps {
                echo 'Waiting for backend to initialize...'
                sh 'sleep 10'
                echo 'Validating services...'
                sh 'curl -f ${API_URL}/ping || exit 1'
            }
        }

    }

    post {
        success {
            emailext (
                subject: 'Pipeline Success: ${JOB_NAME} #${BUILD_NUMBER}',
                body: 'The pipeline completed successfully.\n\nCheck the details at ${BUILD_URL}',
                to: 'joseph.caice88@gmail.com'
            )
        }
        failure {
            emailext (
                subject: 'Pipeline Failed: ${JOB_NAME} #${BUILD_NUMBER}',
                body: 'The pipeline failed.\n\nCheck the details at ${BUILD_URL}',
                to: 'joseph.caice88@gmail.com'
            )
        }
        always {
            echo 'Pipeline execution finished.'
        }
    }

}
