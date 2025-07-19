import { apiImg } from "@/axios.config"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Mail, Phone, MapPin, Linkedin, Calendar, Award, Code, Globe } from "lucide-react"

interface CVData {
  titre: string
  informations_personnelles: {
    description: string
    username: string
    email: string
    telephone: string
    adresse: string
    linkedin: string
    photos: string // Add this line
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
}

interface ModerneTemplateProps {
  cvData: CVData
  exportMode?: boolean
  includeColors?: boolean
  previewOnly?: boolean
}

const formatDate = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
}

const getNiveauWidth = (niveau: string) => {
  switch (niveau.toLowerCase()) {
    case "débutant":
      return "w-1/4"
    case "intermédiaire":
      return "w-2/4"
    case "avancé":
      return "w-3/4"
    case "expert":
    case "natif":
      return "w-full"
    default:
      return "w-1/4"
  }
}

export default function ModerneTemplate({ cvData,
  exportMode = false,
  includeColors = true,
  previewOnly = false}: ModerneTemplateProps) {
  const { informations_personnelles: info } = cvData

  const primaryColor = includeColors ? "bg-blue-600" : "bg-gray-800"
  const accentColor = includeColors ? "text-blue-600" : "text-gray-600"
  const gradientBg = includeColors ? "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800" : "bg-gray-800"

  const API_URL = "http://192.168.1.2:5000";

  return (
    <div
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
      <Card className={`${exportMode ? "border-0 shadow-none" : "shadow-xl"} overflow-hidden`}>
        {/* Header avec design moderne */}
        {!previewOnly && 
          <div>
              <CardHeader className={`${gradientBg} text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10 text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  {info.username} 
                </h1>
                {/* Add this section after the title div and before the description */}
                {info.photos && (
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <img
                        src={`${info.photos}`}
                        alt={`${info.username}`}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                      />

                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                )}
                {cvData.titre && (
                  <div className="inline-block px-4 py-2 bg-white/20 rounded-full">
                    <p className="text-lg font-medium">{cvData.titre}</p>
                  </div>
                )}
              </div>

              {/* {cvData.description && (
                <p className="text-blue-100 max-w-2xl mx-auto leading-relaxed">{cvData.description}</p>
              )} */}

              {/* Contact moderne */}
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                {info.email && (
                  <div className="flex items-center gap-2 text-blue-100">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{info.email}</span>
                  </div>
                )}
                {info.telephone && (
                  <div className="flex items-center gap-2 text-blue-100">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{info.telephone}</span>
                  </div>
                )}
                {info.adresse && (
                  <div className="flex items-center gap-2 text-blue-100">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{info.adresse}</span>
                  </div>
                )}
                {info.linkedin && (
                  <div className="flex items-center gap-2 text-blue-100">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Linkedin className="h-4 w-4" />
                    </div>
                    <span className="text-sm truncate max-w-32">{info.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className={`space-y-8 ${exportMode ? "p-6 space-y-6" : "p-8"}`}>
            {/* Expériences avec design moderne */}
            {cvData.experiences.length > 0 && (
              <section className={exportMode ? "break-inside-avoid" : ""}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 ${primaryColor} rounded-lg`}>
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Expériences Professionnelles</h2>
                </div>

                <div className="space-y-6">
                  {cvData.experiences.map((exp, index) => (
                    <div key={exp.id} className={`relative pl-8 ${exportMode && index > 0 ? "break-inside-avoid" : ""}`}>
                      <div className={`absolute left-0 top-2 w-4 h-4 ${primaryColor} rounded-full`}></div>
                      <div
                        className={`absolute left-2 top-6 w-0.5 h-full ${includeColors ? "bg-blue-200" : "bg-gray-200"}`}
                      ></div>

                      <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{exp.titre_poste}</h3>
                            <p className={`text-lg font-semibold ${accentColor}`}>{exp.nom_entreprise}</p>
                          </div>
                          {(exp.date_debut || exp.date_fin) && (
                            <div
                              className={`flex items-center gap-2 px-3 py-1 ${includeColors ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"} rounded-full text-sm font-medium`}
                            >
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatDate(exp.date_debut)} - {exp.date_fin ? formatDate(exp.date_fin) : "Présent"}
                              </span>
                            </div>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Formations avec design moderne */}
            {cvData.formations.length > 0 && (
              <section className={exportMode ? "break-inside-avoid" : ""}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 ${includeColors ? "bg-green-600" : "bg-gray-600"} rounded-lg`}>
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Formation</h2>
                </div>

                <div className="grid gap-4">
                  {cvData.formations.map((formation) => (
                    <div key={formation.id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{formation.diplome}</h3>
                          <p className={`font-semibold ${includeColors ? "text-green-600" : "text-gray-600"}`}>
                            {formation.nom_etablissement}
                          </p>
                        </div>
                        {(formation.date_debut || formation.date_fin) && (
                          <div
                            className={`flex items-center gap-2 px-3 py-1 ${includeColors ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"} rounded-full text-sm font-medium`}
                          >
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(formation.date_debut)} - {formatDate(formation.date_fin)}
                            </span>
                          </div>
                        )}
                      </div>
                      {formation.description && (
                        <p className="text-gray-700 mt-3 leading-relaxed">{formation.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Compétences et Langues avec design moderne */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Compétences */}
              {cvData.competences.length > 0 && (
                <section className={exportMode ? "break-inside-avoid" : ""}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 ${includeColors ? "bg-purple-600" : "bg-gray-600"} rounded-lg`}>
                      <Code className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Compétences</h2>
                  </div>

                  <div className="space-y-4">
                    {cvData.competences.map((comp) => (
                      <div key={comp.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">{comp.nom_competence}</span>
                          <span className="text-sm text-gray-600">{comp.niveau}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${includeColors ? "bg-purple-600" : "bg-gray-600"} ${getNiveauWidth(comp.niveau)}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Langues */}
              {cvData.langues.length > 0 && (
                <section className={exportMode ? "break-inside-avoid" : ""}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 ${includeColors ? "bg-orange-600" : "bg-gray-600"} rounded-lg`}>
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Langues</h2>
                  </div>

                  <div className="space-y-4">
                    {cvData.langues.map((langue) => (
                      <div key={langue.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">{langue.nom_langue}</span>
                          <span className="text-sm text-gray-600">{langue.niveau}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${includeColors ? "bg-orange-600" : "bg-gray-600"} ${getNiveauWidth(langue.niveau)}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Message si CV vide */}
            {!info.username &&
              cvData.experiences.length === 0 &&
              cvData.formations.length === 0 &&
              !exportMode && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Votre CV apparaîtra ici en temps réel</p>
                  <p className="text-sm">Commencez par remplir vos informations personnelles</p>
                </div>
              )}
          </CardContent>
          </div>
    }
      </Card>
    </div>
  )
}
