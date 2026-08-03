"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LemonPencilLogo } from "@/components/LemonPencilLogo";

export default function Home() {
  const ALCHEMIST_EASE = [0.16, 1, 0.3, 1] as const;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: ALCHEMIST_EASE },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col relative selection:bg-primary/30">
      {/* Heavy Cinematic Background Auroras */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-accent/20 rounded-full blur-[150px] pointer-events-none" 
      />

      {/* Header */}
      <header className="p-6 flex items-center justify-between z-10 border-b-2 border-border bg-card">
        <div className="flex items-center gap-2">
          <LemonPencilLogo className="w-10 h-10" />
          <span className="font-bold text-xl tracking-tight">Lemon Notes</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/folders">
            <Button variant="outline" className="btn-squishy-secondary font-bold px-6">
              My Library
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-border font-bold">
            <span className="material-symbols-rounded text-primary text-sm">auto_awesome</span>
            <span>Turn notes into genius mode</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Supercharge Your <br /> Learning Speed
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Paste your lecture notes or textbooks. We instantly generate summaries, 
            interactive quizzes, and track your weak spots so you can ace your next exam.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/folders" className="w-full sm:w-auto">
              <Button size="lg" className="btn-squishy w-full sm:w-auto px-8 py-6 text-lg font-bold">
                Start Studying
                <span className="material-symbols-rounded ml-2">arrow_forward</span>
              </Button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full">
            <FeatureCard
              icon={<span className="material-symbols-rounded text-blue-500">menu_book</span>}
              title="Smart Summaries"
              description="Boil down hours of reading into concise, easy-to-digest bullet points and key concepts."
            />
            <FeatureCard
              icon={<span className="material-symbols-rounded text-purple-500">psychology</span>}
              title="Dynamic Quizzes"
              description="Automatically generate multiple-choice and short-answer questions to test your knowledge."
            />
            <FeatureCard
              icon={<span className="material-symbols-rounded text-yellow-500">emoji_events</span>}
              title="Track Weak Areas"
              description="We remember what you don't know yet, bringing back concepts you struggle with to ensure mastery."
            />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card card-sticker relative overflow-hidden group">
      <div className="p-3 bg-secondary rounded-xl inline-block mb-4 border-2 border-border">
        {icon}
      </div>
      <h3 className="text-xl font-extrabold mb-2">{title}</h3>
      <p className="text-muted-foreground font-medium text-sm leading-relaxed">{description}</p>
    </div>
  );
}
