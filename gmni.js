const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("userInput");

// Send message on Enter key
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

// Send Message Function
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user message
    addMessage(message, 'user-message');

    // Clear input field
    userInput.value = "";

    // API call to Google Gemini AI
    try {
        const apiKey = "AIzaSyB2z-9qQW-ri59oMELf_bNrMcMRldadO84";
        const response = await fetch(https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: message }]
                }]
            })
        });

        if (!response.ok) throw new Error(Error: ${response.status});

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Show AI response properly
        await showAIResponse(aiResponse, 'ai-response');
    } catch (error) {
        console.error("Error:", error);
        addMessage("❌ Error: Unable to connect to the API.", 'ai-response');
    }
}

// Function to add user/AI message with proper formatting
function addMessage(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = chat-bubble ${className};

    // Convert Markdown to HTML (parse Markdown using marked.js)
    const formattedText = marked.parse(text);  // Use marked.js to parse Markdown into HTML

    messageDiv.innerHTML = formattedText; // Render the parsed HTML
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to show AI response with proper formatting
async function showAIResponse(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = chat-bubble ${className};
    chatWindow.appendChild(messageDiv);

    // Convert Markdown to HTML (parse Markdown using marked.js)
    const formattedText = marked.parse(text);  // Use marked.js to parse Markdown into HTML

    messageDiv.innerHTML = formattedText; // Render the parsed HTML
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Optional: Typing effect for text display (unchanged)
async function typeText(text, container) {
    const span = document.createElement("span");
    container.appendChild(span);

    for (let i = 0; i < text.length; i++) {
        span.innerHTML += text[i];
        chatWindow.scrollTop = chatWindow.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 5)); // Fast typing effect
    }
}

// Optional CSS Styling for better readability
const style = document.createElement("style");
style.innerHTML = `
.chat-bubble {
    margin: 5px;
    padding: 10px;
    border-radius: 10px;
    max-width: 80%;
    word-wrap: break-word;
}
.user-message {
    background-color: #d1e7dd;
    align-self: flex-end;
}
.ai-response {
    background-color: #f8d7da;
    align-self: flex-start;
}
.code-block {
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    font-family: monospace;
    overflow-x: auto;
    white-space: pre-wrap;
}
`;
document.head.appendChild(style);
