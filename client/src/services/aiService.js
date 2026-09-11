import api from "../api";

/*
|--------------------------------------------------------------------------
| AI Configuration
|--------------------------------------------------------------------------
|
| true  -> dùng mock
| false -> dùng Laravel + Gemini
|
*/
const USE_MOCK =
  import.meta.env.VITE_USE_AI_MOCK === "true";


/*
|--------------------------------------------------------------------------
| Normal JSON Chat
|--------------------------------------------------------------------------
|
| POST /api/ai/chat
|
*/
export async function sendChatMessage({
  message,
  conversationId,
  context,
  images,
}) {

  if (USE_MOCK) {

    const { mockChat } =
      await import("./aiService.mock");

    return mockChat({
      message,
      conversationId,
    });
  }


  const response =
    await api.post(
      "/ai/chat",
      {
        message,

        conversation_id:
          conversationId,

        context,

        images,
      }
    );


  return response.data;
}


/*
|--------------------------------------------------------------------------
| REAL STREAMING CHAT
|--------------------------------------------------------------------------
|
| React
|   ↓
| Laravel
|   ↓
| Gemini
|   ↓
| SSE
|   ↓
| React
|
*/
export async function streamChatMessage(
  {
    message,
    conversationId,
    context,
    images,
  },
  onEvent,
  signal
) {

  /*
  |--------------------------------------------------------------------------
  | MOCK
  |--------------------------------------------------------------------------
  */

  if (USE_MOCK) {

    const { mockChat } =
      await import("./aiService.mock");


    const result =
      await mockChat({
        message,
        conversationId,
      });


    const text =
      result.reply?.text ??
      result.data?.message ??
      result.message ??
      "";


    /*
    |--------------------------------------------------------------------------
    | Simulate streaming
    |--------------------------------------------------------------------------
    */

    for (
      const chunk of splitText(
        text,
        8
      )
    ) {

      if (signal?.aborted) {

        throw new DOMException(
          "Aborted",
          "AbortError"
        );
      }


      onEvent({
        type: "chunk",

        content: chunk,
      });


      await sleep(20);
    }


    onEvent({

      type: "done",

      conversation_id:
        result.conversation_id ??
        result.data?.conversation_id,

      message: text,

      flights:
        result.reply?.flights ??
        result.data?.flights ??
        [],

      quick_replies:
        result.reply?.quick_replies ??
        result.data?.quick_replies ??
        [],
    });


    return;
  }


  /*
  |--------------------------------------------------------------------------
  | REAL API
  |--------------------------------------------------------------------------
  */

  const envBase = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
  const isProdHost = typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1");
  const baseURL = (isProdHost && envBase.includes("127.0.0.1")) ? "/api" : envBase;


  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  const token =
    localStorage.getItem(
      "access_token"
    ) ||
    sessionStorage.getItem(
      "access_token"
    );


  /*
  |--------------------------------------------------------------------------
  | Request
  |--------------------------------------------------------------------------
  */

  const response =
    await fetch(
      `${baseURL}/ai/chat/stream`,
      {
        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          Accept:
            "text/event-stream",

          ...(token
            ? {
              Authorization:
                `Bearer ${token}`,
            }
            : {}),
        },

        body:
          JSON.stringify({
            message,

            conversation_id:
              conversationId,

            context,

            images,
          }),

        signal,
      }
    );


  /*
  |--------------------------------------------------------------------------
  | HTTP Error
  |--------------------------------------------------------------------------
  */

  if (!response.ok) {
    try {
      // Tự động chuyển tiếp sang Normal JSON Chat nếu Streaming gặp sự cố
      const fallbackResult = await sendChatMessage({
        message,
        conversationId,
        context,
        images,
      });

      const text =
        fallbackResult.reply?.text ??
        fallbackResult.data?.message ??
        fallbackResult.message ??
        "";

      onEvent({
        type: "done",
        conversation_id:
          fallbackResult.conversation_id ??
          fallbackResult.data?.conversation_id,
        message: text,
        flights:
          fallbackResult.reply?.flights ??
          fallbackResult.data?.flights ??
          [],
        quick_replies:
          fallbackResult.reply?.quick_replies ??
          fallbackResult.data?.quick_replies ??
          [],
      });
      return;
    } catch {
      // Fallback không thành công, tiếp tục ném lỗi bên dưới
    }

    let errorMessage =
      `Streaming thất bại (HTTP ${response.status})`;

    try {
      const data =
        await response.json();

      if (data?.message) {
        errorMessage =
          data.message;
      }
    } catch {
      // Response không phải JSON
    }

    throw new Error(
      errorMessage
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Browser Streaming Support
  |--------------------------------------------------------------------------
  */

  if (!response.body) {

    throw new Error(
      "Browser không hỗ trợ streaming response."
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Read Stream
  |--------------------------------------------------------------------------
  */

  const reader =
    response.body.getReader();


  const decoder =
    new TextDecoder(
      "utf-8"
    );


  let buffer = "";


  while (true) {

    const {
      done,
      value,
    } =
      await reader.read();


    /*
    |--------------------------------------------------------------------------
    | Stream finished
    |--------------------------------------------------------------------------
    */

    if (done) {

      break;
    }


    /*
    |--------------------------------------------------------------------------
    | Decode chunk
    |--------------------------------------------------------------------------
    */

    buffer +=
      decoder.decode(
        value,
        {
          stream: true,
        }
      );


    /*
    |--------------------------------------------------------------------------
    | SSE events
    |--------------------------------------------------------------------------
    |
    | data: {...}
    |
    | data: {...}
    |
    */

    const events =
      buffer.split(
        /\r?\n\r?\n/
      );


    /*
    |--------------------------------------------------------------------------
    | Keep incomplete event
    |--------------------------------------------------------------------------
    */

    buffer =
      events.pop() ?? "";


    /*
    |--------------------------------------------------------------------------
    | Process complete events
    |--------------------------------------------------------------------------
    */

    for (
      const rawEvent
      of events
    ) {

      const event =
        parseSSEEvent(
          rawEvent
        );


      if (!event) {

        continue;
      }


      /*
      |--------------------------------------------------------------------------
      | Send event to React
      |--------------------------------------------------------------------------
      */

      onEvent(event);


      /*
      |--------------------------------------------------------------------------
      | Server-side AI error
      |--------------------------------------------------------------------------
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
    }
  }


  /*
  |--------------------------------------------------------------------------
  | Process remaining buffer
  |--------------------------------------------------------------------------
  */

  if (
    buffer.trim()
  ) {

    const event =
      parseSSEEvent(
        buffer
      );


    if (event) {

      onEvent(event);
    }
  }
}


/*
|--------------------------------------------------------------------------
| Parse SSE
|--------------------------------------------------------------------------
*/

function parseSSEEvent(
  raw
) {

  const lines =
    raw.split(
      /\r?\n/
    );


  const dataLines = [];


  for (
    const line
    of lines
  ) {

    if (
      line.startsWith(
        "data:"
      )
    ) {

      dataLines.push(
        line
          .slice(5)
          .trim()
      );
    }
  }


  if (
    dataLines.length === 0
  ) {

    return null;
  }


  const data =
    dataLines.join(
      "\n"
    );


  try {

    return JSON.parse(
      data
    );

  } catch (error) {

    console.warn(
      "Invalid SSE data:",
      data,
      error
    );


    return null;
  }
}


/*
|--------------------------------------------------------------------------
| Split Mock Text
|--------------------------------------------------------------------------
*/

function splitText(
  text,
  size = 8
) {

  const chunks = [];


  for (
    let i = 0;
    i < text.length;
    i += size
  ) {

    chunks.push(
      text.slice(
        i,
        i + size
      )
    );
  }


  return chunks;
}


/*
|--------------------------------------------------------------------------
| Sleep
|--------------------------------------------------------------------------
*/

function sleep(
  ms
) {

  return new Promise(
    resolve =>
      setTimeout(
        resolve,
        ms
      )
  );
}