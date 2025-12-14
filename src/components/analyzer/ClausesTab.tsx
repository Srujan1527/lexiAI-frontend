import React from "react";
import { DocumentAnalysis } from "../../types";
import { ClausesIcon } from "../Icons";

export default function ClausesTab({
  analysis,
}: {
  analysis: DocumentAnalysis;
}) {
  return (
    <div className="space-y-6 animate-fadeIn pb-24 lg:pb-0">
      <div className="flex items-center space-x-3 mb-2">
        <ClausesIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-800">Key Clauses</h2>
      </div>

      {analysis.keyClauses && analysis.keyClauses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {analysis.keyClauses.map((clause, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                <h3 className="font-bold text-slate-800 text-lg break-words">
                  {clause.title}
                </h3>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium">
                  {clause.category}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed break-words">
                {clause.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-dashed border-slate-200 text-center">
          <p className="text-slate-400">
            No key clauses identified in this document.
          </p>
        </div>
      )}
    </div>
  );
}
