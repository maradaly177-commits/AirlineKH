import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function MessageList({ messages, isSending, onQuickReply, onSelectFlight }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 bg-gradient-to-b from-zinc-50 to-zinc-100/50">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onQuickReply={onQuickReply}
          onSelectFlight={onSelectFlight}
          disabled={isSending}
        />
      ))}

      {isSending && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
