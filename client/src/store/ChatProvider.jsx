import { useMemo, useReducer } from "react";
import { ChatContext, chatReducer, initialChatState } from "./chatContext";

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
