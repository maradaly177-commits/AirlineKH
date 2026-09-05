import { createContext } from "react";

export const ChatContext =
  createContext(null);

export const WELCOME_MESSAGE = {
  id: "welcome",

  role: "assistant",

  text:
    "Xin chào! Mình là trợ lý AI của SkyLink. Bạn muốn bay đi đâu?",

  flights: [],

  quickReplies: [
    {
      label: "✈️ Tìm chuyến bay HN → DN",
      payload: "Tìm chuyến bay từ Hà Nội đi Đà Nẵng",
    },
    {
      label: "🧳 Quy định hành lý",
      payload: "Mức hành lý kí gửi miễn phí là bao nhiêu?",
    },
    {
      label: "🎫 Tra cứu mã đặt chỗ",
      payload: "Tôi muốn kiểm tra thông tin mã đặt chỗ",
    },
  ],

  createdAt:
    Date.now(),
};

export const initialChatState = {

  isOpen: false,

  conversationId: null,

  messages: [
    WELCOME_MESSAGE,
  ],

  status: "idle",

  streamStatus: "",

  error: null,
};

export function chatReducer(
  state,
  action
) {

  switch (action.type) {

    case "TOGGLE":

      return {
        ...state,
        isOpen:
          !state.isOpen,
      };

    case "OPEN":

      return {
        ...state,
        isOpen: true,
      };

    case "CLOSE":

      return {
        ...state,
        isOpen: false,
      };

    case "ADD_MESSAGE":

      return {
        ...state,

        messages: [
          ...state.messages,
          action.message,
        ],
      };

    /**
     * Edit a message and truncate subsequent replies
     */
    case "EDIT_MESSAGE": {
      const targetIndex = state.messages.findIndex(m => m.id === action.messageId);
      if (targetIndex === -1) return state;
      const updatedMessages = state.messages.slice(0, targetIndex + 1);
      updatedMessages[targetIndex] = {
        ...updatedMessages[targetIndex],
        text: action.newText,
        images: action.images !== undefined ? action.images : updatedMessages[targetIndex].images,
        updatedAt: Date.now(),
      };
      return {
        ...state,
        messages: updatedMessages,
      };
    }

    /**
     * Update an existing message.
     */
    case "UPDATE_MESSAGE":

      return {
        ...state,

        messages:
          state.messages.map(
            (message) =>
              message.id ===
                action.messageId
                ? {
                  ...message,
                  ...action.patch,
                }
                : message
          ),
      };

    case "SET_STATUS":

      return {
        ...state,

        status:
          action.status,

        error:
          action.error ??
          null,
      };

    /**
     * Text displayed while AI
     * is thinking/searching.
     */
    case "SET_STREAM_STATUS":

      return {
        ...state,

        streamStatus:
          action.message || "",
      };

    case "SET_CONVERSATION":

      return {
        ...state,

        conversationId:
          action.conversationId,
      };

    case "RESET":

      return {
        ...initialChatState,

        isOpen:
          state.isOpen,

        messages: [
          {
            ...WELCOME_MESSAGE,

            createdAt:
              Date.now(),
          },
        ],
      };

    default:

      return state;
  }
}