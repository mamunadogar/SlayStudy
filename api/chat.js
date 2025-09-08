export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = await req.json();

    // DEBUG: Check if API key is loaded (will print true/false)
    console.log("OPENAI_API_KEY loaded?", !!process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "API key not found. Did you redeploy?" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("OpenAI API error:", errData);
      return res.status(response.status).json({ error: errData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: error.message });
  }
}
