from flask import Flask, render_template, request, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo
import random

import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'quiz_secret_key_123')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///quiz.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# User Model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Forms
class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=150)])
    email = StringField('Email', validators=[DataRequired(), Email(message='Enter a valid email address.')])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(message='Enter a valid email address.')])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Sign In')

QUESTIONS = [
    {
        "id": 1,
        "text": "What is the primary purpose of an online quiz portal?",
        "choices": [
            "Deliver multimedia content",
            "Collect user feedback",
            "Evaluate knowledge and score responses",
            "Track physical attendance"
        ],
        "answer": "Evaluate knowledge and score responses"
    },
    {
        "id": 2,
        "text": "Which Python web framework is used in this quiz portal?",
        "choices": [
            "Django",
            "Flask",
            "FastAPI",
            "Pyramid"
        ],
        "answer": "Flask"
    },
    {
        "id": 3,
        "text": "How does the portal calculate the final score?",
        "choices": [
            "Based on time taken",
            "By comparing user answers with correct answers",
            "By counting page visits",
            "Using random selection"
        ],
        "answer": "By comparing user answers with correct answers"
    },
    {
        "id": 4,
        "text": "Which HTML element is used to group answer options in the quiz?",
        "choices": [
            "<form>",
            "<section>",
            "<ul>",
            "<input type=\"radio\">"
        ],
        "answer": "<input type=\"radio\">"
    },
    {
        "id": 5,
        "text": "What makes the quiz interface user-friendly?",
        "choices": [
            "Complex navigation",
            "Clean layout and clear feedback",
            "Hidden results",
            "Multiple pop-ups"
        ],
        "answer": "Clean layout and clear feedback"
    },
    {
        "id": 6,
        "text": "What does CSS stand for?",
        "choices": [
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Creative Style Sheets",
            "Colorful Style Sheets"
        ],
        "answer": "Cascading Style Sheets"
    },
    {
        "id": 7,
        "text": "Which programming language is primarily used for web development?",
        "choices": [
            "Python",
            "JavaScript",
            "C++",
            "Java"
        ],
        "answer": "JavaScript"
    },
    {
        "id": 8,
        "text": "What is the purpose of the 'if' statement in programming?",
        "choices": [
            "To loop through data",
            "To make decisions based on conditions",
            "To define functions",
            "To import modules"
        ],
        "answer": "To make decisions based on conditions"
    },
    {
        "id": 9,
        "text": "Which HTTP method is used to send data to a server?",
        "choices": [
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ],
        "answer": "POST"
    },
    {
        "id": 10,
        "text": "What is the main advantage of using version control systems like Git?",
        "choices": [
            "Faster code execution",
            "Track changes and collaborate",
            "Automatic code formatting",
            "Built-in testing framework"
        ],
        "answer": "Track changes and collaborate"
    },
    {
        "id": 11,
        "text": "What does HTML stand for?",
        "choices": [
            "HyperText Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlink and Text Markup Language"
        ],
        "answer": "HyperText Markup Language"
    },
    {
        "id": 12,
        "text": "Which data type is used to store true/false values in programming?",
        "choices": [
            "String",
            "Integer",
            "Boolean",
            "Float"
        ],
        "answer": "Boolean"
    },
    {
        "id": 13,
        "text": "What is the purpose of a database in web applications?",
        "choices": [
            "Store and retrieve data",
            "Handle user authentication",
            "Process payments",
            "Generate reports"
        ],
        "answer": "Store and retrieve data"
    },
    {
        "id": 14,
        "text": "Which of the following is NOT a programming paradigm?",
        "choices": [
            "Object-oriented",
            "Functional",
            "Procedural",
            "Algorithmic"
        ],
        "answer": "Algorithmic"
    },
    {
        "id": 15,
        "text": "What does API stand for?",
        "choices": [
            "Application Programming Interface",
            "Advanced Programming Interface",
            "Automated Program Integration",
            "Application Process Interface"
        ],
        "answer": "Application Programming Interface"
    },
    {
        "id": 16,
        "text": "Which loop structure repeats code while a condition is true?",
        "choices": [
            "For loop",
            "While loop",
            "Do-while loop",
            "If statement"
        ],
        "answer": "While loop"
    },
    {
        "id": 17,
        "text": "What is the main purpose of responsive web design?",
        "choices": [
            "Improve loading speed",
            "Adapt to different screen sizes",
            "Enhance security",
            "Reduce server costs"
        ],
        "answer": "Adapt to different screen sizes"
    },
    {
        "id": 18,
        "text": "Which of these is a NoSQL database?",
        "choices": [
            "MySQL",
            "PostgreSQL",
            "MongoDB",
            "SQLite"
        ],
        "answer": "MongoDB"
    },
    {
        "id": 19,
        "text": "What does the 'return' keyword do in a function?",
        "choices": [
            "Prints output to console",
            "Exits the function and returns a value",
            "Defines a new variable",
            "Imports a module"
        ],
        "answer": "Exits the function and returns a value"
    },
    {
        "id": 20,
        "text": "Which HTTP status code indicates a successful request?",
        "choices": [
            "200 OK",
            "404 Not Found",
            "500 Internal Server Error",
            "301 Moved Permanently"
        ],
        "answer": "200 OK"
    },
    {
        "id": 21,
        "text": "What is the purpose of the 'else' clause in an if-else statement?",
        "choices": [
            "To execute code when the condition is true",
            "To execute code when the condition is false",
            "To define a new condition",
            "To end the program"
        ],
        "answer": "To execute code when the condition is false"
    },
    {
        "id": 22,
        "text": "Which of the following is a frontend framework?",
        "choices": [
            "Express.js",
            "React",
            "Django",
            "Flask"
        ],
        "answer": "React"
    },
    {
        "id": 23,
        "text": "What does SQL stand for?",
        "choices": [
            "Structured Query Language",
            "Simple Query Language",
            "Standard Query Language",
            "System Query Language"
        ],
        "answer": "Structured Query Language"
    },
    {
        "id": 24,
        "text": "Which programming concept allows functions to call themselves?",
        "choices": [
            "Recursion",
            "Iteration",
            "Polymorphism",
            "Encapsulation"
        ],
        "answer": "Recursion"
    },
    {
        "id": 25,
        "text": "What is the main benefit of using cloud computing?",
        "choices": [
            "Lower costs and scalability",
            "Faster internet speeds",
            "Better graphics performance",
            "Improved battery life"
        ],
        "answer": "Lower costs and scalability"
    }
]


