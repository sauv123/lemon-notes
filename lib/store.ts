import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Folder {
  id: string;
  name: string;
}

export interface SavedKit {
  id: string;
  folderId: string | null;
  title: string;
  notes: string;
  summaryData: { 
    summary: string; 
    concepts: string[]; 
    tags?: string[];
    formulas?: { name: string; equation: string }[];
    laws_and_principles?: { name: string; description: string }[];
    important_points?: string[];
  } | null;
  quizResults: any | null;
  date: string;
}

interface StudyState {
  // Current active session
  notes: string;
  setNotes: (notes: string) => void;
  summaryData: { 
    summary: string; 
    concepts: string[]; 
    tags?: string[];
    formulas?: { name: string; equation: string }[];
    laws_and_principles?: { name: string; description: string }[];
    important_points?: string[];
  } | null;
  setSummaryData: (data: { 
    summary: string; 
    concepts: string[]; 
    tags?: string[];
    formulas?: { name: string; equation: string }[];
    laws_and_principles?: { name: string; description: string }[];
    important_points?: string[];
  } | null) => void;
  quizData: any;
  setQuizData: (data: any) => void;
  resetStudyData: () => void;
  
  // Persistence Data
  folders: Folder[];
  addFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  
  savedKits: SavedKit[];
  saveKit: (kit: Omit<SavedKit, "id" | "date">) => void;
  deleteKit: (id: string) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      notes: '',
      setNotes: (notes) => set({ notes }),
      summaryData: null,
      setSummaryData: (data) => set({ summaryData: data }),
      quizData: null,
      setQuizData: (data) => set({ quizData: data }),
      resetStudyData: () => set({ notes: '', summaryData: null, quizData: null }),

      folders: [
        { id: '1', name: 'Biology' },
        { id: '2', name: 'History' },
        { id: '3', name: 'Computer Science' }
      ], // Default folders for demo

      addFolder: (name) => set((state) => ({
        folders: [...state.folders, { id: Date.now().toString(), name }]
      })),
      
      deleteFolder: (id) => set((state) => ({
        folders: state.folders.filter((f) => f.id !== id),
        // Also move existing kits in this folder to Uncategorized (folderId = null)
        savedKits: state.savedKits.map(kit => kit.folderId === id ? { ...kit, folderId: null } : kit)
      })),

      savedKits: [],
      
      saveKit: (kitData) => set((state) => {
        const newKit: SavedKit = {
          ...kitData,
          id: Date.now().toString(),
          date: new Date().toISOString()
        };
        return { savedKits: [newKit, ...state.savedKits] };
      }),
      
      deleteKit: (id) => set((state) => ({
        savedKits: state.savedKits.filter(k => k.id !== id)
      })),
    }),
    {
      name: 'ai-study-storage', 
      partialize: (state) => ({ folders: state.folders, savedKits: state.savedKits }), // Only persist folders and kits
    }
  )
);

export interface SettingsState {
  emailNotifications: boolean;
  setEmailNotifications: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  autoSaveKits: boolean;
  setAutoSaveKits: (val: boolean) => void;
  
  aiGenerationsCount: number;
  incrementGenerations: () => void;
  storageBytes: number;
  addStorageBytes: (bytes: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      emailNotifications: true,
      setEmailNotifications: (val) => set({ emailNotifications: val }),
      highContrast: false,
      setHighContrast: (val) => set({ highContrast: val }),
      autoSaveKits: true,
      setAutoSaveKits: (val) => set({ autoSaveKits: val }),
      
      aiGenerationsCount: 45, // Default mock starting point as requested by initial UI
      incrementGenerations: () => set((state) => ({ aiGenerationsCount: state.aiGenerationsCount + 1 })),
      storageBytes: 120 * 1024 * 1024, // 120MB default mock starting point
      addStorageBytes: (bytes) => set((state) => ({ storageBytes: state.storageBytes + bytes })),
    }),
    {
      name: 'ai-settings-storage',
    }
  )
);
