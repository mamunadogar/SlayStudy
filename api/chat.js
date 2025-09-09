// pages/api/chat.js (Next.js API Route)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // req.body se message lo (req.json() nahi)
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // OpenAI API request
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    // OpenAI se response
    const data = await response.json();

    // Error handling
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "OpenAI API Error" });
    }

    // Success: return content
    return res.status(200).json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server Error" });
  }
}
