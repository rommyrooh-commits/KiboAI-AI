const promptInput = document.getElementById("prompt");
const sendButton = document.getElementById("send");
const messages = document.getElementById("messages");
const newChatButton = document.getElementById("newChat");
const menuButton = document.getElementById("menu");
const sidebar = document.querySelector(".sidebar");
const greetingEl = document.getElementById("greeting");

// Settings
const settingsModal = document.getElementById("settingsModal");
const openSettingsBtn = document.getElementById("openSettings");
const closeSettingsBtn = document.getElementById("closeSettings");
const saveSettingsBtn = document.getElementById("saveSettings");
const apiKeyInput = document.getElementById("apiKeyInput");
const modelInput = document.getElementById("modelInput");

// Defaults (Groq is free + extremely fast)
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Load saved key
let apiKey = localStorage.getItem("kibo_api_key") || "";
let model = localStorage.getItem("kibo_model") || DEFAULT_MODEL;

apiKeyInput.value = apiKey;
modelInput.value = model;

/* Dynamic greeting */
function setGreeting() {
  const hour = new Date().getHours();
  let text = "Good evening 👋";
  if (hour < 12) text = "Good morning 👋";
  else if (hour < 17) text = "Good afternoon 👋";
  greetingEl.textContent = text;
}
setGreeting();

/* Helpers */
function addMessage(content, type, isHTML = false) {
  const message = document.createElement("div");
  message.className = `bubble ${type}`;
  if (isHTML) message.innerHTML = content;
  else message.textContent = content;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
}

function showThinking() {
  return addMessage("KiboAI is thinking… 🤔", "ai thinking");
}

/* Real AI call */
async function callAI(userMessage) {
  if (!apiKey) {
    return "⚠️ No API key set. Click **Settings** (bottom left) and paste a free Groq key from console.groq.com";
  }

  const systemPrompt = `You are KiboAI, a friendly and practical AI assistant built for students, job seekers and creators in Africa and beyond.
You help with:
- Writing professional CVs and cover letters
- Explaining study topics simply
- Rewriting / improving text
- Generating useful ideas
- General productivity advice

Keep answers clear, structured and encouraging. Use short paragraphs and bullet points when helpful.`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error(err);
    return `Sorry, something went wrong: ${err.message}. Check your API key and try again.`;
  }
}

/* Send message */
async function sendMessage() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  addMessage(prompt, "user");
  promptInput.value = "";
  sendButton.disabled = true;

  const thinking = showThinking();

  const reply = await callAI(prompt);

  thinking.remove();
  addMessage(reply, "ai");
  sendButton.disabled = false;
  promptInput.focus();
}

sendButton.addEventListener("click", sendMessage);
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

/* Suggestion buttons */
document.querySelectorAll("[data-prompt]").forEach(btn => {
  btn.addEventListener("click", () => {
    promptInput.value = btn.dataset.prompt;
    promptInput.focus();
  });
});

/* New chat */
newChatButton.addEventListener("click", () => {
  messages.innerHTML = `
    <div class="bubble ai">
      <b>New conversation started. 🤖</b><br>
      What would you like to work on?
    </div>`;
  promptInput.value = "";
  promptInput.focus();
});

/* Mobile menu */
menuButton.addEventListener("click", () => sidebar.classList.toggle("open"));

document.querySelectorAll(".sidebar a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 900) sidebar.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (window.innerWidth <= 900 &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !menuButton.contains(e.target)) {
    sidebar.classList.remove("open");
  }
});

/* Settings modal */
openSettingsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  settingsModal.classList.remove("hidden");
  apiKeyInput.focus();
});

closeSettingsBtn.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

saveSettingsBtn.addEventListener("click", () => {
  apiKey = apiKeyInput.value.trim();
  model = modelInput.value.trim() || DEFAULT_MODEL;

  localStorage.setItem("kibo_api_key", apiKey);
  localStorage.setItem("kibo_model", model);

  settingsModal.classList.add("hidden");
  addMessage("✅ Settings saved. You can now chat with real AI!", "ai");
});
