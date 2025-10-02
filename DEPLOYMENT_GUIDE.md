# 🚀 Connect Studio - Deployment Guide for Demo

This guide will help you quickly set up and demonstrate your Connect Studio video generation website to your boss.

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** (if cloning from repository)

## ⚡ Quick Setup (5 minutes)

### Step 1: Setup Backend

1. **Open terminal and navigate to your project**
   ```bash
   cd CSE486/CSE485_Project_Connect_Studio
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   ✅ **Backend will be running on: http://localhost:3001**

### Step 2: Setup Frontend (New Terminal)

1. **Open a new terminal tab/window**
   ```bash
   cd CSE486/CSE485_Project_Connect_Studio
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   
   ✅ **Frontend will be running on: http://localhost:5173**

