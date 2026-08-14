"use client";

import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useState } from "react";

// Serve Monaco from the locally installed package instead of a remote CDN
// so the editor mounts fast and works offline.
loader.config({ monaco });

type CodeEditorProps = {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (next: string) => void;
  language?: string;
  readOnly?: boolean;
};

const CodeEditor = ({
  value,
  onChange,
  language = "javascript",
  readOnly = false,
}: CodeEditorProps) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    // Ensure the loader resolves before the Editor mounts (avoids a second
    // remote fetch when the page hot-reloads).
    loader.init().then(() => setIsEditorReady(true));
  }, []);

  return (
    <div className="h-full w-full bg-[#1e1e1e]">
      {!isEditorReady && (
        <div className="h-full w-full flex items-center justify-center gap-2 text-textGray">
          <div className="w-4 h-4 rounded-full border-2 border-iconBlue border-t-transparent animate-spin" />
          <span className="text-sm">Loading editor...</span>
        </div>
      )}
      {isEditorReady && (
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={(v) => onChange(v ?? "")}
          theme="vs-dark"
          loading={<div />}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            tabSize: 2,
            readOnly,
          }}
        />
      )}
    </div>
  );
};

export default CodeEditor;
