const revealTargets = document.querySelectorAll(".hero, .section, .announcement-bar");
const sliderRange = document.querySelector("[data-slider-range]");
const sliderAfter = document.querySelector("[data-slider-after]");
const quiz = document.getElementById("smile-quiz");
const quizSteps = quiz ? Array.from(quiz.querySelectorAll(".quiz-step")) : [];
const quizResult = document.getElementById("quiz-result");
const quizReset = document.getElementById("quiz-reset");
const bookingForm = document.getElementById("booking-form");
const formMessage = document.getElementById("form-message");
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotResponse = document.getElementById("chatbot-response");
const chatbotChips = document.querySelectorAll(".chatbot-chip");

revealTargets.forEach((element) => element.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

if (sliderRange && sliderAfter) {
  const syncSlider = () => {
    sliderAfter.style.width = `${sliderRange.value}%`;
  };

  sliderRange.addEventListener("input", syncSlider);
  syncSlider();
}

if (quiz) {
  const answers = [];

  const showStep = (stepIndex) => {
    quizSteps.forEach((step, index) => {
      step.classList.toggle("is-active", index === stepIndex);
    });
  };

  quiz.addEventListener("click", (event) => {
    const answerButton = event.target.closest("[data-answer]");
    if (!answerButton) return;

    answers.push(answerButton.dataset.answer);

    if (answers.length < 2) {
      showStep(1);
      return;
    }

    let recommendation = "A private premium consultation is the best next step to understand your options clearly.";

    if (answers.includes("pain")) {
      recommendation = "You appear to need an urgent pain-relief visit. Position this patient for a same-day appointment with quick diagnosis and calm, gentle care.";
    } else if (answers.includes("replace")) {
      recommendation = "You appear to be a strong candidate for an implant or restorative consultation focused on function, appearance, and long-term confidence.";
    } else if (answers.includes("confidence")) {
      recommendation = "You appear to be a strong candidate for smile design, whitening, or cosmetic refinement to improve brightness, balance, and confidence.";
    }

    if (answers.includes("urgent")) {
      recommendation += " Priority scheduling should be offered immediately.";
    } else if (answers.includes("planning")) {
      recommendation += " A consultation with treatment roadmap and pricing clarity will convert this patient better than a hard sell.";
    }

    quizResult.textContent = recommendation;
    showStep(2);
  });

  if (quizReset) {
    quizReset.addEventListener("click", () => {
      answers.length = 0;
      quizResult.textContent = "Answer the quick questions to get a tailored recommendation.";
      showStep(0);
    });
  }
}

if (bookingForm && formMessage) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const name = formData.get("name");
    formMessage.textContent = `Thank you, ${name}. Your request has been received. The clinic team can now confirm your appointment by call or WhatsApp.`;
    bookingForm.reset();
  });
}

if (chatbotToggle && chatbotPanel) {
  const setChatState = (open) => {
    chatbotPanel.classList.toggle("is-open", open);
    chatbotPanel.setAttribute("aria-hidden", String(!open));
    chatbotToggle.setAttribute("aria-expanded", String(open));
  };

  chatbotToggle.addEventListener("click", () => {
    const nextOpen = !chatbotPanel.classList.contains("is-open");
    setChatState(nextOpen);
  });

  if (chatbotClose) {
    chatbotClose.addEventListener("click", () => setChatState(false));
  }

  chatbotChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const label = chip.textContent.trim();
      let response = "A private consultation helps answer this clearly and move you to the right treatment plan.";

      if (label.includes("hurt")) {
        response = "Most nervous patients ask this first. The clinic positioning emphasizes gentle care, pain-aware dentistry, and clear communication so treatment feels calmer and more predictable.";
      } else if (label.includes("time")) {
        response = "Treatment timing depends on the issue, but premium patients respond well when given a clear roadmap, expected visits, and what can be accelerated.";
      } else if (label.includes("same-day")) {
        response = "Yes. Same-day emergency and urgent appointments can be highlighted for pain, swelling, or broken teeth to convert high-intent visitors quickly.";
      }

      chatbotResponse.textContent = response;
    });
  });
}
