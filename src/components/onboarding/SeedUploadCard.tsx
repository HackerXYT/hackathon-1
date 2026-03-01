import { useRef, useState } from "react";
import { Upload, X, FileSpreadsheet, Check } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

interface SeedUploadCardProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function SeedUploadCard({ file, onFileChange }: SeedUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewRows, setPreviewRows] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onFileChange(selected);
    if (selected) {
      parsePreview(selected);
    } else {
      setPreviewRows([]);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0] ?? null;
    onFileChange(dropped);
    if (dropped) {
      parsePreview(dropped);
    } else {
      setPreviewRows([]);
    }
  };

  const parsePreview = (f: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (!text) return;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      // Show first 5 rows, mask emails for privacy preview
      const preview = lines.slice(0, 5).map((line) => {
        const email = line.split(",")[0].trim();
        if (email.includes("@")) {
          const [local, domain] = email.split("@");
          return `${local.slice(0, 2)}***@${domain}`;
        }
        return email.slice(0, 20);
      });
      setPreviewRows(preview);
    };
    reader.readAsText(f.slice(0, 2048)); // Only read first 2KB for preview
  };

  const handleRemove = () => {
    onFileChange(null);
    setPreviewRows([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Seed Audience List
        </p>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
          Optional
        </span>
        <InfoTooltip text="Upload a CSV of previous customer emails (hashed for privacy). The Media Buyer Agent uses this to create Lookalike Audiences on Meta, Google, and TikTok for faster results." />
      </div>

      {!file ? (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/30 transition-colors cursor-pointer group"
        >
          <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              Upload Customer List
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              CSV file with email addresses • Drag & drop or click to browse
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      ) : (
        <div className="rounded-xl border border-success/30 bg-success/5 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-success font-medium">
                <Check className="h-3 w-3" /> Uploaded
              </span>
              <button
                onClick={handleRemove}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {previewRows.length > 0 && (
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">
                Preview (first {previewRows.length} rows, masked):
              </p>
              <div className="space-y-0.5">
                {previewRows.map((row, i) => (
                  <p key={i} className="text-[11px] text-foreground font-mono">
                    {row}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-3 rounded-lg bg-secondary/30 border border-border">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">🔒 Privacy:</span> Email addresses are
          SHA-256 hashed before being sent to ad platforms. Raw emails are never stored or shared.
        </p>
      </div>
    </div>
  );
}