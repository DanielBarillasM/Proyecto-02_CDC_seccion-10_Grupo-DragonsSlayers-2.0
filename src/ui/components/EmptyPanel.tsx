import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyPanelProps {
  icon: ReactNode;
  title?: string;
  text?: string;
  className?: string;
}

export function EmptyPanel({ icon, title, text, className }: EmptyPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded border-2 bg-card p-4 text-center text-sm text-muted-foreground",
        className
      )}
    >
      {icon}
      {title && <strong className="font-head text-foreground">{title}</strong>}
      {text && <p>{text}</p>}
    </div>
  );
}
