import { cn } from "@/lib/utils";

export function LemonPencilLogo({ className }: { className?: string }) {
  return (
    <svg className={cn("w-10 h-10", className)} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Minimalist 3D Lemon Shadow */}
      <path d="M 28 80 C 8 90, 8 50, 28 30 C 48 10, 88 10, 78 30 C 98 40, 98 80, 78 80 C 58 100, 18 100, 28 80 Z" fill="#111" />
      {/* Lemon Body */}
      <path d="M 25 75 C 5 85, 5 45, 25 25 C 45 5, 85 5, 75 25 C 95 15, 95 55, 75 75 C 55 95, 15 95, 25 75 Z" fill="#FFD95A" stroke="#111" strokeWidth="4" strokeLinejoin="round"/>
      
      {/* Pencil */}
      <g transform="rotate(-15 50 50)">
        {/* Pencil body */}
        <rect x="15" y="45" width="60" height="12" fill="#FAFAFA" stroke="#111" strokeWidth="4"/>
        <line x1="15" y1="51" x2="75" y2="51" stroke="#111" strokeWidth="2" opacity="0.3"/>
        {/* Pencil Tip */}
        <path d="M 75 45 L 92 51 L 75 57 Z" fill="#FFCDD2" stroke="#111" strokeWidth="4" strokeLinejoin="round"/>
        <polygon points="86,48.8 92,51 86,53.2" fill="#111" />
        {/* Eraser End */}
        <rect x="5" y="45" width="10" height="12" fill="#FF4B4B" stroke="#111" strokeWidth="4"/>
      </g>
    </svg>
  );
}
