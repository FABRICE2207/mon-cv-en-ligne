"use client"

import { forwardRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Linkedin, Calendar } from "lucide-react"

interface CVData {
  titre: string
  description: string
  modele: string
  informations_personnelles: {
    nom: string
    prenom: string
    email: string
    telephone: string
    adresse: string
    linkedin: string
  }
  experiences: Array<{
    id: string
    titre_poste: string
    nom_entreprise: string
    date_debut: string
    date_fin: string
    description: string
  }>
  formations: Array<{
    id: string
    diplome: string
    nom_etablissement: string
    date_debut: string
    date_fin: string
    description: string
  }>
  competences: Array<{
    id: string
    nom_competence: string
    niveau: string
  }>
  langues: Array<{
    id: string
    nom_langue: string
    niveau: string
  }>
  projets: Array<{
    id: string
    nom_projet: string
    description: string
    technologies: string
    realisations: string
  }>
  certifications: Array<{
    id: string
    nom_certification: string
    date_obtention: string
    description: string
  }>
  centres_interet: Array<{
    id: string
    nom_centre_interet: string
    description: string
  }>
}

interface EnhancedCVPreviewProps {
  cvData: CVData
  exportMode?: boolean
  includeColors?: boolean
}

const formatDate = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
}

const getNiveauColor = (niveau: string, includeColors = true) => {
  if (!includeColors) return "bg-gray-100 text-gray-800"

  switch (niveau.toLowerCase()) {
    case "débutant":
      return "bg-red-100 text-red-800"
    case "intermédiaire":
      return "bg-yellow-100 text-yellow-800"
    case "avancé":
      return "bg-blue-100 text-blue-800"
    case "expert":
      return "bg-green-100 text-green-800"
    case "natif":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const EnhancedCVPreview = forwardRef<HTMLDivElement, EnhancedCVPreviewProps>(
  ({ cvData, exportMode = false, includeColors = true }, ref) => {
    const { informations_personnelles: info } = cvData

    const headerBgClass = includeColors
      ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      : "bg-gray-800 text-white"

    const iconColorClass = includeColors ? "text-blue-600" : "text-gray-600"

    return (
      <div
        ref={ref}
        id="cv-preview"
        className={`w-full max-w-4xl mx-auto bg-white ${exportMode ? "print-optimized" : ""}`}
        style={
          exportMode
            ? {
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                lineHeight: "1.4",
                color: "#333",
              }
            : {}
        }
      >
        <Card className={`${exportMode ? "border-0 shadow-none" : "shadow-lg"}`}>
          <CardHeader className={`text-center ${headerBgClass} ${exportMode ? "print:bg-gray-800" : ""}`}>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                {info.prenom} {info.nom}
              </h1>
              {cvData.titre && <p className="text-xl opacity-90">{cvData.titre}</p>}
              {cvData.description && <p className="opacity-80 max-w-2xl mx-auto">{cvData.description}</p>}
            </div>
          </CardHeader>

          <CardContent className={`space-y-6 ${exportMode ? "p-4 space-y-4" : "p-6"}`}>
            {/* Informations de contact */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {info.email && (
                <div className="flex items-center gap-2">
                  <Mail className={`h-4 w-4 ${iconColorClass}`} />
                  <span className="break-all">{info.email}</span>
                </div>
              )}
              {info.telephone && (
                <div className="flex items-center gap-2">
                  <Phone className={`h-4 w-4 ${iconColorClass}`} />
                  <span>{info.telephone}</span>
                </div>
              )}
              {info.adresse && (
                <div className="flex items-center gap-2">
                  <MapPin className={`h-4 w-4 ${iconColorClass}`} />
                  <span>{info.adresse}</span>
                </div>
              )}
              {info.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className={`h-4 w-4 ${iconColorClass}`} />
                  <span className="truncate text-xs">{info.linkedin}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Expériences */}
            {cvData.experiences.length > 0 && (
              <div className={exportMode ? "break-inside-avoid" : ""}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Expériences professionnelles</h2>
                <div className="space-y-4">
                  {cvData.experiences.map((exp, index) => (
                    <div
                      key={exp.id}
                      className={`border-l-4 ${includeColors ? "border-blue-600" : "border-gray-400"} pl-4 ${exportMode && index > 0 ? "break-inside-avoid" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg leading-tight">{exp.titre_poste}</h3>
                          <p className={`font-medium ${includeColors ? "text-blue-600" : "text-gray-600"}`}>
                            {exp.nom_entreprise}
                          </p>
                        </div>
                        {(exp.date_debut || exp.date_fin) && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0">
                            <Calendar className="h-4 w-4" />
                            <span className="whitespace-nowrap">
                              {formatDate(exp.date_debut)} - {exp.date_fin ? formatDate(exp.date_fin) : "Présent"}
                            </span>
                          </div>
                        )}
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formations */}
            {cvData.formations.length > 0 && (
              <div className={exportMode ? "break-inside-avoid" : ""}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Formations</h2>
                <div className="space-y-4">
                  {cvData.formations.map((formation, index) => (
                    <div
                      key={formation.id}
                      className={`border-l-4 ${includeColors ? "border-green-600" : "border-gray-400"} pl-4 ${exportMode && index > 0 ? "break-inside-avoid" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg leading-tight">{formation.diplome}</h3>
                          <p className={`font-medium ${includeColors ? "text-green-600" : "text-gray-600"}`}>
                            {formation.nom_etablissement}
                          </p>
                        </div>
                        {(formation.date_debut || formation.date_fin) && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0">
                            <Calendar className="h-4 w-4" />
                            <span className="whitespace-nowrap">
                              {formatDate(formation.date_debut)} - {formatDate(formation.date_fin)}
                            </span>
                          </div>
                        )}
                      </div>
                      {formation.description && (
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {formation.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compétences et Langues */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Compétences */}
              {cvData.competences.length > 0 && (
                <div className={exportMode ? "break-inside-avoid" : ""}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Compétences</h2>
                  <div className="space-y-3">
                    {cvData.competences.map((comp) => (
                      <div key={comp.id} className="flex justify-between items-center gap-2">
                        <span className="font-medium flex-1 min-w-0 truncate">{comp.nom_competence}</span>
                        <Badge className={`${getNiveauColor(comp.niveau, includeColors)} flex-shrink-0 text-xs`}>
                          {comp.niveau}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Langues */}
              {cvData.langues.length > 0 && (
                <div className={exportMode ? "break-inside-avoid" : ""}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Langues</h2>
                  <div className="space-y-3">
                    {cvData.langues.map((langue) => (
                      <div key={langue.id} className="flex justify-between items-center gap-2">
                        <span className="font-medium flex-1 min-w-0 truncate">{langue.nom_langue}</span>
                        <Badge className={`${getNiveauColor(langue.niveau, includeColors)} flex-shrink-0 text-xs`}>
                          {langue.niveau}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message si CV vide */}
            {!info.prenom &&
              !info.nom &&
              cvData.experiences.length === 0 &&
              cvData.formations.length === 0 &&
              !exportMode && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Votre CV apparaîtra ici en temps réel</p>
                  <p className="text-sm">Commencez par remplir vos informations personnelles</p>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Print styles */}
        <style jsx>{`
          @media print {
            .print-optimized {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .break-inside-avoid {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}</style>
      </div>
    )
  },
)

EnhancedCVPreview.displayName = "EnhancedCVPreview"

export default EnhancedCVPreview
