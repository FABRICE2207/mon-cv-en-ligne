"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, AlertCircle } from "lucide-react"

interface ExportDebugProps {
  onExport: () => void
  isExporting: boolean
}

export default function ExportDebug({ onExport, isExporting }: ExportDebugProps) {
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const runDiagnostic = () => {
    const info: string[] = []

    // Vérifier l'élément CV
    const cvElement = document.getElementById("cv-preview")
    if (cvElement) {
      info.push("✅ Élément CV trouvé")
      info.push(`📏 Dimensions: ${cvElement.scrollWidth}x${cvElement.scrollHeight}px`)
    } else {
      info.push("❌ Élément CV non trouvé")
    }

    // Vérifier les images
    const images = document.querySelectorAll("#cv-preview img")
    info.push(`🖼️ Images trouvées: ${images.length}`)

    images.forEach((img, index) => {
      const imgElement = img as HTMLImageElement
      if (imgElement.complete) {
        info.push(`✅ Image ${index + 1}: Chargée (${imgElement.naturalWidth}x${imgElement.naturalHeight})`)
      } else {
        info.push(`⏳ Image ${index + 1}: En cours de chargement`)
      }
    })

    // Vérifier les bibliothèques
    info.push("📚 Vérification des bibliothèques...")

    setDebugInfo(info)
  }

  const testExport = async () => {
    try {
      setDebugInfo((prev) => [...prev, "🚀 Début du test d'export..."])

      const html2canvas = await import("html2canvas")
      setDebugInfo((prev) => [...prev, "✅ html2canvas chargé"])

      const jsPDF = await import("jspdf")
      setDebugInfo((prev) => [...prev, "✅ jsPDF chargé"])

      const element = document.getElementById("cv-preview")
      if (!element) {
        setDebugInfo((prev) => [...prev, "❌ Élément CV non trouvé"])
        return
      }

      setDebugInfo((prev) => [...prev, "📸 Génération du canvas..."])

      const canvas = await html2canvas.default(element, {
        scale: 1,
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      setDebugInfo((prev) => [...prev, `✅ Canvas généré: ${canvas.width}x${canvas.height}px`])

      const pdf = new jsPDF.default()
      setDebugInfo((prev) => [...prev, "✅ PDF créé"])

      const imgData = canvas.toDataURL("image/png")
      setDebugInfo((prev) => [...prev, "✅ Image convertie en base64"])

      pdf.addImage(imgData, "PNG", 10, 10, 190, 0)
      setDebugInfo((prev) => [...prev, "✅ Image ajoutée au PDF"])

      pdf.save("test-cv.pdf")
      setDebugInfo((prev) => [...prev, "🎉 Export réussi !"])
    } catch (error) {
      setDebugInfo((prev) => [...prev, `❌ Erreur: ${error}`])
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Diagnostic d'export PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runDiagnostic} variant="outline">
            Diagnostic
          </Button>
          <Button onClick={testExport} variant="outline">
            Test Export
          </Button>
          <Button onClick={onExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Export..." : "Export Normal"}
          </Button>
        </div>

        {debugInfo.length > 0 && (
          <Alert>
            <AlertDescription>
              <div className="space-y-1 font-mono text-sm">
                {debugInfo.map((info, index) => (
                  <div key={index}>{info}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
