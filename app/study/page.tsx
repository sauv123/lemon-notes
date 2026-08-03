"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useStudyStore, useSettingsStore } from "@/lib/store";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import Tesseract from 'tesseract.js';
import Script from 'next/script';
import { Card } from "@/components/ui/card";
import { SqueezingLemonLoader } from "@/components/SqueezingLemonLoader";

export default function StudyInputPage() {
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [parsingFile, setParsingFile] = useState(false);
  const router = useRouter();
  const setNotes = useStudyStore((state: any) => state.setNotes);

  const parsePDF = async (file: File): Promise<string> => {
    // Dynamic import to prevent SSR issues with browser APIs
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    let extractedText = "";

    // Parse all pages for text
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      extractedText += `\n\n--- Page ${i} ---\n\n` + pageText;
    }
    
    return extractedText;
  };

  const parseImage = async (file: File) => {
    const worker = await Tesseract.createWorker("eng", 1, {
      logger: m => console.log(m) // Optional progress
    });
    
    // Convert file to URL for Tesseract
    const fileUrl = URL.createObjectURL(file);
    const { data: { text } } = await worker.recognize(fileUrl);
    
    await worker.terminate();
    URL.revokeObjectURL(fileUrl);
    
    return text;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setParsingFile(true);
    let extractedText = "";

    try {
      if (file.type.startsWith("image/")) {
        toast("Scanning Image (OCR)... This may take ~10s the first time.");
        extractedText = await parseImage(file);
      } else if (file.type === "application/pdf") {
        toast("Extracting PDF text client-side...");
        extractedText = await parsePDF(file);
      } else if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
        toast("Transcribing audio securely with Groq... Please wait.");
        
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetch("/api/transcribe", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Audio transcription failed.");
        const data = await res.json();
        extractedText = data.text;
      } else {
        throw new Error("Unsupported file type");
      }

      if (!extractedText.trim()) {
        throw new Error("No content could be extracted.");
      }

      setText((prev) => prev + (prev.trim() ? "\n\n---\n\n" : "") + extractedText.trim());
      
      const { addStorageBytes } = useSettingsStore.getState();
      addStorageBytes(file.size);
      
      toast.success("File processed successfully!");

    } catch (e: any) {
      toast.error(e.message || "An error occurred while parsing the file.");
      console.error("Parsing Error:", e);
    } finally {
      setParsingFile(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ 
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.webm', '.ogg'],
      'video/mp4': ['.mp4']
    }
  });

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some notes to process.");
      return;
    }

    setLoading(true);
    setNotes(text);

    // Call API Route
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to process notes");
      }

      const data = await response.json();

      const { setSummaryData, saveKit } = useStudyStore.getState();
      const { incrementGenerations, autoSaveKits } = useSettingsStore.getState();
      
      const summaryData = {
        summary: data.summary,
        concepts: data.concepts,
        tags: data.tags,
        formulas: data.formulas,
        laws_and_principles: data.laws_and_principles,
        important_points: data.important_points
      };

      setSummaryData(summaryData);
      incrementGenerations();

      if (autoSaveKits) {
        saveKit({
          folderId: null,
          title: "Auto-saved Kit " + new Date().toLocaleDateString(),
          notes: text || "No notes",
          summaryData,
          quizResults: null
        });
        toast.success("Kit automatically saved!");
      }

      router.push("/results");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while analyzing your notes.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative flex flex-col items-center justify-center pt-32 p-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl z-10"
      >
        <div className="mb-12 text-center pt-32 md:pt-0">
          <h1 className="text-4xl font-serif tracking-tight mb-4 uppercase">Upload Library 🍋</h1>
          <p className="text-muted-foreground font-light tracking-wide uppercase text-sm">Paste material or inject a PDF / Image.</p>
        </div>

        {loading && (
          <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center">
            <SqueezingLemonLoader />
            <p className="mt-6 text-lg font-bold text-foreground animate-pulse">Squeezing the knowledge out...</p>
          </div>
        )}

        <div {...getRootProps()} className={`transition-all duration-300 ${isDragActive ? "ring-1 ring-primary ring-offset-4 ring-offset-background scale-[1.02]" : ""}`}>
          <input {...getInputProps()} />
          
          <Card className="p-0 card-alchemist overflow-hidden relative bg-card">
            
            {isDragActive && (
              <div className="absolute inset-0 z-50 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center border border-dashed border-primary">
                <span className="material-symbols-rounded text-6xl text-primary animate-bounce mb-4 block">upload</span>
                <p className="text-xl font-serif uppercase tracking-widest text-primary">Inject Material</p>
              </div>
            )}

            <div className={`p-6 relative transition-opacity ${parsingFile ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="mb-4">
                <div className="flex justify-between items-center ml-1 mb-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-muted-foreground">Notes / Text</Label>
                  <div className="flex gap-2 items-center text-xs text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full flex-wrap">
                    <span className="material-symbols-rounded text-base text-blue-500">description</span> PDFs
                    <span className="mx-1">•</span>
                    <span className="material-symbols-rounded text-base text-orange-500">image</span> Images
                    <span className="mx-1">•</span>
                    <span className="material-symbols-rounded text-base text-green-500">graphic_eq</span> Audio
                  </div>
                </div>
                  <Textarea 
                  id="notes"
                  placeholder="Paste your notes, or drop a PDF, Image, or Audio Recording (MP3/WAV/MP4) here..."
                  className="mt-4 min-h-[300px] resize-none border border-border focus-visible:ring-primary text-base font-light p-6 bg-black/5"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={parsingFile}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto btn-alchemist-outline px-8"
                  onClick={open}
                  disabled={parsingFile}
                >
                  {parsingFile ? (
                    <><span className="material-symbols-rounded mr-2 animate-spin">progress_activity</span> Digging into file...</>
                  ) : (
                    <><span className="material-symbols-rounded mr-2">upload</span> Upload File</>
                  )}
                </Button>
                
                <Button 
                  onClick={handleGenerate}
                  disabled={loading || parsingFile}
                  className="w-full sm:w-auto btn-alchemist px-10"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-rounded mr-2 animate-spin">progress_activity</span>
                      Squeezing your notes...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-rounded mr-2">auto_awesome</span>
                      Generate Study Kit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </main>
  );
}
