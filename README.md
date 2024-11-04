# HealthHub Project

This project is a full-stack application consisting of a backend service built with Node.js and TypeScript, a frontend built with React, and a PostgreSQL database. The setup uses Docker for containerization, making it easy to deploy and manage.

---

## Prerequisites

Before starting, make sure you have the following installed on your machine:

- **Docker**: [Download and Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: Included with Docker Desktop

---

## Project Structure

```
HEALTHHUB-APP/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/josephsae/healthhub-app.git
cd healthhub-app
```

### 2. Setup Environment Variables

Create a `.env` file in the root of the project and add the following variables:

```env
# Ports
API_HOST_PORT=8080          # Host port for the backend
API_CONTAINER_PORT=8080     # Internal port of the backend
APP_HOST_PORT=3000          # Host port for the frontend
DB_HOST_PORT=5432           # Host port for PostgreSQL

# Database Configuration
DB_HOST=db                                       # Name of the database service in docker-compose.yml
DB_USERNAME=healtcare_db_use                     # Replace with your desired username
DB_PASSWORD=123                                  # Replace with your desired password
DB_DATABASE=healthub_db                          # Replace with the name of your database

# API URL for the Frontend
API_URL=http://localhost:8080 

# Backend Configuration
ENV=development
API_JWT_SECRET=123password
```

### 3. Build and Start the Project Using Docker

To build and run the services (database, backend, and frontend), use the following command:

```bash
docker-compose up --build
```

- `--build`: Ensures that Docker builds the images before starting the containers.

### 4. Access the Application

- **Frontend**: Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
- **Backend**: The API will be running on [http://localhost:8080](http://localhost:8080)
- **Database**: The PostgreSQL database will be accessible on port `5432` (if needed for external access).

---

## Database Setup

To set up the database, you need to run the SQL script that creates the necessary tables and sequences. Follow these steps:

### 1. Connect to Your PostgreSQL Database

You can use a tool like `psql`, DBeaver, or TablePlus to connect to your PostgreSQL database. For example, using `psql`:

```bash
psql -h localhost -U your_username -d healthub_db
```

Replace `your_username` with your PostgreSQL username and `healthub_db` with the name of your database.

### 2. Run the SQL Script

Once connected, execute the `create_database.sql` script to create the tables and sequences:

```bash
\i create_database.sql
```

Make sure you are in the root directory of your project where the create_database.sql file is located when running this command.

### Note

- Make sure the database is created before running the SQL script.
- Ensure you have the necessary permissions to create tables and sequences in the database.


## Useful Commands

### Stop and Remove Containers

```bash
docker-compose down
```

This command stops and removes all running containers and networks created by Docker Compose.

### View Logs

To view the logs of a specific service (e.g., backend):

```bash
docker-compose logs backend
```

### Access a Container's Shell

To access the shell of a running container (e.g., backend):

```bash
docker exec -it healthcare-api sh
```

---

## Troubleshooting

1. **Database Connection Issues**:
   - Ensure that the PostgreSQL container is running and accessible.
   - Double-check the database credentials in the `.env` file.

2. **Environment Variables Not Loading**:
   - Make sure `dotenv.config()` is called at the top of your backend code.
   - Ensure the `.env` file is correctly placed in the root directory.

3. **Port Conflicts**:
   - If you experience port conflicts, update the port numbers in the `.env` file.

---

## Notes

- **Security**: Make sure to use strong secrets and passwords in the `.env` file, especially for the `JWT_SECRET` and database credentials.
- **Production**: For a production environment, consider using SSL for the database connection and configure environment variables appropriately.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---
