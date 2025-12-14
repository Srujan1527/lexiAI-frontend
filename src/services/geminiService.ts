import { http } from "../api/http";
import { DocumentAnalysis } from "../types";

/**
 * Calls backend: POST /api/ai/analyze
 * Backend reads the uploaded file from disk and returns structured JSON.
 *
 * We pass filePath and mimeType, NOT base64.
 */
export async function analyzeDocument(
  documentId: string
): Promise<DocumentAnalysis> {
  const { data } = await http.post("ai/analyze", { documentId });
  return data.analysis as DocumentAnalysis;
}

/**
 * Calls backend: POST /api/ai/chat
 */
export async function sendChatMessage(
  documentId: string,
  history: { role: "user" | "model"; text: string }[],
  newMessage: string,
  analysisContext?: any
): Promise<string> {
  const { data } = await http.post("ai/chat", {
    documentId,
    message: newMessage,
    history,
    analysisContext,
  });

  return data.reply as string;
}
