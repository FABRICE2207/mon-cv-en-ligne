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

  const accentColor = includeColors ? "bg-orange-60" : "text-gray-600";

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
      <div
        className={`${exportMode ? "border-0" : "h-screen"} w-full h-screen`}
      >
        {/* Header avec design moderne */}
        {!previewOnly && (
          <div>
            <div
              className="bg-orange-600 text-white relative overflow-hidden"
            >
              {/* <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div> */}

              <div className="relative z-10 p-2 text-center space-x-2 flex flex-row">
                {/* Colonne gauche - PHOTO */}
                <div className="w-[35%] flex-shrink-0 space-y-2 max-auto">
                  <div className="flex justify-center mb-2 mt-2">
                    <div className="relative">
                      {info.photos ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/cv/get_cv_photo/${info.photos}`}
                          alt={`${info.username}`}
                          className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                        />
                      ) : (
                        <img
                          src="/photo-cv.png"
                          alt="Photo de profil"
                          className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                        />
                      )}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Colonne droite - INFOS */}
                <div className="w-[65%] flex flex-col space-y-2 justify-center items-center text-left">
                  <div className="justify-center items-center">
                    <h1 className="text-[22px] uppercase font-bold text-center tracking-tight">
                      {info.username}
                    </h1>

                    {cvData.titre && (
                      <div className="inline-block w-full justify-center items-center px-4 py-2 rounded-full ">
                        <p className="text-[16px] text-center font-medium uppercase">
                          {cvData.titre}
                        </p>
                      </div>
                    )}

                    {cvData.description && (
                      <p className="text-white text-sm max-w-2xl mx-auto leading-relaxed">
                        {cvData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${exportMode ? "mt-[-5%] lg:h-fit" : "lg:h-fit"}`}>
              <div className="flex flex-row gap-x-4">
                <div className="w-[35%] px-2 py-2 lg:h-[100vh]">
                  {/* CONTACTS */}
                  <h2 className="text-[16px] uppercase font-bold text-gray-900">
                    COORDONNEES
                  </h2>
                  <div className="border mt-1"></div>

                  <div className="flex flex-col justify-center">
                    {info.email && (
                      <div className="flex items-center text-black-100 mb-1">
                        <div className="bg-white/20 rounded-lg">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="text-sm ml-1">{info.email}</span>
                      </div>
                    )}
                    {info.telephone && (
                      <div className="flex items-center text-black-100 mb-1">
                        <div className=" bg-white/20 rounded-lg">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-sm ml-1"> {"+255 "}{info.telephone}</span>
                      </div>
                    )}
                    {info.date_naissance && (
                      <div className="flex items-center text-black-100 mb-1">
                        <div className="bg-white/20 rounded-lg">
                          <Calendar className="h-4 w-4" />
                        </div>
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
                        <div className="bg-white/20 rounded-lg">
                          <Baby className="h-4 w-4" />
                        </div>
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
                        <div className=" bg-white/20 rounded-lg">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="text-sm ml-1">{info.nationalite}</span>
                      </div>
                    )}
                    {info.permis_conduire && (
                      <div className="flex items-center text-black-100 mb-1">
                        <div className=" bg-white/20 rounded-lg">
                          <CarFront className="h-4 w-4" />
                        </div>
                        {"Permis de conduire : "}
                        <span className="text-sm ml-1 uppercase">
                          {info.permis_conduire}
                        </span>
                      </div>
                    )}
                    {info.adresse && (
                      <div className="flex items-center text-black-100 mb-1">
                        <div className=" bg-white/20 rounded-lg">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-sm ml-1">{info.adresse}</span>
                      </div>
                    )}
                    {info.linkedin && (
                      <div className="flex items-center text-black-100 mb-1">
                        <div className=" bg-white/20 rounded-lg">
                          <Linkedin className="h-4 w-4" />
                        </div>
                        <div className="text-sm ml-1 whitespace-pre-line">
                          {info.linkedin}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compétences */}
                  <div className="mt-4">
                    <h2 className="text-[16px] uppercase font-bold text-gray-900">
                      Competences
                    </h2>
                    <div className="border mt-1"></div>
                    <div className="flex flex-col justify-center">
                      {cvData.competences.length > 0 && (
                        <section
                          className={
                            exportMode
                              ? "break-inside-avoid page-break-inside-avoid"
                              : ""
                          }
                        >
                          {/* <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`p-2 ${
                            includeColors ? "bg-purple-600" : "bg-gray-600"
                          } rounded-lg`}
                        >
                          <Code className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-[16px] uppercase font-bold text-gray-900">
                          Compétences
                        </h2>
                      </div> */}

                          <div className="mt-2">
                            {cvData.competences.map((comp) => (
                              <div key={comp.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-sm text-gray-900">
                                    {comp.nom_competence}
                                  </span>
                                  
                                </div>
                                {/* <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      includeColors ? "bg-black" : "bg-gray-600"
                                    } ${getNiveauWidth(comp.niveau)}`}
                                  ></div>
                                </div> */}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  </div>

                  {/* Langues */}
                  <div className="mt-4">
                    <h2 className="text-[16px] uppercase font-bold text-gray-900">
                      Langues
                    </h2>
                    <div className="border mt-1"></div>
                    {cvData.langues.length > 0 && (
                      <section
                        className={
                          exportMode
                            ? "break-inside-avoid page-break-inside-avoid"
                            : ""
                        }
                      >
                        <div className="flex items-center gap-3">
                          {/* <div
                            className={`p-2 ${
                              includeColors ? "bg-orange-600" : "bg-gray-600"
                            } rounded-lg`}
                          >
                            <Globe className="h-5 w-5 text-white" />
                          </div>
                          <h2 className="text-[16px] uppercase font-bold text-gray-900">
                            Langues
                          </h2> */}
                        </div>

                        <div className="space-y-4">
                          {cvData.langues.map((langue) => (
                            <div key={langue.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-normal text-gray-900">
                                  {langue.nom_langue}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {langue.niveau}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    includeColors ? "bg-orange-600" : "bg-gray-600"
                                  } ${getNiveauWidth(langue.niveau)}`}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Centre intétêt*/}
                  <div className="mt-4">
                    <h2 className="text-[16px] uppercase font-bold text-gray-900">
                      Centres d'interet
                    </h2>
                    <div className="border mt-1"></div>
                    {cvData.centres_interet.length > 0 && (
                      <section
                        className={
                          exportMode
                            ? "break-inside-avoid page-break-inside-avoid"
                            : ""
                        }
                      >
                        {/* <div className="flex items-center gap-3 mb-6">
                          <div
                            className={`p-2 ${
                              includeColors ? "bg-orange-600" : "bg-gray-600"
                            } rounded-lg`}
                          >
                            <Globe className="h-5 w-5 text-white" />
                          </div>
                          <h2 className="text-[16px] uppercase font-bold text-gray-900">
                            Langues
                          </h2>
                        </div> */}

                        <div className="mt-2">
                          {cvData.centres_interet.map((centre) => (
                            <div key={centre.id}>
                              <div className="flex justify-between items-center">
                                <span className="font-normal text-gray-900">
                                  {centre.nom_centre_interet}
                                </span>
                                {/* <span className="text-sm text-gray-600">
                                  {centre.niveau}
                                </span> */}
                              </div>
                              {/* <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    includeColors ? "bg-black" : "bg-gray-600"
                                  } ${getNiveauWidth(langue.niveau)}`}
                                ></div>
                              </div> */}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
                <div className="w-[65%] bg-gray-50 h-[100vh]">
                  <div className="p-2">
                    <h2 className="text-[16px] uppercase font-bold text-gray-900">
                      Experiences Professionnelles
                    </h2>
                    <div className="border mt-1"></div>
                  </div>
                  {/* Expériences avec design moderne */}
                  {cvData.experiences.length > 0 && (
                    <section
                      className={
                        exportMode
                          ? "break-inside-avoid page-break-inside-avoid"
                          : ""
                      }
                    >
                      <div className="space-y-1">
                        {cvData.experiences.map((exp, index) => (
                          <div key={exp.id}>
                            <div className="rounded-xl p-2 mt-[-2%]">
                              <div className="flex justify-between items-start flex-col space-y-2">
                                <div>
                                  {/* poste et date */}

                                  {/* poste */}
                                  <div>
                                    <h3 className="text-[18px] font-extralight text-gray-900">
                                      {exp.titre_poste}
                                    </h3>
                                  </div>
                                  {/* entreprise */}
                                  <p
                                    className={`text-[16px] uppercase font-normal  ${accentColor}`}
                                  >
                                    {exp.nom_entreprise}
                                  </p>

                                  {/* Colonne droite : Date fixe */}
                                  {(exp.date_debut || exp.date_fin) && (
                                    <div>
                                      <span>
                                        {formatDate(exp.date_debut)} -{" "}
                                        {exp.date_fin
                                          ? formatDate(exp.date_fin)
                                          : "Présent"}
                                      </span>
                                    </div>
                                  )}

                                  <div className="max-w-full">
                                    <ul className="list-disc list-inside">
                                      {exp.missions.map((mission) => (
                                        <li
                                          key={mission.id}
                                          className="text-gray-800"
                                        >
                                          {mission.missions_details}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Formations avec design moderne */}
                  <div className="gap-2">
                    {/* <div
                          className={`p-2 ${
                            includeColors ? "bg-black" : "bg-gray-600"
                          } rounded-lg`}
                        >
                          <Award className="h-5 w-5 text-white" />
                        </div> */}
                    <div className="p-2">
                      <h2 className="text-[16px] uppercase font-bold text-gray-900">
                        Formations
                      </h2>
                      <div className="border mt-1"></div>
                    </div>
                  </div>

                  {cvData.formations.length > 0 && (
                    <section
                      className={
                        exportMode
                          ? "break-inside-avoid page-break-inside-avoid"
                          : ""
                      }
                    >
                      <div className="grid">
                        {cvData.formations.map((formation) => (
                          <div
                            key={formation.id}
                            className="rounded-xl p-3 mt-[-2%]"
                          >
                            <div className="flex justify-between items-start flex-col">
                              <div>
                                <h3 className="text-lg font-semiblod mt-[-1%] text-gray-900">
                                  {formation.diplome}
                                </h3>
                                <p
                                  className={`font-normal ${
                                    includeColors
                                      ? "text-black/100"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {formation.nom_etablissement}
                                </p>
                              </div>
                              {(formation.date_debut || formation.date_fin) && (
                                <div>
                                  <span>
                                    {formatDate(formation.date_debut)} -{" "}
                                    {formatDate(formation.date_fin)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* Compétences et Langues avec design moderne */}

              {/* Message si CV vide */}
              {!info.username &&
                cvData.experiences.length === 0 &&
                cvData.formations.length === 0 &&
                !exportMode && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">
                      Votre CV apparaîtra ici en temps réel
                    </p>
                    <p className="text-sm">
                      Commencez par remplir vos informations personnelles
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
