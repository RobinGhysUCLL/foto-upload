// components/ui/toast.tsx
"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  id: string
  message: string
  type?: ToastType
  onClose: (id: string) => void
}

export function Toast({ id, message, type = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [id, onClose])

  const colors = {
    success: "bg-green-500 border-green-600",
    error: "bg-red-500 border-red-600",
    warning: "bg-yellow-500 border-yellow-600",
    info: "bg-blue-500 border-blue-600",
  }

  return (
    <div
      className={`${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center justify-between gap-3 min-w-[300px] max-w-[500px] animate-in slide-in-from-right duration-300`}
    >
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}