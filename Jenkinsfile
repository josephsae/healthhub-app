pipeline {
    agent any

    environment {
        DB_USERNAME = 'your_db_username'
        DB_PASSWORD = 'your_db_password'
        DB_DATABASE = 'your_database_name'
        DB_HOST_PORT = '5432'
        API_HOST_PORT = '4000'
        API_CONTAINER_PORT = '4000'
        APP_HOST_PORT = '3000'
        ENV = 'staging'
        API_JWT_SECRET = 'your_secret_key'
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
                sh '/usr/local/bin/docker-compose -f docker-compose.yml run --rm backend npm test'
            }
        }

        stage('Deploy Services') {
            steps {
                echo 'Deploying services...'
                sh '/usr/local/bin/docker-compose -f docker-compose.yml -f docker-compose.yml up -d'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh '/usr/local/bin/docker-compose down'
        }
    }
}
