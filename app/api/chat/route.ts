import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Ты — сервис сокращения текста. Твоя задача: брать длинные тексты и выдавать очень краткие, понятные и простые пересказы. Никаких лишних слов, только суть.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.2,
        }),
      }
    );
    console.log("🔵 RATE LIMIT HEADERS:");
    console.log(
      "Requests left (RPD):",
      groqRes.headers.get("x-ratelimit-remaining-requests")
    );
    console.log(
      "Tokens left (TPM):",
      groqRes.headers.get("x-ratelimit-remaining-tokens")
    );
    console.log(
      "Requests limit:",
      groqRes.headers.get("x-ratelimit-limit-requests")
    );
    console.log(
      "Tokens limit:",
      groqRes.headers.get("x-ratelimit-limit-tokens")
    );

    const data = await groqRes.json();
    console.log("🔵 RAW GROQ RESPONSE:", data);

    if (data.error) {
      return NextResponse.json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json({ error: "Empty reply" });
    }

    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    console.error("🔥 CHAT ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
