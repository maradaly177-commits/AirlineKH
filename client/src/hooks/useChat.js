import {
  useCallback,
  useContext,
  useRef,
} from "react";

import { ChatContext } from "../store/chatContext";

import {
  streamChatMessage,
} from "../services/aiService";

const newId = () =>
  typeof crypto !== "undefined" &&
    crypto.randomUUID
    ? crypto.randomUUID()
    : String(
      Date.now() +
      Math.random()
    );

export function useChat() {

  const context =
    useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat phải được dùng bên trong <ChatProvider>"
    );
  }

  const {
    state,
    dispatch,
  } = context;

  const abortControllerRef =
    useRef(null);

  const sendMessage =
    useCallback(
      async (text, images = []) => {

        const content =
          (text || "").trim();

        if (
          (!content && (!images || images.length === 0)) ||
          state.status === "sending"
        ) {
          return;
        }

        /**
         * Cancel previous request.
         */
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        const controller =
          new AbortController();

        abortControllerRef.current =
          controller;

        /**
         * Add user message.
         */
        dispatch({
          type: "ADD_MESSAGE",

          message: {
            id: newId(),

            role: "user",

            text: content,

            images: images || [],

            createdAt:
              Date.now(),
          },
        });

        /**
         * Create empty assistant message
         * immediately.
         */
        const assistantId =
          newId();

        dispatch({
          type: "ADD_MESSAGE",

          message: {
            id: assistantId,

            role: "assistant",

            text: "",

            flights: [],

            quickReplies: [],

            isStreaming: true,

            createdAt:
              Date.now(),
          },
        });

        dispatch({
          type: "SET_STATUS",

          status: "sending",
        });

        try {

          let fullText = "";

          let finalFlights = [];

          let finalQuickReplies = [];

          await streamChatMessage(
            {
              message: content,

              images: images || [],

              conversationId:
                state.conversationId,
            },

            (event) => {

              /**
               * Conversation ID
               */
              if (
                event.conversation_id
              ) {

                dispatch({
                  type:
                    "SET_CONVERSATION",

                  conversationId:
                    event.conversation_id,
                });
              }

              /**
               * Thinking / searching /
               * writing status.
               */
              if (
                event.type ===
                "status"
              ) {

                dispatch({
                  type:
                    "SET_STREAM_STATUS",

                  message:
                    event.message ||
                    "",
                });

                return;
              }

              /**
               * Tool execution.
               */
              if (
                event.type ===
                "tool"
              ) {

                dispatch({
                  type:
                    "SET_STREAM_STATUS",

                  message:
                    event.message ||
                    "Đang kiểm tra thông tin...",
                });

                return;
              }

              /**
               * TEXT CHUNK
               *
               * This is the important part.
               */
              if (
                event.type ===
                "chunk"
              ) {

                const chunk =
                  event.content || "";

                if (!chunk) {
                  return;
                }

                fullText += chunk;

                dispatch({
                  type:
                    "UPDATE_MESSAGE",

                  messageId:
                    assistantId,

                  patch: {
                    text:
                      fullText,

                    isStreaming:
                      true,
                  },
                });

                return;
              }

              /**
               * Final response.
               */
              if (
                event.type ===
                "done"
              ) {

                if (
                  event.message
                ) {

                  fullText =
                    event.message;
                }

                finalFlights =
                  event.flights ||
                  [];

                finalQuickReplies =
                  event.quick_replies ||
                  [];

                if (
                  event.conversation_id
                ) {

                  dispatch({
                    type:
                      "SET_CONVERSATION",

                    conversationId:
                      event.conversation_id,
                  });
                }

                dispatch({
                  type:
                    "UPDATE_MESSAGE",

                  messageId:
                    assistantId,

                  patch: {
                    text:
                      fullText,

                    flights:
                      finalFlights,

                    quickReplies:
                      finalQuickReplies,

                    isStreaming:
                      false,
                  },
                });

                return;
              }

              /**
               * Backend error event.
               */
              if (
                event.type ===
                "error"
              ) {

                throw new Error(
                  event.message ||
                  "AI Assistant error."
                );
              }
            },

            controller.signal
          );

          /**
           * Ensure streaming state is
           * removed.
           */
          dispatch({
            type:
              "UPDATE_MESSAGE",

            messageId:
              assistantId,

            patch: {
              text:
                fullText,

              flights:
                finalFlights,

              quickReplies:
                finalQuickReplies,

              isStreaming:
                false,
            },
          });

          dispatch({
            type:
              "SET_STATUS",

            status: "idle",
          });

        } catch (err) {

          if (
            err?.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "SkyAI streaming error:",
            err
          );

          const message =
            err?.message ||
            "Không kết nối được trợ lý AI. Bạn thử lại nhé.";

          dispatch({
            type:
              "UPDATE_MESSAGE",

            messageId:
              assistantId,

            patch: {
              text:
                message,

              isError:
                true,

              isStreaming:
                false,

              retry:
                content,
            },
          });

          dispatch({
            type:
              "SET_STATUS",

            status: "error",

            error:
              message,
          });
        } finally {

          abortControllerRef.current =
            null;
        }
      },

      [
        dispatch,
        state.conversationId,
        state.status,
      ]
    );

  const editMessage = useCallback(
    async (messageId, newText, images) => {
      const content = (newText || "").trim();
      if (!content && (!images || images.length === 0)) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      dispatch({
        type: "EDIT_MESSAGE",
        messageId,
        newText: content,
        images,
      });

      const assistantId = newId();
      dispatch({
        type: "ADD_MESSAGE",
        message: {
          id: assistantId,
          role: "assistant",
          text: "",
          flights: [],
          quickReplies: [],
          isStreaming: true,
          createdAt: Date.now(),
        },
      });

      dispatch({ type: "SET_STATUS", status: "sending" });

      try {
        let fullText = "";
        let finalFlights = [];
        let finalQuickReplies = [];

        await streamChatMessage(
          {
            message: content,
            images: images || [],
            conversationId: state.conversationId,
          },
          (event) => {
            if (event.conversation_id) {
              dispatch({ type: "SET_CONVERSATION", conversationId: event.conversation_id });
            }
            if (event.type === "status" || event.type === "tool") {
              dispatch({ type: "SET_STREAM_STATUS", message: event.message || "" });
              return;
            }
            if (event.type === "chunk") {
              const chunk = event.content || "";
              if (!chunk) return;
              fullText += chunk;
              dispatch({
                type: "UPDATE_MESSAGE",
                messageId: assistantId,
                patch: { text: fullText, isStreaming: true },
              });
              return;
            }
            if (event.type === "done") {
              if (event.message) fullText = event.message;
              finalFlights = event.flights || [];
              finalQuickReplies = event.quick_replies || [];
              dispatch({
                type: "UPDATE_MESSAGE",
                messageId: assistantId,
                patch: {
                  text: fullText,
                  flights: finalFlights,
                  quickReplies: finalQuickReplies,
                  isStreaming: false,
                },
              });
            }
          },
          controller.signal
        );

        dispatch({
          type: "UPDATE_MESSAGE",
          messageId: assistantId,
          patch: {
            text: fullText,
            flights: finalFlights,
            quickReplies: finalQuickReplies,
            isStreaming: false,
          },
        });
        dispatch({ type: "SET_STATUS", status: "idle" });
      } catch (err) {
        if (err?.name === "AbortError") return;
        const message = err?.message || "Không kết nối được trợ lý AI. Bạn thử lại nhé.";
        dispatch({
          type: "UPDATE_MESSAGE",
          messageId: assistantId,
          patch: { text: message, isError: true, isStreaming: false, retry: content },
        });
        dispatch({ type: "SET_STATUS", status: "error", error: message });
      } finally {
        abortControllerRef.current = null;
      }
    },
    [dispatch, state.conversationId]
  );

  const stop = useCallback(
    () => {

      if (
        abortControllerRef.current
      ) {

        abortControllerRef.current.abort();

        abortControllerRef.current =
          null;
      }

      dispatch({
        type:
          "SET_STATUS",

        status: "idle",
      });
    },

    [dispatch]
  );

  return {

    messages:
      state.messages,

    status:
      state.status,

    streamStatus:
      state.streamStatus,

    error:
      state.error,

    isOpen:
      state.isOpen,

    sendMessage,

    editMessage,

    stop,

    toggle:
      useCallback(
        () =>
          dispatch({
            type: "TOGGLE",
          }),
        [dispatch]
      ),

    close:
      useCallback(
        () =>
          dispatch({
            type: "CLOSE",
          }),
        [dispatch]
      ),

    reset:
      useCallback(
        () =>
          dispatch({
            type: "RESET",
          }),
        [dispatch]
      ),
  };
}