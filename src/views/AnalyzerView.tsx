import React from "react";
import {
  AnalysisTab,
  ChatMessage,
  DocumentAnalysis,
  UploadedFile,
} from "../types";
import AnalysisContent from "../components/analyzer/AnalysisContent";

type Props = {
  isUploading: boolean;
  isAnalyzing: boolean;
  isHistoryView: boolean;
  currentFile: UploadedFile | null;
  analysis: DocumentAnalysis | null;
  activeTab: AnalysisTab;

  // ✅ NEW
  currentDocId: string | null;
  onAnalyze: () => void;

  chatHistory: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  isSendingMessage: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
  onSendMessage: (text?: string) => void;
  onClearChat: () => void;

  onBack: () => void;
};

export default function AnalyzerView(props: Props) {
  const showAnalyzeCard =
    !!props.currentDocId && !props.analysis && !props.isAnalyzing;

  return (
    <div className="p-4 md:p-8">
      <button
        onClick={props.onBack}
        className="mb-4 text-sm text-slate-500 hover:text-blue-600 flex items-center"
      >
        ← Back to Dashboard
      </button>

      {/* ✅ Uploaded doc + Analyze button */}
      {showAnalyzeCard && (
        <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">Uploaded document</p>
            <p className="font-semibold text-slate-800 truncate">
              {props.currentFile?.name || "Untitled"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              ID: {props.currentDocId}
            </p>
          </div>

          <button
            onClick={props.onAnalyze}
            className="ml-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            Analyze
          </button>
        </div>
      )}

      {/* ✅ If analyzing, show a simple status */}
      {props.isUploading && (
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
            <div>
              <p className="font-medium">Uploading document…</p>
              <p className="text-sm text-slate-500">Please wait</p>
            </div>
          </div>
        </div>
      )}

      <AnalysisContent {...props} />
    </div>
  );
}
