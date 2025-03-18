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

// Function to add user/AI message with support for formatted HTML and sanitization
function addMessage(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = chat-bubble ${className};
    const sanitizedText = DOMPurify.sanitize(text); // Sanitize for safety
    messageDiv.innerHTML = sanitizedText; // Render sanitized HTML
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to show AI response with code blocks and HTML tables
async function showAIResponse(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = chat-bubble ${className};
    chatWindow.appendChild(messageDiv);

    const parts = splitMessage(text);

    for (const part of parts) {
        if (part.type === "code") {
            const codeBlock = document.createElement("pre");
            codeBlock.className = "code-block";
            const codeElement = document.createElement("code");
            codeElement.textContent = part.content.trim();
            codeBlock.appendChild(codeElement);
            messageDiv.appendChild(codeBlock);
        } else {
            const sanitizedContent = DOMPurify.sanitize(part.content); // Sanitize HTML content
            messageDiv.innerHTML += sanitizedContent;
        }
    }

    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Typing effect for text display
async function typeText(text, container) {
    const span = document.createElement("span");
    container.appendChild(span);

    for (let i = 0; i < text.length; i++) {
        span.innerHTML += text[i];
        chatWindow.scrollTop = chatWindow.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 5)); // Fast typing effect
    }
}

// Split message into text, table, and code parts
function splitMessage(text) {
    const regex = /([\s\S]*?)/g;
    let result, lastIndex = 0;
    const parts = [];

    while ((result = regex.exec(text)) !== null) {
        if (result.index > lastIndex) {
            parts.push({ type: "text", content: text.substring(lastIndex, result.index) });
        }
        parts.push({ type: "code", content: result[1] }); // Code block
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push({ type: "text", content: text.substring(lastIndex) });
    }

    return parts;
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
