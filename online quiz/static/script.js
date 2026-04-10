document.addEventListener("DOMContentLoaded", function () {
  const questionBlocks = document.querySelectorAll(".question-block");
  const radios = document.querySelectorAll("input[type=radio]");
  const progressText = document.getElementById("progress-text");
  const progressFill = document.getElementById("progress-fill");
  const timerDisplay = document.getElementById("timer-display");
  const quizForm = document.querySelector(".quiz-form");

  if (!progressText || !progressFill || questionBlocks.length === 0) {
    return;
  }

  const totalQuestions = questionBlocks.length;

  const updateProgress = () => {
    const answeredQuestions = new Set(
      Array.from(radios)
        .filter((radio) => radio.checked)
        .map((radio) => radio.name)
    ).size;

    const percent = Math.round((answeredQuestions / totalQuestions) * 100);
    progressText.textContent = `${answeredQuestions} / ${totalQuestions} answered`;
    progressFill.style.width = `${percent}%`;
  };

  // Timer functionality
  let timeLeft = 15 * 60; // 15 minutes in seconds

  const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 0) {
      // Time's up - auto-submit the form
      quizForm.submit();
    } else {
      timeLeft--;
      setTimeout(updateTimer, 1000);
    }
  };

  // Start the timer
  updateTimer();

  radios.forEach((radio) => {
    radio.addEventListener("change", updateProgress);
  });

  updateProgress();
});
