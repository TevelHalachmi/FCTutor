let promptType = 0;

const explanationPrompt = 
`I will send you the subject that I want to learn. 
{r}
Subject: {m}`;

const summaryPrompt = 
`I will send you a summary of a subject. 
{r}
Summary: {m}`;

const syntaxPrompt = `I want you to turn it into a kahoot like quiz.
    give me questions with 4 answers for each or a question true or false. 
    I want these to help me study on the subject.
    I am using this for an app so I will give a special syntax for writing these.
    I want you to treat this like a json object of a dictionary. I need a question array, each question has of the following fields:
    give options array(should be 4) and give index of correct answer.
    here are the names for the fields: question string: question, answers array: options, correct answer index: correct.
    The only difference from json is before the [ for the questions are put ~ and after the end of questions array ] put ~
    I want {n} questions, mostly option questions.
    Answer in the language of the subject.`;

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

async function getGroqResponse(message) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

async function submitText() {
  const text = document.getElementById("subject").value;
  if (text === ""){
    alert("Prompt field is empty.");
    return;
  }

  const numQuestions = document.getElementById("numQuestions").valueAsNumber;

  let prompt = "";
  switch (promptType){
    case 0:
      prompt = explanationPrompt;
      break;
    case 1:
      prompt = summaryPrompt;
      break
    default:
      throw new Error("Invalid prompt type: " + promptType);
  }

  const message = prompt.replace("{r}", syntaxPrompt)
    .replace("{m}", text)
    .replace("{n}", numQuestions);
    
  const response = await getGroqResponse(message);
  const start = response.indexOf("~");
  const end = response.indexOf("~", start + 1);
  
  let rawQuestions = response;

  if (start !== -1 && end !== -1 && end > start) {
    rawQuestions = response.substring(start + 1, end);
  }
  rawQuestions = await tryFixSyntaxErrors(rawQuestions);
  if (rawQuestions == null){
    alert("Error occured generating questions.")
    return;
  }
  
  localStorage.setItem("questions", rawQuestions);
  window.location.href = (window.location.href + "personal/index.html").replace("index.html/", "");
}

async function tryFixSyntaxErrors(json){
  console.warn("Got syntax errors trying to fix them.");
  try {
    JSON.parse(json);
    return json;
  }
  catch {
    const respone = await getGroqResponse("Fix syntax errors in my json file: " + json);
    const match = respone.match(/\[.*\]/s); 
    const result = match ? match[0] : null;   
    return result;
  }
}

function onPromptTypeChanged(event){
  promptType = parseInt(event.target.value);
}

function onNumQuestionsChanged(event) {
  const input = event.target;
  let value = input.valueAsNumber;

  const min = parseInt(input.min, 10);
  const max = parseInt(input.max, 10);

  if (value < min) 
  {
    value = min;
  }
  if (value > max) 
  {
    value = max;
  }
  input.value = value;
}


document.getElementById("inputDropdown")?.addEventListener("change", onPromptTypeChanged);
document.getElementById("numQuestions")?.addEventListener("change", onNumQuestionsChanged);


const textarea = document.getElementById("subject");
textarea?.addEventListener("input", () => autoResize(textarea));

document.getElementById("continue")?.addEventListener("click", submitText);
