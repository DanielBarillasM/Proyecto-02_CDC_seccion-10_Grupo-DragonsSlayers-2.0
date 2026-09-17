import { useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { ensureCompiscriptLanguage, monaco } from "../monaco/setup";

export interface EditorMarker {
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  severity: "error" | "warning";
}

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  language?: string;
  markers?: EditorMarker[];
  revealLine?: number;
  onRunShortcut?: () => void;
  theme: "light" | "dark";
  onCursorChange?: (position: { line: number; column: number }) => void;
}

const MARKER_OWNER = "compiscript";

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  language = "compiscript",
  markers = [],
  revealLine,
  onRunShortcut,
  theme,
  onCursorChange
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const onRunShortcutRef = useRef(onRunShortcut);

  useEffect(() => {
    ensureCompiscriptLanguage();
  }, []);

  useEffect(() => {
    onRunShortcutRef.current = onRunShortcut;
  }, [onRunShortcut]);

  useEffect(() => {
    const model = editorRef.current?.getModel();
    if (!model) return;

    monaco.editor.setModelMarkers(
      model,
      MARKER_OWNER,
      markers.map((marker) => ({
        startLineNumber: marker.line,
        startColumn: marker.column,
        endLineNumber: marker.endLine ?? marker.line,
        endColumn: marker.endColumn ?? marker.column + 1,
        message: marker.message,
        severity: marker.severity === "error" ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning
      }))
    );
  }, [markers, value]);

  useEffect(() => {
    if (revealLine === undefined) return;
    const currentEditor = editorRef.current;
    if (!currentEditor) return;
    currentEditor.revealLineInCenter(revealLine);
    currentEditor.setPosition({ lineNumber: revealLine, column: 1 });
    currentEditor.focus();
  }, [revealLine]);

  const handleMount: OnMount = (mountedEditor) => {
    editorRef.current = mountedEditor;

    mountedEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunShortcutRef.current?.();
    });

    mountedEditor.onDidChangeCursorPosition((event) => {
      onCursorChange?.({ line: event.position.lineNumber, column: event.position.column });
    });
  };

  return (
    <Editor
      value={value}
      language={language}
      theme={theme === "dark" ? "compiscript-dark" : "compiscript-light"}
      onChange={(next) => onChange?.(next ?? "")}
      onMount={handleMount}
      options={{
        readOnly,
        tabSize: 2,
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        renderLineHighlight: readOnly ? "none" : "line"
      }}
    />
  );
}
