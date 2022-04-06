// element links to static html
var mainContainer = document.querySelector(".main-container");
var startButton = document.querySelector(".start-button");
var timerEl = document.querySelector(".timer");
var highScoresLinkEl = document.querySelector(".highscores");
var belowMainContainerEl = document.querySelector(".below-main-container");

var secondsLeft = 75;
var quizQuestionIndex = 0;
var gameOver = false;
var footerTimer;

const WRONG_ANSWER_DEDUCTION = 20;

// render start page once app starts
renderStartPage();

// renders highscores if button in top left is clicked
highScoresLinkEl.addEventListener("click", function(){
    renderHighscores();
});

// event delegation over main container. Targets button text and data attibutes of elements
mainContainer.addEventListener("click", function(event){
    var target = event.target;

    // targets start button
    if (target.textContent === "Start Quiz"){
        startTimer();
        renderQuizQuestion(quizQuestions[quizQuestionIndex]);
    }

    // targets if answer is correct
    if (target.dataset.isCorrect === "true"){
        quizQuestionIndex++;
        renderFooterMessage("Correct!");
        renderQuizQuestion(quizQuestions[quizQuestionIndex]);
    }

    // targets if answer is incorrect
    if (target.dataset.isCorrect === "false"){
        secondsLeft = secondsLeft - WRONG_ANSWER_DEDUCTION;
        quizQuestionIndex++;
        renderFooterMessage("Incorrect!");
        renderQuizQuestion(quizQuestions[quizQuestionIndex]);
    }

    // targets initials submit button
    if (target.textContent === "Submit"){
        var initials = target.previousElementSibling.value;
        highScores.addScore(secondsLeft, initials);
        renderHighscores();
    }

    // targets high scores play again button
    if (target.textContent === "Play Again"){
        resetValues();
        renderStartPage();
    }

    //targets high scores clear button
    if (target.textContent === "Clear Highscores"){
        highScores.clearScores();
        renderHighscores();
    }
});

// blanks out main container and renders starting info and buttons
function renderStartPage(){
    mainContainer.innerHTML = "";
    timerEl.textContent = secondsLeft;

    var headerElement = document.createElement("h1");
    headerElement.textContent = "Coding Quiz Challenge";
    headerElement.className += "padding-v15 font-xxl";
    
    var gameDirectionsElement = document.createElement("p");
    gameDirectionsElement.textContent = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!";
    gameDirectionsElement.className += "padding-v15";

    var startButton = document.createElement("button");
    startButton.textContent = "Start Quiz";
    startButton.className += "quiz-button";

    mainContainer.appendChild(headerElement);
    mainContainer.appendChild(gameDirectionsElement);
    mainContainer.appendChild(startButton);
}

// blanks out main container and renders quiz question 
function renderQuizQuestion(quizQuestion){
    mainContainer.innerHTML = "";

    if (quizQuestionIndex >= quizQuestions.length){
        gameOver = true;
        endQuiz();
        return;
    }

    // change header to question prompt
    var questionPromptElement = document.createElement("h1");
    questionPromptElement.textContent = quizQuestion.question;
    questionPromptElement.className += "padding-v15 font-xxl";
    mainContainer.appendChild(questionPromptElement);

    var answersOrderedListElement = document.createElement("ol");

    // make a list of answer buttons
    for (var i = 0; i < quizQuestion.answers.length; i++){
        
        var answer = quizQuestion.answers[i].text;
        var answerListElement = document.createElement("li");
        var answerButtonElement = document.createElement("button");

        answerButtonElement.textContent = (i+1) + ".  " + answer;
        answerButtonElement.dataset.isCorrect = quizQuestion.answers[i].isCorrect;
        answerButtonElement.className += "quiz-button";

        answerListElement.appendChild(answerButtonElement);
        answersOrderedListElement.appendChild(answerListElement);
    }

    mainContainer.appendChild(answersOrderedListElement);
} 

// renders the screen after quiz questions are completed. Prompts user for highscore input
function endQuiz(){
    mainContainer.innerHTML = "";

    var headerPromptElement = document.createElement("h1");
    headerPromptElement.textContent = "All Done!";
    headerPromptElement.className += "padding-v15 font-xxl";
    mainContainer.appendChild(headerPromptElement);

    var scoreDisplayElement = document.createElement("p");
    scoreDisplayElement.textContent = "Your score is: " + secondsLeft + ".";
    scoreDisplayElement.className += "padding-v15";
    mainContainer.appendChild(scoreDisplayElement);

    var intialsPrompt = document.createElement("span");
    intialsPrompt.textContent = "Enter initials:";
    mainContainer.appendChild(intialsPrompt);

    var initialsInput = document.createElement("input");
    initialsInput.className += "margin-5 padding-5"
    mainContainer.appendChild(initialsInput);

    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.className += "quiz-button";
    mainContainer.appendChild(submitButton);

}

