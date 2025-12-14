import React from "react";
import { AppView, AnalysisTab, User } from "../../types";
import { HomeIcon, UserIcon, LogOutIcon } from "../Icons";

type Props = {
  user: User | null;
  currentView: AppView;
  activeTab: AnalysisTab;
  onNavigate: (v: AppView) => void;
  onTabChange: (t: AnalysisTab) => void;
  onLogout: () => void;
};

export default function Sidebar({
  user,
  currentView,
  activeTab,
  onNavigate,
  onTabChange,
  onLogout,
}: Props) {
  return (
    <div className="hidden lg:flex flex-col w-64 bg-slate-900 text-white fixed inset-y-0 left-0 z-50">
      <div className="flex flex-col h-full p-6 overflow-y-auto">
        <div
          className="flex items-center space-x-2 mb-8 cursor-pointer flex-shrink-0"
          onClick={() => onNavigate(AppView.DASHBOARD)}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
            L
          </div>
          <span className="text-xl font-bold tracking-tight">Lexi AI</span>
        </div>

        <div className="mb-6 px-3 py-2 bg-slate-800 rounded-lg flex items-center space-x-3 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate w-32">{user?.name}</p>
            <p className="text-xs text-slate-400">Basic Plan</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => onNavigate(AppView.DASHBOARD)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === AppView.DASHBOARD
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate(AppView.PROFILE)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === AppView.PROFILE
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span>Profile</span>
          </button>

          {currentView === AppView.ANALYZER && (
            <div className="mt-6 pt-6 border-t border-slate-700 animate-fadeIn">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">
                Document Tools
              </h4>

              {[
                {
                  tab: AnalysisTab.SUMMARY,
                  label: "Summary",
                  dot: "bg-green-500",
                },
                {
                  tab: AnalysisTab.CLAUSES,
                  label: "Key Clauses",
                  dot: "bg-purple-500",
                },
                { tab: AnalysisTab.RISKS, label: "Risks", dot: "bg-red-500" },
                { tab: AnalysisTab.CHAT, label: "AI Chat", dot: "bg-blue-500" },
              ].map((i) => (
                <button
                  key={i.tab}
                  onClick={() => onTabChange(i.tab)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === i.tab
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${i.dot}`}></span>
                  <span>{i.label}</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        <button
          onClick={onLogout}
          className="flex items-center justify-center space-x-2 w-full py-3 hover:bg-slate-800 rounded-lg text-sm text-slate-400 transition-colors mt-auto flex-shrink-0"
        >
          <LogOutIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
