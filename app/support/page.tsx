"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { useState } from "react";

export default function SupportPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent! Our support team will get back to you shortly.");
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background pt-32 p-6 lg:p-12 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl font-serif font-medium tracking-tight uppercase mb-4">Help & Support</h1>
          <p className="text-muted-foreground font-light tracking-wide uppercase text-sm">We&apos;re here to help you get the most out of Lemon Notes.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-medium tracking-wide">Frequently Asked Questions</h2>
            {/* @ts-expect-error - third party component issue */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">How do I upload audio?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  You can drag and drop any .mp3, .wav, or .m4a file directly into the main Dashboard area. Our system will automatically transcribe it into text.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">What is the Alchemist tier?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  The Alchemist tier is our premium offering that gives you unlimited AI generation, priority customer support, and advanced PDF scanning features.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">How are quotas calculated?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Every time you generate a new study kit or quiz, 1 AI Generation is deducted from your balance. Storage limits are based on the combined size of the files you upload.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">Can I export my notes?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes, you can copy your generated summaries and quizzes directly. We will be adding dedicated PDF export functionality soon!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="p-8 card-alchemist relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
              <h2 className="text-2xl font-serif font-medium tracking-wide mb-6">Contact Us</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What do you need help with?" required className="bg-background/50 border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue in detail..." 
                    required 
                    className="min-h-[150px] resize-none bg-background/50 border-border"
                  />
                </div>
                <Button type="submit" className="w-full btn-alchemist mt-4" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
