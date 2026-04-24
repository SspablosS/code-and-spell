import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  disabled: boolean;
}

export default function CodeEditor({ value, onChange, disabled }: CodeEditorProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  if (isMobile) {
    return (
      <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #2a3a6a', backgroundColor: '#0f172a' }}>
        <div
          style={{
            backgroundColor: '#2a1f4a',
            color: '#a78bfa',
            padding: '8px 12px',
            fontSize: '0.8rem',
            textAlign: 'center',
          }}
        >
          💻 Для полноценного редактора откройте на Desktop
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#0f172a',
            color: 'white',
            fontFamily: 'Fira Code, monospace',
            fontSize: '14px',
            padding: '12px',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #2a3a6a', backgroundColor: '#0f172a' }}>
      <div
        style={{
          backgroundColor: '#16213E',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid #2a3a6a',
        }}
      >
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#febc2e' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28c840' }} />
        <span
          style={{
            color: '#94a3b8',
            fontSize: '0.8rem',
            fontFamily: 'Fira Code, monospace',
            marginLeft: '8px',
          }}
        >
          spell.py
        </span>
      </div>
      <Editor
        height="280px"
        language="python"
        theme="vs-dark"
        value={value}
        onChange={(newValue) => onChange(newValue || '')}
        onMount={(editor, monaco) => {
          editor.addCommand(monaco.KeyCode.Enter, () => {
            const model = editor.getModel();
            const position = editor.getPosition();
            if (!model || !position) return;

            const currentLine = model.getLineContent(position.lineNumber).trim();

            if (currentLine.match(/^repeat \d+:$/)) {
              editor.executeEdits('auto-indent', [
                {
                  range: new monaco.Range(
                    position.lineNumber,
                    position.column,
                    position.lineNumber,
                    position.column
                  ),
                  text: '\n    ',
                },
              ]);
              editor.setPosition({
                lineNumber: position.lineNumber + 1,
                column: 5,
              });
            } else {
              editor.trigger('keyboard', 'type', { text: '\n' });
            }
          });
        }}
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          readOnly: disabled,
          padding: { top: 12, bottom: 12 },
          lineDecorationsWidth: 8,
          renderLineHighlight: 'line',
        }}
      />
    </div>
  );
}
