import { useRef } from "react";
import { Braces, Code2, Database, GitBranch, Play, Upload } from "lucide-react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from "@/components/ui/menubar";
import { Badge } from "@/components/ui/badge";
import { AboutDialog } from "./AboutDialog";

const capabilities = [
  { label: "ANTLR 4", icon: <Braces size={12} /> },
  { label: "TypeScript", icon: <Code2 size={12} /> },
  { label: "Tabla de símbolos", icon: <Database size={12} /> },
  { label: "Ámbitos léxicos", icon: <GitBranch size={12} /> }
];

interface MenuBarProps {
  onLoadFile: (text: string) => void;
  onFileError: (message: string) => void;
  onDownloadInput: () => void;
  onCopyInput: () => void;
  onReset: () => void;
  onAnalyze: () => void;
  isRunning: boolean;
  isEmpty: boolean;
  onExportFocus: () => void;
  onOpenDocs: () => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  aboutOpen: boolean;
  onAboutOpenChange: (open: boolean) => void;
}

export function MenuBar({
  onLoadFile,
  onFileError,
  onDownloadInput,
  onCopyInput,
  onReset,
  onAnalyze,
  isRunning,
  isEmpty,
  onExportFocus,
  onOpenDocs,
  theme,
  onThemeChange,
  aboutOpen,
  onAboutOpenChange
}: MenuBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".cps")) {
      onFileError("El archivo seleccionado debe tener extensión .cps.");
      return;
    }
    onLoadFile(await file.text());
  }

  return (
    <div className="flex h-10 items-center gap-3 border-b-2 bg-card px-2">
      <div className="flex size-6 items-center justify-center rounded border-2 bg-primary font-head text-xs text-primary-foreground">
        CS
      </div>
      <span className="font-head text-sm">Compiscript Semantic IDE</span>

      <input ref={fileInputRef} type="file" accept=".cps,text/plain" hidden onChange={handleFile} />

      <Menubar className="h-auto border-0 bg-transparent px-0 shadow-none">
        <MenubarMenu>
          <MenubarTrigger>Archivo</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => fileInputRef.current?.click()}>
              <Upload size={14} /> Cargar .cps
            </MenubarItem>
            <MenubarItem onClick={onDownloadInput}>Descargar entrada .cps</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={onExportFocus}>Exportar evidencia</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Editar</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onCopyInput}>Copiar entrada</MenubarItem>
            <MenubarItem onClick={onReset}>Restablecer</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Ejecutar</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onAnalyze} disabled={isEmpty || isRunning}>
              <Play size={14} /> Ejecutar análisis
              <MenubarShortcut>Ctrl+Enter</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Ver</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onOpenDocs}>Documentación</MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem checked={theme === "dark"} onCheckedChange={(checked) => onThemeChange(checked ? "dark" : "light")}>
              Tema oscuro
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Ayuda</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => onAboutOpenChange(true)}>Acerca de</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <div className="ml-auto hidden items-center gap-1.5 lg:flex">
        {capabilities.map((item) => (
          <Badge key={item.label} variant="outline">
            {item.icon}
            {item.label}
          </Badge>
        ))}
      </div>

      <AboutDialog open={aboutOpen} onOpenChange={onAboutOpenChange} />
    </div>
  );
}
