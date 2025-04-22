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
    The only difference from json is before the [ for the questions are put ~ and after the end of questions array ] put ~ 
    I want mostly options questions.
    I want enough questions to actually learn so give as much as you think is good.`;

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

  const response = await  getGroqResponse(prompt.replace("{r}", syntaxPrompt).replace("{m}", text));

    const start = response.indexOf("~");
    const end = response.indexOf("~", start + 1);
  
    let rawQuestions = response;

    if (start !== -1 && end !== -1 && end > start) {
      rawQuestions = response.substring(start + 1, end);
    }
  
    localStorage.setItem("questions", rawQuestions);
    window.location.href = (window.location.href + "personal/index.html").replace("index.html/", "");
}

function onPromptTypeChanged(event){
  promptType = parseInt(event.target.value);
}

document.getElementById("inputDropdown")?.addEventListener("change", onPromptTypeChanged);

const textarea = document.getElementById("subject");
textarea?.addEventListener("input", () => autoResize(textarea));

document.getElementById("continue")?.addEventListener("click", submitText);
