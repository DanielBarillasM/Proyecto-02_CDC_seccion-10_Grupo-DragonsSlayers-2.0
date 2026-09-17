import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadText } from "../../lib/downloads";
import { grammarDescription, grammarSource } from "../../lib/examples";
import { CodeEditor } from "./CodeEditor";

export function GrammarTab({ theme }: { theme: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(grammarSource);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b-2 bg-card px-3 py-1.5">
        <div className="text-xs">
          <strong className="font-head">Compiscript.g4</strong>
          <span className="ml-2 text-muted-foreground">{grammarDescription}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copiada" : "Copiar"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => downloadText("Compiscript.g4", grammarSource)}>
            <Download size={14} /> .g4
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor value={grammarSource} language="plaintext" readOnly theme={theme} />
      </div>
    </div>
  );
}
