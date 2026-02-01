"use server"

import { writeFile, mkdir, readdir, stat } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 500 * 1024 * 1024 // 5MB

export async function uploadPhoto(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { error: "Geen bestand geselecteerd" }
    }

    // Valideer bestandstype
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { error: "Alleen JPG, PNG, WebP en GIF zijn toegestaan" }
    }

    // Valideer bestandsgrootte
    if (file.size > MAX_SIZE) {
      return { error: "Bestand is te groot (max 500MB)" }
    }

    // Maak uploads directory aan als deze niet bestaat
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Genereer unieke bestandsnaam
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}-${randomStr}.${extension}`
    const filepath = join(UPLOAD_DIR, filename)

    // Schrijf bestand
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    return { success: true, filename }
  } catch (error) {
    console.error("Upload error:", error)
    return { error: "Upload mislukt" }
  }
}

export async function getPhotos() {
  try {
    if (!existsSync(UPLOAD_DIR)) {
      return []
    }

    const files = await readdir(UPLOAD_DIR)
    const photos = await Promise.all(
      files
        .filter((f) => ["jpg", "jpeg", "png", "webp", "gif"].includes(f.split(".").pop()?.toLowerCase() || ""))
        .map(async (filename) => {
          const filepath = join(UPLOAD_DIR, filename)
          const stats = await stat(filepath)
          return {
            filename,
            url: `/uploads/${filename}`,
            uploadedAt: stats.mtime,
          }
        }),
    )

    // Sorteer op nieuwste eerst
    return photos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
  } catch (error) {
    console.error("Error reading photos:", error)
    return []
  }
}
