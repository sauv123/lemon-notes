"use client";

import { useStudyStore, SavedKit } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SummaryCard } from "@/components/SummaryCard";

// Review kit route for reading past generated studies
export default function KitReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const savedKits = useStudyStore((state) => state.savedKits);
  const kit = typeof id === "string" ? savedKits.find(k => k.id === id) : null;

  useEffect(() => {
    if (id && typeof id === "string" && !kit) {
      router.push("/folders");
    }
  }, [id, kit, router]);

  if (!kit) return null;

  return (
    <main className="min-h-screen bg-background relative flex flex-col items-center pt-28 p-6 pb-20">
      <div className="w-full max-w-4xl pt-10">
        <div className="flex justify-between items-end mb-10 border-b border-border pb-6">
          <div>
            <button onClick={() => router.push("/folders")} className="text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors mb-4 text-xs tracking-widest uppercase">
              <span className="material-symbols-rounded">arrow_left_alt</span> Directory
            </button>
            <h1 className="text-4xl font-serif font-medium tracking-tight uppercase">{kit.title}</h1>
            <p className="text-muted-foreground tracking-wide mt-2 font-light">
              Generated on {new Date(kit.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <Button 
            variant="ghost"
            onClick={() => {
               // Restore to state so user can retake quiz or chat
               useStudyStore.getState().setNotes(kit.notes);
               useStudyStore.getState().setSummaryData(kit.summaryData);
               if (kit.quizResults) {
                   useStudyStore.getState().setQuizData(kit.quizResults);
               } else {
                   useStudyStore.getState().setQuizData(null);
               }
               router.push('/results');
            }}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors p-0 hover:bg-transparent"
          >
            Enter Interactive Mode <span className="material-symbols-rounded ml-2">play_arrow</span>
          </Button>
        </div>

        {kit.summaryData ? (
          <div className="card-alchemist p-10 bg-card">
            <h3 className="font-serif text-2xl uppercase border-b border-border pb-4 mb-6">Briefing</h3>
            <div className="prose prose-neutral max-w-none font-light leading-relaxed mb-10">
              <p>{kit.summaryData.summary}</p>
            </div>
            
            <h3 className="font-serif text-2xl uppercase border-b border-border pb-4 mb-6">Core Concept Extractions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kit.summaryData.concepts.map((concept, idx) => (
                <div key={idx} className="p-4 border border-border bg-black/5 text-sm font-light">
                  {concept}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-20 font-light italic">
            Document data could not be recovered.
          </div>
        )}
      </div>
    </main>
  );
}
