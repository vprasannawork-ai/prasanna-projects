// DOM Elements
const signinScreen = document.getElementById('signin-screen');
const signupScreen = document.getElementById('signup-screen');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

// Auth DOM
const goToSignup = document.getElementById('go-to-signup');
const goToSignin = document.getElementById('go-to-signin');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const signinUserid = document.getElementById('signin-userid');
const signinPassword = document.getElementById('signin-password');
const signupUserid = document.getElementById('signup-userid');
const signupPassword = document.getElementById('signup-password');
const signinError = document.getElementById('signin-error');
const signupError = document.getElementById('signup-error');

// Quiz DOM
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressBar = document.getElementById('progress-bar');
const questionNumber = document.getElementById('question-number');
const scoreLive = document.getElementById('score-live');

const finalScoreDisplay = document.getElementById('final-score');
const analysisContainer = document.getElementById('analysis-container');

// State Variables
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; // Array to store { selectedOptionIndex, isCorrect }
let currentSelectedOptionIndex = null;
let fallbackUsers = {}; // In-memory fallback if localStorage fails

// Helper to get users safely
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('quizUsers') || '{}');
    } catch (e) {
        return fallbackUsers;
    }
}

// Helper to set users safely
function saveUsers(users) {
    try {
        localStorage.setItem('quizUsers', JSON.stringify(users));
    } catch (e) {
        fallbackUsers = users;
    }
}

// Initialize
function init() {
    // Auth listeners
    goToSignup.addEventListener('click', showSignup);
    goToSignin.addEventListener('click', showSignin);
    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);

    // Quiz listeners
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    submitBtn.addEventListener('click', submitQuiz);
    restartBtn.addEventListener('click', () => {
        // Reset and go to start screen instead of straight into quiz
        resultScreen.classList.remove('active');
        startScreen.classList.add('active');
    });
}

// Auth Functions
function showSignup() {
    signinScreen.classList.remove('active');
    signupScreen.classList.add('active');
    signupError.classList.add('hidden');
}

function showSignin() {
    signupScreen.classList.remove('active');
    signinScreen.classList.add('active');
    signinError.classList.add('hidden');
}

function handleRegister() {
    const userid = signupUserid.value.trim();
    const password = signupPassword.value.trim();

    if (!userid || !password) {
        signupError.innerText = "Please fill in all fields.";
        signupError.classList.remove('hidden');
        return;
    }

    const users = getUsers();

    if (users[userid]) {
        signupError.innerText = "User ID already exists.";
        signupError.classList.remove('hidden');
        return;
    }

    // Save user
    users[userid] = password;
    saveUsers(users);

    // Clear inputs and go to sign in
    signupUserid.value = '';
    signupPassword.value = '';
    showSignin();
    signinError.innerText = "Registration successful! Please login.";
    signinError.classList.remove('hidden');
    signinError.style.color = "var(--correct-color)";
    signinError.style.background = "var(--correct-bg)";
}

function handleLogin() {
    const userid = signinUserid.value.trim();
    const password = signinPassword.value.trim();

    signinError.style.color = "var(--wrong-color)";
    signinError.style.background = "var(--wrong-bg)";

    if (!userid || !password) {
        signinError.innerText = "Please fill in all fields.";
        signinError.classList.remove('hidden');
        return;
    }

    const users = getUsers();

    if (users[userid] && users[userid] === password) {
        // Login successful
        signinScreen.classList.remove('active');
        startScreen.classList.add('active');
        signinUserid.value = '';
        signinPassword.value = '';
        signinError.classList.add('hidden');
    } else {
        signinError.innerText = "Invalid User ID or Password.";
        signinError.classList.remove('hidden');
    }
}


// Quiz Functions
function startQuiz() {
    startScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    quizScreen.classList.add('active');

    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    scoreLive.innerText = `Score: 0`;

    loadQuestion();
}

function loadQuestion() {
    currentSelectedOptionIndex = null;
    nextBtn.classList.add('hidden');
    submitBtn.classList.add('hidden');

    const currentQuestion = questions[currentQuestionIndex];
    
    // Update progress
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    questionNumber.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    // Set question text
    questionText.innerText = currentQuestion.question;

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Create options
    currentQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option');
        optionDiv.innerText = option;
        optionDiv.addEventListener('click', () => selectOption(index, optionDiv));
        optionsContainer.appendChild(optionDiv);
    });
}

function selectOption(selectedIndex, optionElement) {
    currentSelectedOptionIndex = selectedIndex;

    // Remove selected class from all options
    Array.from(optionsContainer.children).forEach(child => {
        child.classList.remove('selected');
    });

    // Add selected class to current option
    optionElement.classList.add('selected');

    // Show next or submit button
    if (currentQuestionIndex < questions.length - 1) {
        nextBtn.classList.remove('hidden');
    } else {
        submitBtn.classList.remove('hidden');
    }
}

function saveCurrentAnswer() {
    if (currentSelectedOptionIndex === null) return false;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentSelectedOptionIndex === currentQuestion.answer;

    if (isCorrect) {
        score++;
        scoreLive.innerText = `Score: ${score}`;
    } 

    // Save user answer
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedOptionIndex: currentSelectedOptionIndex,
        isCorrect: isCorrect
    });
    
    return true;
}

function nextQuestion() {
    if (saveCurrentAnswer()) {
        currentQuestionIndex++;
        loadQuestion();
    }
}

function submitQuiz() {
    if (saveCurrentAnswer()) {
        // Fill progress bar fully if it's the last question
        progressBar.style.width = `100%`;
        
        quizScreen.classList.remove('active');
        resultScreen.classList.add('active');

        // Display Score
        finalScoreDisplay.innerText = `${score} / ${questions.length}`;

        renderAnalysis();
    }
}

function renderAnalysis() {
    analysisContainer.innerHTML = ''; // Clear previous analysis

    userAnswers.forEach((answerData, i) => {
        const qData = questions[answerData.questionIndex];
        
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('analysis-item');
        itemDiv.classList.add(answerData.isCorrect ? 'correct' : 'incorrect');

        const qTitle = document.createElement('div');
        qTitle.classList.add('analysis-question');
        qTitle.innerText = `${i + 1}. ${qData.question}`;
        itemDiv.appendChild(qTitle);

        const yourAnswerDiv = document.createElement('div');
        yourAnswerDiv.classList.add('analysis-detail');
        const yourAnsClass = answerData.isCorrect ? 'text-correct' : 'text-wrong';
        yourAnswerDiv.innerHTML = `<span class="label">Your Answer:</span> <span class="${yourAnsClass}">${qData.options[answerData.selectedOptionIndex]}</span>`;
        itemDiv.appendChild(yourAnswerDiv);

        if (!answerData.isCorrect) {
            const correctAnsDiv = document.createElement('div');
            correctAnsDiv.classList.add('analysis-detail');
            correctAnsDiv.innerHTML = `<span class="label">Correct Answer:</span> <span class="text-correct">${qData.options[qData.answer]}</span>`;
            itemDiv.appendChild(correctAnsDiv);
        }

        analysisContainer.appendChild(itemDiv);
    });
}

// Start the app
init();
