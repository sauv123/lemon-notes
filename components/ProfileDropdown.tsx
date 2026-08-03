"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProfileDropdown() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>("guest@lemonnotes.app");

  const handleSignOut = () => {
    router.push("/");
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-9 w-9 border border-border cursor-pointer transition-transform hover:scale-105">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {email ? getInitials(email) : "US"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Account</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email || "Loading..."}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => {
          toast.info("Account Settings (Coming Soon)");
        }} className="cursor-pointer">
          <span className="material-symbols-rounded mr-2 text-[18px]">settings</span>
          <span>Account Settings</span>
          <span className="ml-auto text-[10px] uppercase bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">Soon</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => router.push("/folders")} className="cursor-pointer">
          <span className="material-symbols-rounded mr-2 text-[18px]">folder</span>
          <span>My Folders</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => {
          toast.info("Usage & Quotas (Coming Soon)");
        }} className="cursor-pointer">
          <span className="material-symbols-rounded mr-2 text-[18px]">data_usage</span>
          <span>Usage & Quotas</span>
          <span className="ml-auto text-[10px] uppercase bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">Soon</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          <span className="material-symbols-rounded mr-2 text-[18px]">light_mode</span>
          <span>Light Mode</span>
          {theme === "light" && <span className="material-symbols-rounded ml-auto text-[18px] text-green-500">check</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          <span className="material-symbols-rounded mr-2 text-[18px]">dark_mode</span>
          <span>Dark Mode</span>
          {theme === "dark" && <span className="material-symbols-rounded ml-auto text-[18px] text-green-500">check</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          <span className="material-symbols-rounded mr-2 text-[18px]">computer</span>
          <span>System Theme</span>
          {theme === "system" && <span className="material-symbols-rounded ml-auto text-[18px] text-green-500">check</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/support")} className="cursor-pointer">
          <span className="material-symbols-rounded mr-2 text-[18px]">help</span>
          <span>Help & Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
          <span className="material-symbols-rounded mr-2 text-[18px]">logout</span>
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
