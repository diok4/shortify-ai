"use client";
import { useState } from "react";

export const ChatWrapper = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  async function handleSend(e: any) {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    const userMessage = text;
    setText("");

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage, id: Date.now() },
    ]);

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.reply, id: Date.now() + 1 },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "AI не смог ответить",
            id: Date.now() + 1,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Ошибка сервера. Попробуйте позже.",
          id: Date.now() + 1,
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl max-w-[75%] whitespace-pre-line ${
              msg.role === "user"
                ? "self-end bg-blue-600 text-white"
                : "self-start bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="p-3 rounded-xl bg-gray-300 text-gray-600 w-fit animate-pulse">
            AI is typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 mt-4">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your message..."
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};
