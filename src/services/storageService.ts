import { docsApi } from "./docsApi";
import { AnalysisTab, DocumentAnalysis, StoredDocument } from "../types";

/**
 * Backend currently stores only the uploaded file record.
 * Analysis + last tab are cached locally per document id.
 */

const ANALYSIS_KEY = "lexi_doc_analysis"; // { [docId]: {analysis,lastTab} }

type LocalEntry = { analysis?: DocumentAnalysis; lastTab?: AnalysisTab };

function readLocal(): Record<string, LocalEntry> {
  const raw = localStorage.getItem(ANALYSIS_KEY);
  return raw ? (JSON.parse(raw) as Record<string, LocalEntry>) : {};
}

function writeLocal(map: Record<string, LocalEntry>) {
  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(map));
}

export const storageService = {
  /**
   * Create a document in backend (file upload) and return its id.
   */
  async uploadToBackend(file: File) {
    const doc = await docsApi.create(file);
    return doc;
  },

  /**
   * Merge backend list with local analysis cache.
   */
  async getUserDocuments(_userId: string): Promise<StoredDocument[]> {
    const backend = await docsApi.list();
    const local = readLocal();

    return backend.map((d) => {
      const cached = local[d.id] || {};
      return {
        id: d.id,
        userId: _userId,
        name: d.filename,
        type: d.mimeType,
        uploadDate: d.createdAt,
        analysis:
          cached.analysis ||
          ({
            category: "Other",
            documentType: "Document",
            summary: [],
            obligations: [],
            keyClauses: [],
            risks: [],
            deadlines: [],
          } as any),
        lastTab: cached.lastTab || AnalysisTab.SUMMARY,
      };
    });
  },

  /**
   * Save analysis locally for a backend document id.
   */
  saveAnalysis(docId: string, analysis: DocumentAnalysis) {
    const local = readLocal();
    local[docId] = { ...(local[docId] || {}), analysis };
    writeLocal(local);
  },

  async deleteDocument(docId: string) {
    await docsApi.remove(docId);
    const local = readLocal();
    delete local[docId];
    writeLocal(local);
  },

  updateDocumentTab(docId: string, tab: AnalysisTab) {
    const local = readLocal();
    local[docId] = { ...(local[docId] || {}), lastTab: tab };
    writeLocal(local);
  },
};
