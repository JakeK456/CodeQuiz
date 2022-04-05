var mainContainer = document.querySelector(".main-container");
var startButton = document.querySelector(".start-button");
var timerEl = document.querySelector(".timer");

var secondsLeft = 75;
var quizQuestionIndex = 0;
var gameOver = false;

const WRONG_ANSWER_DEDUCTION = 20;

startButton.addEventListener("click", function () {
    resetValues();
    //endQuiz();
    startTimer();
    renderQuizQuestion(quizQuestions[quizQuestionIndex]);
});

function resetValues(){
    secondsLeft = 75;
    quizQuestionIndex = 0;
    gameOver = false;
}

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

function endQuiz(){
    mainContainer.innerHTML = "";

    // change header to question prompt
    var headerPromptElement = document.createElement("h1");
    headerPromptElement.textContent = "All Done!";
    mainContainer.appendChild(headerPromptElement);

    var headerPromptElement = document.createElement("p");
    headerPromptElement.textContent = "Your score is: " + secondsLeft + ".";
    mainContainer.appendChild(headerPromptElement);

    var intialsPrompt = document.createElement("span");
    intialsPrompt.textContent = "Enter initials:";
    mainContainer.appendChild(intialsPrompt);

    var initialsInput = document.createElement("input");
    mainContainer.appendChild(initialsInput);

    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.dataset.isInitialsSubmit = true;
    mainContainer.appendChild(submitButton);

}

function renderQuizQuestion(quizQuestion){
    mainContainer.innerHTML = "";

    if (quizQuestionIndex >= quizQuestions.length){
        gameOver = true;
        return;
    }

    // change header to question prompt
    var questionPromptElement = document.createElement("h1");
    questionPromptElement.textContent = quizQuestion.question;
    mainContainer.appendChild(questionPromptElement);

    var answersOrderedListElement = document.createElement("ol");

    // make a list of answers
    for (var i = 0; i < quizQuestion.answers.length; i++){
        
        var answer = quizQuestion.answers[i].text;
        var answerListElement = document.createElement("li");
        var answerButtonElement = document.createElement("button");

        answerButtonElement.textContent = answer;
        answerButtonElement.dataset.isCorrect = quizQuestion.answers[i].isCorrect;

        answerListElement.appendChild(answerButtonElement);
        answersOrderedListElement.appendChild(answerListElement);
    }

    mainContainer.appendChild(answersOrderedListElement);
} 

function renderHighscores(){
    mainContainer.innerHTML = "";
    
    var headerPromptElement = document.createElement("h1");
    headerPromptElement.textContent = "Highscores";
    mainContainer.appendChild(headerPromptElement);

    var highScoresOrderedListElement = document.createElement("ol");
    var scores = highScores.getScores();
    console.log(scores);

    for (var i = 0; i < scores.length; i++){
        var highScoreListElement = document.createElement("li");
        highScoreListElement.textContent = scores[i][1] + "   " + scores[i][0]
        highScoresOrderedListElement.appendChild(highScoreListElement);
    }

    mainContainer.appendChild(highScoresOrderedListElement);

}

mainContainer.addEventListener("click", function(event){
    var target = event.target;
 
    if (target.dataset.isCorrect === "true"){
        console.log("correct!");
        quizQuestionIndex++;
        renderQuizQuestion(quizQuestions[quizQuestionIndex]);
    }
    if (target.dataset.isCorrect === "false"){
        console.log("Incorrect!");
        secondsLeft = secondsLeft - WRONG_ANSWER_DEDUCTION;
        quizQuestionIndex++;
        renderQuizQuestion(quizQuestions[quizQuestionIndex]);
    }
    if (target.dataset.isInitialsSubmit === "true"){
        var initials = target.previousElementSibling.value;
        highScores.addScore(secondsLeft, initials);
        renderHighscores();
    }
});

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
