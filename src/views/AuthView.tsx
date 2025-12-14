import React from "react";
import { GoogleIcon } from "../components/Icons";

type Props = {
  authView: "LOGIN" | "SIGNUP";
  setAuthView: (v: "LOGIN" | "SIGNUP") => void;
  authError: string;
  setAuthError: (v: string) => void;
  onLogin: (e: React.FormEvent) => void;
  onSignup: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
};

export default function AuthView({
  authView,
  setAuthView,
  authError,
  setAuthError,
  onLogin,
  onSignup,
  onGoogleLogin,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4">
            L
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Lexi AI</h1>
          <p className="text-slate-500">
            {authView === "LOGIN"
              ? "Welcome back, please login."
              : "Create your account."}
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {authError}
          </div>
        )}

        <form
          onSubmit={authView === "LOGIN" ? onLogin : onSignup}
          className="space-y-4"
        >
          {authView === "SIGNUP" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            {authView === "LOGIN" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoogleLogin}
            className="mt-6 w-full flex items-center justify-center px-4 py-3 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          {authView === "LOGIN" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setAuthView("SIGNUP");
                  setAuthError("");
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setAuthView("LOGIN");
                  setAuthError("");
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
