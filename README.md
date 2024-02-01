# Ilia Backend Test

## Prerequisites
- Docker
- Docker Compose

## Setup and Installation

### Clone the Repository
First, clone the repository to your local machine:
```bash
git clone git@github.com:ygortgaleno/desafio-ilia.git
```

### Environment Variables
Ensure you have the required environment variables set up. These variables are defined in `./config/development.env` file.

### Starting the Services with Docker Compose
Run the following command to start all services:
```bash
docker-compose up --build
```

This command will build and start the following services:
- `database`: A PostgreSQL database.
- `app`: The Node.js application.

### Database Initialization
The database will be initialized with the SQL scripts located in `./config/database`. This includes:
- `01_create_time_sheet.sql`: Script to create the timesheet table.
- `02_create_month_report.sql`: Script to create the month report table.

### Accessing the Application
Once the services are up and running, the Node.js application will be accessible at:
```
http://localhost:3000
```

## Testing
To run tests, execute the following command:
```bash
docker-compose run app npm test
```

---
