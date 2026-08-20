import api from "../api";
import { mockChat } from "./aiService.mock";

// Mặc định dùng mock cho tới khi Backend có endpoint /api/ai/chat.
// Tắt bằng VITE_USE_AI_MOCK=false trong client/.env
const USE_MOCK = import.meta.env.VITE_USE_AI_MOCK !== "false";

/**
 * Gửi câu hỏi của người dùng tới AI Core và nhận phản hồi.
 *
 * Response contract (thống nhất với Backend):
 * {
 *   conversation_id: string,
 *   reply: {
 *     type: "text" | "flight_cards" | "mixed",
 *     text: string,
 *     flights: Flight[],            // cùng shape với GET /api/flights
 *     quick_replies: { label, payload }[]
 *   }
 * }
 */
export async function sendChatMessage({ message, conversationId, context }) {
  if (USE_MOCK) return mockChat({ message, conversationId });

  const res = await api.post("/ai/chat", {
    message,
    conversation_id: conversationId,
    context,
  });
  return res.data;
}

/**
 * Bản streaming (SSE) — axios không đọc được stream nên dùng fetch.
 * onChunk nhận từng đoạn text để render dần, trả về payload cuối cùng nếu có.
 */
export async function streamChatMessage({ message, conversationId }, onChunk) {
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
  const token =
    localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

  const res = await fetch(`${baseURL}/ai/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Streaming thất bại (HTTP ${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}