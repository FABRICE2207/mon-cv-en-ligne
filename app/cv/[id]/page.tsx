"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Trash2,
  ArrowLeft,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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

interface Mission {
  id: string;
  missions_details: string;
}

interface Experience {
  id: string;
  titre_poste: string;
  nom_entreprise: string;
  date_debut: string;
  date_fin: string;
  missions: Mission[];
}

interface Formation {
  id: string;
  diplome: string;
  nom_etablissement: string;
  date_debut: string;
  date_fin: string;
}

interface Competence {
  id: string;
  nom_competence: string;
  niveau: string;
}

interface Langue {
  id: string;
  nom_langue: string;
  niveau: string;
}

interface CentreInteret {
  id: string;
  nom_centre_interet: string;
}

interface PersonalInfo {
  username: string;
  email: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  permis_conduire: string;
  situation_familiale: string;
  nbre_enfants: string;
  nationalite: string;
  linkedin: string;
  photos: string | File;
}

interface CVData {
  titre: string;
  images: string;
  description: string;
  users_id: number;
  models_cv_id: number;
  informations_personnelles: PersonalInfo;
  experiences: Experience[];
  formations: Formation[];
  competences: any[];
  langues: any[];
  centres_interet: any[];
}

interface Props {
  params: Promise<{ id: string }>; // 👈 C’est une promesse désormais
  previewTemplate: string;
}

