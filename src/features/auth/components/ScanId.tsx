import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";

type ScanIdProps = {
  onFileSelected?: (file: File | null) => void;
};

export default function ScanId({ onFileSelected }: ScanIdProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  function handleFile(file: File | null) {
    if (file && !file.type.startsWith("image/")) return;

    setFileName(file?.name ?? "");
    onFileSelected?.(file);
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center gap-3">
        <Camera className="size-6 text-green-700" />
        <div>
          <p className="font-medium">Scan your ID</p>
          <p className="text-sm text-muted-foreground">
            Take a photo or upload an image
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {fileName ? (
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm">{fileName}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              handleFile(null);
            }}
            aria-label="Remove ID image"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 size-4" />
          Upload or Take Photo
        </Button>
      )}
    </div>
  );
}
