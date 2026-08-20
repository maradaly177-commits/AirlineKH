import { useCallback, useContext } from "react";
import { ChatContext } from "../store/chatContext";
import { sendChatMessage } from "../services/aiService";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

/**
 * Logic hội thoại với AI Core: gửi tin nhắn, quản lý trạng thái chờ và lỗi.
 */
export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat phải được dùng bên trong <ChatProvider>");
  }

  const { state, dispatch } = context;

  const sendMessage = useCallback(
    async (text) => {
      const content = text.trim();
      if (!content || state.status === "sending") return;

      dispatch({
        type: "ADD_MESSAGE",
        message: { id: newId(), role: "user", text: content, createdAt: Date.now() },
      });
      dispatch({ type: "SET_STATUS", status: "sending" });

      try {
        const data = await sendChatMessage({
          message: content,
          conversationId: state.conversationId,
        });

        if (data.conversation_id) {
          dispatch({ type: "SET_CONVERSATION", conversationId: data.conversation_id });
        }

        dispatch({
          type: "ADD_MESSAGE",
          message: {
            id: newId(),
            role: "assistant",
            text: data.reply?.text ?? "",
            flights: data.reply?.flights ?? [],
            quickReplies: data.reply?.quick_replies ?? [],
            createdAt: Date.now(),
          },
        });
        dispatch({ type: "SET_STATUS", status: "idle" });
      } catch (err) {
        const message =
          err.response?.data?.message ??
          "Không kết nối được trợ lý AI. Bạn thử lại giúp mình nhé.";

        dispatch({
          type: "ADD_MESSAGE",
          message: {
            id: newId(),
            role: "assistant",
            text: message,
            isError: true,
            retry: content,
            createdAt: Date.now(),
          },
        });
        dispatch({ type: "SET_STATUS", status: "error", error: message });
      }
    },
    [dispatch, state.conversationId, state.status]
  );

  return {
    messages: state.messages,
    status: state.status,
    error: state.error,
    isOpen: state.isOpen,
    sendMessage,
    toggle: useCallback(() => dispatch({ type: "TOGGLE" }), [dispatch]),
    close: useCallback(() => dispatch({ type: "CLOSE" }), [dispatch]),
    reset: useCallback(() => dispatch({ type: "RESET" }), [dispatch]),
  };
}