import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Calendar,
  Award,
  Code,
  Globe,
  Baby,
  CarFront,
} from "lucide-react";
import PhotoCvExemple from "@/app/assets/photo-cv.png";
import Image from "next/image";
import { apiImg } from "@/axios.config";
import { useState } from "react";

interface CVData {
  titre: string;
  description: string;
  informations_personnelles: {
    username: string;
    email: string;
    telephone: string;
    adresse: string;
    linkedin: string;
    photos: string | File; // Add this line
    date_naissance: string;
    situation_familiale: string;
    nbre_enfants: string;
    nationalite: string;
    permis_conduire: string;
  };
  experiences: Array<{
    id: string;
    titre_poste: string;
    nom_entreprise: string;
    date_debut: string;
    date_fin: string;
    missions: Array<{
      id: string;
      missions_details: string;
    }>;
  }>;
  formations: Array<{
    id: string;
    diplome: string;
    nom_etablissement: string;
    date_debut: string;
    date_fin: string;
  }>;
  competences: Array<{
    id: string;
    nom_competence: string;
    niveau: string;
  }>;
  langues: Array<{
    id: string;
    nom_langue: string;
    niveau: string;
  }>;
  centres_interet: Array<{
    id: string;
    nom_centre_interet: string;
  }>;
}

interface ModerneTemplateProps {
  cvData: CVData;
  exportMode?: boolean;
  includeColors?: boolean;
  previewOnly?: boolean;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
};

const getNiveauWidth = (niveau: string) => {
  switch (niveau.toLowerCase()) {
    case "débutant":
      return "w-1/4";
    case "intermédiaire":
      return "w-2/4";
    case "avancé":
      return "w-3/4";
    case "expert":
    case "natif":
      return "w-full";
    default:
      return "w-1/4";
  }
};

