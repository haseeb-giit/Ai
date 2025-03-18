// DOM elements
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("userInput");

// Add an event listener to send a message on pressing "Enter"
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

// Function to split text into different parts
function splitMessage(text) {
    return [{ type: "text", content: text }];
}

// Send Message Function
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user message
    addMessage(message, "user-message");

    // Clear the input field
    userInput.value = "";

    try {
        const apiKey = "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"; // OpenRouter API key
        const url = "https://openrouter.ai/api/v1/chat/completions"; // Base URL for OpenRouter API

        // Fetch API call
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}` // Properly set Authorization header
            },
            body: JSON.stringify({
                model: "gpt-4", // Specify the AI model (example: GPT-4)
                messages: [{ role: "user", content: message }],
                stream: true // Enable streaming if required
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "No response received from the AI.";

        // Show AI response
        showAIResponse(aiResponse, "ai-response");
    } catch (error) {
        console.error("Error:", error);
        addMessage("❌ Error: Unable to connect to OpenRouter API.", "ai-response");
    }
}

// Add simple user message
function addMessage(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-bubble ${className}`;
    messageDiv.textContent = text;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to show AI response
function showAIResponse(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-bubble ${className}`;
    chatWindow.appendChild(messageDiv);

    const parts = splitMessage(text);
    for (const part of parts) {
        if (part.type === "code") {
            const codeBlock = document.createElement("pre");
            const codeElement = document.createElement("code");
            codeElement.textContent = part.content.trim();
            codeBlock.appendChild(codeElement);

            // Syntax highlighting (requires Highlight.js library)
            hljs.highlightElement(codeElement);
            messageDiv.appendChild(codeBlock);
        } else {
            messageDiv.textContent = part.content;
        }
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
