import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { NextRequest } from "next/server";
import { dormFunctionDeclarations, executeDormTool } from "@/lib/ai/tools/dormTools";
import { DEFAULT_SYSTEM_PROMPT } from "@/lib/ai/systemPrompt";
import { queryLogStorage, SqlQueryLog } from "@/lib/db/mysql";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function resolveModelName(requestedModel?: string): string {
  if (!requestedModel) return "gemini-3.1-flash-lite";
  const m = requestedModel.toLowerCase().trim();
  if (m.includes("pro")) {
    return "gemini-3.1-pro-preview";
  }
  if (m.includes("3.7") || m === "gemini-flash" || m === "gemini-3.7-flash") {
    return "gemini-3.7-flash";
  }
  if (m.includes("lite") || m.includes("flash-lite") || m.includes("3.5")) {
    return "gemini-3.1-flash-lite";
  }
  return "gemini-3.1-flash-lite";
}

export async function POST(req: NextRequest) {
  const sqlLogs: SqlQueryLog[] = [];
  const reqStartTime = Date.now();

  return await queryLogStorage.run(sqlLogs, async () => {
    try {
      const {
        messages,
        systemInstruction,
        model = "gemini-3.1-flash-lite",
        webSearch = false,
        enableThinking = false,
      } = await req.json();

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: "GEMINI_API_KEY ortam değişkeni bulunamadı." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const targetModel = resolveModelName(model);

      // Format conversation history for Gemini API
      const validMessages = (messages || []).filter(
        (msg: { content?: string; attachments?: unknown[] }) =>
          (msg.content && msg.content.trim().length > 0) ||
          (msg.attachments && msg.attachments.length > 0)
      );

      if (validMessages.length === 0) {
        return new Response(
          JSON.stringify({ error: "Gönderilecek mesaj bulunamadı." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const formattedContents: Array<any> = validMessages.map((msg: {
        role: string;
        content: string;
        attachments?: { name: string; type: string; dataUrl?: string; textContent?: string }[];
      }) => {
        const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
        const parts: Array<Record<string, unknown>> = [];

        // Handle attached files (Images and Text documents)
        if (msg.attachments && msg.attachments.length > 0) {
          for (const att of msg.attachments) {
            if (att.dataUrl && att.type.startsWith("image/")) {
              const base64Data = att.dataUrl.split(",")[1] || att.dataUrl;
              parts.push({
                inlineData: {
                  mimeType: att.type,
                  data: base64Data,
                },
              });
            } else if (att.textContent) {
              parts.push({
                text: `[Ekli Dosya: ${att.name}]\n\`\`\`\n${att.textContent}\n\`\`\``,
              });
            }
          }
        }

        if (msg.content && msg.content.trim()) {
          parts.push({ text: msg.content });
        }

        return {
          role,
          parts: parts.length > 0 ? parts : [{ text: msg.content || "Merhaba" }],
        };
      });

      // Build configuration
      const config: Record<string, unknown> = {
        systemInstruction: systemInstruction || DEFAULT_SYSTEM_PROMPT,
      };

      // Setup Tools: Function Calling + Optional Google Search Grounding
      if (webSearch) {
        config.tools = [
          { googleSearch: {} },
          { functionDeclarations: dormFunctionDeclarations },
        ];
        config.toolConfig = { includeServerSideToolInvocations: true };
      } else {
        config.tools = [{ functionDeclarations: dormFunctionDeclarations }];
      }

      // Thinking config if enabled
      if (enableThinking && targetModel !== "gemini-3.1-flash-lite") {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      // Iterative Tool Resolution Loop (Supports up to 8 multi-turn tool calling steps before streaming final text)
      const currentContents = [...formattedContents];
      const maxAllowedIterations = 8;
      let iterationsRemaining = maxAllowedIterations;
      let stepsExecuted = 0;
      let finalStreamResponse = null;

      while (iterationsRemaining > 0) {
        iterationsRemaining--;
        stepsExecuted++;

        // Check if the model wants to call tools
        const stepResponse = await ai.models.generateContent({
          model: targetModel,
          contents: currentContents,
          config,
        });

        const functionCalls = stepResponse.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
          // Execute each requested tool in backend
          const toolResponseParts: Array<any> = [];

          for (const call of functionCalls) {
            if (!call.name) continue;
            const toolResult = await executeDormTool(call.name, (call.args as Record<string, any>) || {});
            toolResponseParts.push({
              functionResponse: {
                name: call.name,
                response: toolResult,
              },
            });
          }

          // Append assistant tool-call turn and user tool-response turn to the conversation history
          const modelContent = stepResponse.candidates?.[0]?.content;
          if (modelContent) {
            currentContents.push(modelContent);
          }

          currentContents.push({
            role: "user",
            parts: toolResponseParts,
          });

          // Loop continues to let model process tool outputs (up to 8 steps)
        } else {
          // No further tools called, stream final text
          finalStreamResponse = await ai.models.generateContentStream({
            model: targetModel,
            contents: currentContents,
            config,
          });
          break;
        }
      }

      // Fallback if loop ended after tools
      if (!finalStreamResponse) {
        finalStreamResponse = await ai.models.generateContentStream({
          model: targetModel,
          contents: currentContents,
          config,
        });
      }

      // Prepare Debug Payload
      const debugPayload = {
        timestamp: Date.now(),
        model: targetModel,
        stepsExecuted,
        systemInstruction: String(config.systemInstruction || DEFAULT_SYSTEM_PROMPT),
        formattedContents: JSON.parse(JSON.stringify(formattedContents)),
        fullContents: JSON.parse(JSON.stringify(currentContents)),
        toolsProvided: dormFunctionDeclarations.map((f) => f.name),
        sqlLogs: [...sqlLogs],
        totalDurationMs: Date.now() - reqStartTime,
      };

      // Stream directly through a ReadableStream
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of finalStreamResponse) {
              const chunkText = chunk.text;
              if (chunkText) {
                controller.enqueue(encoder.encode(chunkText));
              }
            }

            // Append debug payload at the very end of stream
            const debugPayloadString = `\n<!--__DEBUG_DATA_START__${encodeURIComponent(
              JSON.stringify(debugPayload)
            )}__DEBUG_DATA_END__-->`;
            controller.enqueue(encoder.encode(debugPayloadString));

            controller.close();
          } catch (err: unknown) {
            console.error("Streaming iteration error:", err);
            controller.error(err);
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    } catch (error: unknown) {
      console.error("Chat API Critical Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Bilinmeyen bir sunucu hatası oluştu.";
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  });
}
