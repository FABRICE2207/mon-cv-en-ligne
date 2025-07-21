"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ExportOptionsProps {
  onExport: (options: ExportOptions) => void
  isExporting: boolean
  disabled?: boolean
}

export interface ExportOptions {
  format: "A4" | "Letter"
  orientation: "portrait" | "landscape"
  quality: "standard" | "high"
  includeColors: boolean
  filename?: string
}

export default function ExportOptions({ onExport, isExporting, disabled }: ExportOptionsProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: "A4",
    orientation: "portrait",
    quality: "high",
    includeColors: true,
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleExport = () => {
    onExport(options)
    setIsOpen(false)
  }

  const handleQuickExport = () => {
    onExport(options)
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Quick Export Button */}
      <Button
        onClick={handleQuickExport}
        disabled={isExporting || disabled}
        className="flex items-center space-x-2 w-full bg-blue-950 hover:bg-blue-00 text-white"
      >
        <Download className="h-4 w-full" />
        <span>{isExporting ? "Chargement..." : "Télécharger"}</span>
      </Button>

    </div>
  );
}
