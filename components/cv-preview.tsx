import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Linkedin, Calendar } from "lucide-react"

interface CVPreviewProps {
  cvData: {
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
}

const formatDate = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
}

const getNiveauColor = (niveau: string) => {
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

export default function CVPreview({ cvData }: CVPreviewProps) {
  const { informations_personnelles: info } = cvData

  return (
    <div id="cv-preview" className="w-full max-w-4xl mx-auto bg-white">
      <Card className="shadow-lg print:shadow-none">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white print:bg-blue-800">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {info.prenom} {info.nom}
            </h1>
            {cvData.titre && <p className="text-xl text-blue-100">{cvData.titre}</p>}
            {cvData.description && <p className="text-blue-100 max-w-2xl mx-auto">{cvData.description}</p>}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 print:p-4 print:space-y-4">
          {/* Informations de contact */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {info.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>{info.email}</span>
              </div>
            )}
            {info.telephone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>{info.telephone}</span>
              </div>
            )}
            {info.adresse && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>{info.adresse}</span>
              </div>
            )}
            {info.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <span className="truncate">{info.linkedin}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Expériences */}
          {cvData.experiences.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Expériences professionnelles</h2>
              <div className="space-y-4">
                {cvData.experiences.map((exp) => (
                  <div key={exp.id} className="border-l-4 border-blue-600 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{exp.titre_poste}</h3>
                        <p className="text-blue-600 font-medium">{exp.nom_entreprise}</p>
                      </div>
                      {(exp.date_debut || exp.date_fin) && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(exp.date_debut)} - {exp.date_fin ? formatDate(exp.date_fin) : "Présent"}
                          </span>
                        </div>
                      )}
                    </div>
                    {exp.description && <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formations */}
          {cvData.formations.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Formations</h2>
              <div className="space-y-4">
                {cvData.formations.map((formation) => (
                  <div key={formation.id} className="border-l-4 border-green-600 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{formation.diplome}</h3>
                        <p className="text-green-600 font-medium">{formation.nom_etablissement}</p>
                      </div>
                      {(formation.date_debut || formation.date_fin) && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(formation.date_debut)} - {formatDate(formation.date_fin)}
                          </span>
                        </div>
                      )}
                    </div>
                    {formation.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{formation.description}</p>
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
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Compétences</h2>
                <div className="space-y-3">
                  {cvData.competences.map((comp) => (
                    <div key={comp.id} className="flex justify-between items-center">
                      <span className="font-medium">{comp.nom_competence}</span>
                      <Badge className={getNiveauColor(comp.niveau)}>{comp.niveau}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {cvData.langues.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Langues</h2>
                <div className="space-y-3">
                  {cvData.langues.map((langue) => (
                    <div key={langue.id} className="flex justify-between items-center">
                      <span className="font-medium">{langue.nom_langue}</span>
                      <Badge className={getNiveauColor(langue.niveau)}>{langue.niveau}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Message si CV vide */}
          {!info.prenom && !info.nom && cvData.experiences.length === 0 && cvData.formations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Votre CV apparaîtra ici en temps réel</p>
              <p className="text-sm">Commencez par remplir vos informations personnelles</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
