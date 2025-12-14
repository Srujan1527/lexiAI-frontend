import React from "react";
import { LogOutIcon } from "../Icons";

export default function MobileHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md flex-shrink-0">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold">
          L
        </div>
        <span className="font-bold text-lg">Lexi AI</span>
      </div>
      <button onClick={onLogout} className="text-slate-300">
        <LogOutIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
