import React from "react";
import { DocumentAnalysis } from "../../types";
import { AlertIcon } from "../Icons";

export default function RisksTab({ analysis }: { analysis: DocumentAnalysis }) {
  return (
    <div className="space-y-6 animate-fadeIn pb-24 lg:pb-0">
      <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
        <div className="flex items-center space-x-3 mb-4">
          <AlertIcon className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-red-900">
            Identified Risks & Red Flags
          </h2>
        </div>

        <ul className="space-y-3">
          {analysis.risks.length > 0 ? (
            analysis.risks.map((risk, idx) => (
              <li
                key={idx}
                className="flex items-start p-3 bg-white rounded-lg border border-red-100 shadow-sm"
              >
                <span className="font-bold text-red-500 mr-3 text-lg">!</span>
                <span className="text-slate-700 text-sm break-words min-w-0">
                  {risk}
                </span>
              </li>
            ))
          ) : (
            <p className="text-slate-500 italic">
              No significant risks detected.
            </p>
          )}
        </ul>
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
        <h2 className="text-xl font-bold text-amber-900 mb-4">
          Deadlines & Time Sensitivity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.deadlines.length > 0 ? (
            analysis.deadlines.map((deadline, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <span className="text-slate-700 text-sm font-medium break-words min-w-0">
                  {deadline}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic">
              No specific deadlines detected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
