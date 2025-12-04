import { ChatInput } from "@/widgets/chat/chat-input";
import { ChatOutput } from "@/widgets/chat/chat-output";

export default function HomePage() {
  return (
    <div className="w-full bg-blue-50 h-screen py-3 px-5">
      <ChatOutput />
      <ChatInput />
    </div>
  );
}
