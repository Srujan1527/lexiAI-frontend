import React from "react";
import { ChatMessage, DocumentAnalysis, UploadedFile } from "../../types";
import { ClausesIcon, SendIcon } from "../Icons";

type Props = {
  isHistoryView: boolean;
  currentFile: UploadedFile | null;
  analysis: DocumentAnalysis | null;

  chatHistory: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;

  isSendingMessage: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;

  onSendMessage: (text?: string) => void;
  onClearChat: () => void;
};

export default function ChatTab({
  isHistoryView,
  currentFile,
  analysis,
  chatHistory,
  chatInput,
  setChatInput,
  isSendingMessage,
  chatEndRef,
  onSendMessage,
  onClearChat,
}: Props) {
  const quickPrompts = [
    "Summarize this document",
    "List key risks",
    "Explain the termination clause",
    "What are the deadlines?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 overflow-x-auto flex items-center gap-2 whitespace-nowrap scrollbar-hide">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            disabled={
              isSendingMessage ||
              (isHistoryView && !currentFile?.data && !analysis)
            }
            className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex-shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide relative">
        {chatHistory.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-50 pointer-events-none">
            <ClausesIcon className="w-12 h-12 mb-2" />
            <p>Start asking questions...</p>
          </div>
        )}

        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed break-words ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-100 text-slate-800 rounded-bl-none"
              } ${msg.isError ? "bg-red-100 text-red-700" : ""}`}
            >
              <div
                className="markdown-prose"
                dangerouslySetInnerHTML={{
                  __html: msg.text
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br />"),
                }}
              />
            </div>
          </div>
        ))}

        {isSendingMessage && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-bl-none px-5 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div />
          <button
            onClick={onClearChat}
            className="text-[10px] text-slate-400 hover:text-red-500 uppercase font-semibold tracking-wider"
          >
            Clear Chat
          </button>
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
            placeholder={
              isSendingMessage
                ? "Thinking..."
                : "Ask a question about this document..."
            }
            className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm disabled:bg-white"
            disabled={isSendingMessage}
          />
          <button
            onClick={() => onSendMessage()}
            disabled={isSendingMessage || !chatInput.trim()}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
