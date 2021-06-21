const startButton = document.getElementById('start-btn')
const demosContainer = document.getElementById('demos')
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const plotContainer = document.getElementById('plot')
const submitButton = document.getElementById('submit-btn');

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
  output.push(
  `<h1> Demographic Questions </h1>
  <p id="msg"> What is your age? </p>
  <label><input type="radio" name="demo1" value="19-25">19 - 25</label>
  <label><input type="radio" name="demo1" value="26-35">26 - 35</label>
  <label><input type="radio" name="demo1" value="36-50">36 - 50</label>
  <label><input type="radio" name="demo1" value="50-65">50 - 65</label>
  <label><input type="radio" name="demo1" value="65+">65+</label><br><br>`
  );
  demosContainer.innerHTML = output;
}

function submitDemos(){

}

function buildQuiz(){
  const output = [];

  // shuffle questions randomly
  shuffleArray(quizQuestions);
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

  // finally combine our output list into one string of HTML and put it on the page
  quizContainer.innerHTML = output.join('');
}

function collateAnswers(){
  const answerContainers = quizContainer.querySelectorAll('.answers');
  const userAnswers = [];
  quizQuestions.forEach( (currentQuestion, questionNumber) => {
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    userAnswers.push({axis: currentQuestion.axis,  answer: userAnswer})
  }
  )
  console.log(userAnswers);
}

function computeAlignments(){

}

function displayPlots(){
  Plotly.newPlot( plotContainer, [{
  	x: [1, 2, 3, 4, 5],
  	y: [1, 2, 4, 8, 16] }], {
  	margin: { t: 0 } } );
}

function runQuiz(){
  displayDemos();
  buildQuiz();
}
// display quiz right away

displayPlots();

startButton.addEventListener('click', displayDemos);
demoSubmitButton.addEventListener('click', submitDemos);
quizSubmitButton.addEventListener('click', collateAnswers);
