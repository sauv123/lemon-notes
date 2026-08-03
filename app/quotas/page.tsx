"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/store";
import { toast } from "sonner";
import { useState } from "react";

export default function QuotasPage() {
  const { aiGenerationsCount, storageBytes } = useSettingsStore();
  const [upgrading, setUpgrading] = useState(false);

  const maxGenerations = 100;
  const maxStorageBytes = 500 * 1024 * 1024; // 500 MB

  const generationProgress = Math.min((aiGenerationsCount / maxGenerations) * 100, 100);
  const storageProgress = Math.min((storageBytes / maxStorageBytes) * 100, 100);

  const storageMB = (storageBytes / (1024 * 1024)).toFixed(1);
  const maxStorageMB = 500;

  const handleUpgrade = () => {
    setUpgrading(true);
    setTimeout(() => {
      toast.success("Successfully upgraded to Alchemist Pro!");
      setUpgrading(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background pt-32 p-6 lg:p-12 relative overflow-hidden">
      <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl font-serif font-medium tracking-tight uppercase mb-4">Usage & Quotas</h1>
          <p className="text-muted-foreground font-light tracking-wide uppercase text-sm">Keep track of your monthly limits.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 card-alchemist flex flex-col justify-between border-l-4 border-l-blue-500">
            <div>
              <h2 className="text-xl font-serif font-medium uppercase tracking-wide mb-2">AI Generations</h2>
              <p className="text-muted-foreground text-sm mb-8">Used to extract summaries, concepts, and build quizzes.</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>{aiGenerationsCount} Used</span>
                <span>{maxGenerations} Limit</span>
              </div>
              <Progress value={generationProgress} className="h-2 bg-border [&>div]:bg-blue-500" />
            </div>
          </Card>

          <Card className="p-8 card-alchemist flex flex-col justify-between border-l-4 border-l-orange-500">
            <div>
              <h2 className="text-xl font-serif font-medium uppercase tracking-wide mb-2">Storage</h2>
              <p className="text-muted-foreground text-sm mb-8">Audio, PDF, and Image assets stored on our servers.</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>{storageMB} MB</span>
                <span>{maxStorageMB} MB</span>
              </div>
              <Progress value={storageProgress} className="h-2 bg-border [&>div]:bg-orange-500" />
            </div>
          </Card>

          <div className="md:col-span-2 card-alchemist p-8 text-center bg-primary/5 mt-4">
            <h2 className="text-2xl font-serif font-medium tracking-tight mb-4">Need more juice? 🍋</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Upgrade to the Alchemist tier to get unlimited AI generations, 10GB of storage, and priority model access.
            </p>
            <Button 
              className="btn-alchemist px-10" 
              onClick={handleUpgrade}
              disabled={upgrading}
            >
              {upgrading ? <span className="material-symbols-rounded animate-spin">progress_activity</span> : "Upgrade Plan"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