export default function ModerneTemplateFirst({
  cvData,
  exportMode = false,
  includeColors = true,
  previewOnly = false,
}: ModerneTemplateProps) {
  const { informations_personnelles: info } = cvData;

  const primaryColor = includeColors ? "bg-blue-900" : "bg-gray-800";
  const accentColor = includeColors ? "bg-[#3d3d3d]" : "text-[#3d3d3d]";
  const gradientBg = includeColors ? "" : "bg-gray-800";

  return (
    <div
      id="cv-preview"
      className="bg-white mx-auto"
      style={
        exportMode
          ? {
              fontFamily: "Monserrat, medium",
              fontSize: "14px",
              lineHeight: "1.4",
              color: "#333",
              width: "600px", // A4 width in px
              padding: "20px",
            }
          : {}
      }
    >
      <div className={`${exportMode ? "border-0" : "h-screen"} w-full`}>
        {!previewOnly && (
          <div className="flex flex-row">
            {/* Colonne gauche (35%) - Informations personnelles */}
            <div className="w-[35%] lg:w-[35%] lg:h-[116.5vh] bg-gray-50">
              {/* Photo de profil */}
              <div className="flex justify-center p-3">
                <img
                  src={
                    info.photos
                      ? `${process.env.NEXT_PUBLIC_API_URL}/cv/get_cv_photo/${info.photos}`
                      : "/photo-cv.png"
                  }
                  alt={info.username || "Photo de profil"}
                  className="w-36 h-36  object-cover border-white"
                />
              </div>

              <div className="bg-[#3d3d3d] h-[99.4vh] rounded-tr-[30px]">
                {/* Section Contacts */}
                <div className="p-2">
                  <h2 className="text-lg uppercase font-bold text-white mb-1">
                    COORDONNEES
                  </h2>
                  <div className="border-b border-white/20 mb-4"></div>

                  <div className="space-y-3 text-white">
                    {info.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-white/80" />
                        <span className="text-sm">{info.email}</span>
                      </div>
                    )}
                    {info.telephone && (
                      <div className="flex items-center text-black-100 mb-1">
                        <Phone className="h-4 w-4" />

                        <span className="text-sm ml-1">
                          {" "}
                          {"+255 "}
                          {info.telephone}
                        </span>
                      </div>
                    )}
                    {info.date_naissance && (
                      <div className="flex items-center text-black-100 mb-1">
                        <Calendar className="h-4 w-4" />

                        <span className="text-sm ml-1">
                          {new Date(info.date_naissance).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}

                    {info.situation_familiale && (
                      <div className="flex items-center text-black-100 mb-1">
                        <Baby className="h-4 w-4" />

                        <span className="text-sm ml-1">
                          {info.situation_familiale},{" "}
                          {info.nbre_enfants === "" || info.nbre_enfants === "0"
                            ? "Sans enfant"
                            : `${info.nbre_enfants} enfant${
                                info.nbre_enfants !== "1" ? "s" : ""
                              }`}
                        </span>
                      </div>
                    )}

                    {info.nationalite && (
                      <div className="flex items-center text-black-100 mb-1">
                        <Phone className="h-4 w-4" />

                        <span className="text-sm ml-1">{info.nationalite}</span>
                      </div>
                    )}
                    {info.permis_conduire && (
                      <div className="flex items-center text-black-100 mb-1">
                        <CarFront className="h-4 w-4" />
                        {"Permis de conduire : "}
                        <span className="text-sm ml-1 uppercase">
                          {info.permis_conduire}
                        </span>
                      </div>
                    )}
                    {info.adresse && (
                      <div className="flex items-center text-black-100 mb-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm ml-1">{info.adresse}</span>
                      </div>
                    )}
                    {info.linkedin && (
                      <div className="flex items-center text-black-100 mb-1">
                        <Linkedin className="h-4 w-4" />
                        <div className="text-sm ml-1 whitespace-pre-line">
                          {info.linkedin}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Compétences */}
                <div className="p-2">
                  <h2 className="text-lg uppercase font-bold mb-1 text-white">
                    COMPETENCES
                  </h2>
                  <div className="border-b border-white/20 mb-4"></div>

                  {cvData.competences.map((comp) => (
                    <div key={comp.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-white">
                          {comp.nom_competence}
                        </span>
                        {/* <span className="text-xs text-white/70">
                          {comp.niveau}
                        </span> */}
                      </div>
                      {/* <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full bg-white ${getNiveauWidth(
                            comp.niveau
                          )}`}
                        ></div>
                      </div> */}
                    </div>
                  ))}
                </div>

                {/* Sections Langues */}
                <div className="p-2 text-white">
                  <h2 className="text-lg uppercase font-bold mb-1">LANGUES</h2>
                  <div className="border-b border-white/20 mb-4"></div>

                  <div className="space-y-2">
                    {cvData.langues.map((langue) => (
                      <div key={langue.id} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-white uppercase">
                            {langue.nom_langue}
                          </span>
                          <span className="text-xs text-white/70">
                            {langue.niveau}
                          </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full bg-white ${getNiveauWidth(
                              langue.niveau
                            )}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sections Centre d'interets */}
                <div className="p-2 text-white">
                  <h2 className="text-lg uppercase font-bold mb-1">
                    CENTRES D'INTERETS
                  </h2>
                  <div className="border-b border-white/20 mb-4"></div>

                  {cvData.centres_interet.map((centre) => (
                    <div key={centre.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-white">
                          {centre.nom_centre_interet}
                        </span>
                        {/* <span className="text-xs text-white/70">
                          {langue.niveau}
                        </span> */}
                      </div>
                      {/* <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full bg-white ${getNiveauWidth(
                            langue.niveau
                          )}`}
                        ></div>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne droite (65%) - Contenu principal */}
            <div className="w-[65%] lg:w-[65%] bg-gray-50 h-[116.5vh] p-5">
              {/* En-tête */}
              <div className="mb-8">
                <h1 className="text-3xl text-center font-bold uppercase tracking-tight text-[#3d3d3d]">
                  {info.username}
                </h1>
                {cvData.titre && (
                  <p className="text-lg font-medium text-center uppercase mt-2">
                    {cvData.titre}
                  </p>
                )}
                {cvData.description && (
                  <p className="text-[#3d3d3d] mt-4 max-w-2xl mx-auto">
                    {cvData.description}
                  </p>
                )}
              </div>

              {/* Section Expériences */}
              <div className="mb-8">
                <h2 className="text-lg uppercase font-bold bg-[#3d3d3d] text-white">
                  EXPERIENCES PROFESSIONNELLES
                </h2>
                <div className="border-b border-gray-300 mb-1"></div>

                <div className="space-y-6">
                  {cvData.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-2">
                      <div className="flex justify-between flex-col sm:flex-row">
                        <h4 className="text-[16px] font-semibold text-gray-800">
                          {exp.titre_poste}
                        </h4>
                        <span className="">
                          {formatDate(exp.date_debut)} -{" "}
                          {exp.date_fin ? formatDate(exp.date_fin) : "Présent"}
                        </span>
                      </div>

                      <p className="font-medium uppercase">
                        {exp.nom_entreprise}
                      </p>

                      <ul className="list-disc list-inside space-y-1 ml-4">
                        {exp.missions.map((mission) => (
                          <li key={mission.id} className="text-gray-700 whitespace-normal">
                            {mission.missions_details}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Formations */}
              <div>
                <h2 className="text-lg uppercase font-bold bg-[#3d3d3d] text-white mb-1">
                  FORMATIONS
                </h2>
                <div className="border-b border-gray-300 mb-1"></div>

                <div className="space-y-5">
                  {cvData.formations.map((formation) => (
                    <div key={formation.id} className="space-y-1">
                      <div className="flex justify-between flex-col sm:flex-row">
                        <h3 className="text-[16px] font-semibold text-gray-800">
                          {formation.diplome}
                        </h3>
                        <span className="">
                          {formatDate(formation.date_debut)} -{" "}
                          {formatDate(formation.date_fin)}
                        </span>
                      </div>
                      <p className="text-[#3d3d3d]">
                        {formation.nom_etablissement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
