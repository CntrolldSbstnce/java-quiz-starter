var startButton = document.getElementById('start-btn');
var questionContainerElement = document.getElementById('question-container');
var questionElement = document.getElementById('question');
var answerButtonsElement = document.getElementById('answer-buttons');
var timerElement = document.getElementById('time');
var endQuizElement = document.getElementById('end-quiz');
var finalScoreElement = document.getElementById('final-score');
var initialsForm = document.getElementById('score-form');
var highScoresElement = document.getElementById('high-scores');
var scoresListElement = document.getElementById('scores-list');
var startOverButton = document.getElementById('start-over-btn');
var resetScoresButton = document.getElementById('reset-scores-btn');

let currentQuestionIndex, timerId;
let time = 60;

const questions = [
    {
        question: 'What does HTML stand for?',
        answers: [
            { text: 'Hyper Text Markup Language', correct: true },
            { text: 'Hyperlinks and Text Markup Language', correct: false },
            { text: 'Home Tool Markup Language', correct: false },
            { text: 'Hyper Tool Modem Language', correct: false },
        ]
    },
    {
        question: 'Which language runs in a web browser?',
        answers: [
            { text: 'Java', correct: false },
            { text: 'C', correct: false },
            { text: 'Python', correct: false },
            { text: 'JavaScript', correct: true },
        ]
    },
    {
        question: 'Arrays in Javascript can be used to store...?',
        answers: [
            { text: 'numbers and strings', correct: false },
            { text: 'other arrays', correct: false },
            { text: 'booleans', correct: false },
            { text: 'all of the above', correct: true },
        ]
    },
    {
        question: 'Inside which HTML element do we place the JavaScript?',
        answers: [
            { text: '<js>', correct: false },
            { text: '<script>', correct: true },
            { text: '<javascript>', correct: false },
            { text: '<scripting>', correct: false},
        ]
    },
    {
        question: 'How can you add a comment in Javascript?',
        answers: [
            { text: '<--Comment-->', correct: false},
            { text: '/*Comment*/', correct: false },
            { text: '//Comment', correct: true },
            { text: '*!--Comment--!*', correct: false },
        ]
    },
];

startButton.addEventListener('click', startQuiz);

function startQuiz() {
    startButton.style.display = 'none';
    startOverButton.style.display = 'none';
    currentQuestionIndex = 0;
    questionContainerElement.style.display = '';
    timerId = startTimer();
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        var button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    var selectedButton = e.target;
    var correct = selectedButton.dataset.correct;
    if (!correct) {
        time -= 10;
        if (time < 0) time = 0;
        timerElement.textContent = time;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setNextQuestion();
    } else {
        endQuiz();
    }
}

function startTimer() {
    timerElement.textContent = time;
    return setInterval(() => {
        time--;
        timerElement.textContent = time;
        if (time <= 0) {
            clearInterval(timerId);
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerId);
    questionContainerElement.style.display = 'none';
    endQuizElement.style.display = '';
    finalScoreElement.textContent = time;
}

initialsForm.addEventListener('submit', saveHighScore);

function saveHighScore(e) {
    e.preventDefault();
    var initials = initialsForm.initials.value;
    var score = {
        score: time,
        initials
    };
    var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
    endQuizElement.style.display = 'none';
}

function displayHighScores() {
    highScoresElement.style.display = '';
    scoresListElement.innerHTML = '';
    var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    if (highScores.length > 0) {
    highScores.forEach(score => {
        var li = document.createElement('li');
        li.textContent = `${score.initials} - ${score.score}`;
        scoresListElement.appendChild(li);
    });
    } else {
        scoresListElement.textContent = 'No scores yet!';
    }
    startOverButton.style.display = 'inline-block'
    
}

startOverButton.addEventListener('click', startOver);
resetScoresButton.addEventListener('click', resetScores);

function resetScores() {
    localStorage.removeItem('highScores'); 
    displayScores();
    alert("Scores have been reset.");
}
function startOver() {
    
    questionContainerElement.style.display = 'none';
    endQuizElement.style.display = 'none';
    highScoresElement.style.display = 'none'; 
    startButton.style.display = 'inline-block';
    startOverButton.style.display = 'none';
    time = 60; 
    timerElement.textContent = time; 
    currentQuestionIndex = 0; 
    startQuiz();
}

initialsForm.reset();

