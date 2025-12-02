# Job Tracker Application

A full-stack job tracking application with email reporting capabilities. Built with React frontend and Python Flask backend.

## Features

- 🔐 **User Authentication**: Secure login with JWT tokens
- 📊 **Job Dashboard**: View and search job processes with real-time data
- 📧 **Email Configuration**: Manage recipient emails for automated reports
- 📨 **Email Reports**: Send formatted job tables via email to configured recipients
- 🎨 **Modern UI**: Dark theme with glassmorphism and smooth animations

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Vite
- Modern CSS with glassmorphism

### Backend
- Python 3.x
- Flask
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- SMTP Email

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- PostgreSQL database
- SMTP email account (e.g., Outlook/Office365)

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```bash
# Using psql
createdb job_tracker

# Or using PostgreSQL client
CREATE DATABASE job_tracker;
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env  # On Windows
# cp .env.example .env  # On macOS/Linux

# Edit .env file with your configuration
# Update database credentials and SMTP settings

# Initialize database
python init_db.py

# Start the backend server
python app.py
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Configuration

### Environment Variables (.env)

Update the `backend/.env` file with your settings:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_tracker
DB_USER=postgres
DB_PASSWORD=your_password

# Email (SMTP)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USE_TLS=True
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-email-password
SENDER_EMAIL=your-email@example.com
```

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

## Usage

1. **Login**: Navigate to `http://localhost:3000` and login with default credentials
2. **View Jobs**: See all job processes in a searchable table
3. **Configure Emails**: Go to Email Config page to add recipient email addresses
4. **Send Reports**: Click "Send Report" to email the job table to all configured recipients

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Jobs
- `GET /api/jobs` - Get all jobs (requires authentication)

### Email Configuration
- `GET /api/email-config` - Get all configured emails
- `POST /api/email-config` - Add new email
- `DELETE /api/email-config/:id` - Remove email
- `POST /api/email-config/send-report` - Send report to all configured emails

## Project Structure

```
Job Tracker/
├── backend/
│   ├── app.py                 # Flask application
│   ├── config.py              # Configuration
│   ├── models.py              # Database models
│   ├── init_db.py             # Database initialization
│   ├── requirements.txt       # Python dependencies
│   ├── routes/
│   │   ├── auth.py           # Authentication routes
│   │   ├── jobs.py           # Job data routes
│   │   └── email_config.py   # Email config routes
│   └── utils/
│       ├── auth_middleware.py # JWT middleware
│       └── email_sender.py    # Email sending utility
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx     # Login page
│   │   │   ├── Jobs.jsx      # Jobs dashboard
│   │   │   └── Config.jsx    # Email configuration
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js        # API client
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # Global styles
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
└── weekly data.json           # Job data source
```

## Troubleshooting

### Backend Issues

- **Database connection error**: Verify PostgreSQL is running and credentials in `.env` are correct
- **Import errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`
- **SMTP errors**: Check email credentials and ensure "less secure apps" or app passwords are configured

### Frontend Issues

- **API connection error**: Ensure backend is running on port 5000
- **Module not found**: Run `npm install` to install all dependencies
- **Port already in use**: Change port in `vite.config.js`

## License

MIT
