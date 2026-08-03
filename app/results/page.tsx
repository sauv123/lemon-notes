"use client";

import { motion } from "framer-motion";

import { useStudyStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryCard } from "@/components/SummaryCard";
import { QuizCard, Question } from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { ChatAssistant } from "@/components/ChatAssistant";
import { SqueezingLemonLoader } from "@/components/SqueezingLemonLoader";

export default function ResultsPage() {
  const router = useRouter();
  const summaryData = useStudyStore((state) => state.summaryData);
  const notes = useStudyStore((state) => state.notes);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);

  useEffect(() => {
    if (!summaryData && !notes) {
      router.push("/study");
    }
  }, [summaryData, notes, router]);

  const handleGenerateQuiz = async () => {
    setLoadingQuiz(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setQuestions(data.questions);
    } catch (e) {
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleQuizComplete = async (results: any[]) => {
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results }),
      });
      const data = await res.json();
      setQuizResults(data);
    } catch (e) {
      toast.error("Failed to submit results.");
    }
  };

  if (!summaryData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-background relative flex flex-col items-center pt-32 p-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl pt-10"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/study")}
            className="hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground btn-squishy-secondary"
          >
            <span className="material-symbols-rounded mr-2 text-lg">arrow_back</span>
            Back to Notes
          </Button>

          <Button 
            variant="outline"
            className="btn-squishy-secondary bg-white/5 border-border hover:bg-black/5"
            onClick={() => {
              const kitName = prompt("Name this Study Kit:");
              if (!kitName) return;
              useStudyStore.getState().saveKit({
                folderId: null, // Saves to root folder by default
                title: kitName,
                notes,
                summaryData,
                quizResults
              });
              toast.success("Study kit saved safely!");
            }}
          >
            <span className="material-symbols-rounded mr-2 text-primary">menu_book</span>
            Save Kit to Folders
          </Button>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Study Kit Generated <span className="text-primary text-2xl rotate-12 inline-block ml-2">✨</span></h1>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card card-sticker h-16 rounded-2xl p-2 gap-2">
            <TabsTrigger value="summary" className="rounded-xl h-full flex items-center justify-center gap-2 text-sm sm:text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:card-sticker transition-all">
              <span className="material-symbols-rounded">menu_book</span>
              Summary
            </TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-xl h-full flex items-center justify-center gap-2 text-sm sm:text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:card-sticker transition-all">
              <span className="material-symbols-rounded">psychology</span>
              Quiz
            </TabsTrigger>
            <TabsTrigger value="chat" className="rounded-xl h-full flex items-center justify-center gap-2 text-sm sm:text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:card-sticker transition-all">
              <span className="material-symbols-rounded">chat_bubble</span>
              Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-0 focus-visible:outline-none">
            <SummaryCard 
              summary={summaryData.summary} 
              concepts={summaryData.concepts} 
              tags={summaryData.tags} 
              formulas={summaryData.formulas}
              laws_and_principles={summaryData.laws_and_principles}
              important_points={summaryData.important_points}
            />
          </TabsContent>
          
          <TabsContent value="quiz" className="mt-0 flex flex-col items-center focus-visible:outline-none">
            {loadingQuiz && (
              <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center">
                <SqueezingLemonLoader />
                <p className="mt-6 text-lg font-bold text-foreground animate-pulse">Squeezing out quiz questions...</p>
              </div>
            )}
            {questions.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-center max-w-md mx-auto">
                <span className="material-symbols-rounded text-7xl text-muted-foreground/30 mb-8 block">psychology</span>
                <h3 className="text-2xl font-serif font-medium uppercase tracking-widest mb-4">Challenge Mode</h3>
                <p className="text-muted-foreground mb-8 font-light">Synthesize and test your concept retention.</p>
                <Button 
                  size="lg" 
                  onClick={handleGenerateQuiz} 
                  disabled={loadingQuiz}
                  className="btn-alchemist px-12"
                >
                  {loadingQuiz ? "Injecting..." : "Initiate Sequence"}
                </Button>
              </div>
            ) : !quizResults ? (
              <QuizCard questions={questions} onComplete={handleQuizComplete} />
            ) : (
              <div className="w-full max-w-2xl bg-card rounded-2xl p-8 text-center card-sticker">
                <div className="inline-flex items-center justify-center p-4 bg-primary/20 rounded-2xl mb-6 ring-4 ring-primary/10 border-2 border-border">
                  <span className="text-4xl font-black text-primary">{quizResults.score}%</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  You got {quizResults.correct} out of {quizResults.total} questions correct.
                </p>
                
                {quizResults.weakTopics.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-left mb-8">
                    <h3 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2">
                      Needs Review
                    </h3>
                    <ul className="list-disc pl-5 text-red-100/80 space-y-1">
                      {quizResults.weakTopics.map((topic: string, i: number) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <Button 
                  className="rounded-full px-8 py-6 text-lg w-full mb-4 bg-white text-black hover:bg-gray-200"
                  onClick={() => router.push("/folders")}
                >
                  Go to Folders
                </Button>
                <Button 
                  variant="ghost" 
                  className="rounded-full text-muted-foreground"
                  onClick={() => {
                    setQuestions([]);
                    setQuizResults(null);
                  }}
                >
                  Retake Quiz
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="mt-0 focus-visible:outline-none">
            <ChatAssistant />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
