let currentQuestion = 0;
let questions;
let corrects = 0;

function displayQuestion(index){
  document.getElementById("optionsContainer").style.display = "grid"
  document.getElementById("answerContainer").style.display = "none"

  const question = questions[index];

  document.getElementById("title").innerHTML = `${currentQuestion + 1}/${questions.length}<br>${question.question}`;

  document.getElementById("btn1").textContent = question.options[0];
  document.getElementById("btn2").textContent = question.options[1];
  document.getElementById("btn3").textContent = question.options[2];
  document.getElementById("btn4").textContent = question.options[3];
}

function answerQuestion(index){
  let question = questions[currentQuestion];

  document.getElementById("optionsContainer").style.display = "none"
  document.getElementById("answerContainer").style.display = "block"

  document.getElementById("guessed").textContent = "Your answer: " + question.options[index];
  document.getElementById("correct").textContent = "Correct answer: " + question.options[question.correct];

  if (index == question.correct){
    corrects++;
  }
}

function continueToNext(){
    if (currentQuestion != questions.length - 1)
    {
      currentQuestion++;
      displayQuestion(currentQuestion);
    }
    else
    {
      document.getElementById("optionsContainer").style.display = "none"
      document.getElementById("answerContainer").style.display = "none"      
      document.getElementById("scoreContainer").style.display = "block"

      document.getElementById("title").textContent = "Final Score";
      document.getElementById("score").textContent = `${corrects}/${questions.length}`;
    }
}

function restart(){
  document.getElementById("scoreContainer").style.display = "none"
  corrects = 0;
  currentQuestion = 0;
  displayQuestion(0);
}

function onLoad(){
  const rawQuestions = localStorage.getItem("questions");

  if (!rawQuestions) {
    console.error("No questions found in localStorage.");
    return;
  }

  try {
    questions = JSON.parse(rawQuestions);
  } catch (error) {
    console.error("Error parsing questions JSON:", error);
    console.log(rawQuestions);
    return;
  }

  console.log(questions);

  document.getElementById("btn1").addEventListener("click", () => answerQuestion(0));
  document.getElementById("btn2").addEventListener("click", () => answerQuestion(1));
  document.getElementById("btn3").addEventListener("click", () => answerQuestion(2));
  document.getElementById("btn4").addEventListener("click", () => answerQuestion(3));

  document.getElementById("continue").addEventListener("click", continueToNext);  
  document.getElementById("restart").addEventListener("click", restart);

  restart();
}

document.addEventListener("DOMContentLoaded", onLoad);
