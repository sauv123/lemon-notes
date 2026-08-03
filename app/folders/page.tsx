"use client";

import { useStudyStore } from "@/lib/store";
import { Folder, FileText, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";

export default function FoldersPage() {
  const router = useRouter();
  const folders = useStudyStore((state) => state.folders);
  const savedKits = useStudyStore((state) => state.savedKits);
  const addFolder = useStudyStore((state) => state.addFolder);
  const deleteFolder = useStudyStore((state) => state.deleteFolder);
  const deleteKit = useStudyStore((state) => state.deleteKit);

  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{title: string, description: string, onConfirm: () => void} | null>(null);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName("");
      toast.success("Folder created!");
    }
  };

  const currentFolderKits = savedKits.filter(k => k.folderId === selectedFolderId);

  return (
    <main className="min-h-screen bg-background flex flex-col pt-32 p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        
        {/* Sidebar: Folders List */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-medium tracking-tight uppercase flex items-center gap-3">
              <span className="material-symbols-rounded text-primary">folder_open</span> Directory
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Input 
              placeholder="New folder..." 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
              className="bg-card/50 border-border focus-visible:ring-primary focus-visible:ring-offset-background"
              aria-label="New folder name"
            />
            <Button size="icon" onClick={handleAddFolder} className="shrink-0 btn-squishy gap-0 bg-primary text-primary-foreground focus-visible:ring-primary focus-visible:ring-offset-background" aria-label="Create Folder">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSelectedFolderId(null)}
              className={`flex items-center justify-between p-4 transition-all border ${
                selectedFolderId === null 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-transparent border-transparent hover:border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Folder className="w-5 h-5 opacity-70" />
                <span>All Notes</span>
              </div>
              <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">{savedKits.length}</span>
            </button>
            
            {folders.map(folder => {
              const count = savedKits.filter(k => k.folderId === folder.id).length;
              const isSelected = selectedFolderId === folder.id;
              
              return (
                <div key={folder.id} className="group flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`flex-1 flex items-center justify-between p-4 transition-all border ${
                      isSelected 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-transparent border-transparent hover:border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Folder className="w-5 h-5 opacity-70 shrink-0" />
                      <span className="truncate">{folder.name}</span>
                    </div>
                    <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full shrink-0">{count}</span>
                  </button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 shrink-0 text-red-500 hover:text-red-400 hover:bg-red-500/10 focus-visible:ring-red-500"
                    aria-label={`Delete ${folder.name} folder`}
                    onClick={() => {
                      setConfirmAction({
                        title: "Delete Folder",
                        description: `Are you sure you want to delete the folder "${folder.name}"? Notes inside will become uncategorized.`,
                        onConfirm: () => {
                          deleteFolder(folder.id);
                          if (isSelected) setSelectedFolderId(null);
                        }
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Area: Notes List */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div>
              <h2 className="text-3xl font-serif font-medium uppercase tracking-tight">
                {selectedFolderId === null ? "Index" : folders.find(f => f.id === selectedFolderId)?.name || 'Unknown Folder'}
              </h2>
              <p className="text-muted-foreground mt-2 font-light">
                {currentFolderKits.length} {currentFolderKits.length === 1 ? "document" : "documents"} available
              </p>
            </div>
            <Link href="/study">
              <Button className="btn-alchemist-outline flex items-center gap-2">
                <span className="material-symbols-rounded">add</span> New Document
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {currentFolderKits.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/10 rounded-3xl"
                >
                  <FileText className="w-12 h-12 mb-4 opacity-50" />
                  <p>No study kits in this folder yet.</p>
                </motion.div>
              ) : (
                currentFolderKits.map(kit => (
                  <motion.div
                    key={kit.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="flex flex-col h-full card-alchemist hover:-translate-y-1 transition-transform group overflow-hidden cursor-pointer" onClick={() => router.push(`/kit/${kit.id}`)}>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-2 text-muted-foreground font-serif uppercase tracking-widest text-xs">
                            <span className="material-symbols-rounded">article</span>
                            Document
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmAction({
                                title: "Delete Document",
                                description: `Are you sure you want to delete "${kit.title}"? This action cannot be undone.`,
                                onConfirm: () => deleteKit(kit.id)
                              });
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors focus-visible:ring-2 focus-visible:ring-destructive p-1"
                            aria-label={`Delete ${kit.title} kit`}
                          >
                            <span className="material-symbols-rounded">delete</span>
                          </button>
                        </div>
                        <h3 className="font-serif font-medium text-xl leading-tight mb-3 line-clamp-2" title={kit.title}>{kit.title}</h3>
                        <p className="text-xs text-muted-foreground mt-auto font-light tracking-wide uppercase">
                          {new Date(kit.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
        
      </div>

      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 overflow-hidden bg-card card-alchemist shadow-xl rounded-2xl"
            >
              <h2 className="text-2xl font-serif font-medium tracking-tight mb-2 uppercase flex items-center gap-2">
                <span className="material-symbols-rounded text-destructive">warning</span> {confirmAction.title}
              </h2>
              <p className="text-muted-foreground font-light mb-8">
                {confirmAction.description}
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="ghost" onClick={() => setConfirmAction(null)} className="btn-squishy-secondary">
                  Cancel
                </Button>
                <Button 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 btn-squishy px-6" 
                  onClick={() => {
                    confirmAction.onConfirm();
                    setConfirmAction(null);
                  }}
                >
                  Confirm Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
