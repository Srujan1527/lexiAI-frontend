import React from "react";
import { AppView, AnalysisTab } from "../../types";
import { HomeIcon, UserIcon } from "../Icons";

type Props = {
  currentView: AppView;
  activeTab: AnalysisTab;
  onNavigate: (v: AppView) => void;
  onTabChange: (t: AnalysisTab) => void;
};

export default function MobileTabs({
  currentView,
  activeTab,
  onNavigate,
  onTabChange,
}: Props) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {currentView === AppView.ANALYZER ? (
        <>
          {[
            { tab: AnalysisTab.SUMMARY, label: "Summary" },
            { tab: AnalysisTab.CLAUSES, label: "Clauses" },
            { tab: AnalysisTab.RISKS, label: "Risks" },
            { tab: AnalysisTab.CHAT, label: "Chat" },
          ].map((i) => (
            <button
              key={i.tab}
              onClick={() => onTabChange(i.tab)}
              className={`p-2 rounded-lg flex flex-col items-center ${
                activeTab === i.tab ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <span className="text-xs font-medium">{i.label}</span>
            </button>
          ))}

          <button
            onClick={() => onNavigate(AppView.DASHBOARD)}
            className="p-2 rounded-lg flex flex-col items-center text-slate-400 border-l border-slate-100 pl-4"
          >
            <span className="text-xs font-medium">Exit</span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => onNavigate(AppView.DASHBOARD)}
            className={`p-2 rounded-lg flex flex-col items-center ${
              currentView === AppView.DASHBOARD
                ? "text-blue-600"
                : "text-slate-400"
            }`}
          >
            <HomeIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => onNavigate(AppView.PROFILE)}
            className={`p-2 rounded-lg flex flex-col items-center ${
              currentView === AppView.PROFILE
                ? "text-blue-600"
                : "text-slate-400"
            }`}
          >
            <UserIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </>
      )}
    </div>
  );
}
