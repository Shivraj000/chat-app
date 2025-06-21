# Chat Application

This is a full-stack chat application with a React frontend and a Node.js/Express backend.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas URI)

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd chat-app
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    npm install --prefix frontend
    ```

4.  **Create a `.env` file in the root directory:**
    Copy the example environment variables and replace them with your actual values.
    ```env
    PORT=5000
    MONGO_DB_URI=<your_mongodb_uri>
    JWT_SECRET=<your_jwt_secret>
    NODE_ENV=development
    ```
    **Note:** For production, set `NODE_ENV=production`.

## Running the Application Locally (Development Mode)

This command will start both the backend server (using nodemon) and the frontend development server (using Vite) concurrently.

```bash
npm run dev
```

- Backend will be accessible at `http://localhost:5000`
- Frontend will be accessible at `http://localhost:3000`

## Building the Application for Production

This command will build the frontend application for production. The optimized static assets will be placed in the `frontend/dist` directory.

```bash
npm run build
```

## Running the Application in Production Mode

This command will start the backend server in production mode, serving the static frontend files built in the previous step.

```bash
npm start
```

The application will be accessible at `http://localhost:<PORT>` (where `PORT` is defined in your `.env` file, defaulting to 5000).

## Deployment on Render (Example)

Render is a platform that can host full-stack applications. Here's a general guide:

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab).

2.  **Create a new Web Service on Render:**
    - Connect your Git repository.
    - **Environment:** Select `Node`.
    - **Build Command:**
      ```bash
      npm install && npm run build --prefix frontend
      ```
      Or, if you want to include `concurrently` for the build step (though usually not needed if `npm install` is run at the root):
      ```bash
      npm install && npm install concurrently && npm run build --prefix frontend
      ```
      A simpler approach if your `package.json` is set up correctly (as done in this project):
      ```bash
      npm install && npm run build
      ```
    - **Start Command:**
      ```bash
      npm start
      ```

3.  **Add Environment Variables in the Render dashboard:**
    - `MONGO_DB_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A strong, unique secret for JWT signing.
    - `NODE_ENV`: Set this to `production`.
    - `PORT`: Render usually sets this automatically, but you can define it if needed.

4.  **Deploy!**

Render will automatically pull your code, run the build command, and then the start command.

### Notes for Render Deployment:

-   **Static Site vs. Web Service:** Since this application has a backend, deploy it as a "Web Service" on Render, not a "Static Site".
-   **Database:** Ensure your MongoDB instance (e.g., MongoDB Atlas) is configured to allow connections from Render's IP addresses, or use `0.0.0.0/0` for testing (not recommended for production security).
-   **CORS:** The backend is configured with `cors()`, which should be sufficient for most cases. If you encounter CORS issues, you might need to configure specific origins in `backend/server.js`.
-   **Health Checks:** Render uses health checks. Ensure your application starts successfully and responds to HTTP requests on the root path or a configured health check path. The current setup should work as Express will serve the frontend on the root path in production.

This `README.md` provides a comprehensive guide for setting up, running, and deploying the application.
