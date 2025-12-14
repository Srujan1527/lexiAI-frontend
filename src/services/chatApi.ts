import { http } from "../api/http";

export type ChatMessagePayload = { role: "user" | "model"; text: string };

export const chatApi = {
  async ask(docId: string, history: ChatMessagePayload[], message: string) {
    const { data } = await http.post<{ answer: string }>(
      `/documents/${docId}/chat`,
      {
        history,
        message,
      }
    );
    return data.answer;
  },
};
