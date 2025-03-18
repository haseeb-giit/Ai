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

        // Show AI response properly
        await showAIResponse(aiResponse, 'ai-response');

    } catch (error) {
        console.error("Error:", error);
        addMessage("❌ Error: Unable to connect to HSYB API.", 'ai-response');
    }
}

// Function to add simple user message (without typing effect)
function addMessage(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-bubble ${className}`;
    messageDiv.innerHTML = formatResponse(text);
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to show AI response
async function showAIResponse(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-bubble ${className}`;
    chatWindow.appendChild(messageDiv);
    messageDiv.innerHTML = formatResponse(text);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to format AI response like ChatGPT
function formatResponse(text) {
    text = text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;");

    // Headings
    text = text.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    text = text.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    text = text.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    // Bold, Italic, Underline
    text = text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    text = text.replace(/\*(.+?)\*/g, "<i>$1</i>");
    text = text.replace(/__(.+?)__/g, "<u>$1</u>");

    // Blockquote
    text = text.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

    // Unordered List
    text = text.replace(/^- (.+)$/gm, "<ul><li>$1</li></ul>");
    text = text.replace(/(<ul><li>.+<\/li><\/ul>)+/g, match => `<ul>${match.replace(/<\/ul><ul>/g, '')}</ul>`);

    // Ordered List
    text = text.replace(/^\d+\.\s(.+)$/gm, "<ol><li>$1</li></ol>");
    text = text.replace(/(<ol><li>.+<\/li><\/ol>)+/g, match => `<ol>${match.replace(/<\/ol><ol>/g, '')}</ol>`);

    // Code Blocks
    text = text.replace(/```([\s\S]*?)```/g, `<pre class="code-block"><code>$1</code></pre>`);

    // Inline Code
    text = text.replace(/`(.+?)`/g, `<code class="inline-code">$1</code>`);

    // Tables
    text = text.replace(/\|(.+)\|\n(\|[-:]+\|\n)?([\s\S]*?)\n/g, function (match, header, divider, rows) {
        let headers = header.split('|').map(h => `<th>${h.trim()}</th>`).join('');
        let bodyRows = rows.split('\n').map(row => `<tr>${row.split('|').map(cell => `<td>${cell.trim()}</td>`).join('')}</tr>`).join('');
        return `<table class="custom-table"><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    });

    return text.replace(/\n/g, '<br>');
}
