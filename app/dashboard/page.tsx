"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WeakTopicsList } from "@/components/WeakTopicsList";
import { useStudyStore } from "@/lib/store";

export default function DashboardPage() {
  const savedKits = useStudyStore((state) => state.savedKits);

  const quizzes = savedKits.filter(kit => kit.quizResults);
  const totalQuizzes = quizzes.length;
  const avgScore = totalQuizzes > 0 
    ? Math.round(quizzes.reduce((acc, kit) => acc + (kit.quizResults.score || 0), 0) / totalQuizzes)
    : 0;

  // Simple streak: if they have kits, they have a 1-day streak.
  const studyStreak = savedKits.length > 0 ? 1 : 0;

  const stats = {
    totalQuizzes,
    avgScore,
    studyStreak,
  };

  const activity = savedKits.slice(0, 5).map(kit => ({
    title: kit.title,
    date: new Date(kit.date).toLocaleDateString(),
    score: kit.quizResults?.score || 0,
    hasQuiz: !!kit.quizResults
  }));

  return (
    <main className="min-h-screen bg-background pt-32 p-6 lg:p-12 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto z-10 relative">
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 border-b border-border pb-8">
          <div>
            <h1 className="text-4xl font-serif font-medium tracking-tight uppercase mb-4">Dashboard</h1>
            <p className="text-muted-foreground font-light tracking-wide uppercase text-sm">Active Streak: {stats.studyStreak} Days</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Avg. Accuracy" 
            value={`${stats.avgScore}%`} 
            progress={stats.avgScore}
            icon={<span className="material-symbols-rounded text-emerald-500">my_location</span>} 
            colorClass="border-t-4 border-t-emerald-500 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] bg-gradient-to-br from-card to-emerald-500/5"
            progressColor="bg-emerald-500"
          />
          <StatCard 
            title="Quizzes Taken" 
            value={stats.totalQuizzes.toString()} 
            icon={<span className="material-symbols-rounded text-blue-500">psychology</span>} 
            colorClass="border-t-4 border-t-blue-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] bg-gradient-to-br from-card to-blue-500/5"
          />
          <StatCard 
            title="Current Streak" 
            value={`${stats.studyStreak} Days`} 
            icon={<span className="material-symbols-rounded text-amber-500">emoji_events</span>} 
            colorClass="border-t-4 border-t-amber-500 hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] bg-gradient-to-br from-card to-amber-500/5"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 card-alchemist p-8 flex flex-col">
            <h2 className="text-xl font-serif font-medium uppercase tracking-wide mb-8 flex items-center gap-2 border-b border-border pb-4">
              <span className="material-symbols-rounded text-destructive">error</span> Action Areas
            </h2>
            <WeakTopicsList />
          </div>

          <div className="lg:col-span-2 card-alchemist p-8 flex flex-col">
            <h2 className="text-xl font-serif font-medium uppercase tracking-wide mb-8 flex items-center gap-2 border-b border-border pb-4">
              Timeline
            </h2>
            <div className="space-y-0 divide-y divide-border">
              {activity.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center font-light">No historical data.</div>
              ) : activity.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-6 group cursor-pointer hover:bg-black/5 px-4 -mx-4 transition-colors">
                  <div className="flex items-center gap-6">
                    {item.hasQuiz ? (
                      <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-serif text-lg relative">
                        {item.score}
                      </div>
                    ) : (
                      <div className="w-12 h-12 border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                        <span className="material-symbols-rounded">article</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif font-medium text-lg tracking-wide uppercase">{item.title}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{item.date}</p>
                    </div>
                  </div>
                  <span className="material-symbols-rounded text-muted-foreground group-hover:text-primary transition-colors">arrow_right_alt</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, progress, colorClass = "", progressColor = "bg-primary" }: any) {
  return (
    <Card className={`p-8 card-alchemist w-full flex flex-col justify-between transition-all duration-300 ${colorClass}`}>
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-muted-foreground font-medium uppercase tracking-widest text-xs">{title}</h3>
        {icon}
      </div>
      <div className="text-5xl font-serif font-medium tracking-tighter mb-4">{value}</div>
      {progress !== undefined && (
        <Progress value={progress} className={`h-1 bg-border [&>div]:${progressColor}`} />
      )}
    </Card>
  );
}