# Authentication Routes
@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            flash('Email already registered. Please log in.', 'danger')
            return redirect(url_for('login'))
        
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            flash('Username already taken. Please choose another.', 'danger')
            return redirect(url_for('register'))
        
        new_user = User(username=form.username.data, email=form.email.data, password=form.password.data)
        db.session.add(new_user)
        db.session.commit()
        
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.password == form.password.data:
            login_user(user)
            flash('Login successful!', 'success')
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('index'))
        else:
            flash('Login unsuccessful. Please check email and password.', 'danger')
    
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

# Protected Routes
@app.route("/")
def index():
    return render_template("index.html", total_questions=len(QUESTIONS))


@app.route("/quiz")
@login_required
def quiz():
    questions = QUESTIONS.copy()
    random.shuffle(questions)
    session['questions'] = questions
    return render_template("quiz.html", questions=questions)


@app.route("/submit", methods=["POST"])
@login_required
def submit():
    questions = session.get('questions', QUESTIONS)
    user_answers = {}
    score = 0
    results = []

    for question in questions:
        answer_key = f"question-{question['id']}"
        selected = request.form.get(answer_key, "")
        correct = question["answer"]
        is_correct = selected == correct

        if is_correct:
            score += 1

        results.append(
            {
                "text": question["text"],
                "selected": selected,
                "correct": correct,
                "is_correct": is_correct,
            }
        )

    percent = int((score / len(questions)) * 100)
    return render_template(
        "result.html",
        score=score,
        total=len(questions),
        percent=percent,
        results=results,
    )


# Create database tables
with app.app_context():
    db.create_all()


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
