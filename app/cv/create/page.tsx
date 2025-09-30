"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExportOptions, {
  type ExportOptions as ExportOptionsType,
} from "@/components/export-options";
import TemplateSelector from "@/components/cv-templates/template-selector";
import PhotoUpload from "@/components/photo-upload";
import { api, apiImg, apitoken } from "@/axios.config";
import { templateComponents } from "@/components/cv-templates/index";
import Swal from "sweetalert2";
import { headers } from "next/headers";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

interface CVData {
  titre: string;
  images: string;
  description: string;
  users_id: number;
  models_cv_id: number;
  informations_personnelles: {
    username: string;
    email: string;
    telephone: string;
    adresse: string;
    linkedin: string;
    photos: string;
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
  projets: Array<{
    id: string;
    nom_projet: string;
    technologies: string;
    realisations: string;
  }>;
  certifications: Array<{
    id: string;
    nom_certification: string;
    date_obtention: string;
  }>;
  centres_interet: Array<{
    id: string;
    nom_centre_interet: string;
  }>;
}

interface CreateCVPageProps {
  previewTemplate: string;
}

export default function CreateCVPage({ previewTemplate }: CreateCVPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(previewTemplate);

  // const [cvInfos, setCvInfos] = useState<any>(null);

  const [getModele, setGetModele] = useState<any>([]);
  const [nomModel, setNomModel] = useState<any>([]);
  const [modelesId, setModelesId] = useState<number>(0);

  const [showCV, setShowCV] = useState(false);
  const params = useParams();
  const id = params.id as string;

  const handleTemplateSelect = (templateId: string, modeleId: number) => {
    setSelectedTemplate(templateId);
    setModelesId(modeleId);
    setCvData((prev) => ({
      ...prev,
      models_cv_id: modeleId,
    }));
  };

  const initialCvData: CVData = {
    titre: "",
    description: "",
    models_cv_id: 1,
    users_id: 1,
    images: `${previewTemplate}.png`,
    informations_personnelles: {
      username: "",
      email: "",
      telephone: "",
      adresse: "",
      linkedin: "",
      photos: "",
      date_naissance: "",
      situation_familiale: "",
      nbre_enfants: "",
      nationalite: "",
      permis_conduire: "",
    },
    experiences: [],
    formations: [],
    competences: [],
    langues: [],
    projets: [],
    certifications: [],
    centres_interet: [],
  };

  const [cvDataVide, setCvDataVide] = useState<CVData>(initialCvData);

  const [cvData, setCvData] = useState<CVData>({
    titre: "",
    description: "",
    models_cv_id: 1,
    users_id: 1,
    images: `${previewTemplate}.png`,
    informations_personnelles: {
      username: "",
      email: "",
      telephone: "",
      adresse: "",
      linkedin: "",
      photos: "",
      date_naissance: "",
      situation_familiale: "",
      nbre_enfants: "",
      nationalite: "",
      permis_conduire: "",
    },
    experiences: [],
    formations: [],
    competences: [],
    langues: [],
    projets: [],
    certifications: [],
    centres_interet: [],
  });

  const [isExporting, setIsExporting] = useState(false);

  // useEffect pour charger l'utilisateur une seule fois
  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await apitoken.get("/tokens/users", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const userData = response.data;
        setUser(userData); // stocke l'utilisateur
        setCvData((prev) => ({
          ...prev,
          informations_personnelles: {
            ...prev.informations_personnelles,
            email: userData.email,
            username: userData.username,
          },
        }));
      } catch (error) {
        console.error("Token invalide ou expiré :", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }

    try {
      const responseUser = await apitoken.get("/tokens/users", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const userData = responseUser.data;
      const usersID = userData.id;

      const newCVData = {
        models_cv_id: modelesId,
        users_id: usersID,
        cvData: cvData,
      };

      const response = await api.post("/cv/add_new_cv", newCVData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const cvAddData = response.data;

      // setCvDataVide(initialCvData)

      await Swal.fire({
        title: "Succès",
        text: "Votre CV a été créé avec succès !",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Optionnel : redirection après ajout
      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la création du CV :", error);

      let message = "Impossible de créer le CV. Veuillez réessayer.";

      // Si c'est une erreur Axios avec message serveur
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          message = error.response.data.message;
        } else if (error.message) {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      await Swal.fire({
        title: "Erreur",
        text: message,
        icon: "error",
      });
    }
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      titre_poste: "",
      nom_entreprise: "",
      date_debut: "",
      date_fin: "",
      missions: [
        {
          id: Date.now().toString(),
          missions_details: "",
        },
      ],
    };
    setCvData((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExp],
    }));
  };
  const updateExperience = (id: string, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const updateMission = (
    experienceId: string,
    missionId: string,
    newMission: string
  ) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              missions: exp.missions.map((m) =>
                m.id === missionId ? { ...m, missions_details: newMission } : m
              ),
            }
          : exp
      ),
    }));
  };

  const addMissionToExperience = (missionId: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === missionId
          ? {
              ...exp,
              missions: [
                ...exp.missions,
                {
                  id: Date.now().toString(), // ID unique de la mission
                  missions_details: "", //  nom du champ corrigé
                },
              ],
            }
          : exp
      ),
    }));
  };

  const removeMissionFromExperience = (
    experienceId: string | number,
    missionId: string | number
  ) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              missions: exp.missions.filter((m) => m.id !== missionId),
            }
          : exp
      ),
    }));
  };

  const addFormation = () => {
    const newFormation = {
      id: Date.now().toString(),
      diplome: "",
      nom_etablissement: "",
      date_debut: "",
      date_fin: "",
    };
    setCvData((prev) => ({
      ...prev,
      formations: [...prev.formations, newFormation],
    }));
  };

  const updateFormation = (id: string, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      formations: prev.formations.map((formation) =>
        formation.id === id ? { ...formation, [field]: value } : formation
      ),
    }));
  };

  const removeFormation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      formations: prev.formations.filter((formation) => formation.id !== id),
    }));
  };

  const addCompetence = () => {
    const newCompetence = {
      id: Date.now().toString(),
      nom_competence: "",
      niveau: "Débutant",
    };
    setCvData((prev) => ({
      ...prev,
      competences: [...prev.competences, newCompetence],
    }));
  };

  const updateCompetence = (id: string, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      competences: prev.competences.map((comp) =>
        comp.id === id ? { ...comp, [field]: value } : comp
      ),
    }));
  };

  const removeCompetence = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      competences: prev.competences.filter((comp) => comp.id !== id),
    }));
  };

  const addLangue = () => {
    const newLangue = {
      id: Date.now().toString(),
      nom_langue: "",
      niveau: "Débutant",
    };
    setCvData((prev) => ({
      ...prev,
      langues: [...prev.langues, newLangue],
    }));
  };

  const updateLangue = (id: string, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      langues: prev.langues.map((langue) =>
        langue.id === id ? { ...langue, [field]: value } : langue
      ),
    }));
  };

  const removeLangue = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      langues: prev.langues.filter((langue) => langue.id !== id),
    }));
  };

  const addCentreInteret = () => {
    const newCentre = {
      id: Date.now().toString(),
      nom_centre_interet: "",
      niveau: "Débutant",
    };
    setCvData((prev) => ({
      ...prev,
      centres_interet: [...prev.centres_interet, newCentre],
    }));
  };

  const updateCentreInteret = (id: string, field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      centres_interet: prev.centres_interet.map((centre) =>
        centre.id === id ? { ...centre, [field]: value } : centre
      ),
    }));
  };

  const removeCentreInteret = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      centres_interet: prev.centres_interet.filter(
        (centre) => centre.id !== id
      ),
    }));
  };

  const exportToPDF = async (options: ExportOptionsType) => {
    setIsExporting(true);
    try {
      const element = document.getElementById("cv-preview");
      if (!element) {
        throw new Error("Élément CV non trouvé. Activez la prévisualisation.");
      }

      // Créer une fenêtre/frame dédiée à l'impression
      const printFrame = document.createElement("iframe");
      printFrame.style.position = "absolute";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "none";

      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const timestamp = `${day}-${month}-${year}`;
      const username = cvData?.informations_personnelles?.username || "Export";
      const fileName = options.filename || `CV_${username}_${timestamp}.pdf`;

      // Copier le contenu + styles de l'élément CV
      printFrame.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            /* Réinjecter les styles critiques */
            ${Array.from(document.styleSheets)
              .flatMap((sheet) => {
                try {
                  return Array.from(sheet.cssRules).map((rule) => rule.cssText);
                } catch (e) {
                  return [];
                }
              })
              .join("\n")}

            /* Forcer les couleurs et le format */
            @page {
              size: ${options.format} ${options.orientation};
              margin: 0;
            }
            body { 
              margin: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #cv-print-content {
              width: ${options.format === "A4" ? "210mm" : "100mm"};
              height: auto;
            }
          </style>
        </head>
        <body>
          <div id="cv-print-content">
            ${element.innerHTML}
          </div>
        </body>
      </html>
    `;

      document.body.appendChild(printFrame);

      // Attendre le chargement
      await new Promise<void>((resolve) => {
        printFrame.onload = () => resolve();
      });

      // console.log("Nom du fichier :", fileName);

      // Démarrer l'impression
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();

      // Nettoyer après impression
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    } catch (error) {
      console.error("Erreur d'export :", error);
      Swal.fire({
        icon: "error",
        title: "Modèle manquant",
        text: "Veuillez sélectionner un modèle avant de télécharger votre CV. Merci !",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchModele = async () => {
      try {
        const response = await api.get(`/models/modele_cv/${selectedTemplate}`);
        setGetModele(response.data);

        const nom = response.data.images.split(".")[0]; // ex: "modele_1"
        setNomModel(nom);
      } catch (error) {
        console.error("Erreur lors du chargement du modèle :", error);
      }
    };

    if (selectedTemplate) {
      fetchModele();
    }
  }, [selectedTemplate]);

  const renderCVTemplate = () => {
    const correctedCVData = {
      ...cvData,
      informations_personnelles: {
        ...cvData.informations_personnelles,
        // photos: cvData.informations_personnelles.photos,
        photos: cvData.informations_personnelles.photos,
      },
      images: getModele.images,
    };

    const templateProps = {
      cvData: correctedCVData,
      exportMode: false,
      includeColors: true,
    };

    // Récupère le nom du modèle depuis l'image ou un slug (ex: "moderne.png" → "moderne")
    const templateKey = nomModel; // donne "modele_1"
    // const templateKey = modele[modele].images.split(".")[0].toLowerCase();

    const TemplateComponent = templateComponents[templateKey];

    if (!TemplateComponent) {
      return (
        <div className="flex items-center justify-center h-[100vh]">
          <p className="text-slate-400 text-2xl  p-4 rounded text-center">
            Aucun modèle n’a été détecté. <br /> Veuillez sélectionner un modèle
            de CV pour poursuivre
          </p>
        </div>
      );
    }

    return <TemplateComponent {...templateProps} />;
  };

  // État pour gérer les sections ouvertes
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    experiences: true,
    formations: false,
    competences: false,
    langues: false,
    centres_interet: false,
    logiciels: false,
  });

  // Fonction pour basculer l'état d'une section
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === section ? !prev[key] : false;
        return acc;
      }, {} as Record<string, boolean>),
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 mx-auto px-4 py-4 items-center">
          <div className="flex items-center space-x-4">
            <Button className="text-white bg-blue-950 hover:bg-blue-900" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center space-x-2 w-full">
              {/* <FileText className="h-6 w-6 text-blue-600" /> */}
              <h1 className="text-xl font-bold text-gray-900">
                Mon CV en ligne
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4 w-full justify-end">
            {/* <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Masquer" : "Prévisualiser"}
            </Button> */}
            <ExportOptions
              onExport={exportToPDF}
              isExporting={isExporting}
              // disabled={!showPreview}
              modelesId={modelesId}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto px-4 py-6 max-h-[calc(120vh-120px)]">
        {/* Prévisualisation */}
        <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-4 bg-white rounded shadow">
          {/* Bouton toggle mobile uniquement */}
          <div className="block lg:hidden mb-4" id="btn-show">
            <Button
              onClick={() => setShowCV((prev) => !prev)}
              className="w-full"
            >
              {showCV ? "Masquer le CV" : "Voir le CV"}
            </Button>
          </div>

          {/* CV visible si showCV est true (mobile), ou toujours visible en desktop */}
          <AnimatePresence initial={false}>
            {showCV && (
              <motion.div
                key="cv-mobile"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="block lg:hidden"
              >
                {renderCVTemplate()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toujours visible sur desktop */}
          <div className="hidden lg:block">{renderCVTemplate()}</div>
        </div>

        {/* Colonne Choix modèle / Formulaire */}
        <div
          id="choix-modele"
          className={`overflow-y-auto max-h-[calc(100vh-100px)] p-4 bg-white rounded shadow mb-4
          ${showCV ? "hidden" : "block"} lg:block`}
        >
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des modèles</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                modelesId={modelesId}
                onTemplateSelect={handleTemplateSelect}
                cvData={cvData}
                setSelectedTemplate={setSelectedTemplate}
                onExport={exportToPDF}
              />
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <div>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="hidden">
                    <Label htmlFor="models_cv_id">Id mODEL</Label>
                    <input
                      id="model_cv_id"
                      placeholder="Ex: Développeur Full Stack"
                      value={cvData.models_cv_id}
                    />
                  </div>
                  <div className="hidden">
                    <Label htmlFor="users_id">Id USERS</Label>
                    <input
                      id="users_id"
                      placeholder="Ex: Développeur Full Stack"
                      value={cvData.users_id}
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <PhotoUpload
                        photo={cvData.informations_personnelles.photos} // une string (filename)
                        onPhotoChange={(filename) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              photos: filename, // ✅ juste le nom du fichier
                            },
                          }))
                        }
                        id={id}
                      />
                    </div>

                    <div className="w-full">
                      <div className="flex flex-col gap-4">
                        <div>
                          <Label>Profil</Label>
                          <input
                            id="titre"
                            placeholder="Ex: Responsable Marketing"
                            value={cvData.titre}
                            onChange={(e) =>
                              setCvData((prev) => ({
                                ...prev,
                                titre: e.target.value,
                              }))
                            }
                            required
                            className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                          />
                        </div>
                        <div>
                          <Label>Description de votre profil</Label>
                          <textarea
                            id="titre"
                            placeholder="Ex: Responsable Marketing"
                            value={cvData.description}
                            onChange={(e) =>
                              setCvData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            required
                            className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations personnelles */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Nom complet</Label>
                      <input
                        id="username"
                        value={cvData.informations_personnelles.username}
                        placeholder="Ex: KOUAKOU KAN JEAN-MARIE"
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              username: e.target.value,
                            },
                          }))
                        }
                        required
                        className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <input
                        id="email"
                        type="email"
                        value={cvData.informations_personnelles.email}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              email: e.target.value,
                            },
                          }))
                        }
                        required
                        className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adresse">Adresse</Label>
                      <input
                        id="adresse"
                        value={cvData.informations_personnelles.adresse}
                        placeholder="Ex: Abidjan, Yopougon"
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              adresse: e.target.value,
                            },
                          }))
                        }
                        required
                        className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <input
                        id="telephone"
                        type="tel"
                        maxLength={14}
                        value={cvData.informations_personnelles.telephone}
                        placeholder="Ex: +225 07 07 07 07"
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              telephone: e.target.value,
                            },
                          }))
                        }
                        required
                        className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <div>
                        <Label htmlFor="date_naissance">
                          Date de naissance
                        </Label>
                        <input
                          id="date_naissance"
                          type="date"
                          value={
                            cvData.informations_personnelles.date_naissance
                          }
                          onChange={(e) =>
                            setCvData((prev) => ({
                              ...prev,
                              informations_personnelles: {
                                ...prev.informations_personnelles,
                                date_naissance: e.target.value,
                              },
                            }))
                          }
                          required
                          className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="situation_familiale">
                        Situation familiale
                      </Label>
                      <Select
                        value={
                          cvData.informations_personnelles.situation_familiale
                        }
                        onValueChange={(value) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              situation_familiale: value,
                            },
                          }))
                        }
                        required
                      >
                        <SelectTrigger id="situation_familiale">
                          <SelectValue placeholder="Sélectionner votre situation familiale" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Célibataire">
                            Célibataire
                          </SelectItem>
                          <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                          <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                          <SelectItem value="Veuf/Veuve">Veuf/Veuve</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="nbre_enfants">Nombre d'enfants</Label>
                      <input
                        type="number"
                        maxLength={2}
                        value={cvData.informations_personnelles.nbre_enfants}
                        placeholder="Ex: 1"
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              nbre_enfants: e.target.value, // garde en string
                            },
                          }))
                        }
                        className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="permis_conduire">
                        Permis de conduire
                      </Label>
                      <input
                        value={cvData.informations_personnelles.permis_conduire}
                        maxLength={5}
                        placeholder="Ex: ABCDE ou ABCD"
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              permis_conduire: e.target.value,
                            },
                          }))
                        }
                        className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/votre-profil"
                        value={cvData.informations_personnelles.linkedin}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              linkedin: e.target.value,
                            },
                          }))
                        }
                        className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sections avec onglets */}
              <div className="mt-4 h-full">
                {/* Section Expériences */}
                <div className="border rounded-lg">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4  text-black"
                    onClick={() => toggleSection("experiences")}
                  >
                    <span className="text-xl font-semibold">Expériences</span>
                    {openSections.experiences ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {openSections.experiences && (
                    <div className="p-4">
                      <div className="space-y-4">
                        {cvData.experiences.map((exp) => (
                          <div
                            key={exp.id}
                            className="p-4 space-y-4 border rounded-lg"
                          >
                            <div className="space-y-6">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">
                                  Expérience #
                                  {cvData.experiences.indexOf(exp) + 1}
                                </h4>
                                <Button
                                  className="px-4 py-2 bg-red-600 text-white rounded"
                                  onClick={() => removeExperience(exp.id)}
                                >
                                  <Trash2 className="h-7 w-7" color="white" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Titre du poste</Label>
                                  <input
                                    value={exp.titre_poste}
                                    onChange={(e) =>
                                      updateExperience(
                                        exp.id,
                                        "titre_poste",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: Développeur Frontend"
                                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                                  />
                                </div>
                                <div>
                                  <Label>Entreprise</Label>
                                  <input
                                    value={exp.nom_entreprise}
                                    onChange={(e) =>
                                      updateExperience(
                                        exp.id,
                                        "nom_entreprise",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: Google"
                                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Date de début</Label>
                                  <input
                                    type="date"
                                    value={exp.date_debut}
                                    onChange={(e) =>
                                      updateExperience(
                                        exp.id,
                                        "date_debut",
                                        e.target.value
                                      )
                                    }
                                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                                  />
                                </div>
                                <div>
                                  <Label>Date de fin</Label>
                                  <input
                                    type="date"
                                    value={exp.date_fin}
                                    onChange={(e) =>
                                      updateExperience(
                                        exp.id,
                                        "date_fin",
                                        e.target.value
                                      )
                                    }
                                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="block">Vos missions</Label>

                                {exp.missions.map((mission, index) => (
                                  <div
                                    key={mission.id}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <input
                                      value={mission.missions_details}
                                      placeholder={`Mission ${index + 1}`}
                                      onChange={(e) =>
                                        updateMission(
                                          exp.id,
                                          mission.id,
                                          e.target.value
                                        )
                                      }
                                      required
                                      className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                                    />
                                    <Button
                                      className="px-4 py-2 bg-red-600 text-white rounded"
                                      onClick={() =>
                                        removeMissionFromExperience(
                                          exp.id,
                                          mission.id
                                        )
                                      }
                                    >
                                      <Trash2
                                        className="h-7 w-7"
                                        color="white"
                                      />
                                    </Button>
                                  </div>
                                ))}

                                <button
                                  type="button"
                                  className="px-3 py-1 bg-blue-950 hover:bg-blue-900 text-white rounded"
                                  onClick={() => addMissionToExperience(exp.id)}
                                >
                                  Ajouter une mission
                                </button>
                              </div>

                              {/* <div>
                                            <Label>Vos missions</Label>
                                            <input
                                              value={exp.missions[0]?.missions_details || ""}
                                              placeholder="Décrivez vos diffrérentes missions"
                                              onChange={(e) =>
                                                updateExperience(
                                                  exp.id,
                                                  "missions",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div> */}

                              {cvData.experiences.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  <p>Aucune expérience ajoutée</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        <div className="flex justify-start mb-2">
                          <Button
                            className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded"
                            type="button"
                            onClick={addExperience}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une expérience
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Formations */}
                <div className="border rounded-lg overflow-hidden mt-4">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4  text-black"
                    onClick={() => toggleSection("formations")}
                  >
                    <span className="text-xl font-semibold">Formations</span>
                    {openSections.formations ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {openSections.formations && (
                    <div className="p-4">
                      <div className="space-y-4">
                        {cvData.formations.map((formation) => (
                          <div key={formation.id} className="space-y-4">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">
                                Formation #
                                {cvData.formations.indexOf(formation) + 1}
                              </h4>
                              <Button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={() => removeFormation(formation.id)}
                              >
                                <Trash2 className="h-7 w-7" color="white" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Diplôme</Label>
                                <input
                                  value={formation.diplome}
                                  onChange={(e) =>
                                    updateFormation(
                                      formation.id,
                                      "diplome",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ex: Master en Informatique"
                                  className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                                />
                              </div>
                              <div>
                                <Label>Établissement</Label>
                                <input
                                  value={formation.nom_etablissement}
                                  onChange={(e) =>
                                    updateFormation(
                                      formation.id,
                                      "nom_etablissement",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ex: Université de Paris"
                                  className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Date de début</Label>
                                <input
                                  type="date"
                                  value={formation.date_debut}
                                  onChange={(e) =>
                                    updateFormation(
                                      formation.id,
                                      "date_debut",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                                />
                              </div>
                              <div>
                                <Label>Date de fin</Label>
                                <input
                                  type="date"
                                  value={formation.date_fin}
                                  onChange={(e) =>
                                    updateFormation(
                                      formation.id,
                                      "date_fin",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                                />
                              </div>
                            </div>
                            {/* <div>
                                  <Label>Description</Label>
                                  <Textarea
                                    value={formation.description}
                                    onChange={(e) =>
                                      updateFormation(
                                        formation.id,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Décrivez votre formation..."
                                  />
                                </div> */}
                          </div>
                        ))}
                        {/* {cvData.formations.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                <p>Aucune formation ajoutée</p>
                              </div>
                            )} */}

                        <div className="flex justify-start mb-4">
                          <Button
                            className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded"
                            type="button"
                            onClick={addFormation}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une formation
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Compétences */}
                <div className="border rounded-lg overflow-hidden mt-4">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 text-black"
                    onClick={() => toggleSection("competences")}
                  >
                    <span className="text-xl font-semibold">Compétences</span>
                    {openSections.competences ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {openSections.competences && (
                    <div className="p-4 space-y-4">
                      {cvData.competences.map((comp) => (
                        <div
                          key={comp.id}
                          className="flex items-center gap-2 rounded-lg"
                        >
                          <input
                            value={comp.nom_competence}
                            onChange={(e) =>
                              updateCompetence(
                                comp.id,
                                "nom_competence",
                                e.target.value
                              )
                            }
                            placeholder="Ex: JavaScript, React, Node.js"
                            className="flex-1 p-2 rounded border focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                          />

                          {/* Niveau (optionnel) */}
                          {/* <div className="w-32">
            <Select
              value={comp.niveau}
              onValueChange={(value) =>
                updateCompetence(comp.id, "niveau", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Débutant">Débutant</SelectItem>
                <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="Avancé">Avancé</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

                          <Button
                            type="button"
                            className="px-4 py-2 bg-red-600 text-white rounded"
                            onClick={() => removeCompetence(comp.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}

                      <div className="flex justify-start mb-4 mt-4">
                        <Button
                          className="px-4 py-2 rounded bg-blue-950 hover:bg-blue-900 text-white"
                          type="button"
                          onClick={addCompetence}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une compétence
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Langues */}
                <div className="border rounded-lg overflow-hidden mt-4">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 text-black"
                    onClick={() => toggleSection("langues")}
                  >
                    <span className="text-lg font-semibold">Langues</span>
                    {openSections.langues ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {openSections.langues && (
                    <div className="p-4 space-y-4">
                      {cvData.langues.map((langue, index) => (
                        <div
                          key={langue.id}
                          className="flex items-center gap-2 rounded-lg"
                        >
                          <div className="flex flex-wrap gap-2 items-start w-full">
                            <div className="flex-1 w-full">
                              <Label>Langue {index + 1}</Label>
                              <input
                                value={langue.nom_langue}
                                onChange={(e) =>
                                  updateLangue(
                                    langue.id,
                                    "nom_langue",
                                    e.target.value
                                  )
                                }
                                placeholder={`Langue ${index + 1}`}
                                className="w-full p-2 rounded border focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                              />
                            </div>

                            <div className="w-32 min-w-[130px]">
                              <Label>Niveau</Label>
                              <Select
                                value={langue.niveau}
                                onValueChange={(value) =>
                                  updateLangue(langue.id, "niveau", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Niveau" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Débutant">
                                    Débutant
                                  </SelectItem>
                                  <SelectItem value="Intermédiaire">
                                    Intermédiaire
                                  </SelectItem>
                                  <SelectItem value="Avancé">Avancé</SelectItem>
                                  <SelectItem value="Expert">Expert</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="mt-6">
                              <Button
                              className="px-4 py-2 bg-red-600 text-white rounded"
                              onClick={() => removeLangue(langue.id)}
                            >
                              <Trash2 className="h-7 w-7" color="white" />
                            </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* {cvData.langues.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p>Aucune langue ajoutée</p>
                          </div>
                        )} */}

                      <div className="flex justify-start mb-4">
                        <Button
                          className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded"
                          type="button"
                          onClick={addLangue}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter une langue
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Centres d'intérêt */}
                <div className="border rounded-lg overflow-hidden mt-4">
                  <button
                    type="button"
                    className="w-full flex justify-between items-center p-4 text-block"
                    onClick={() => toggleSection("centres_interet")}
                  >
                    <span className="text-xl font-semibold">
                      Centres d'intérêt
                    </span>
                    {openSections.centres_interet ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </button>

                  {openSections.centres_interet && (
                    <div className="p-4 space-y-4">
                      {cvData.centres_interet.map((centre) => (
                        <div
                          key={centre.id}
                          className="flex items-center gap-2"
                        >
                          <div className="flex-1">
                            <input
                              value={centre.nom_centre_interet}
                              onChange={(e) =>
                                updateCentreInteret(
                                  centre.id,
                                  "nom_centre_interet",
                                  e.target.value
                                )
                              }
                              placeholder="Ex: Voyages, Lecture, Natation"
                              className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                            />
                          </div>

                          <Button
                            className="px-4 py-2 bg-red-600 text-white rounded"
                            onClick={() => removeCentreInteret(centre.id)}
                          >
                            <Trash2 className="h-7 w-7" color="white" />
                          </Button>
                        </div>
                      ))}

                      {/* {cvData.centres_interet.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>Aucun centre d'intérêt ajoutée</p>
                        </div>
                      )} */}

                      <div className="flex justify-start mb-4">
                        <Button
                          className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded"
                          type="button"
                          onClick={addCentreInteret}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un centre d'intérêt
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded"
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
