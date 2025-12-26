"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "chat_history";

export const ChatWrapper = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMessages(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages, isLoaded]);

  async function handleSend(e: any) {
    e?.preventDefault();
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

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "AI cannot answer",
          id: Date.now() + 1,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Server error. Try later.",
          id: Date.now() + 1,
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-[70vw] mx-auto px-4 py-6 flex flex-col gap-4">
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

        <form
          onSubmit={handleSend}
          className="sticky bottom-0 pt-2 pb-4  bg-blue-50"
        >
          <textarea
            className="w-full resize-none border border-gray-200 bg-blue-50 rounded-lg px-3 py-2 shadow-sm h-32"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text to shorten..."
          />

          <button
            type="submit"
            className="mt-2 w-full py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
