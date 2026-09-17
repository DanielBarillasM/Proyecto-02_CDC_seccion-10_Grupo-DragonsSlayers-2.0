import { Keyboard, Moon, Play, RotateCcw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import type { AnalyzeResult } from "../../lib/types";
import { PhasePipeline } from "./PhasePipeline";

interface ToolbarProps {
  isRunning: boolean;
  isEmpty: boolean;
  onAnalyze: () => void;
  onReset: () => void;
  result: AnalyzeResult | null;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}

export function Toolbar({ isRunning, isEmpty, onAnalyze, onReset, result, theme, onThemeChange }: ToolbarProps) {
  return (
    <div className="flex h-10 items-center gap-2 border-b-2 bg-card px-2">
      <Button size="sm" onClick={onAnalyze} disabled={isEmpty || isRunning}>
        <Play size={14} />
        {isRunning ? "Analizando…" : "Ejecutar análisis"}
      </Button>
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Keyboard size={13} /> Ctrl + Enter
      </span>

      <div className="mx-2 h-5 w-0.5 bg-border" />
      <PhasePipeline result={result} />

      <div className="flex-1" />

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Restablecer">
                <RotateCcw size={15} />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Restablecer entrada</TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restablecer entrada</AlertDialogTitle>
            <AlertDialogDescription>
              Se perderá el código actual y se volverá al caso de ejemplo "Entrada válida".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onReset}>Restablecer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Cambiar tema"
            onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Cambiar tema</TooltipContent>
      </Tooltip>
    </div>
  );
}
