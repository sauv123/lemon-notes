"use client";

import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useStudyStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface SummaryCardProps {
  summary: string;
  concepts: string[];
  tags?: string[];
  formulas?: { name: string; equation: string }[];
  laws_and_principles?: { name: string; description: string }[];
  important_points?: string[];
}

export function SummaryCard({ summary, concepts, tags, formulas, laws_and_principles, important_points }: SummaryCardProps) {
  const notes = useStudyStore((state) => state.notes);
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [conceptDetails, setConceptDetails] = useState<Record<string, string>>({});
  const [loadingConcept, setLoadingConcept] = useState<string | null>(null);

  const handleConceptClick = async (concept: string) => {
    // Telescope toggle
    if (expandedConcept === concept) {
      setExpandedConcept(null);
      return;
    }

    setExpandedConcept(concept);

    // If we already fetched it, do nothing more
    if (conceptDetails[concept] || !notes) return;

    setLoadingConcept(concept);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          history: [{ role: "user", content: `Explain the concept of "${concept}" strictly using the provided notes in 2-3 clear sentences.` }]
        })
      });
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setConceptDetails(prev => ({ ...prev, [concept]: data.message }));
    } catch (e) {
      setConceptDetails(prev => ({ ...prev, [concept]: "Could not generate summary for this concept." }));
    } finally {
      setLoadingConcept(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card card-sticker mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold">Executive Summary</h2>
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex gap-2">
              {tags.map((tag, i) => (
                <span key={i} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {summary}
          </ReactMarkdown>
        </div>
      </Card>

      {important_points && important_points.length > 0 && (
        <Card className="p-6 bg-card card-sticker mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-rounded text-yellow-500">lightbulb</span>
            <h2 className="text-xl font-bold">Important Points</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            {important_points.map((point, i) => (
              <li key={i}>
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {point}
                </ReactMarkdown>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {laws_and_principles && laws_and_principles.length > 0 && (
        <Card className="p-6 bg-card card-sticker mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-rounded text-purple-500">gavel</span>
            <h2 className="text-xl font-bold">Laws & Principles</h2>
          </div>
          <div className="space-y-4">
            {laws_and_principles.map((law, i) => (
              <div key={i} className="p-4 border border-border rounded-xl bg-secondary/20">
                <h3 className="font-bold text-lg mb-2">{law.name}</h3>
                <div className="text-muted-foreground prose prose-invert max-w-none text-sm">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {law.description}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {formulas && formulas.length > 0 && (
        <Card className="p-6 bg-card card-sticker mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-rounded text-green-500">calculate</span>
            <h2 className="text-xl font-bold">Formulas & Equations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formulas.map((formula, i) => (
              <div key={i} className="p-4 border border-border rounded-xl bg-secondary/20 text-center flex flex-col items-center justify-center">
                <h3 className="font-bold text-sm text-muted-foreground mb-4 uppercase tracking-widest">{formula.name}</h3>
                <div className="text-xl overflow-x-auto w-full px-2">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {formula.equation}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-card card-sticker mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold">Key Concepts</h2>
          </div>
          <span className="text-xs text-muted-foreground bg-white/5 py-1 px-3 rounded-full border border-white/5 hidden sm:block">Click any concept to learn more</span>
        </div>
        
        <ul className="flex flex-col gap-3">
          {concepts.map((concept, index) => {
            const isExpanded = expandedConcept === concept;
            const detail = conceptDetails[concept];
            const isLoading = loadingConcept === concept;

            return (
              <li key={index} className="flex flex-col rounded-xl overflow-hidden border-2 border-border bg-card transition-colors hover:bg-secondary">
                <button 
                  onClick={() => handleConceptClick(concept)}
                  className="flex items-center justify-between w-full p-4 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/20 text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-semibold">{concept}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-black/20"
                    >
                      <div className="p-4 px-12 text-sm text-foreground border-t-2 border-border whitespace-pre-wrap leading-relaxed relative min-h-[60px] bg-secondary/30">
                        {isLoading ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" /> Gathering context...
                          </div>
                        ) : (
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {detail || ""}
                            </ReactMarkdown>
                          </div>
                        )}
                        
                        <div className="absolute left-6 top-4 bottom-4 w-[2px] bg-primary/30 rounded-full" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
