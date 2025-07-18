import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Linkedin, Calendar } from "lucide-react"

interface CVData {
   titre: string;
    modele: string;
    informations_personnelles: {
    description: string;
    username: string;
    email: string;
    telephone: string;
    adresse: string;
    linkedin: string;
    photo: string;
  };
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

interface ClassiqueTemplateProps {
  cvData: CVData
  exportMode?: boolean
  includeColors?: boolean
}

const formatDate = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
}

export default function ClassiqueTemplate({
  cvData,
  exportMode = false,
  includeColors = true,
}: ClassiqueTemplateProps) {
  const { informations_personnelles: info } = cvData

  return (
    <div
      id="cv-preview"
      className={`w-full max-w-4xl mx-auto bg-white ${exportMode ? "print-optimized" : ""}`}
      style={
        exportMode
          ? {
              fontFamily: "Times New Roman, serif",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#333",
            }
          : {}
      }
    >
      <Card className={`${exportMode ? "border-0 shadow-none" : "shadow-lg"}`}>
        {/* Header classique */}
        <CardHeader className="text-center border-b-2 border-gray-800 pb-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
              {info.username} 
            </h1>
            {info.photo && (
              <div className="flex justify-center my-6">
                <img
                  src={info.photo || "/placeholder.svg"}
                  alt={`${info.username}`}
                  className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow-md"
                />
              </div>
            )}
            {cvData.titre && (
              <p className="text-xl text-gray-700 font-medium uppercase tracking-wider">{cvData.titre}</p>
            )}
            {/* {cvData.description && (
              <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed italic">{cvData.description}</p>
            )} */}
          </div>
        </CardHeader>

        <CardContent className={`space-y-8 ${exportMode ? "p-6 space-y-6" : "p-8"}`}>
          {/* Informations de contact classiques */}
          <section className="text-center">
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              {info.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span>{info.email}</span>
                </div>
              )}
              {info.telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span>{info.telephone}</span>
                </div>
              )}
              {info.adresse && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span>{info.adresse}</span>
                </div>
              )}
              {info.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-gray-600" />
                  <span className="truncate">{info.linkedin}</span>
                </div>
              )}
            </div>
          </section>

          <Separator className="border-gray-300" />

          {/* Expériences classiques */}
          {cvData.experiences.length > 0 && (
            <section className={exportMode ? "break-inside-avoid" : ""}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wider border-b border-gray-300 pb-2">
                Expérience Professionnelle
              </h2>

              <div className="space-y-6">
                {cvData.experiences.map((exp, index) => (
                  <div key={exp.id} className={`${exportMode && index > 0 ? "break-inside-avoid" : ""}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{exp.titre_poste}</h3>
                        <p className="text-gray-700 font-semibold italic">{exp.nom_entreprise}</p>
                      </div>
                      {(exp.date_debut || exp.date_fin) && (
                        <div className="text-right text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(exp.date_debut)} - {exp.date_fin ? formatDate(exp.date_fin) : "Présent"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-wrap pl-4 border-l-2 border-gray-200">
                        {exp.description}
                      </p>
                    )}
                    {index < cvData.experiences.length - 1 && <Separator className="mt-6 border-gray-200" />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formations classiques */}
          {cvData.formations.length > 0 && (
            <section className={exportMode ? "break-inside-avoid" : ""}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center uppercase tracking-wider border-b border-gray-300 pb-2">
                Formation
              </h2>

              <div className="space-y-6">
                {cvData.formations.map((formation, index) => (
                  <div key={formation.id}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{formation.diplome}</h3>
                        <p className="text-gray-700 font-semibold italic">{formation.nom_etablissement}</p>
                      </div>
                      {(formation.date_debut || formation.date_fin) && (
                        <div className="text-right text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(formation.date_debut)} - {formatDate(formation.date_fin)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {formation.description && (
                      <p className="text-gray-700 leading-relaxed text-justify pl-4 border-l-2 border-gray-200">
                        {formation.description}
                      </p>
                    )}
                    {index < cvData.formations.length - 1 && <Separator className="mt-6 border-gray-200" />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Compétences et Langues classiques */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Compétences */}
            {cvData.competences.length > 0 && (
              <section className={exportMode ? "break-inside-avoid" : ""}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 text-center uppercase tracking-wider border-b border-gray-300 pb-2">
                  Compétences
                </h2>

                <div className="space-y-3">
                  {cvData.competences.map((comp) => (
                    <div key={comp.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{comp.nom_competence}</span>
                      <span className="text-sm text-gray-600 font-semibold">{comp.niveau}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Langues */}
            {cvData.langues.length > 0 && (
              <section className={exportMode ? "break-inside-avoid" : ""}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 text-center uppercase tracking-wider border-b border-gray-300 pb-2">
                  Langues
                </h2>

                <div className="space-y-3">
                  {cvData.langues.map((langue) => (
                    <div key={langue.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{langue.nom_langue}</span>
                      <span className="text-sm text-gray-600 font-semibold">{langue.niveau}</span>
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
      </Card>
    </div>
  )
}
