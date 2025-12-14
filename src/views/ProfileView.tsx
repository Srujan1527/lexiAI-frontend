import React from "react";
import { User } from "../types";

type Props = {
  user: User | null;
  profileForm: Partial<User>;
  setProfileForm: (v: Partial<User>) => void;
  onUpdateProfile: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ProfileView({
  user,
  profileForm,
  setProfileForm,
  onUpdateProfile,
}: Props) {
  return (
    <div className="p-6 lg:p-10 animate-fadeIn max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">My Profile</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl">
            {user?.name?.charAt(0) ?? "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={onUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name ?? user?.name ?? ""}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address (Read Only)
              </label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="w-full px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company / Organization
              </label>
              <input
                type="text"
                value={profileForm.company ?? user?.company ?? ""}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, company: e.target.value })
                }
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={profileForm.role ?? user?.role ?? ""}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, role: e.target.value })
                }
                placeholder="e.g. Legal Counsel"
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
