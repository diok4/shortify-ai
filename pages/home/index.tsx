import { ChatInput } from "@/widgets/chat/chat-input";
import styles from "./index.module.css";
import { ChatOutput } from "@/widgets/chat/chat-output";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <ChatOutput />
      <ChatInput />
    </div>
  );
}
