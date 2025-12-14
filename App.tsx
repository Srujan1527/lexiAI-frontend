import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  UploadedFile,
  DocumentAnalysis,
  AppView,
  AnalysisTab,
  ChatMessage,
  User,
  StoredDocument,
} from "./src/types";

import { analyzeDocument, sendChatMessage } from "./src/services/geminiService";
import { authService } from "./src/services/authService";
import { storageService } from "./src/services/storageService";

import Sidebar from "./src/components/Layout/Sidebar";
import MobileHeader from "./src/components/Layout/MobileHeader";
import MobileTabs from "./src/components/Layout/MobileTabs";

import AuthViewComponent from "./src/views/AuthView";
import DashboardView from "./src/views/DashboardView";
import ProfileView from "./src/views/ProfileView";
import AnalyzerView from "./src/views/AnalyzerView";

const getGoogleClientId = () => {
  try {
    // note: Vite uses import.meta.env, but keeping your fallback logic as-is
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = (globalThis as any)?.process;
    if (p?.env?.GOOGLE_CLIENT_ID) return p.env.GOOGLE_CLIENT_ID;
  } catch {}
  return "";
};

const GOOGLE_CLIENT_ID = getGoogleClientId();

export default function App() {
  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [authError, setAuthError] = useState("");

  // --- App View State ---
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  // --- Analysis State ---
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<AnalysisTab>(AnalysisTab.SUMMARY);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [isHistoryView, setIsHistoryView] = useState(false);

  // --- Dashboard State ---
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [filterType, setFilterType] = useState<
    "All" | "Contract" | "Policy" | "Other"
  >("All");
  const [sortType, setSortType] = useState<
    "Newest" | "Oldest" | "Name" | "Type"
  >("Newest");

  // --- Loading States ---
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // --- Chat State ---
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Profile State ---
  const [profileForm, setProfileForm] = useState<Partial<User>>({});
  const debugState = {
    // Core State
    currentFile,
    analysis,
    activeTab,
    currentDocId,
    isHistoryView,

    // Dashboard
    documents,
    filterType,
    sortType,

    // Loading
    isAnalyzing,
    isSendingMessage,

    // Chat
    chatHistory,
    chatInput,

    // Profile
    profileForm,
  };

  useEffect(() => {
    (async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadDashboard(currentUser.id);
      } else {
        setCurrentView(AppView.LOGIN);
      }
    })();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, activeTab]);

  const loadDashboard = async (userId: string) => {
    const docs = await storageService.getUserDocuments(userId);
    setDocuments(docs);
  };
  useEffect(() => {
    console.log("🔍 DEBUG STATE:", debugState);
  }, [
    currentFile,
    analysis,
    activeTab,
    currentDocId,
    isHistoryView,
    documents,
    filterType,
    sortType,
    isAnalyzing,
    isSendingMessage,
    chatHistory,
    chatInput,
    profileForm,
  ]);

  // --- Auth Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const u = await authService.login(
      formData.get("email") as string,
      formData.get("password") as string
    );
    if (u) {
      setUser(u);
      await loadDashboard(u.id);
      setCurrentView(AppView.DASHBOARD);
      setAuthError("");
    } else {
      setAuthError("Invalid credentials");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    try {
      const u = await authService.signup(
        formData.get("name") as string,
        formData.get("email") as string,
        formData.get("password") as string
      );
      setUser(u);
      await loadDashboard(u.id);
      setCurrentView(AppView.DASHBOARD);
      setAuthError("");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    // Backend currently supports only email/password auth.
    setAuthError(
      "Google login is not enabled on the backend yet. Use email/password."
    );
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setCurrentView(AppView.LOGIN);
  };

  // --- Profile Handlers ---
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updatedUser = { ...user, ...profileForm };
    authService.updateProfile(updatedUser);
    setUser(updatedUser);
    alert("Profile updated successfully!");
  };

  // --- Tab Management ---
  const handleTabChange = (tab: AnalysisTab) => {
    setActiveTab(tab);
    if (currentDocId) storageService.updateDocumentTab(currentDocId, tab);
  };

  // --- Document Logic ---
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];

    if (!validTypes.includes(file.type) && !file.type.includes("text/")) {
      alert("Supported formats: PDF, DOCX, TXT, Images.");
      return;
    }

    try {
      setIsAnalyzing(true); // use it as "uploading" spinner too
      setAnalysis(null);
      setChatHistory([]);
      setIsHistoryView(false);

      // 1) upload to backend -> get real document id
      const created = await storageService.uploadToBackend(file);
      // created.id must be prisma document id
      setCurrentDocId(created.id);

      // 2) set current file info (no base64 needed)
      setCurrentFile({
        name: created.filename,
        type: created.mimeType,
        data: "",
      });

      // 3) go to analyzer screen
      setCurrentView(AppView.ANALYZER);
      setActiveTab(AnalysisTab.SUMMARY);

      // 4) refresh dashboard docs
      await loadDashboard(user.id);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
      // reset input so same file can be uploaded again
      event.target.value = "";
    }
  };

  //analyze when button is clicked
  const handleAnalyzeClick = async () => {
    if (!currentDocId) {
      alert("Document ID missing. Please upload again.");
      return;
    }

    try {
      setIsAnalyzing(true);

      const result = await analyzeDocument(currentDocId);
      setAnalysis(result);

      // Optional local cache
      storageService.saveAnalysis(currentDocId, result);

      setChatHistory([
        {
          id: "init-1",
          role: "model",
          text: `✅ Analysis completed. This appears to be a **${result.documentType}**. Ask me anything about it.`,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openHistoryDocument = (doc: StoredDocument) => {
    setAnalysis(doc.analysis);
    setCurrentFile({ name: doc.name, type: doc.type, data: "" });
    setCurrentDocId(doc.id);
    setIsHistoryView(true);
    setCurrentView(AppView.ANALYZER);
    setActiveTab(doc.lastTab || AnalysisTab.SUMMARY);
    setChatHistory([]);
  };

  const handleDeleteDocument = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this document?")) {
      await storageService.deleteDocument(docId);
      if (user) await loadDashboard(user.id);
    }
  };

  // --- Chat Logic ---
  const handleSendMessage = async (text: string = chatInput) => {
    if (!text.trim()) return;
    if (!analysis && !currentDocId) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsSendingMessage(true);

    try {
      const apiHistory = chatHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      // Send structured analysis as context (backend-safe)
      const analysisContext = analysis ? JSON.stringify(analysis) : undefined;

      const responseText = await sendChatMessage(
        apiHistory,
        userMsg.text,
        analysisContext
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: responseText,
        timestamp: new Date(),
      };

      setChatHistory((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "I encountered an error trying to answer that. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const clearChat = () => {
    if (confirm("Clear current chat history?")) setChatHistory([]);
  };

  // --- Filtering & Sorting ---
  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    if (filterType !== "All") {
      result = result.filter((doc) => doc.analysis.category === filterType);
    }

    result.sort((a, b) => {
      switch (sortType) {
        case "Newest":
          return (
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          );
        case "Oldest":
          return (
            new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
          );
        case "Name":
          return a.name.localeCompare(b.name);
        case "Type":
          return a.analysis.documentType.localeCompare(b.analysis.documentType);
        default:
          return 0;
      }
    });

    return result;
  }, [documents, filterType, sortType]);

  // --- View Switch ---
  if (currentView === AppView.LOGIN || currentView === AppView.SIGNUP) {
    return (
      <AuthViewComponent
        authView={authView}
        setAuthView={setAuthView}
        authError={authError}
        setAuthError={setAuthError}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onGoogleLogin={handleGoogleLogin}
      />
    );
  }

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <div className="flex h-full">
        <Sidebar
          user={user}
          currentView={currentView}
          activeTab={activeTab}
          onNavigate={setCurrentView}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col lg:ml-64 h-full relative min-w-0">
          <MobileHeader onLogout={handleLogout} />

          <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 w-full">
            <div className="max-w-5xl mx-auto w-full">
              {currentView === AppView.DASHBOARD && (
                <DashboardView
                  user={user}
                  documents={documents}
                  filteredDocuments={filteredDocuments}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  sortType={sortType}
                  setSortType={setSortType}
                  onFileUpload={handleFileUpload}
                  onOpenDoc={openHistoryDocument}
                  onDeleteDoc={handleDeleteDocument}
                />
              )}

              {currentView === AppView.PROFILE && (
                <ProfileView
                  user={user}
                  profileForm={profileForm}
                  setProfileForm={setProfileForm}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}

              {currentView === AppView.ANALYZER && (
                <AnalyzerView
                  isAnalyzing={isAnalyzing}
                  isHistoryView={isHistoryView}
                  currentFile={currentFile}
                  analysis={analysis}
                  activeTab={activeTab}
                  chatHistory={chatHistory}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  isSendingMessage={isSendingMessage}
                  chatEndRef={chatEndRef}
                  onSendMessage={handleSendMessage}
                  onClearChat={clearChat}
                  onBack={() => setCurrentView(AppView.DASHBOARD)}
                  currentDocId={currentDocId}
                  onAnalyze={handleAnalyzeClick}
                />
              )}
            </div>
          </main>

          <MobileTabs
            currentView={currentView}
            activeTab={activeTab}
            onNavigate={setCurrentView}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
    </div>
  );
}
