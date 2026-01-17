"use client"

import { useState } from "react"
import Link from "next/link"
import { PhotoGallery } from "@/components/photo-gallery"
import { Button } from "@/components/ui/button"
import { ImagePlus, Images, RotateCw } from "lucide-react"

export default function GalleryPage() {
  const [refresh, setRefresh] = useState(0)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Fotogallerij</h1>
          <nav className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ImagePlus className="size-4" />
                Upload
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="default" size="sm">
                <Images className="size-4" />
                Gallerij
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setRefresh(refresh + 1)}>
              <RotateCw className="size-4" />
            </Button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Foto Collectie</h2>
            <p className="text-muted-foreground">Nieuwste fotos eerst</p>
          </div>
          <PhotoGallery refresh={refresh} />
        </div>
      </div>
    </main>
  )
}
