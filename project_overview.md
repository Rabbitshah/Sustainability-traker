ō# Sustainability Tracker (EcoTracker) - Project Overview

The **Sustainability Tracker** is a full-stack web application designed to help users and companies track, analyze, and reduce their environmental impact. It allows users to log daily activities (such as travel, energy consumption, and food habits) and calculates their estimated Carbon Dioxide Equivalent (CO2e) emissions. It features gamification elements, interactive reports, and AI-powered recommendations to guide users toward more sustainable habits.

## 🏗️ Architecture & Tech Stack

The project is divided into a **React frontend** and a **Django backend**, containerized using Docker for easier deployment and orchestration.

### 1. Backend (`/backend`)
The backend is built with Python and serves as the core data processing and API engine.
*   **Framework**: Django and Django REST Framework (DRF) to serve RESTful APIs.
*   **Database**: SQLite (`db.sqlite3`) for local development and testing.
*   **Asynchronous Processing**: Uses **Celery** to handle background tasks, such as batch-processing uploaded files, without blocking the main API thread.
*   **Core Models**:
    *   `User`: Standard Django authentication model.
    *   `Company`: Linked to a user; aggregates all the sustainability data for that entity.
    *   `EmissionRecord`: The primary data point storing category, input value, unit, and the calculated `co2e_impact`.
    *   `UploadedFile`: Tracks files uploaded for batch data processing.
*   **Calculations Engine**: Dedicated logic (`conversions.py`) that uses official conversion factors (e.g., Electricity = 0.82 kg CO2e/kWh) to compute the environmental impact of logged activities.
*   **Reporting Service**: A custom service that can generate downloadable PDF reports on the fly.

### 2. Frontend (`/sustainability-frontend`)
The frontend is a modern, responsive Single Page Application (SPA).
*   **Framework & Build Tool**: React.js built with **Vite** for fast compilation and hot-module replacement.
*   **Language**: TypeScript, ensuring type safety across the UI codebase.
*   **Package Management**: Node Package Manager (`npm`).
*   **Code Quality**: Configured with ESLint and TypeScript configurations (`tsconfig.json`).

## 📱 Key Features & Pages

The application is structured around several core user interfaces:

1.  **Dashboard** (`Dashboard.tsx`): 
    *   The central hub displaying KPI cards (Today's Footprint, Eco Score, Streak).
    *   Features a 7-day trend chart, an impact distribution donut chart, and a table of recent activities.
    *   Includes a "Generate AI Advice" button for on-the-fly sustainability tips.
2.  **Daily Logs** (`Logs.tsx`): 
    *   A categorized input interface (Travel, Energy, Food, Waste).
    *   Calculates the estimated CO2e impact dynamically as the user types, before persisting it to the backend.
3.  **AI Insights** (`AIInsights.tsx`): 
    *   Offers a 7-day actionable plan with checkable tasks.
    *   Provides an interactive AI Chat interface to help users brainstorm ways to minimize their footprint.
4.  **Reports & Analytics** (`Reports.tsx`): 
    *   Detailed view of historical logs with interactive charts.
    *   Allows data filtering by date and category.
    *   Supports exporting data locally as a **CSV** or requesting a compiled **PDF** from the backend.
5.  **Community** (`Community.tsx`): 
    *   Gamification elements including Global, Friends, and Local leaderboards.
    *   Features a friend activity feed and active community challenges (e.g., "Plastic-Free Month").
6.  **Settings** (`Settings.tsx`): 
    *   Manages user profiles, UI preferences (theme, units), notifications, Two-Factor Authentication (2FA), and privacy controls (data deletion).

## ⚙️ Infrastructure & Documentation
*   **Docker**: The root folder includes a `docker-compose.yml` file, and the backend has a `Dockerfile`, suggesting that the database, backend, (and potentially frontend/Redis for Celery) can be spun up together using Docker Compose.
*   **Documentation**: The project contains extensive product documentation at the root level, including:
    *   `Product Requirements Document.docx`
    *   `Design Document.docx`
    *   `EcoTracker Tech Stack Overview.docx`
    *   `walkthrough.md` (which provides a developer briefing on the codebase).
ō