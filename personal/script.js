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
    console.log(rawQuestions);
    return;
  }

  console.log(questions);
}

document.addEventListener("DOMContentLoaded", onLoad);
