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
    <div className="min-h-screen w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-xl max-w-[75%] whitespace-pre-line border border-[#4c4c4d63] ${
                msg.role === "user"
                  ? "self-end bg-[#3b389d] text-white"
                  : "self-start bg-[#252525] text-gray-200"
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
          className="sticky bottom-0 pb-4 text-gray-200 backdrop-blur-sm bg-[#1a1a1a96]"
        >
          <textarea
            className="w-full resize-none border border-[#252525] text-gray-200 bg-[#1a1a1a] rounded-lg focus:outline-none focus:ring-0  px-3 py-2 shadow-sm h-32"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text to shorten..."
          />

          <button
            type="submit"
            className="mt-2 w-full py-2 bg-[#3b389d] text-white rounded-lg hover:bg-[#3f3bb3] cursor-pointer transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