const CVForm = ({ params, previewTemplate }: Props) => {
  const { id } = React.use(params); // ✅ déstructuration via React.use
  // const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [showCV, setShowCV] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(previewTemplate);

  const handleTemplateSelect = (templateId: string, modeleId: number) => {
    setSelectedTemplate(templateId);
    setModelesId(modeleId);
    setCvData((prev) => ({
      ...prev,
      models_cv_id: modeleId,
    }));
  };

  // const [cvInfos, setCvInfos] = useState<any>(null);

  const [getModele, setGetModele] = useState<any>([]);
  const [nomModel, setNomModel] = useState<any>([]);
  const [modelesId, setModelesId] = useState<number>(0);

  // État pour gérer les sections ouvertes
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    experiences: true,
    formations: false,
    competences: false,
    langues: false,
    centres_interet: false,
    logiciels: false,
  });

  //   const initialCvData: CVData = {
  //   titre: "",
  //   description: "",
  //   models_cv_id: 1,
  //   users_id: 1,
  //   images: `${previewTemplate}.png`,
  //   informations_personnelles: {
  //     username: "",
  //     email: "",
  //     telephone: "",
  //     adresse: "",
  //     linkedin: "",
  //     photos: "",
  //     date_naissance: "",
  //     situation_familiale: "",
  //     nbre_enfants: "",
  //     // nationalite: "",
  //     permis_conduire: "",
  //   },
  //   experiences: [],
  //   formations: [],
  //   competences: [],
  //   langues: [],
  //   projets: [],
  //   certifications: [],
  //   centres_interet: [],
  // };

  const [cvData, setCvData] = useState<CVData>({
    titre: "",
    images: "",
    description: "",
    users_id: 1,
    models_cv_id: 1,
    informations_personnelles: {
      username: "",
      email: "",
      telephone: "",
      adresse: "",
      date_naissance: "",
      permis_conduire: "",
      situation_familiale: "",
      nbre_enfants: "",
      nationalite: "",
      linkedin: "",
      photos: "",
    },
    experiences: [],
    formations: [],
    competences: [],
    langues: [],
    centres_interet: [],
  });

  useEffect(() => {
    const fetchCV = async () => {
      try {
        if (!id) {
          setLoading(false);
          return;
        }

        const response = await api.get(`/cv/get_cv_id/${id}`);
        const data = response.data;

        if (data.cvData) {
          // Transformation des données pour s'adapter à l'état initial
          const transformedData = {
            ...data.cvData,
            informations_personnelles: {
              username: data.cvData.informations_personnelles?.username || "",
              email: data.cvData.informations_personnelles?.email || "",
              telephone: data.cvData.informations_personnelles?.telephone || "",
              adresse: data.cvData.informations_personnelles?.adresse || "",
              date_naissance:
                data.cvData.informations_personnelles?.date_naissance || "",
              permis_conduire:
                data.cvData.informations_personnelles?.permis_conduire || "",
              situation_familiale:
                data.cvData.informations_personnelles?.situation_familiale ||
                "",
              nbre_enfants:
                data.cvData.informations_personnelles?.nbre_enfants || "",
              linkedin: data.cvData.informations_personnelles?.linkedin || "",
              photos: data.cvData.informations_personnelles?.photos || null,
            },
            experiences: data.cvData.experiences || [],
            formations: data.cvData.formations || [],
            competences: data.cvData.competences || [],
            langues: data.cvData.langues || [],
            centres_interet: data.cvData.centres_interet || [],
          };

          setCvData(transformedData);

          if (transformedData.informations_personnelles.photos) {
            setSelectedImage(
              transformedData.informations_personnelles.photos as string
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du CV", error);
        alert("Erreur lors du chargement du CV");
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      // Only allow specific parent keys that we know are objects
      if (parent === "informations_personnelles") {
        setCvData((prev) => ({
          ...prev,
          informations_personnelles: {
            ...prev.informations_personnelles,
            [child]: value,
          },
        }));
        return;
      }
      // Add other object parents here if needed
    } else {
      // Only allow direct properties that aren't objects
      if (name === "titre" || name === "description") {
        setCvData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setCvData((prev) => {
      const updatedExperiences = [...prev.experiences];
      updatedExperiences[index] = {
        ...updatedExperiences[index],
        [field]: value,
      };
      return {
        ...prev,
        experiences: updatedExperiences,
      };
    });
  };

  const handleFormationChange = (
    index: number,
    field: keyof Formation,
    value: string
  ) => {
    setCvData((prev) => {
      const updateFormations = [...prev.formations];
      updateFormations[index] = {
        ...updateFormations[index],
        [field]: value,
      };
      return {
        ...prev,
        formations: updateFormations,
      };
    });
  };

  const handleCompetenceChange = (
    index: number,
    field: keyof Competence,
    value: string
  ) => {
    setCvData((prev) => {
      const updateCompetences = [...prev.competences];
      updateCompetences[index] = {
        ...updateCompetences[index],
        [field]: value,
      };
      return {
        ...prev,
        competences: updateCompetences,
      };
    });
  };

  const handleLangueChange = (
    index: number,
    field: keyof Langue,
    value: string
  ) => {
    setCvData((prev) => {
      const updateLangues = [...prev.langues];
      updateLangues[index] = {
        ...updateLangues[index],
        [field]: value,
      };
      return {
        ...prev,
        langues: updateLangues,
      };
    });
  };

  const handleCentreInteretChange = (
    index: number,
    field: keyof CentreInteret,
    value: string
  ) => {
    setCvData((prev) => {
      const updateCentresInteret = [...prev.centres_interet];
      updateCentresInteret[index] = {
        ...updateCentresInteret[index],
        [field]: value,
      };
      return {
        ...prev,
        centres_interet: updateCentresInteret,
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setCvData((prev) => ({
        ...prev,
        informations_personnelles: {
          ...prev.informations_personnelles,
          photos: file,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Ajout des champs simples
      formData.append("titre", cvData.titre);
      formData.append("description", cvData.description);

      // Ajout des informations personnelles (sauf la photo)
      const { photos, ...personalInfo } = cvData.informations_personnelles;
      formData.append(
        "informations_personnelles",
        JSON.stringify(personalInfo)
      );

      // Ajout de la photo si elle a été modifiée
      if (cvData.informations_personnelles.photos instanceof File) {
        formData.append("photo", cvData.informations_personnelles.photos);
      }

      // Ajout des autres sections
      formData.append("experiences", JSON.stringify(cvData.experiences));
      formData.append("formations", JSON.stringify(cvData.formations));
      formData.append("competences", JSON.stringify(cvData.competences));
      formData.append("langues", JSON.stringify(cvData.langues));
      formData.append(
        "centres_interet",
        JSON.stringify(cvData.centres_interet)
      );

      // // Envoi des données
      // const url = id ? `/cv/update/${id}` : "/cv/create";
      // const method = id ? "PUT" : "POST";

      // const response = await api({
      //   method,
      //   url,
      //   data: formData,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // if (response.status === 200 || response.status === 201) {
      //   alert("CV sauvegardé avec succès!");
      //   if (!id) {
      //     // router.push('/mes-cv');
      //   }
      // } else {
      //   throw new Error("Erreur lors de la sauvegarde");
      // }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExperience = () => {
    setCvData((prev: CVData) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: Date.now().toString(),
          titre_poste: "",
          nom_entreprise: "",
          date_debut: "",
          date_fin: "",
          missions: [], // Initialisé comme tableau vide d'objets Mission
        },
      ],
    }));
  };

  // Ajouter une mission à une expérience
  const addMissionToExperience = (expId: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              missions: [
                ...exp.missions,
                { id: Date.now().toString(), missions_details: "" },
              ],
            }
          : exp
      ),
    }));
  };

  // Update a mission
  const updateMission = (expId: string, missionId: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            missions: exp.missions.map((mission) =>
              mission.id === missionId
                ? { ...mission, missions_details: value }
                : mission
            ),
          };
        }
        return exp;
      }),
    }));
  };

  // Remove a mission from an experience
  const removeMissionFromExperience = (expId: string, missionId: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            missions: exp.missions.filter(
              (mission) => mission.id !== missionId
            ),
          };
        }
        return exp;
      }),
    }));
  };

  const handleMissionChange = (
    expId: string,
    missionId: string,
    value: string
  ) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            missions: exp.missions.map((mission) =>
              mission.id === missionId
                ? { ...mission, mission_details: value }
                : mission
            ),
          };
        }
        return exp;
      }),
    }));
  };

  const removeExperience = (index: number) => {
    setCvData((prev) => {
      const newExperiences = [...prev.experiences];
      newExperiences.splice(index, 1);
      return {
        ...prev,
        experiences: newExperiences,
      };
    });
  };

  const addFormation = () => {
    setCvData((prev) => ({
      ...prev,
      formations: [
        ...prev.formations,
        {
          id: Date.now().toString(),
          diplome: "",
          nom_etablissement: "",
          date_debut: "",
          date_fin: "",
        },
      ],
    }));
  };

  const removeFormation = (index: number) => {
    setCvData((prev) => {
      const newFormations = [...prev.formations];
      newFormations.splice(index, 1);
      return {
        ...prev,
        formations: newFormations,
      };
    });
  };

  const addCompetence = () => {
    setCvData((prev) => ({
      ...prev,
      competences: [
        ...prev.competences,
        {
          nom_competence: "",
          niveau: "",
        },
      ],
    }));
  };

  const removeCompetence = (index: number) => {
    setCvData((prev) => {
      const newCompetence = [...prev.competences];
      newCompetence.splice(index, 1);
      return {
        ...prev,
        competences: newCompetence,
      };
    });
  };

  const addLangue = () => {
    setCvData((prev) => ({
      ...prev,
      langues: [
        ...prev.langues,
        {
          nom_langue: "",
          niveau: "",
        },
      ],
    }));
  };

  const removeLangue = (index: number) => {
    setCvData((prev) => {
      const newLangue = [...prev.langues];
      newLangue.splice(index, 1);
      return {
        ...prev,
        langues: newLangue,
      };
    });
  };

  const addCentreInteret = () => {
    setCvData((prev) => ({
      ...prev,
      centres_interet: [
        ...prev.centres_interet,
        {
          nom_: "",
          niveau: "",
        },
      ],
    }));
  };

  const removeCentreInteret = (index: number) => {
    setCvData((prev) => {
      const newCentre = [...prev.centres_interet];
      newCentre.splice(index, 1);
      return {
        ...prev,
        centres_interet: newCentre,
      };
    });
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
                    return Array.from(sheet.cssRules).map(
                      (rule) => rule.cssText
                    );
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
            Aucun modèle sélectionné pour le modèle. <br />
            Veuillez sélectionner un modèle dans le formulaire.
          </p>
        </div>
      );
    }
    return <TemplateComponent {...templateProps} />;
  };

  // Fonction pour basculer l'état d'une section
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === section ? !prev[key] : false;
        return acc;
      }, {} as Record<string, boolean>),
    }));
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 mx-auto px-4 py-4 items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
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
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto px-4 py-6 max-h-[calc(100vh-100px)]">
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
              />
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            {/* Section Informations de base */}
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
                        photo={cvData.informations_personnelles.photos}
                        onPhotoChange={(filename) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              photos: filename,
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
                            type="text"
                            name="titre"
                            value={cvData.titre}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                            required
                          />
                        </div>
                        <div>
                          <Label>Description de votre profil</Label>
                          <textarea
                            id="titre"
                            placeholder="Ex: Responsable Marketing"
                            value={cvData.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Informations personnelles */}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <div>
                      <Label htmlFor="date_naissance">Date de naissance</Label>
                      <input
                        id="date_naissance"
                        type="date"
                        value={cvData.informations_personnelles.date_naissance}
                        onChange={handleInputChange}
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
                        <SelectItem value="Célibataire">Célibataire</SelectItem>
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
                      onChange={handleInputChange}
                      className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="permis_conduire">Permis de conduire</Label>
                    <input
                      value={cvData.informations_personnelles.permis_conduire}
                      maxLength={5}
                      placeholder="Ex: ABCDE ou ABCD"
                      onChange={handleInputChange}
                      className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/votre-profil"
                      value={cvData.informations_personnelles.linkedin}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Expériences professionnelles */}
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
                      {cvData.experiences.map((exp, index) => (
                        <div
                          key={index}
                          className="p-4 space-y-4 border rounded-lg"
                        >
                          <div className="space-y-6">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">
                                Expérience #{index + 1}
                              </h4>
                              <Button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={() => removeExperience(index)}
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
                                    handleExperienceChange(
                                      index,
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
                                    handleExperienceChange(
                                      index,
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
                                    handleExperienceChange(
                                      index,
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
                                    handleExperienceChange(
                                      index,
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
                                    onChange={(e) =>
                                      updateMission(
                                        exp.id,
                                        mission.id,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Mission ${index + 1}`}
                                    required
                                    className="w-full p-2 rounded border focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
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
                                    <Trash2 className="h-7 w-7" color="white" />
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

                          {/* {cvData.experiences.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                              <p>Aucune expérience ajoutée</p>
                                            </div>
                                          )} */}
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
                      {cvData.formations.map((formation, index) => (
                        <div key={index} className="space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">
                              Formation #{index + 1}
                            </h4>
                            <Button
                              
                              className="px-4 py-2 bg-red-600 text-white rounded"
                              onClick={() => removeFormation(index)}
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
                                  handleFormationChange(
                                    index,
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
                                  handleFormationChange(
                                    index,
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
                                  handleFormationChange(
                                    index,
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
                                  handleFormationChange(
                                    index,
                                    "date_fin",
                                    e.target.value
                                  )
                                }
                                className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

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
                    {cvData.competences.map((competence, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg"
                      >
                        <input
                          value={competence.nom_competence}
                          onChange={(e) =>
                            handleCompetenceChange(
                              index,
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
                          onClick={() => removeCompetence(index)}
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
                        key={index}
                        className="flex items-center gap-2 rounded-lg"
                      >
                        <div className="flex flex-wrap gap-2 items-start w-full">
                          <div className="flex-1 w-full">
                            <Label>Langue {index + 1}</Label>
                            <input
                              value={langue.nom_langue}
                              onChange={(e) =>
                                handleLangueChange(
                                  index,
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
                                handleLangueChange(index, "niveau", value)
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
                              type="button"
                              className="px-4 py-2 bg-red-600 text-white rounded"
                              onClick={() => removeLangue(index)}
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
                    {cvData.centres_interet.map((centre, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <input
                            value={centre.nom_centre_interet}
                            onChange={(e) =>
                              handleCentreInteretChange(
                                index,
                                "nom_centre_interet",
                                e.target.value
                              )
                            }
                            placeholder="Ex: Voyages, Lecture, Natation"
                            className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                          />
                        </div>

                        <Button
                          type="button"
                          className="px-4 py-2 bg-red-600 text-white rounded"
                          onClick={() => removeCentreInteret(index)}
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

            {/* Bouton de soumission */}
            {/* <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CVForm;
