import AssistantAvatar from "./AssistantAvatar";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <AssistantAvatar size="sm" />
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-zinc-100 shadow-sm w-fit">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
