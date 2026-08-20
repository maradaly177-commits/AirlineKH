import { createContext } from "react";

export const ChatContext = createContext(null);

export const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Xin chào! Mình là trợ lý AI của SkyLink. Bạn muốn bay đi đâu?",
  flights: [],
  quickReplies: [
    { label: "Hà Nội → Sài Gòn", payload: "Tìm vé từ Hà Nội đi Sài Gòn ngày mai" },
    { label: "Hà Nội → Đà Nẵng", payload: "Tìm vé từ Hà Nội đi Đà Nẵng ngày mai" },
    { label: "Vé rẻ cuối tuần", payload: "Gợi ý vé rẻ cuối tuần này" },
  ],
  createdAt: Date.now(),
};

export const initialChatState = {
  isOpen: false,
  conversationId: null,
  messages: [WELCOME_MESSAGE],
  status: "idle", // idle | sending | error
  error: null,
};

export function chatReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "SET_STATUS":
      return { ...state, status: action.status, error: action.error ?? null };
    case "SET_CONVERSATION":
      return { ...state, conversationId: action.conversationId };
    case "RESET":
      return {
        ...initialChatState,
        isOpen: state.isOpen,
        messages: [{ ...WELCOME_MESSAGE, createdAt: Date.now() }],
      };
    default:
      return state;
  }
}
