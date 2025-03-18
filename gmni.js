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
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + apiKey, {
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

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Show AI response properly with formatting
        await showAIResponse(aiResponse, 'ai-response');

    } catch (error) {
        console.error("Error:", error);
        addMessage("❌ Error: Unable to connect to AI API.", 'ai-response');
    }
}

// Function to add simple user message (without typing effect)
function addMessage(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-bubble ${className}`;
    messageDiv.innerHTML = formatText(text);
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to show AI response with formatting + typing effect
async function showAIResponse(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-bubble ${className}`;
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
            await typeText(part.content, messageDiv);
        }
    }

    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Typing text effect
async function typeText(text, container) {
    const span = document.createElement("span");
    container.appendChild(span);

    for (let i = 0; i < text.length; i++) {
        span.innerHTML += text[i];
        chatWindow.scrollTop = chatWindow.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 5));
    }
}

// Split message into normal and code parts
function splitMessage(text) {
    const regex = /```([\s\S]*?)```/g;
    let result, lastIndex = 0;
    const parts = [];

    while ((result = regex.exec(text)) !== null) {
        if (result.index > lastIndex) {
            parts.push({ type: "text", content: text.substring(lastIndex, result.index) });
        }
        parts.push({ type: "code", content: result[1] });
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push({ type: "text", content: text.substring(lastIndex) });
    }

    return parts;
}

// Function to format text with all elements
// Function to format text with all elements
function formatText(text) {
    // Handle Tables FIRST to avoid breaking markdown structure
    text = text.replace(/\n\|(.+?)\|\n/g, function (match) {
        return createTable(match);
    });

    // Headings
    text = text.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    text = text.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    text = text.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    // Bold (**Bold Text**)
    text = text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

    // Italic (*Italic Text*)
    text = text.replace(/\*(.+?)\*/g, "<i>$1</i>");

    // Underline (__Underline Text__)
    text = text.replace(/__(.+?)__/g, "<u>$1</u>");

    // Blockquote ( > Quote )
    text = text.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

    // Unordered List (- Item)
    text = text.replace(/^- (.+)$/gm, "<li>$1</li>");
    text = text.replace(/(<li>.+<\/li>)/g, "<ul>$1</ul>");

    // Ordered List (1. Item)
    text = text.replace(/^\d+\.\s(.+)$/gm, "<li>$1</li>");
    text = text.replace(/(<li>.+<\/li>)/g, "<ol>$1</ol>");

    // Code Blocks (```Code```)
    text = text.replace(/```([\s\S]*?)```/g, `<pre class="code-block"><code>$1</code></pre>`);

    // Inline Code (`inline code`)
    text = text.replace(/`(.+?)`/g, `<code class="inline-code">$1</code>`);

    return text.replace(/\n/g, '<br>'); // Line breaks
}

// Function to create a proper table
function createTable(tableText) {
    let rows = tableText.trim().split("\n");
    let table = `<table class="custom-table">`;

    rows.forEach((row, index) => {
        let cells = row.split("|").map(cell => cell.trim()).filter(cell => cell !== "");
        table += index === 0 ? "<tr><th>" : "<tr><td>";
        table += cells.join(index === 0 ? "</th><th>" : "</td><td>");
        table += index === 0 ? "</th></tr>" : "</td></tr>";
    });

    table += "</table>";
    return table;
}

