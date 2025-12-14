import React from "react";
import {
  AnalysisTab,
  ChatMessage,
  DocumentAnalysis,
  UploadedFile,
} from "../types";
import AnalysisContent from "../components/analyzer/AnalysisContent";

type Props = {
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
      {props.isAnalyzing && (
        <div className="mb-6 bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-lg text-sm">
          Analyzing document… please wait.
        </div>
      )}

      <AnalysisContent {...props} />
    </div>
  );
}
