function createMultipleChoice(questionTitle, options) {
  const container = document.createElement("div");
  container.classList.add("question");

  const title = document.createElement("h1");

  title.textContent = questionTitle;
  container.appendChild(title);

  options.forEach((optionText, index) => {
    const label = document.createElement("label");

    const input = document.createElement("input");
    input.type = "radio"; 
    input.name = questionTitle;
    input.value = index;

    label.appendChild(input);
    label.appendChild(document.createTextNode(" " + optionText));
    
    container.appendChild(label);
    container.appendChild(document.createElement("br")); 
  });

  document.body.appendChild(container);
}

function checkAnswers(questions) {
  let rightCount = 0;
  
  questions.forEach((question) => {
    const radios = document.querySelectorAll('input[name="' + question.question + '"]');
    
    let selected = -1;

    radios.forEach((radio, radioIndex) => {
      if (radio.checked) {
        selected = radioIndex;
      }
    });

    if (radios.length > 0) {
      const container = radios[0].closest('.question');
      const h1 = container.querySelector('h1');

      if (selected !== -1) {
        if (selected === question.correct){
          h1.style.color = "green"
          rightCount += 1;
        }
        else{
          h1.style.color = "red"
        }

      } else {
        h1.style.color = "black"; 
      }
    }
  });

  document.getElementsByClassName("rightCounter")[0].textContent = `${rightCount}/${questions.length} Correct`;
}


function onLoad(){
  const rawQuestions = localStorage.getItem("questions");

  if (!rawQuestions) {
    console.error("No questions found in localStorage.");
    return;
  }

  let questions;
  try {
    questions = JSON.parse(rawQuestions);
  } catch (error) {
    console.error("Error parsing questions JSON:", error);
    return;
  }

  console.log(questions);

  for (let i = 0; i < questions.length; i++){
    const question = questions[i];
    createMultipleChoice(question.question, question.options);
  }

  const controlWrapper = document.createElement("div");
  controlWrapper.classList.add("controlWrapper"); 

  const checkButton = document.createElement("button");
  checkButton.classList.add("checkButton");
  checkButton.textContent = "Check";

  const rightCounter = document.createElement("p");
  rightCounter.classList.add("rightCounter");
  rightCounter.textContent = "";

  controlWrapper.appendChild(checkButton);
  controlWrapper.appendChild(rightCounter);

  document.body.appendChild(controlWrapper);

  checkButton.addEventListener("click", () => checkAnswers(questions));
}

document.addEventListener("DOMContentLoaded", onLoad);
