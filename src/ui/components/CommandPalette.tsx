import {
  BookOpen,
  BrainCircuit,
  Braces,
  CheckCircle,
  Clipboard,
  Database,
  Download,
  Edit3,
  FileCode2,
  FlaskConical,
  FolderTree,
  Info,
  ListChecks,
  Moon,
  Play,
  RotateCcw,
  Sun
} from "lucide-react";
import { AlertCircle, AlertOctagon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import type { AnalysisMode } from "../../lib/types";
import type { DockTabId } from "./RightDock";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalyze: () => void;
  onReset: () => void;
  onCopyInput: () => void;
  onDownloadInput: () => void;
  onSelectExample: (mode: AnalysisMode) => void;
  onOpenGrammar: () => void;
  onSelectDock: (tab: DockTabId) => void;
  onOpenAbout: () => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  isRunning: boolean;
  isEmpty: boolean;
}

export function CommandPalette({
  open,
  onOpenChange,
  onAnalyze,
  onReset,
  onCopyInput,
  onDownloadInput,
  onSelectExample,
  onOpenGrammar,
  onSelectDock,
  onOpenAbout,
  theme,
  onThemeChange,
  isRunning,
  isEmpty
}: CommandPaletteProps) {
  function run(action: () => void) {
    action();
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Busca una acción del IDE…" />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>

        <CommandGroup heading="Acciones">
          <CommandItem disabled={isEmpty || isRunning} onSelect={() => run(onAnalyze)}>
            <Play /> Ejecutar análisis
          </CommandItem>
          <CommandItem onSelect={() => run(onReset)}>
            <RotateCcw /> Restablecer entrada
          </CommandItem>
          <CommandItem onSelect={() => run(onCopyInput)}>
            <Clipboard /> Copiar entrada
          </CommandItem>
          <CommandItem onSelect={() => run(onDownloadInput)}>
            <Download /> Descargar entrada .cps
          </CommandItem>
          <CommandItem onSelect={() => run(() => onThemeChange(theme === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? <Sun /> : <Moon />} Cambiar tema
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Ejemplos">
          <CommandItem onSelect={() => run(() => onSelectExample("valid"))}>
            <CheckCircle /> Entrada válida
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectExample("lexical"))}>
            <AlertCircle /> Errores léxicos
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectExample("syntax"))}>
            <AlertOctagon /> Errores sintácticos
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectExample("semantic-error"))}>
            <BrainCircuit /> Errores semánticos
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectExample("custom"))}>
            <Edit3 /> Archivo propio
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navegación">
          <CommandItem onSelect={() => run(onOpenGrammar)}>
            <BookOpen /> Abrir Compiscript.g4
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectDock("resultado"))}>
            <FileCode2 /> Panel resultado
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectDock("simbolos"))}>
            <Database /> Panel símbolos
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectDock("ambitos"))}>
            <FolderTree /> Panel ámbitos
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectDock("arboles"))}>
            <Braces /> Panel árboles
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectDock("documentacion"))}>
            <ListChecks /> Documentación
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectDock("exportar"))}>
            <Download /> Exportar evidencia
          </CommandItem>
          <CommandItem onSelect={() => run(() => onSelectDock("pruebas"))}>
            <FlaskConical /> Panel de pruebas
          </CommandItem>
          <CommandItem onSelect={() => run(onOpenAbout)}>
            <Info /> Acerca de
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
