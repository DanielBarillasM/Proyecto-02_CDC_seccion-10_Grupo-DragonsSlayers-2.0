import { Braces, Code2, Database, GitBranch, GraduationCap, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  { label: "ANTLR 4", icon: <Braces size={13} /> },
  { label: "TypeScript", icon: <Code2 size={13} /> },
  { label: "Tabla de símbolos", icon: <Database size={13} /> },
  { label: "Ámbitos léxicos", icon: <GitBranch size={13} /> }
];

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-1.5 text-xs font-head uppercase tracking-wide text-muted-foreground">
            <GraduationCap size={14} /> Construcción de Compiladores · Proyecto 1
          </div>
          <DialogTitle className="text-lg">
            Compiscript <span className="text-primary">Semantic IDE</span>
          </DialogTitle>
          <DialogDescription>
            Un laboratorio visual para recorrer el código fuente desde los tokens hasta los tipos, símbolos y
            ámbitos que le dan significado.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5">
          {capabilities.map((item) => (
            <Badge key={item.label} variant="outline">
              {item.icon}
              {item.label}
            </Badge>
          ))}
        </div>

        <div className="flex items-start gap-2 rounded border-2 bg-secondary p-3 text-secondary-foreground">
          <ShieldCheck size={20} className="mt-0.5 shrink-0" />
          <div className="text-sm">
            <small className="text-secondary-foreground/70">Motor activo</small>
            <strong className="block font-head">Pipeline de tres fases</strong>
            <p className="text-secondary-foreground/70">
              Lexer, parser y visitor semántico conectados al mismo resultado verificable.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
