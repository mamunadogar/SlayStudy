// chat.js

async function sendMessage(message) {
  try {
    // Hugging Face GPT2 model endpoint
    const res = await fetch("https://api-inference.huggingface.co/models/openai-community/gpt2", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_HUGGINGFACE_API_KEY", // apni Hugging Face API key
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Something went wrong");

    const aiMessage = data[0]?.generated_text || "Sorry, I couldn't generate a response.";

    // Chat box me message add karna
    const chatMessages = document.getElementById("chatMessages");

    const userMsgHTML = `
      <div class="message user-message">
        <div class="message-avatar">🧑</div>
        <div class="message-content"><p>${message}</p></div>
      </div>`;

    const aiMsgHTML = `
      <div class="message ai-message">
        <div class="message-avatar">🤖</div>
        <div class="message-content"><p>${aiMessage}</p></div>
      </div>`;

    chatMessages.innerHTML += userMsgHTML + aiMsgHTML;
    chatMessages.scrollTop = chatMessages.scrollHeight; // scroll to bottom

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// Button click event
document.getElementById("sendMessage").addEventListener("click", () => {
  const input = document.getElementById("chatInput");
  if (input.value.trim() === "") return;
  sendMessage(input.value);
  input.value = ""; // clear input
});

// Enter key se bhi send ho
document.getElementById("chatInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("sendMessage").click();
  }
});
