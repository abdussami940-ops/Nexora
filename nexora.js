
/* =========================================
   NEXORA — Website Functionality
   Search, Categories, Daily Facts & Quiz
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------------------
  // 1. FOOTER: CURRENT YEAR
  // -----------------------------------------

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // -----------------------------------------
  // 2. TOPIC SEARCH & CATEGORY FILTERS
  // -----------------------------------------

  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("siteSearch");
  const searchStatus = document.getElementById("searchStatus");
  const topicGrid = document.getElementById("topicGrid");
  const emptyState = document.getElementById("emptyState");

  const categoryButtons = document.querySelectorAll("[data-category]");
  const topicCards = topicGrid
    ? Array.from(topicGrid.querySelectorAll(".topic-card"))
    : [];

  let activeCategory = "all";
  let searchTerm = "";

  function filterTopics() {
    let visibleCount = 0;

    topicCards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent || "";
      const description = card.querySelector("p")?.textContent || "";
      const cardText = `${title} ${description}`.toLowerCase();

      const cardCategory = (
        card.dataset.category ||
        card.getAttribute("data-category") ||
        ""
      ).toLowerCase();

      const matchesSearch = cardText.includes(searchTerm);

      const matchesCategory =
        activeCategory === "all" ||
        cardCategory === activeCategory;

      const isVisible = matchesSearch && matchesCategory;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    if (searchStatus) {
      if (searchTerm || activeCategory !== "all") {
        searchStatus.textContent =
          `${visibleCount} topic${visibleCount === 1 ? "" : "s"} found`;
      } else {
        searchStatus.textContent = "";
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value.trim().toLowerCase();
      filterTopics();
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();

      searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

      filterTopics();

      if (topicGrid) {
        topicGrid.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = (
        button.dataset.category || "all"
      ).toLowerCase();

      categoryButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      filterTopics();
    });
  });

  // -----------------------------------------
  // 3. DAILY KNOWLEDGE FACTS
  // -----------------------------------------

  const factNumber = document.getElementById("factNumber");
  const factTitle = document.getElementById("factTitle");
  const factText = document.getElementById("factText");
  const newFactButton = document.getElementById("newFactButton");

  const facts = [
    {
      title: "AI learns patterns from data",
      text: "Artificial intelligence systems can identify patterns in examples and use those patterns to make predictions. Their results depend on the data and methods used."
    },
    {
      title: "Light travels incredibly fast",
      text: "In a vacuum, light travels at approximately 299,792 kilometres per second. Sunlight takes about 8 minutes and 20 seconds to reach Earth."
    },
    {
      title: "Your brain is an information processor",
      text: "The human brain contains billions of neurons that communicate through electrical and chemical signals. These networks help support memory, learning and perception."
    },
    {
      title: "The internet and the web differ",
      text: "The internet is the global network connecting devices. The World Wide Web is one service that uses that network to access linked pages and resources."
    },
    {
      title: "Passwords need more than complexity",
      text: "Long, unique passwords are important for account security. A password manager and multifactor authentication can provide additional protection."
    },
    {
      title: "Space is full of galaxies",
      text: "Our Solar System is part of the Milky Way galaxy, which contains enormous numbers of stars, along with gas, dust and dark matter."
    },
    {
      title: "Sleep supports learning",
      text: "Sleep plays an important role in attention, memory and learning. Consistent sleep routines can help support everyday cognitive performance."
    },
    {
      title: "Water has unusual properties",
      text: "Water expands when it freezes under ordinary conditions, making ice less dense than liquid water. This is why ice floats."
    },
    {
      title: "Two-factor authentication adds protection",
      text: "Multifactor authentication asks for another form of verification in addition to a password, making stolen passwords less useful on their own."
    },
    {
      title: "The ocean shapes Earth's climate",
      text: "Oceans absorb and transport large amounts of heat, influencing weather patterns and Earth's climate."
    }
  ];

  let currentFactIndex = -1;

  function showFact(index) {
    if (!facts.length) return;

    currentFactIndex = (index + facts.length) % facts.length;

    const fact = facts[currentFactIndex];

    if (factNumber) {
      factNumber.textContent =
        `FACT ${String(currentFactIndex + 1).padStart(2, "0")} / ${String(facts.length).padStart(2, "0")}`;
    }

    if (factTitle) {
      factTitle.textContent = fact.title;
    }

    if (factText) {
      factText.textContent = fact.text;
    }
  }

  if (newFactButton) {
    newFactButton.addEventListener("click", () => {
      let nextIndex = currentFactIndex;

      if (facts.length > 1) {
        while (nextIndex === currentFactIndex) {
          nextIndex = Math.floor(Math.random() * facts.length);
        }
      } else {
        nextIndex = 0;
      }

      showFact(nextIndex);
    });
  }

  // Display the same featured fact throughout each calendar day.
  const today = new Date();
  const dayNumber = Math.floor(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ) / 86400000
  );

  showFact(dayNumber % facts.length);

  // -----------------------------------------
  // 4. INTERACTIVE KNOWLEDGE QUIZ
  // -----------------------------------------

  const quizContainer = document.getElementById("quizContainer");
  const quizProgress = document.getElementById("quizProgress");
  const quizProgressBar = document.getElementById("quizProgressBar");
  const quizProgressFill = document.getElementById("quizProgressFill");
  const quizQuestion = document.getElementById("quizQuestion");
  const quizAnswers = document.getElementById("quizAnswers");
  const quizFeedback = document.getElementById("quizFeedback");
  const quizScore = document.getElementById("quizScore");
  const quizNext = document.getElementById("quizNext");

  const questions = [
    {
      question: "What does CPU stand for?",
      answers: [
        "Central Processing Unit",
        "Computer Power Utility",
        "Central Program Upload",
        "Core Performance User"
      ],
      correct: 0,
      explanation: "The CPU executes instructions and performs essential calculations."
    },
    {
      question: "Which technology helps protect an account with an extra verification step?",
      answers: [
        "Screen brightness",
        "Multifactor authentication",
        "File compression",
        "Dark mode"
      ],
      correct: 1,
      explanation: "Multifactor authentication adds another layer of account protection."
    },
    {
      question: "Which planet is known as the Red Planet?",
      answers: [
        "Venus",
        "Jupiter",
        "Mars",
        "Mercury"
      ],
      correct: 2,
      explanation: "Iron-rich dust gives Mars much of its reddish appearance."
    },
    {
      question: "What is the main purpose of an algorithm?",
      answers: [
        "To make a screen brighter",
        "To store electricity",
        "To increase internet speed automatically",
        "To provide steps for solving a problem"
      ],
      correct: 3,
      explanation: "An algorithm is a sequence of steps for completing a task or solving a problem."
    },
    {
      question: "Which of these is a programming language?",
      answers: [
        "Python",
        "Wi-Fi",
        "Bluetooth",
        "HDMI"
      ],
      correct: 0,
      explanation: "Python is a programming language used for web development, automation, data science and AI."
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  let answerSelected = false;
  let quizFinished = false;

  function renderQuizQuestion() {
    if (
      !quizContainer ||
      !quizQuestion ||
      !quizAnswers ||
      !questions.length
    ) {
      return;
    }

    answerSelected = false;
    quizFinished = false;

    const question = questions[currentQuestionIndex];

    if (quizProgress) {
      quizProgress.textContent =
        `QUESTION ${currentQuestionIndex + 1} OF ${questions.length}`;
    }

    if (quizProgressFill) {
      quizProgressFill.style.width =
        `${(currentQuestionIndex / questions.length) * 100}%`;
    }

    if (quizProgressBar) {
      quizProgressBar.setAttribute("role", "progressbar");
      quizProgressBar.setAttribute("aria-valuemin", "0");
      quizProgressBar.setAttribute("aria-valuemax", String(questions.length));
      quizProgressBar.setAttribute("aria-valuenow", String(currentQuestionIndex));
    }

    quizQuestion.textContent = question.question;
    quizAnswers.replaceChildren();

    if (quizFeedback) {
      quizFeedback.textContent = "";
    }

    if (quizScore) {
      quizScore.textContent = `Score: ${score} / ${questions.length}`;
    }

    question.answers.forEach((answer, answerIndex) => {
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = answer;
      button.className = "quiz-answer";
      button.addEventListener("click", () => {
        chooseAnswer(answerIndex, button);
      });

      quizAnswers.appendChild(button);
    });

    if (quizNext) {
      quizNext.hidden = true;
      quizNext.disabled = false;
      quizNext.textContent =
        currentQuestionIndex === questions.length - 1
          ? "See Results →"
          : "Next Question →";
    }
  }

  function chooseAnswer(answerIndex, selectedButton) {
    if (answerSelected || quizFinished) return;

    answerSelected = true;

    const question = questions[currentQuestionIndex];
    const answerButtons = quizAnswers.querySelectorAll("button");
    const isCorrect = answerIndex === question.correct;

    if (isCorrect) {
      score++;
    }

    answerButtons.forEach((button, index) => {
      button.disabled = true;

      if (index === question.correct) {
        button.classList.add("correct");
      }

      if (index === answerIndex && !isCorrect) {
        button.classList.add("incorrect");
      }
    });

    if (quizFeedback) {
      quizFeedback.textContent = isCorrect
        ? `✓ Correct! ${question.explanation}`
        : `Not quite. ${question.explanation}`;
    }

    if (quizScore) {
      quizScore.textContent = `Score: ${score} / ${questions.length}`;
    }

    if (quizNext) {
      quizNext.hidden = false;
    }
  }

  function showQuizResults() {
    quizFinished = true;

    const percentage = Math.round((score / questions.length) * 100);

    if (quizProgress) {
      quizProgress.textContent = "QUIZ COMPLETED";
    }

    if (quizProgressFill) {
      quizProgressFill.style.width = "100%";
    }

    if (quizProgressBar) {
      quizProgressBar.setAttribute("aria-valuenow", String(questions.length));
    }

    quizQuestion.textContent =
      percentage >= 80
        ? "Excellent work! 🏆"
        : percentage >= 60
          ? "Nice effort! 🎯"
          : "Keep exploring! 🚀";

    quizAnswers.replaceChildren();

    if (quizFeedback) {
      quizFeedback.textContent =
        percentage >= 80
          ? "You have a strong start. Keep learning new things."
          : "Every quiz is a chance to learn something new. Try again!";
    }

    if (quizScore) {
      quizScore.textContent =
        `Final score: ${score} / ${questions.length} (${percentage}%)`;
    }

    if (quizNext) {
      quizNext.hidden = false;
      quizNext.disabled = false;
      quizNext.textContent = "Try Again ↻";
    }
  }

  if (quizNext) {
    quizNext.addEventListener("click", () => {
      if (quizFinished) {
        currentQuestionIndex = 0;
        score = 0;
        renderQuizQuestion();
        return;
      }

      if (!answerSelected) return;

      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuizQuestion();
      } else {
        showQuizResults();
      }
    });
  }

  if (quizContainer && questions.length) {
    renderQuizQuestion();
  }

  // -----------------------------------------
  // 5. SMOOTH SCROLL FOR INTERNAL NAVIGATION
  // -----------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // -----------------------------------------
  // NEXORA INITIALIZED
  // -----------------------------------------

  console.log("NEXORA initialized successfully.");
});
