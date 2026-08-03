"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { 
    emailNotifications, setEmailNotifications,
    highContrast, setHighContrast,
    autoSaveKits, setAutoSaveKits
  } = useSettingsStore();

  const [email, setEmail] = useState<string | null>("guest@lemonnotes.app");

  const handlePasswordReset = () => {
    toast.error("Guest accounts do not have passwords.");
  };

  return (
    <main className="min-h-screen bg-background pt-32 p-6 lg:p-12 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl font-serif font-medium tracking-tight uppercase mb-4">Account Settings</h1>
          <p className="text-muted-foreground font-light tracking-wide uppercase text-sm">Manage your Lemon Notes preferences.</p>
        </header>

        <div className="space-y-8">
          <Card className="p-8 card-alchemist">
            <h2 className="text-xl font-serif font-medium uppercase tracking-wide mb-6 border-b border-border pb-4">
              Profile
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Email Address</Label>
                  <p className="font-medium">{email || "Loading..."}</p>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Subscription</Label>
                  <p className="font-medium text-primary">Pro Tier</p>
                </div>
              </div>
              <Button variant="outline" className="btn-squishy-secondary mt-4" onClick={handlePasswordReset}>
                Change Password
              </Button>
            </div>
          </Card>

          <Card className="p-8 card-alchemist">
            <h2 className="text-xl font-serif font-medium uppercase tracking-wide mb-6 border-b border-border pb-4">
              Preferences
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">Email Notifications</h3>
                  <p className="text-muted-foreground text-sm">Receive study reminders and weekly recaps.</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">High Contrast UI</h3>
                  <p className="text-muted-foreground text-sm">Increase contrast for better readability.</p>
                </div>
                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">Auto-save Kits</h3>
                  <p className="text-muted-foreground text-sm">Automatically save generated study kits to folders.</p>
                </div>
                <Switch checked={autoSaveKits} onCheckedChange={setAutoSaveKits} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
