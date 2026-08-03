"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store";

export function HighContrastProvider({ children }: { children: React.ReactNode }) {
  const highContrast = useSettingsStore((state) => state.highContrast);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  return <>{children}</>;
}
