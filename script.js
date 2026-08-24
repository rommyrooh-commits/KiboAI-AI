const promptInput = document.getElementById("prompt");
const sendButton = document.getElementById("send");
const messages = document.getElementById("messages");
const newChatButton = document.getElementById("newChat");
const menuButton = document.getElementById("menu");
const sidebar = document.querySelector(".sidebar");

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `bubble ${type}`;
  message.textContent = text;

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

function getAIResponse(prompt) {
  const text = prompt.toLowerCase();

  if (text.includes("cv")) {
    return "Absolutely! 🤖 I can help you create a professional CV. Start by giving me your name, education, skills, experience and contact details.";
  }

  if (
    text.includes("network") ||
    text.includes("study") ||
    text.includes("exam")
  ) {
    return "Sure! 🎓 Tell me the topic you are studying and I will explain it in simple English, give you examples and create revision questions.";
  }

  if (
    text.includes("rewrite") ||
    text.includes("writing") ||
    text.includes("text")
  ) {
    return "Send me the text you want to improve ✍️. I can make it professional, clear, shorter or more convincing.";
  }

  if (
    text.includes("idea") ||
    text.includes("business") ||
    text.includes("website")
  ) {
    return "💡 Here's an idea: build a platform that connects students with AI study tools, CV creation, job opportunities and useful ICT resources.";
  }

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! 👋 I'm KiboAI. What would you like to work on today?";
  }

  return "I'm ready to help 🤖. Tell me more about what you're working on, and I'll guide you step-by-step.";
}

function sendMessage() {
  const prompt = promptInput.value.trim();

  if (!prompt) return;

  addMessage(prompt, "user");

  promptInput.value = "";

  const typing = document.createElement("div");
  typing.className = "bubble ai";
  typing.textContent = "KiboAI is thinking... 🤔";
  messages.appendChild(typing);

  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    typing.remove();

    const response = getAIResponse(prompt);
    addMessage(response, "ai");
  }, 700);
}

sendButton.addEventListener("click", sendMessage);

promptInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

/* Suggestion buttons */

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt;
    promptInput.focus();
  });
});

/* New chat */

newChatButton.addEventListener("click", () => {
  messages.innerHTML = `
    <div class="bubble ai">
      <b>New conversation started. 🤖</b><br>
      What would you like to work on?
    </div>
  `;

  promptInput.value = "";
  promptInput.focus();
});

/* Mobile menu */

menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

/* Close sidebar after selecting a menu item on mobile */

document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 900) {
      sidebar.classList.remove("open");
    }
  });
});
