export interface Clause {
  title: string;
  text: string;
  category: string;
}

export interface DocumentAnalysis {
  summary: string[]; 
  risks: string[];
  deadlines: string[];
  obligations: string[];
  keyClauses: Clause[];
  documentType: string;
  category: 'Contract' | 'Policy' | 'Other';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface UploadedFile {
  name: string;
  type: string;
  data: string; // Base64
}

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  joinedDate: Date;
}

export interface StoredDocument {
  id: string;
  userId: string;
  name: string;
  uploadDate: string; // ISO String
  type: string;
  analysis: DocumentAnalysis;
  lastTab?: AnalysisTab;
}

export enum AppView {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  ANALYZER = 'ANALYZER', // The active scanning view
  HISTORY_VIEW = 'HISTORY_VIEW', // Viewing a saved doc
}

export enum AnalysisTab {
  SUMMARY = 'SUMMARY',
  CLAUSES = 'CLAUSES',
  RISKS = 'RISKS',
  CHAT = 'CHAT',
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any;
          revoke: (accessToken: string, done: () => void) => void;
        }
      }
    }
  }
}