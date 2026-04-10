# Online Quiz Portal

A simple Python-based web quiz application built with Flask.

## Features

- User registration and authentication
- Dynamic quiz rendering with multiple-choice questions
- Automatic result calculation and score presentation
- Clean user interface with responsive quiz flow

## Run Locally

1. Create and activate a Python virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the application:

```bash
python app.py
```

4. Open `http://127.0.0.1:5000` in your browser.

## Deploy to Render

1. Push your code to a GitHub repository.

2. Go to [Render](https://render.com) and sign up/login.

3. Click "New +" and select "Web Service".

4. Connect your GitHub repository.

5. Configure the service:
   - **Name**: Choose a name for your app
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Environment Variables**:
     - `SECRET_KEY`: A random secret key for Flask sessions
     - `DATABASE_URL`: (Optional) For persistent database, use Render PostgreSQL

6. Click "Create Web Service".

7. Your app will be deployed and accessible at the provided URL.

**Note**: The current setup uses SQLite which resets on each deploy. For persistent user data, consider upgrading to PostgreSQL.
