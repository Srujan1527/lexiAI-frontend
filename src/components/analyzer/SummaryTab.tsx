import React from "react";
import { DocumentAnalysis, UploadedFile } from "../../types";
import { EyeIcon } from "../Icons";

export default function SummaryTab({
  analysis,
  currentFile,
  isHistoryView,
}: {
  analysis: DocumentAnalysis;
  currentFile: UploadedFile | null;
  isHistoryView: boolean;
}) {
  return (
    <div className="space-y-6 animate-fadeIn pb-24 lg:pb-0">
      {isHistoryView && (
        <div className="bg-amber-50 border border-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm mb-2 flex items-center">
          <EyeIcon className="w-4 h-4 mr-2" />
          Viewing archived document. Chat capabilities are limited.
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Executive Summary
          </h2>
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-100 uppercase">
            {analysis.category}
          </span>
        </div>

        <div className="space-y-4">
          {Array.isArray(analysis.summary) ? (
            analysis.summary.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start text-slate-600 leading-relaxed group hover:bg-slate-50 p-2 rounded-lg transition-colors"
              >
                <span className="mr-3 mt-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                <span className="break-words min-w-0">{point}</span>
              </div>
            ))
          ) : (
            <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed break-words">
              {analysis.summary}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Key Obligations
          </h3>
          <ul className="space-y-3">
            {analysis.obligations.length > 0 ? (
              analysis.obligations.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-sm text-slate-600"
                >
                  <span className="mr-2 mt-1.5 w-1 h-1 bg-slate-400 rounded-full flex-shrink-0"></span>
                  <span className="break-words min-w-0">{item}</span>
                </li>
              ))
            ) : (
              <p className="text-slate-400 italic">
                No specific obligations found.
              </p>
            )}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Document Details
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">
                Type
              </span>
              <p className="text-slate-700 font-medium break-words">
                {analysis.documentType}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">
                File Name
              </span>
              <p className="text-slate-700 font-medium break-words">
                {currentFile?.name || "Unknown"}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">
                Category
              </span>
              <p className="text-slate-700 font-medium">{analysis.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
