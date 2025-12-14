import React from "react";
import {
  AnalysisTab,
  ChatMessage,
  DocumentAnalysis,
  UploadedFile,
} from "../../types";
import SummaryTab from "./SummaryTab";
import ClausesTab from "./ClausesTab";
import RisksTab from "./RisksTab";
import ChatTab from "./ChatTab";

type Props = {
  isAnalyzing: boolean;
  isHistoryView: boolean;
  currentFile: UploadedFile | null;
  analysis: DocumentAnalysis | null;
  activeTab: AnalysisTab;

  chatHistory: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  isSendingMessage: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
  onSendMessage: (text?: string) => void;
  onClearChat: () => void;
  currentDocId?: string | null;
  onAnalyze?: () => void;
};

export default function AnalysisContent({
  isAnalyzing,
  isHistoryView,
  currentFile,
  analysis,
  activeTab,
  chatHistory,
  chatInput,
  setChatInput,
  isSendingMessage,
  chatEndRef,
  onSendMessage,
  onClearChat,
}: Props) {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-fadeIn">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mt-6">
          Analyzing Document...
        </h3>
        <p className="text-slate-500 mt-2 text-center max-w-sm">
          Extracting legal clauses, identifying potential risks, and generating
          a point-wise summary.
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  switch (activeTab) {
    case AnalysisTab.SUMMARY:
      return (
        <SummaryTab
          analysis={analysis}
          currentFile={currentFile}
          isHistoryView={isHistoryView}
        />
      );

    case AnalysisTab.CLAUSES:
      return <ClausesTab analysis={analysis} />;

    case AnalysisTab.RISKS:
      return <RisksTab analysis={analysis} />;

    case AnalysisTab.CHAT:
      return (
        <ChatTab
          isHistoryView={isHistoryView}
          currentFile={currentFile}
          analysis={analysis}
          chatHistory={chatHistory}
          chatInput={chatInput}
          setChatInput={setChatInput}
          isSendingMessage={isSendingMessage}
          chatEndRef={chatEndRef}
          onSendMessage={onSendMessage}
          onClearChat={onClearChat}
        />
      );

    default:
      return null;
  }
}
