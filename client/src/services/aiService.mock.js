import api from "../api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const AIRPORT_KEYWORDS = {
  HAN: ["hà nội", "ha noi", "hanoi", "han"],
  SGN: ["sài gòn", "sai gon", "hồ chí minh", "ho chi minh", "tphcm", "sgn"],
  DAD: ["đà nẵng", "da nang", "dad"],
  CXR: ["nha trang", "cam ranh", "cxr"],
  PQC: ["phú quốc", "phu quoc", "pqc"],
};

function detectAirports(text) {
  const lower = text.toLowerCase();
  const hits = [];

  for (const [code, keywords] of Object.entries(AIRPORT_KEYWORDS)) {
    const position = keywords.reduce((best, keyword) => {
      const index = lower.indexOf(keyword);
      return index !== -1 && (best === -1 || index < best) ? index : best;
    }, -1);
    if (position !== -1) hits.push({ code, position });
  }

  hits.sort((a, b) => a.position - b.position);
  return { from: hits[0]?.code, to: hits[1]?.code };
}

function detectDate(text) {
  const lower = text.toLowerCase();
  const date = new Date();

  if (lower.includes("ngày mai") || lower.includes("mai")) date.setDate(date.getDate() + 1);
  else if (lower.includes("mốt")) date.setDate(date.getDate() + 2);
  else if (lower.includes("tuần sau")) date.setDate(date.getDate() + 7);
  else date.setDate(date.getDate() + 1);

  const explicit = lower.match(/(\d{1,2})[/-](\d{1,2})/);
  if (explicit) {
    date.setMonth(Number(explicit[2]) - 1);
    date.setDate(Number(explicit[1]));
  }

  return date.toISOString().slice(0, 10);
}

/**
 * Mock của AI Core: trích xuất điểm đi/đến/ngày bằng keyword rồi gọi API
 * /flights thật để trả về card chuyến bay. Dùng khi Backend AI chưa sẵn sàng
 * (bật bằng VITE_USE_AI_MOCK=true trong client/.env).
 */
export async function mockChat({ message, conversationId }) {
  await delay(900);

  const { from, to } = detectAirports(message);
  const date = detectDate(message);

  if (!from || !to) {
    return {
      conversation_id: conversationId ?? crypto.randomUUID(),
      reply: {
        type: "text",
        text: "Mình cần biết bạn bay từ đâu đến đâu. Ví dụ: \"Tìm vé từ Hà Nội đi Đà Nẵng ngày mai\".",
        flights: [],
        quick_replies: [
          { label: "Hà Nội → Sài Gòn", payload: "Tìm vé từ Hà Nội đi Sài Gòn ngày mai" },
          { label: "Sài Gòn → Đà Nẵng", payload: "Tìm vé từ Sài Gòn đi Đà Nẵng ngày mai" },
        ],
      },
    };
  }

  const res = await api.get("/flights", {
    params: { from, to, date, trip_type: "one_way" },
  });
  const flights = (res.data?.data ?? []).slice(0, 3);

  return {
    conversation_id: conversationId ?? crypto.randomUUID(),
    reply: {
      type: flights.length ? "mixed" : "text",
      text: flights.length
        ? `Mình tìm được ${flights.length} chuyến ${from} → ${to} ngày ${date}. Dưới đây là các lựa chọn tốt nhất:`
        : `Chưa có chuyến ${from} → ${to} ngày ${date}. Bạn thử ngày khác nhé.`,
      flights,
      quick_replies: [
        { label: "Giá rẻ nhất", payload: "sort:price_asc" },
        { label: "Bay sáng", payload: "filter:morning" },
        { label: "Xem tất cả", payload: `open:/flights?from=${from}&to=${to}&date=${date}` },
      ],
    },
  };
}