// renders the highscores page
function renderHighscores(){
    mainContainer.innerHTML = "";
    
    var headerPromptElement = document.createElement("h1");
    headerPromptElement.textContent = "Highscores";
    headerPromptElement.className += "padding-v15 font-xxl";
    mainContainer.appendChild(headerPromptElement);

    var highScoresOrderedListElement = document.createElement("ol");
    highScoresOrderedListElement.className += "padding-v30";
    var scores = highScores.getScores();
    console.log(scores);

    for (var i = 0; i < scores.length; i++){
        var highScoreListElement = document.createElement("li");
        highScoreListElement.textContent = scores[i][1] + "   " + scores[i][0]
        highScoreListElement.className += "highscore-list";
        highScoresOrderedListElement.appendChild(highScoreListElement);
    }

    var highScoresButtonDiv = document.createElement("div");
    var playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play Again";

    var clearHighscoresButton = document.createElement("button");
    clearHighscoresButton.textContent = "Clear Highscores";

    playAgainButton.className += "quiz-button";
    clearHighscoresButton.className += "quiz-button";

    highScoresButtonDiv.appendChild(playAgainButton);
    highScoresButtonDiv.appendChild(clearHighscoresButton);

    mainContainer.appendChild(highScoresOrderedListElement);
    mainContainer.appendChild(highScoresButtonDiv);
}

// renders footer message below main container when user selects an answer
function renderFooterMessage(message){
    belowMainContainerEl.innerHTML = "";

    var hrEl = document.createElement("hr");
    var footerMessageEl = document.createElement("p");
    footerMessageEl.textContent = message;

    belowMainContainerEl.appendChild(hrEl);
    belowMainContainerEl.appendChild(footerMessageEl);

    clearTimeout(footerTimer);
    footerTimer = setTimeout(function(){belowMainContainerEl.innerHTML = "";}, 1000);
}

// starts timer in top right corner
function startTimer(){
    var timerInterval = setInterval(function() {
        secondsLeft--;
        timerEl.textContent = secondsLeft;
    
        if(secondsLeft <= 0 || gameOver) {
          clearInterval(timerInterval);
          endQuiz();
        }
      }, 1000);
}

// resets game data when starting over
function resetValues(){
    secondsLeft = 75;
    quizQuestionIndex = 0;
    gameOver = false;
}

var highScores = {
    scores: [],

    getScores(){
        var retval = JSON.parse(localStorage.getItem("highScores"));
        if (retval === null){
            this.scores = [];
        }
        else{
            this.scores = retval;
        }
        return this.scores;
    },

    addScore(score, name){
        this.getScores();
        this.scores.push([score, name]);
        this.scores.sort(this.sortFunction);
        localStorage.setItem("highScores", JSON.stringify(this.scores));
    },
    clearScores(){
        this.scores = [];
        localStorage.setItem("highScores", [JSON.stringify(this.scores)]);
    },
    sortFunction(a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] > b[0]) ? -1 : 1;
        }
      }
}

function QuizQuestion(question, answers){
    this.question = question;
    this.answers = answers;
}

function Answer(text, isCorrect) {
    this.text = text;
    this.isCorrect = isCorrect;
}

const question1 = "Commonly used data types DO NOT include:";
const answer11 = new Answer("strings", false);
const answer12 = new Answer("booleans", false);
const answer13 = new Answer("alerts", true);
const answer14 = new Answer("numbers", false);
const answers1 = [answer11, answer12, answer13, answer14];
const quizQuestion1 = new QuizQuestion(question1, answers1);

const question2 = "The condition in an if / else statement is enclosed within ______.";
const answer21 = new Answer("quotes", false);
const answer22 = new Answer("curly braces", false);
const answer23 = new Answer("parenthesis", true);
const answer24 = new Answer("square brackets", false);
const answers2 = [answer21, answer22, answer23, answer24];
const quizQuestion2 = new QuizQuestion(question2, answers2);

const question3 = "Arrays in JavaScipt can be used to store ______.";
const answer31 = new Answer("numbers and strings", false);
const answer32 = new Answer("other arrays", false);
const answer33 = new Answer("booleans", false);
const answer34 = new Answer("all of the above", true);
const answers3 = [answer31, answer32, answer33, answer34];
const quizQuestion3 = new QuizQuestion(question3, answers3);

const question4 = "String values must be enclosed within ______ when being assigned to variables.";
const answer41 = new Answer("commas", false);
const answer42 = new Answer("curly braces", false);
const answer43 = new Answer("quotes", true);
const answer44 = new Answer("parenthesis", false);
const answers4 = [answer41, answer42, answer43, answer44];
const quizQuestion4 = new QuizQuestion(question4, answers4);

const question5 = "A very useful tool used during development and debugging for printing content to the debugger is:";
const answer51 = new Answer("JavaScript", false);
const answer52 = new Answer("terminal/bash", false);
const answer53 = new Answer("for loops", false);
const answer54 = new Answer("console log", true);
const answers5 = [answer51, answer52, answer53, answer54];
const quizQuestion5 = new QuizQuestion(question5, answers5);

const quizQuestions = [quizQuestion1, quizQuestion2, quizQuestion3, quizQuestion4, quizQuestion5];
