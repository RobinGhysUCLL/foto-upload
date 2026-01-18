"use client";

import type React from "react";

import { useState, useRef } from "react";
import { uploadPhoto } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";
import { useToast } from "./toast-provider";

export function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadPhoto(formData);

    if (result.success) {
      if (inputRef.current) inputRef.current.value = "";
      onSuccess();
      success("Foto succesvol geüpload! ✨");
    } else {
      error("Upload mislukt, probeer opnieuw");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <Cloud
            className={`size-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`}
          />
          <h3 className="font-semibold text-foreground">
            Sleep foto hier of klik
          </h3>
          <p className="text-sm text-muted-foreground">
            JPG, PNG of WebP tot 5MB
          </p>
        </div>
      </div>
      <Button disabled={isLoading} size="lg" className="w-full mt-4">
        {isLoading ? "Uploading..." : "Of selecteer handmatig"}
      </Button>
    </div>
  );
}
