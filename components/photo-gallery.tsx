"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getPhotos } from "@/app/actions";
import { Copy, Check } from "lucide-react";
import { useToast } from "./toast-provider";

type Photo = {
  filename: string;
  url: string;
  uploadedAt: string;
};

export function PhotoGallery({ refresh }: { refresh: number }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { success, error, info } = useToast();

  useEffect(() => {
    loadPhotos();
  }, [refresh]);

  const loadPhotos = async () => {
    setIsLoading(true);
    const data = await getPhotos();
    const photosWithStringDates = data.map((photo) => ({
      ...photo,
      uploadedAt: photo.uploadedAt.toISOString(),
    }));
    setPhotos(photosWithStringDates);
    setIsLoading(false);
  };

  const handleCopyLink = async (fullUrl: string) => {
    try {
      await navigator.clipboard.writeText(`http://localhost:3000${fullUrl}`);
      setCopiedUrl(fullUrl);
      success("Link gekopieerd naar clipboard! 🎉");
        setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error("Kopiëren naar clipboard mislukt:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">Fotos worden geladen...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nog geen fotos geüpload</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.filename}
          className="group relative overflow-hidden rounded-lg bg-muted aspect-square hover:cursor-pointer"
          onClick={() => handleCopyLink(photo.url)}
        >
          <Image
            src={photo.url || "/placeholder.svg"}
            alt={photo.filename}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              className="p-2 bg-white rounded-lg hover:bg-white/90 transition-colors"
              title="Link kopiëren"
            >
              {copiedUrl === photo.url ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
