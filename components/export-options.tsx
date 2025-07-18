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
      <Button onClick={handleQuickExport} disabled={isExporting || disabled} className="flex items-center space-x-2">
        <Download className="h-4 w-4" />
        <span>{isExporting ? "Export..." : "Export PDF"}</span>
      </Button>

      {/* Advanced Options Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" disabled={isExporting || disabled}>
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Options d'export PDF</DialogTitle>
            <DialogDescription>Personnalisez les paramètres d'export de votre CV</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Format */}
            <div className="space-y-2">
              <Label>Format de page</Label>
              <Select
                value={options.format}
                onValueChange={(value: "A4" | "Letter") => setOptions((prev) => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <Label>Orientation</Label>
              <Select
                value={options.orientation}
                onValueChange={(value: "portrait" | "landscape") =>
                  setOptions((prev) => ({ ...prev, orientation: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Paysage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <Label>Qualité</Label>
              <Select
                value={options.quality}
                onValueChange={(value: "standard" | "high") => setOptions((prev) => ({ ...prev, quality: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (plus rapide)</SelectItem>
                  <SelectItem value="high">Haute qualité (recommandé)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Colors */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="colors"
                checked={options.includeColors}
                onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeColors: checked as boolean }))}
              />
              <Label htmlFor="colors">Inclure les couleurs</Label>
            </div>

            {/* Export Button */}
            <Button onClick={handleExport} className="w-full" disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Export en cours..." : "Exporter le PDF"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
