document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // GET HTML ELEMENTS
    // ==============================

    const promptInput = document.getElementById("prompt");
    const sendButton = document.getElementById("send");
    const messages = document.getElementById("messages");
    const newChatButton = document.getElementById("newChat");
    const menuButton = document.getElementById("menu");

    // ==============================
    // SEND MESSAGE
    // ==============================

    function sendMessage() {

        const text = promptInput.value.trim();

        if (text === "") {
            return;
        }

        // Add user's message
        addMessage(text, "user");

        // Clear input
        promptInput.value = "";

        // Temporary KiboAI response
        setTimeout(() => {

            const reply =
                "I received your message. 🤖 " +
                "I'm currently running in demo mode. " +
                "The real AI connection will be added next.";

            addMessage(reply, "ai");

        }, 700);
    }

    // ==============================
    // ADD MESSAGE TO CHAT
    // ==============================

    function addMessage(text, type) {

        const bubble = document.createElement("div");

        bubble.classList.add("bubble", type);

        const safeText = escapeHTML(text);

        if (type === "user") {

            bubble.innerHTML =
                "<b>You</b><br>" + safeText;

        } else {

            bubble.innerHTML =
                "<b>KiboAI 🤖</b><br>" + safeText;
        }

        messages.appendChild(bubble);

        // Automatically scroll down
        messages.scrollTop = messages.scrollHeight;
    }

    // ==============================
    // SEND BUTTON
    // ==============================

    if (sendButton) {

        sendButton.addEventListener("click", () => {
            sendMessage();
        });

    }

    // ==============================
    // ENTER KEY
    // ==============================

    if (promptInput) {

        promptInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();
            }

        });

    }

    // ==============================
    // SUGGESTION BUTTONS
    // ==============================

    const suggestionButtons =
        document.querySelectorAll("[data-prompt]");

    suggestionButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const text = button.getAttribute("data-prompt");

            promptInput.value = text;

            promptInput.focus();

        });

    });

    // ==============================
    // NEW CHAT
    // ==============================

    if (newChatButton) {

        newChatButton.addEventListener("click", () => {

            messages.innerHTML = `
                <div class="bubble ai">
                    <b>Hi! I'm KiboAI. 🤖</b><br>
                    Tell me what you're working on and I'll help you get it done.
                </div>
            `;

            promptInput.value = "";

            promptInput.focus();

        });

    }

    // ==============================
    // MOBILE MENU
    // ==============================

    if (menuButton) {

        menuButton.addEventListener("click", () => {

            const sidebar =
                document.querySelector(".sidebar");

            if (sidebar) {

                sidebar.classList.toggle("open");

            }

        });

    }

    // ==============================
    // SECURITY
    // ==============================

    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

    // ==============================
    // STARTUP MESSAGE
    // ==============================

    console.log("KiboAI-AI loaded successfully 🚀");

});
