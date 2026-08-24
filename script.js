const promptInput = document.getElementById("prompt");
const sendButton = document.getElementById("send");
const messagesEl = document.getElementById("messages");
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

// CV
const generateCVBtn = document.getElementById("generateCV");
const cvResult = document.getElementById("cvResult");
const copyCVBtn = document.getElementById("copyCV");
const downloadCVBtn = document.getElementById("downloadCV");

// Config
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

let apiKey = localStorage.getItem("kibo_api_key") || "";
let model = localStorage.getItem("kibo_model") || DEFAULT_MODEL;
apiKeyInput.value = apiKey;
modelInput.value = model;

// Conversation history (for current chat)
let conversationHistory = [
  {
    role: "system",
    content: `You are KiboAI, a friendly, practical AI assistant for students, job seekers and creators.
You help with CVs, studying, writing, ideas and general advice.
Keep answers clear, structured and encouraging.`
  }
];

/* ========== GREETING ========== */
function setGreeting() {
  const hour = new Date().getHours();
  let text = "Good evening 👋";
  if (hour < 12) text = "Good morning 👋";
  else if (hour < 17) text = "Good afternoon 👋";
  greetingEl.textContent = text;
}
setGreeting();

/* ========== NAVIGATION ========== */
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    if (!page) return;

    // Update active state
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // Show page
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    const target = document.getElementById(`page-${page === "chat" ? "overview" : page}`);
    if (target) target.classList.remove("hidden");

    // Close mobile sidebar
    if (window.innerWidth <= 900) sidebar.classList.remove("open");
  });
});

/* ========== CHAT ========== */
function addMessage(content, type, isHTML = false) {
  const div = document.createElement("div");
  div.className = `bubble ${type}`;
  if (isHTML) div.innerHTML = content;
  else div.textContent = content;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

async function callAI(userMessage, extraSystem = null) {
  if (!apiKey) {
    return "⚠️ No API key set. Click Settings (bottom left) and paste a free key from console.groq.com";
  }

  // Add user message to history
  conversationHistory.push({ role: "user", content: userMessage });

  // Optional extra system instruction (for CV)
  const messagesToSend = extraSystem
    ? [...conversationHistory, { role: "system", content: extraSystem }]
    : conversationHistory;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messagesToSend,
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error ${res.status}`);
    }

    const data = await res.json();
    const reply = data.choices[0].message.content.trim();

    // Save AI reply to history
    conversationHistory.push({ role: "assistant", content: reply });

    return reply;
  } catch (err) {
    console.error(err);
    // Remove the failed user message from history
    conversationHistory.pop();
    return `Sorry, error: ${err.message}`;
  }
}

async function sendMessage() {
  const text = promptInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  promptInput.value = "";
  sendButton.disabled = true;

  const thinking = addMessage("KiboAI is thinking… 🤔", "ai thinking");

  const reply = await callAI(text);
  thinking.remove();
  addMessage(reply, "ai");

  sendButton.disabled = false;
  promptInput.focus();
}

sendButton.addEventListener("click", sendMessage);
promptInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

document.querySelectorAll("[data-prompt]").forEach(btn => {
  btn.addEventListener("click", () => {
    promptInput.value = btn.dataset.prompt;
    promptInput.focus();
  });
});

/* New Chat – clear history */
newChatButton.addEventListener("click", () => {
  conversationHistory = [
    {
      role: "system",
      content: `You are KiboAI, a friendly, practical AI assistant for students, job seekers and creators.
You help with CVs, studying, writing, ideas and general advice.
Keep answers clear, structured and encouraging.`
    }
  ];
  messagesEl.innerHTML = `
    <div class="bubble ai">
      <b>New conversation started. 🤖</b><br>
      What would you like to work on?
    </div>`;
  promptInput.value = "";
  promptInput.focus();
});

/* ========== CV BUILDER ========== */
generateCVBtn.addEventListener("click", async () => {
  const name = document.getElementById("cv-name").value.trim();
  const email = document.getElementById("cv-email").value.trim();
  const phone = document.getElementById("cv-phone").value.trim();
  const location = document.getElementById("cv-location").value.trim();
  const summary = document.getElementById("cv-summary").value.trim();
  const education = document.getElementById("cv-education").value.trim();
  const experience = document.getElementById("cv-experience").value.trim();
  const skills = document.getElementById("cv-skills").value.trim();
  const projects = document.getElementById("cv-projects").value.trim();

  if (!name || !email) {
    alert("Please fill at least Name and Email");
    return;
  }

  generateCVBtn.disabled = true;
  generateCVBtn.textContent = "Generating…";
  cvResult.textContent = "KiboAI is writing your professional CV…";

  const prompt = `Create a clean, professional CV using the following details.
Format it nicely with clear sections (use markdown-style headings).
Do not invent information. Only use what is provided.

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Location: ${location || "Not provided"}

Professional Summary:
${summary || "Not provided"}

Education:
${education || "Not provided"}

Work Experience:
${experience || "Not provided"}

Skills:
${skills || "Not provided"}

Projects / Certifications:
${projects || "Not provided"}

Make it look professional and ready to use.`;

  const reply = await callAI(prompt, "You are an expert CV writer. Create clear, modern, professional CVs.");
  
  cvResult.textContent = reply;
  generateCVBtn.disabled = false;
  generateCVBtn.textContent = "Generate Professional CV";
});

copyCVBtn.addEventListener("click", () => {
  const text = cvResult.textContent;
  navigator.clipboard.writeText(text).then(() => {
    copyCVBtn.textContent = "Copied!";
    setTimeout(() => copyCVBtn.textContent = "Copy", 1500);
  });
});

downloadCVBtn.addEventListener("click", () => {
  const text = cvResult.textContent;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "My_CV.txt";
  a.click();
  URL.revokeObjectURL(url);
});

/* ========== SETTINGS + MOBILE ========== */
openSettingsBtn.addEventListener("click", e => {
  e.preventDefault();
  settingsModal.classList.remove("hidden");
});
closeSettingsBtn.addEventListener("click", () => settingsModal.classList.add("hidden"));
saveSettingsBtn.addEventListener("click", () => {
  apiKey = apiKeyInput.value.trim();
  model = modelInput.value.trim() || DEFAULT_MODEL;
  localStorage.setItem("kibo_api_key", apiKey);
  localStorage.setItem("kibo_model", model);
  settingsModal.classList.add("hidden");
  addMessage("✅ Settings saved. You can now use real AI!", "ai");
});

menuButton.addEventListener("click", () => sidebar.classList.toggle("open"));

document.addEventListener("click", e => {
  if (window.innerWidth <= 900 &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !menuButton.contains(e.target)) {
    sidebar.classList.remove("open");
  }
});
