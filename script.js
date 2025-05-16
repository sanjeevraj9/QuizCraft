const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const questionBox = document.getElementById("question");
const choicesBox = document.getElementById("choices");
const scoreCard = document.getElementById("scoreCard");
const alertBox = document.querySelector(".alert");
const timer = document.getElementById("timer");
const startScreen = document.getElementById("start-screen");
const quizContainer = document.getElementById("quiz-container");

const originalQuiz = [
  {
    question: "Which of the following is not a CSS box model property?",
    choices: ["margin", "padding", "border-radius", "border-collapse"],
    answer: "border-collapse"
  },
  {
    question: "Which of the following is not a valid way to declare a function in JavaScript?",
    choices: [
      "function myFunction() {}",
      "let myFunction = function() {};",
      "myFunction: function() {}",
      "const myFunction = () => {};"
    ],
    answer: "myFunction: function() {}"
  },
  {
    question: "Which of the following is not a JavaScript data type?",
    choices: ["string", "boolean", "object", "float"],
    answer: "float"
  },
  {
    question: "What is the purpose of the this keyword in JavaScript?",
    choices: [
      "It refers to the current function.",
      "It refers to the current object.",
      "It refers to the parent object.",
      "It is used for comments."
    ],
    answer: "It refers to the current object."
  },
  {
    question: "Which language is primarily used for Android app development?",
    choices: ["Swift", "Java", "Python", "C#"],
    answer: "Java"
  },
  {
    question: "What does HTML stand for?",
    choices: ["HyperText Markup Language", "HyperText Makeup Language", "HyperTool Markup Language", "HyperTransfer Markup Language"],
    answer: "HyperText Markup Language"
  },
  {
    question: "Which data structure uses FIFO (First In First Out)?",
    choices: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue"
  },
  {
    question: "In databases, what does SQL stand for?",
    choices: ["Structured Query Language", "Simple Query Language", "Structured Question Language", "Simple Question Language"],
    answer: "Structured Query Language"
  },
  {
    question: "What is the time complexity of binary search on a sorted array?",
    choices: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: "O(log n)"
  }
];

let quiz = [];
let currentQuestionIndex = 0;
let score = 0;
let quizOver = false;
let timeLeft = 15;
let timerID = null;

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function resetState() {
  clearInterval(timerID);
  timeLeft = 15;
  timer.textContent = `Time: ${timeLeft}s`;
  timer.style.display = "block";
  alertBox.style.display = "none";
  nextBtn.disabled = true;
  nextBtn.textContent = "Next";
  scoreCard.textContent = "";
  choicesBox.innerHTML = "";
  questionBox.textContent = "";
  quizOver = false;
}

function startQuiz() {
  resetState();

  startScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");

  currentQuestionIndex = 0;
  score = 0;
  quizOver = false;

  // Clone and shuffle quiz
  quiz = shuffleArray(JSON.parse(JSON.stringify(originalQuiz)));
  quiz.forEach(q => q.choices = shuffleArray(q.choices));

  showQuestion();
  startTimer();
}

function showQuestion() {
  clearInterval(timerID);
  timeLeft = 15;
  timer.textContent = `Time: ${timeLeft}s`;
  startTimer();

  nextBtn.disabled = true;
  alertBox.style.display = "none";

  const current = quiz[currentQuestionIndex];
  questionBox.textContent = current.question;
  choicesBox.innerHTML = "";

  current.choices.forEach(choice => {
    const div = document.createElement("div");
    div.textContent = choice;
    div.classList.add("choice");
    div.style.pointerEvents = "auto";

    div.addEventListener("click", () => {
      if (!nextBtn.disabled) return;

      document.querySelectorAll(".choice").forEach(c => {
        c.classList.remove("selected", "correct", "wrong");
      });

      div.classList.add("selected");
      nextBtn.disabled = false;
      alertBox.style.display = "none";
    });

    choicesBox.appendChild(div);
  });
}

function checkAnswer() {
  const selected = document.querySelector(".choice.selected");
  if (!selected) {
    showAlert("Please select an answer.");
    return;
  }

  document.querySelectorAll(".choice").forEach(c => {
    c.style.pointerEvents = "none";
  });

  const correctAnswer = quiz[currentQuestionIndex].answer;
  const choices = document.querySelectorAll(".choice");

  if (selected.textContent === correctAnswer) {
    selected.classList.add("correct");
    score++;
    showAlert("Correct!", "success");
  } else {
    selected.classList.add("wrong");
    showAlert(`Wrong! Answer.`, "error");

    choices.forEach(choice => {
      if (choice.textContent === correctAnswer) {
        choice.classList.add("correct");
      }
    });
  }

  nextBtn.disabled = true;
  clearInterval(timerID);

  currentQuestionIndex++;

  if (currentQuestionIndex < quiz.length) {
    setTimeout(() => {
      showQuestion();
    }, 2500);
  } else {
    setTimeout(showScore, 2500);
  }
}

function showScore() {
  questionBox.textContent = "";
  choicesBox.innerHTML = "";
  scoreCard.textContent = `You scored ${score} out of ${quiz.length}`;
  nextBtn.textContent = "Play Again";
  quizOver = true;
  timer.style.display = "none";
  clearInterval(timerID);
  nextBtn.disabled = false;
}

function showAlert(message, type = "info") {
  alertBox.textContent = message;
  alertBox.style.display = "block";
  alertBox.style.backgroundColor =
    type === "success" ? "#28a745" :
    type === "error" ? "#dc3545" :
    "#17a2b8";

  if (message !== "Please select an answer.") {
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 2000);
  }
}

function startTimer() {
  timer.textContent = `Time: ${timeLeft}s`;
  clearInterval(timerID);
  timerID = setInterval(() => {
    timeLeft--;
    timer.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerID);
      showAlert("Time's up!", "error");

      document.querySelectorAll(".choice").forEach(c => {
        c.style.pointerEvents = "none";
      });

      nextBtn.disabled = true;

      currentQuestionIndex++;
      if (currentQuestionIndex < quiz.length) {
        setTimeout(showQuestion, 2500);
      } else {
        setTimeout(showScore, 2500);
      }
    }
  }, 1000);
}

// Event listeners
startBtn.addEventListener("click", startQuiz);

nextBtn.addEventListener("click", () => {
  if (quizOver) {
    startQuiz();
  } else {
    checkAnswer();
  }
});
