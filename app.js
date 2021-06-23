const introContainer = document.getElementById('intro');
const startButton = document.getElementById('start-btn');
const demoSubmitButton = document.getElementById('demo-submit-btn');
const quizSubmitButton = document.getElementById('quiz-submit-btn');
const demographicsContainer = document.getElementById('demographics')
const demoQContainer = document.getElementById('demoQuestions');
const quizContainer = document.getElementById('quiz');
const quizQContainer = document.getElementById('quizQuestions');
const resultsContainer = document.getElementById('results');
const plotContainer = document.getElementById('pl1');
const conclusionContainer = document.getElementById('conclusion')

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
  introContainer.style.display = "none";
  demographicsContainer.style.visibility = "visible";

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

  demoQContainer.innerHTML = output.join('');
  demoSubmitButton.style.visibility = "visible";
}

function submitDemos(){
  const answerContainers = demoQContainer.querySelectorAll('.answers');
  const userResponses = [];

  demoQuestions.forEach( (currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=demo${questionNumber}]:checked`;
    const userResponse = (answerContainer.querySelector(selector) || {}).value;
    userResponses.push({axis: currentQuestion.axis,  answer: userResponse})
  }
  )
  demographicsContainer.style.display = "none";
  return userResponses;
}

function buildQuiz(){
  const output = [];

  // shuffle questions randomly and assign standard answer set to each
  shuffleArray(quizQuestions);
  quiz.style.visibility = "visible";
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
  quizQContainer.innerHTML = output.join('');
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
  return userResponses;
}

function mapResponses(userResponses){
  const LRCoords = [];
  const ALCoords = [];

  userResponses.forEach((currentResponse, responseNumber) => {
    if (currentResponse.axis === "LR" && currentResponse.answer && currentResponse.answer.length != 0) {
      LRCoords.push({
        x: -1*answerWeights[currentResponse.answer][0], //-1 b.c. Left/Right flipped vs. axis
        y: 0,
        r: 3
      })

      LRCoords.push({
        x: answerWeights[currentResponse.answer][1],
        y: 0,
        r: 3
      })
    }
    else if (currentResponse.axis === "AL" && currentResponse.answer && currentResponse.answer.length != 0) {
      ALCoords.push({
        x: 0,
        y: answerWeights[currentResponse.answer][0],
        r: 3
      })
      ALCoords.push({
        x: 0,
        y: -1*answerWeights[currentResponse.answer][1],
        r: 3
      })
    }
  });

  return {
    "LRCoords": LRCoords,
    "ALCoords": ALCoords
  }
}

function computeStats(points){
  const xCum = [];
  const yCum = [];

  numPoints = points.LRCoords.length + points.ALCoords.length

  points.LRCoords.forEach((currentPoint, i) => {
    xCum.push(currentPoint.x)
  });
  points.ALCoords.forEach((currentPoint, i) => {
    yCum.push(currentPoint.y)
  });

  const xCumSum = xCum.reduce((a, b) => a + b, 0);
  const yCumSum = yCum.reduce((a, b) => a + b, 0);
  const xAvg = xCumSum/numPoints;
  const yAvg = yCumSum/numPoints;

  return [{x: xAvg, y: yAvg, r: 10}];
}

function displayResults(responsePoints, avgPoints){
  resultsContainer.style.visibility = "visible";
  conclusionContainer.style.visibility = "visible";

  const plot1 = new Chart(plotContainer, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Left / Right',
        data: responsePoints.LRCoords,
        backgroundColor: 'rgb(187,134,252)'
      },
      {
        label: 'Authoritarian / Libertarian',
        data: responsePoints.ALCoords,
        backgroundColor: 'rgb(129,133,236)'
      },
      {
        label: 'Average',
        data: avgPoints,
        backgroundColor: 'rgb(191,69,151)'
      }
    ]
    },
    options: {
        scales: {
            x: {
              title: {
                display: true,
                text: 'Left / Right',
                color: 'rgb(187,134,252)',
              },
              beginAtZero: false,
              min: -1,
              max: 1,
              grid: {
                drawTicks: true,
                color: (context) => { return context.tick.value === 0 ? "#000000" : "#1e1e1e" }
              },
              scaleShowLabels: false
            },
            y: {
              title: {
                display: true,
                text: 'Authoritarian / Libertarian',
                color: 'rgb(129,133,236)',
              },
              beginAtZero: false,
              min: -1,
              max: 1,
              grid: {
                drawTicks: true,
                color: (context) => { return context.tick.value === 0 ? "#000000" : "#1e1e1e" }
              },
              scaleShowLabels: false
            }
        },
        plugins: {
          title: {
            display: true,
            text: 'Left/Right '+'& '+'Authoritarian/Libertarian'+' Alignment'
          }
        },
        borderWidth: 2,
        maintainAspectRatio: false,
        responsive: true,
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
  const responseCoords = mapResponses(quizResponses);
  console.log(responseCoords)
  const avgCoords = computeStats(responseCoords);
  console.log(responseCoords)
  displayResults(responseCoords, avgCoords);
});
