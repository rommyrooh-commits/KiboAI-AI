// =====================================================
// KiboAI-AI - Main JavaScript
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // ELEMENTS
    // -----------------------------

    const newChatButton = document.getElementById("newChat");
    const menuButton = document.getElementById("menu");

    // -----------------------------
    // NEW CHAT
    // -----------------------------

    if (newChatButton) {
        newChatButton.addEventListener("click", () => {
            startNewChat();
        });
    }

    function startNewChat() {
        const input = document.getElementById("userInput");
        const response = document.getElementById("response");

        if (input) {
            input.value = "";
            input.focus();
        }

        if (response) {
            response.innerHTML = "";
            response.style.display = "none";
        }

        console.log("KiboAI: New chat started.");
    }


    // -----------------------------
    // MOBILE MENU
    // -----------------------------

    if (menuButton) {
        menuButton.addEventListener("click", () => {
            const sidebar = document.querySelector(".sidebar");

            if (sidebar) {
                sidebar.classList.toggle("open");
            }
        });
    }


    // -----------------------------
    // SIDEBAR NAVIGATION
    // -----------------------------

    const navigationLinks = document.querySelectorAll(".sidebar a");

    navigationLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const href = link.getAttribute("href");

            // Ignore links that don't have a real destination
            if (!href || href === "#") {
                event.preventDefault();
            }

            // Remove active state
            navigationLinks.forEach((item) => {
                item.classList.remove("active");
            });

            // Add active state
            link.classList.add("active");

            // Close mobile sidebar
            const sidebar = document.querySelector(".sidebar");

            if (sidebar) {
                sidebar.classList.remove("open");
            }
        });

    });


    // -----------------------------
    // SIMPLE KIBOAI RESPONSE
    // -----------------------------

    window.askKiboAI = function () {

        const input = document.getElementById("userInput");
        const response = document.getElementById("response");

        if (!input || !response) {
            console.warn("Chat input or response element was not found.");
            return;
        }

        const question = input.value.trim();

        if (question === "") {

            response.style.display = "block";
            response.innerHTML =
                "<p>Please type a question first.</p>";

            return;
        }

        response.style.display = "block";

        response.innerHTML =
            "<p><strong>You:</strong> " +
            escapeHTML(question) +
            "</p>" +
            "<p><strong>KiboAI:</strong> " +
            "I received your message. Real AI connection will be added next. 🤖</p>";

        input.value = "";
    };


    // -----------------------------
    // SECURITY HELPER
    // -----------------------------

    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    // -----------------------------
    // ENTER KEY SUPPORT
    // -----------------------------

    const userInput = document.getElementById("userInput");

    if (userInput) {

        userInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter" && !event.shiftKey) {

                event.preventDefault();

                if (typeof window.askKiboAI === "function") {
                    window.askKiboAI();
                }

            }

        });

    }


    // -----------------------------
    // INITIAL MESSAGE
    // -----------------------------

    console.log("KiboAI-AI loaded successfully 🚀");

});
