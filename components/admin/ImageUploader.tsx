"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (images.length + files.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);
      const newImages: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (data.success) {
            newImages.push(data.data.url);
          } else {
            toast.error(data.error || "Upload failed");
          }
        } catch {
          toast.error("Upload failed");
        }
      }

      onChange([...images, ...newImages]);
      setUploading(false);
    },
    [images, maxImages, onChange]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border hover:border-silver/50 transition-colors p-8 text-center cursor-pointer"
        onClick={() => document.getElementById("image-upload")?.click()}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        {uploading ? (
          <Loader2 className="w-8 h-8 text-red mx-auto animate-spin" />
        ) : (
          <>
            <Upload className="w-8 h-8 text-silver/30 mx-auto mb-2" />
            <p className="text-silver/50 text-sm font-body">
              Drag & drop images or click to browse
            </p>
            <p className="text-silver/30 text-xs font-body mt-1">
              {images.length}/{maxImages} images • PNG, JPG, WebP
            </p>
          </>
        )}
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative w-20 h-20 bg-card border border-border group"
            >
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
