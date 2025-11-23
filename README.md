
# Connect Studio – Video Generation Platform
A web application to create personalized tribute videos through a multi-step workflow including project setup, theme selection, media upload, editing, music integration, and preview.

Authors: Neha Rao | Qizheng Yang | Arsalan Nawabi
Sponsor: Mirco Rossetti (mircorossetti@mybabbo.com)




# Features
    - Secure user authentication and project ownership
    - lexible slide and media management (photos, videos, audio)
    - Image editing: crop, filters, blemish & red-eye removal
    - Theme selection and preview (17 included themes)
    - Audio upload and licensing agreement prompt
    - Preview and real-time slide transitions
    - Family contribution workflow for collaborative uploads
    - Download final MP4 video (placeholder)


# Project Structure

    CSE485_Project_Connect_Studio/
    ├── backend/       # Node.js API app and SQLite DB
    ├── public/        # Static theme/image assets
    ├── src/           # Frontend React app
    └── README.md      # Project documentation


# Installation & Deployment
    Prerequisites:
        Node.js v16+
        npm
        Git

    1. Clone the Repository:
        bash
        git clone https://github.com/Qizheng-Yang/CSE485_Project_Connect_Studio.git
        cd CSE485_Project_Connect_Studio

    2. Backend Setup:
        bash
        cd backend
        npm install
        npm run init-db     # Creates ./database/connect_studio.db
        npm start           # Starts backend at localhost

    3. Frontend Setup:
        bash
        cd ..
        npm install
        npm run build

    4. Configure Environment Variables:
        Create a .env file in backend/ with:
            PORT=3001
            NODE_ENV=production
            JWT_SECRET=[secure string]
            DB_PATH=./database/connect_studio.db
            UPLOAD_DIR=./uploads
            CORS_ORIGIN=[frontend domain or localhost]
            MAX_FILE_SIZE=52428800

    5. Access the app:
        API at http://localhost:3001/api
        Build/deploy frontend to desired static host (Netlify, Vercel, etc.)


# API
    Key endpoints are documented in the Technical Documentation section and code comments.
    JWT authentication is required for all protected endpoints. See example requests in /src/services/api.ts.


# Licenses
    Project: MIT License

    See documentation for a full list of frontend and backend third-party libraries and licenses.


# Support
    For critical questions for 1 month post-handoff, open a GitHub Issue in this repository.
    Support is limited to clarifications only; no code changes or integration support will be provided.

    For further details and architecture diagrams, see the included technical documentation and handover document.