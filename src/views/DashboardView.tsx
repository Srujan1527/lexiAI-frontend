import React from "react";
import { StoredDocument, User } from "../types";
import {
  UploadIcon,
  FileIcon,
  FilterIcon,
  SortIcon,
  TrashIcon,
} from "../components/Icons";

type Props = {
  isAnalyzing: boolean;
  onAnalyzeDoc: (docId: string) => void;
  isUploading: boolean;
  user: User | null;
  documents: StoredDocument[];
  filteredDocuments: StoredDocument[];
  filterType: "All" | "Contract" | "Policy" | "Other";
  setFilterType: (v: any) => void;
  sortType: "Newest" | "Oldest" | "Name" | "Type";
  setSortType: (v: any) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenDoc: (doc: StoredDocument) => void;
  onDeleteDoc: (id: string, e: React.MouseEvent) => void;
};

export default function DashboardView({
  isAnalyzing,
  onAnalyzeDoc,
  isUploading,
  user,
  documents,
  filteredDocuments,
  filterType,
  setFilterType,
  sortType,
  setSortType,
  onFileUpload,
  onOpenDoc,
  onDeleteDoc,
}: Props) {
  return (
    <div className="p-6 lg:p-10 animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {user?.name}. Manage your legal documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative overflow-hidden group">
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm">
              <UploadIcon className="w-5 h-5" />
              {isUploading ? "Uploading..." : "New Scan"}
            </button>
            {isUploading && (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                Uploading document, please wait...
              </div>
            )}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onFileUpload}
              accept=".pdf,.docx,.txt,.jpg,.png"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <span className="text-sm font-medium text-slate-500 mr-2 flex items-center">
            <FilterIcon className="w-4 h-4 mr-1" /> Filter:
          </span>
          {["All", "Contract", "Policy", "Other"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                filterType === type
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500 flex items-center">
            <SortIcon className="w-4 h-4 mr-1" /> Sort:
          </span>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as any)}
            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none"
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Name">Name</option>
            <option value="Type">Type</option>
          </select>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
            <FileIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">
            No documents yet
          </h3>
          <p className="text-slate-400 mb-6">
            Upload a contract, policy, or paper to get started.
          </p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">
            No documents found matching the selected filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDoc(doc)}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col min-h-[220px]"
            >
              <div className="flex flex-1 justify-between items-start mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FileIcon className="w-6 h-6" />
                </div>
                <button
                  onClick={(e) => onDeleteDoc(doc.id, e)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <h3
                className="font-semibold text-slate-800 truncate mb-1"
                title={doc.name}
              >
                {doc.name}
              </h3>

              <p className="text-xs text-slate-400 mb-4">
                {new Date(doc.uploadDate).toLocaleDateString()} •{" "}
                {doc.analysis.category}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                  {doc.analysis.documentType}
                </span>

                {doc.analysis.risks.length > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-xs font-medium text-red-600">
                    {doc.analysis.risks.length} Risks
                  </span>
                )}
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAnalyzeDoc(doc.id);
                }}
                disabled={isAnalyzing}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition mt-5
      ${
        isAnalyzing
          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }
    `}
              >
                Analyze
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
