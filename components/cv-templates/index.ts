import Modele1Template from "./modele-1-template"
import Modele2Template from "./modele-2-template"
import Modele3Template from "./modele-3-template"

interface CVData {
  titre: string
  description: string,
  models_cv_id: number,
  informations_personnelles: {
    username: string
    email: string
    telephone: string
    adresse: string
    linkedin: string
    photos: string | File,
    date_naissance: string;
    situation_familiale: string;
    nbre_enfants: string; // Change to number or string
    nationalite: string;
    permis_conduire: string;
  }
  experiences: Array<{
    id: string
    titre_poste: string
    nom_entreprise: string
    date_debut: string
    date_fin: string
    missions: Array<{
      id: string;
      missions_details: string;
    }>;
  }>
  formations: Array<{
    id: string
    diplome: string
    nom_etablissement: string
    date_debut: string
    date_fin: string
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
  centres_interet: Array<{
    id: string;
    nom_centre_interet: string;
  }>;
}

interface TemplateProps {
  cvData: CVData
  previewOnly?: boolean
  exportMode?: boolean
  includeColors?: boolean
}

// ✅ Typage correct ici
export const templateComponents: Record<string, React.ComponentType<TemplateProps>> = {
  modele_1: Modele1Template,
  modele_2: Modele2Template,
  modele_3: Modele3Template,
}
