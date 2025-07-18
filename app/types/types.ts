export interface TemplateProps {
  cvData: {
    titre: string;
    informations_personnelles: {
      username: string;
      description: string;
      email: string;
      telephone: string;
      adresse: string;
      linkedin: string;
      photo: string;
    };
    experiences: {
      id: string;
      titre_poste: string;
      nom_entreprise: string;
      date_debut: string;
      date_fin: string;
      description: string;
    }[];
    formations: {
      id: string;
      diplome: string;
      nom_etablissement: string;
      date_debut: string;
      date_fin: string;
      description: string;
    }[];
    competences: {
      id: string;
      nom_competence: string;
      niveau: string;
    }[];
    langues: {
      id: string;
      nom_langue: string;
      niveau: string;
    }[];
    centres_interet: {
      id: string;
      nom_centre_interet: string;
    }[];
    modele: string;
  };
  previewOnly?: boolean;
  exportMode?: boolean;
  includeColors?: boolean;
}
