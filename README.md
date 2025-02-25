# NutriFitGenie

NutriFitGenie is an application developed for the Adaptive Application subject, where we are building a recommender system for personalized nutrition and fitness guidance. This project features a full-stack application with a Node.js (TypeScript) backend and a React frontend. It uses Docker Compose to orchestrate services including MongoDB and Redis. Swagger is integrated for API documentation and testing.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed on your machine.
- (Optional) Node.js and npm for local development.

## Setup Instructions

### 0. Create the Environment File

Before running the project, create a `.env` file in the root directory by copying the provided development environment file:

```bash
cp dev.env .env
```

### 1. Build and Run with Docker Compose

Docker Compose works on macOS, Windows, and Linux. Use the following commands from the project root (where your `docker-compose.yml` is located):

- **Build and run containers:**

  ```bash
  docker-compose up --build
  ```

- **Run containers in detached mode (optional):**

  ```bash
  docker-compose up --build -d
  ```

- **Stop and remove containers:**

  ```bash
  docker-compose down
  ```

### 2. Application Endpoints

- **Frontend:**  
  The React frontend is hosted on [http://localhost:5173](http://localhost:5173).

- **Backend:**  
  The Node.js backend is hosted on [http://localhost:3000](http://localhost:3000).

### 3. Swagger API Testing

The backend includes Swagger for API documentation and testing. Once the backend is running, access Swagger at:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

This interface lets you view API documentation and test endpoints interactively.

## Project Structure

```
/backend       # Node.js (TypeScript) backend source code
/frontend      # React frontend source code
docker-compose.yml
dev.env       # Development environment variables (copy to .env)
.env          # Your environment file (created from dev.env)
README.md
```

## Additional Information

- **Environment Variables:**  
  Update the `.env` file with the proper configuration for your environment. The project uses these variables to configure MongoDB, Redis, and other settings.

- **Hot Reloading:**  
  Both backend and frontend services are configured for hot reloading. Changes in the source code are automatically reflected during development.

- **Troubleshooting:**  
  - **Container Name Conflicts:** If you encounter errors about container names already in use, remove the conflicting container:
    ```bash
    docker rm -f <container_name>
    ```
  - **Swagger Not Loading:** Ensure the backend service is running correctly. Check the logs for errors related to Swagger initialization.

Happy Coding!

