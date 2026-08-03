"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export interface Question {
  id: string;
  type?: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  topic: string;
}

interface QuizCardProps {
  questions: Question[];
  onComplete: (results: any[]) => void;
}

export function QuizCard({ questions, onComplete }: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [awaitingSelfGrade, setAwaitingSelfGrade] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [results, setResults] = useState<{ questionId: string; isCorrect: boolean; topic: string }[]>([]);

  const question = questions[currentIndex];
  const isTextEntry = question.type === "short_answer" || question.type === "fill_in_the_blank";

  const handleSelect = (option: string) => {
    if (showExplanation || awaitingSelfGrade || evaluating) return;
    setSelectedAnswer(option);
  };

  const handleMcqSubmit = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    setAiFeedback({ isCorrect, explanation: isCorrect ? "Correct!" : "Incorrect." });
    recordResult(isCorrect);
  };

  const handleShortAnswerSubmit = async () => {
    if (!selectedAnswer || !selectedAnswer.trim()) return;
    setEvaluating(true);
    
    try {
      const res = await fetch("/api/quiz/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.text,
          correctAnswer: question.correctAnswer,
          userAnswer: selectedAnswer
        })
      });
      const data = await res.json();
      setAiFeedback({
        isCorrect: data.isCorrect,
        explanation: data.explanation
      });
      recordResult(data.isCorrect);
    } catch (error) {
      // Fallback
      setAiFeedback({ isCorrect: false, explanation: "Could not evaluate automatically. Consider this incorrect for now." });
      recordResult(false);
    } finally {
      setEvaluating(false);
    }
  };

  const recordResult = (isCorrect: boolean) => {
    setResults(prev => [
      ...prev,
      {
        questionId: question.id,
        isCorrect,
        topic: question.topic,
      },
    ]);
    setShowExplanation(true);
    setAwaitingSelfGrade(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAwaitingSelfGrade(false);
    } else {
      onComplete(results);
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto w-full bg-card/60 backdrop-blur-xl border-border/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-xs px-2 py-1 bg-white/10 rounded-full font-medium text-muted-foreground capitalize">
          {question.topic}
        </span>
      </div>

      <div className="text-2xl font-bold mb-8 leading-tight prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {question.text}
        </ReactMarkdown>
      </div>

      {!isTextEntry ? (
        <div className="space-y-3 mb-8">
          {(question.options || []).map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === question.correctAnswer;
            
            let stateClass = "border-white/10 hover:border-primary/50 hover:bg-white/5";
            
            if (showExplanation) {
              if (isCorrectAnswer) {
                stateClass = "bg-green-500/20 border-green-500/50 text-green-100";
              } else if (isSelected && !isCorrectAnswer) {
                stateClass = "bg-red-500/20 border-red-500/50 text-red-100";
              } else {
                stateClass = "opacity-50 border-white/5";
              }
            } else if (isSelected) {
              stateClass = "border-primary bg-primary/10 ring-1 ring-primary";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border transition-all ${stateClass} flex items-center justify-between group`}
              >
                <div className="font-medium prose prose-invert max-w-none m-0">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{option}</ReactMarkdown>
                </div>
                {showExplanation && isCorrectAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-4" />
                )}
                {showExplanation && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-4" />
                )}
                {!showExplanation && isSelected && (
                  <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0 ml-4" />
                )}
                {!showExplanation && !isSelected && (
                  <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-primary/50 flex-shrink-0 ml-4" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          <div>
            <Textarea 
              placeholder="Type your answer here..."
              value={selectedAnswer || ""}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={showExplanation}
              className="min-h-[120px] text-base p-4"
            />
          </div>
          {showExplanation && (
            <div className="p-6 rounded-xl border border-primary/50 bg-primary/10">
              <h3 className="text-sm font-semibold uppercase text-primary mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Correct Answer
              </h3>
              <div className="text-lg font-medium prose prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {question.correctAnswer}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-white/5">
        {!showExplanation ? (
          <Button 
            onClick={isTextEntry ? handleShortAnswerSubmit : handleMcqSubmit} 
            disabled={!selectedAnswer || evaluating}
            className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {evaluating ? "Evaluating..." : "Check Answer"}
          </Button>
        ) : (
          <div className="w-full">
            {aiFeedback && isTextEntry && (
              <div className={`p-4 mb-4 rounded-xl border ${aiFeedback.isCorrect ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}`}>
                <h3 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${aiFeedback.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {aiFeedback.isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {aiFeedback.isCorrect ? "Correct!" : "Incorrect"}
                </h3>
                <p className="text-sm font-medium">{aiFeedback.explanation}</p>
              </div>
            )}
            <div className="flex justify-end">
              <Button 
                onClick={handleNext}
                className="px-8"
              >
                {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
