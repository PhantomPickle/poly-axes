const startButton = document.getElementById('start-btn')
const demoSubmitButton = document.getElementById('demo-submit-btn')
const quizSubmitButton = document.getElementById('quiz-submit-btn');
const demoContainer = document.getElementById('demos')
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const plotContainer = document.getElementById('pl1')

const demoQuestions = [
  {
    "questionText": "What is your age?",
    "answers": {
      a: "0-18",
      b: "19-25",
      c: "26-35",
      d: "36-50",
      e: "51-65",
      f: "65+"
    }
  },
  {
    "questionText": "What is your gender identity?",
    "answers": {
      a: "man",
      b: "woman",
      c: "other"
    }
  }
]

const quizQuestions = [
  {
    "axis": "LR",
    "questionText": "Traditional values should be preserved"
  },
  {
    "axis": "LR",
    "questionText": "The nuclear family composed of two parents and their children is best for society"
  },
  {
    "axis": "LR",
    "questionText": "Marriage should be between a man and a woman"
  },
  {
    "axis": "AL",
    "questionText": "The government should have the authority to levy taxes to fund various aspects of its function"
  },
  {
    "axis": "AL",
    "questionText": "The government should be able to restrict what you put into your body"
  },
  {
    "axis": "AL",
    "questionText": "The government should be able to restrict what kind of weapons you can own"
  },
  {
    "axis": "PI",
    "questionText": "Your vote in a general election should be based more on who would govern competently than on who most aligns with you ideologically"
  },
  {
    "axis": "PI",
    "questionText": "Your vote in a party primary should be based more on who is likely to win the general election than on who most aligns with you ideologically"
  },
  {
    "axis": "PI",
    "questionText": "When faced with two bad choices, you should choose the lesser of the evils"
  },
  {
    "axis": "PE",
    "questionText": "Politicians should spend time among common folk"
  },
  {
    "axis": "PE",
    "questionText": "Listening to ordinary people is important for governing justly"
  },
  {
    "axis": "AL",
    "questionText": "Some groups of people are better suited to deciding what's best for society"
  }
]

const quizAnswers = {
  a: "Strongly Agree",
  b: "Somewhat Agree",
  c: "Neither Agree nor Disagree",
  d: "Both Agree and Disagree",
  e: "Somewhat Disagree",
  f: "Strongly Disagree",
  g: "Unsure or N/A"
}

const answerWeights = {
  a: [1.0,0.0],
  b: [.5,0.0],
  c: [0.0,0.0],
  d: [.25,.25],
  e: [0.0,0.5],
  f: [0.0,1.0],
  g: NaN
}

function shuffleArray(array){
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function displayDemos(){
  const output = [];
  startButton.style.display = "none";

  output.push(`<h2> Demographic Questions </h2>`)
  demoQuestions.forEach((currentQuestion, questionNumber) => {
    const answers = [];
    for(letter in currentQuestion.answers){
      answers.push(
        `<label>
        <input type="radio" name="demo${questionNumber}" value=${letter}>
        ${currentQuestion.answers[letter]}
        </label>`
      );
    }
    output.push(
      `<div class="question"> ${currentQuestion.questionText} </div>
      <div class="answers"> ${answers.join('')} </div> <br>`
    );
  });

  demoContainer.innerHTML = output.join('');
  demoSubmitButton.style.visibility = "visible";
}

function submitDemos(){
  const answerContainers = demoContainer.querySelectorAll('.answers');
  const userResponses = [];
  demoQuestions.forEach( (currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=demo${questionNumber}]:checked`;
    const userResponse = (answerContainer.querySelector(selector) || {}).value;
    userResponses.push({axis: currentQuestion.axis,  answer: userResponse})
  }
  )
  demoContainer.style.display = "none";
  demoSubmitButton.style.display = "none";
  return userResponses;
}

function buildQuiz(){
  const output = [];

  // shuffle questions randomly and assign standard answer set to each
  shuffleArray(quizQuestions);
  quizSubmitButton.style.visibility = "visible";
  quizQuestions.forEach(q => q['answers'] = quizAnswers)

  quizQuestions.forEach((currentQuestion, questionNumber) => {
    const answers = [];
    for(letter in currentQuestion.answers){
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label><br>`
        );
    }

    // add this question and its answers to the output
    output.push(
      `<div class="question"> ${questionNumber+1}. ${currentQuestion.questionText} </div>
      <div class="answers"> ${answers.join('')} </div> <br>`
    );
  }
  );

  // combine output list into one string of HTML and display on page
  quizContainer.innerHTML = output.join('');
}

function submitQuiz(){
  const answerContainers = quizContainer.querySelectorAll('.answers');
  const userResponses = [];
  quizQuestions.forEach( (currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userResponse = (answerContainer.querySelector(selector) || {}).value || NaN;
    userResponses.push({axis: currentQuestion.axis,  answer: userResponse})
  }
  )
  quizContainer.style.display = "none";
  quizSubmitButton.style.display = "none";
  return userResponses;
}

function computeAlignments(userResponses){
  const coords = [];
  userResponses.forEach((currentResponse, responseNumber) => {
    if (currentResponse.axis == "LR" && !isNaN(currentResponse.answer)) {
      console.log(answerWeights[currentResponse.answer][0])
      coords.push({
        x: answerWeights[currentResponse.answer][0],
        y: 0,
        r: 1
      })
      coords.push({
        x: -1*answerWeights[currentResponse.answer][1],
        y: 0,
        r: 1
      })

    }
    else if (currentResponse.axis == "LA" && !isNaN(currentResponse.answer)) {
      coords.push({
        x: 0,
        y: answerWeights[currentResponse.answer][0],
        r: 1
      })
      coords.push({
        x: 0,
        y: -1*answerWeights[currentResponse.answer][1],
        r: 1
      })
    }
  });

  return coords;
}

function displayResults(axisCoords){
  resultsContainer.style.visibility = "visible";
  const plot1 = new Chart(plotContainer, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Dataset 1',
        data: axisCoords,
        backgroundColor: 'rgb(255, 99, 132)'
      }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
  }
  )
}

startButton.addEventListener('click', displayDemos);

demoSubmitButton.addEventListener('click', () => {
  const demoResponses = submitDemos();
  buildQuiz();
});

quizSubmitButton.addEventListener('click', () => {
  const quizResponses = submitQuiz();
  const axisCoords = computeAlignments(quizResponses);
  displayResults();
});
