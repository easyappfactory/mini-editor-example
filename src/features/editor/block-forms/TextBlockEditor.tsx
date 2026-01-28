'use client';

interface TextBlockEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

export default function TextBlockEditor({ content, onUpdate }: TextBlockEditorProps) {
  return (
    <textarea
      value={content}
      onChange={(e) => onUpdate(e.target.value)}
      className="w-full border border-border rounded p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none min-h-[80px]"
      rows={3}
    />
  );
}
