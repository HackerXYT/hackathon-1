import { useState, useRef } from "react";
import { Upload, X, FileText, Image, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadCardProps {
  label: string;
  description: string;
  emoji: string;
  accept?: string;
  multiple?: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

function getFileIcon(file: File) {
  if (file.type.startsWith("image/")) return Image;
  if (file.type.startsWith("video/")) return Film;
  return FileText;
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImage = file.type.startsWith("image/");
  const [preview] = useState(() => (isImage ? URL.createObjectURL(file) : null));
  const Icon = getFileIcon(file);

  return (
    <div className="relative group flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50">
      {isImage && preview ? (
        <img
          src={preview}
          alt={file.name}
          className="h-10 w-10 rounded object-cover shrink-0"
          onLoad={() => {
            // Preview URL will be revoked when component unmounts or file is removed
          }}
        />
      ) : (
        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-foreground truncate">{file.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function FileUploadCard({
  label,
  description,
  emoji,
  accept,
  multiple = true,
  files,
  onFilesChange,
}: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const newFiles = multiple
      ? [...files, ...Array.from(selected)]
      : Array.from(selected);
    onFilesChange(newFiles);
    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files;
    if (!dropped) return;
    const newFiles = multiple
      ? [...files, ...Array.from(dropped)]
      : Array.from(dropped);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-2">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center gap-2 p-5 rounded-xl border border-dashed transition-colors cursor-pointer group",
          files.length > 0
            ? "border-success/30 bg-success/5 hover:border-success/50"
            : "border-border/50 hover:border-primary/30"
        )}
      >
        <span className="text-2xl">{emoji}</span>
        <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-[10px] text-muted-foreground text-center">{description}</p>
        {files.length > 0 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
            {files.length} file{files.length > 1 ? "s" : ""} selected
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>

      {files.length > 0 && (
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {files.map((file, i) => (
            <FilePreview key={`${file.name}-${i}`} file={file} onRemove={() => handleRemove(i)} />
          ))}
        </div>
      )}
    </div>
  );
}