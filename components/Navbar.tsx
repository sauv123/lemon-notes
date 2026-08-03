"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LemonPencilLogo } from "./LemonPencilLogo";
import { useStudyStore } from "@/lib/store";
import { ProfileDropdown } from "./ProfileDropdown";

export function Navbar() {
  const pathname = usePathname();
  const resetStudyData = useStudyStore((state) => state.resetStudyData);

  // Hide Navbar on the landing page and login page
  if (pathname === "/" || pathname === "/login") return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <LemonPencilLogo className="w-7 h-7 group-hover:rotate-6 transition-transform duration-500" />
          <span className="font-serif font-medium text-xl tracking-wide uppercase hidden sm:block">Lemon Notes</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className={`text-xs uppercase tracking-widest transition-colors ${pathname === "/dashboard" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/folders" 
            className={`text-xs uppercase tracking-widest transition-colors ${pathname === "/folders" ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            My Folders
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/study" onClick={() => resetStudyData()}>
          <Button className="btn-alchemist hidden sm:flex items-center gap-2 !py-2 !px-6">
            <span className="material-symbols-rounded text-[18px]">add</span>
            New Document
          </Button>
          {/* Mobile version */}
          <Button size="icon" className="btn-alchemist flex sm:hidden">
            <span className="material-symbols-rounded text-[18px]">add</span>
          </Button>
        </Link>
        
        <ProfileDropdown />
      </div>
    </nav>
  );
}
