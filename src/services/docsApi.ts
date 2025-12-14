import { http } from "../api/http";

export type BackendDocument = {
  id: string;
  filename: string;
  mimeType: string;
  createdAt: string;
  analysisJson?: unknown | null;
};

export const docsApi = {
  async list() {
    const { data } = await http.get<{ documents: BackendDocument[] }>(
      "/documents"
    );
    return data.documents;
  },

  async create(file: File) {
    const form = new FormData();
    form.append("file", file);

    const { data } = await http.post<{ document: BackendDocument }>(
      "/documents",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data.document;
  },

  async get(id: string) {
    const { data } = await http.get<{ document: BackendDocument }>(
      `/documents/${id}`
    );
    return data.document;
  },

  async remove(id: string) {
    await http.delete(`/documents/${id}`);
  },
};
