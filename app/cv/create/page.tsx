"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { FileText, Plus, Trash2, ArrowLeft, Eye } from "lucide-react";
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
    photos:  string;
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
  const [titre, setTitre] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(previewTemplate);

  const [cvInfos, setCvInfos] = useState<any>(null);

  const [getModele, setGetModele] = useState<any>([]);
  const [nomModel, setNomModel] = useState<any>([]);
  const [modelesId, setModelesId] = useState<number>(0);

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
      // router.push("/dashboard");
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

  // const exportToPDF = async (options: ExportOptionsType) => {
  //   setIsExporting(true);
  //   try {
  //     // Import dynamique des bibliothèques
  //     const [html2canvas, jsPDF] = await Promise.all([
  //       import("html2canvas"),
  //       import("jspdf"),
  //     ]);

  //     const element = document.getElementById("cv-preview");
  //     if (!element) {
  //       throw new Error(
  //         "Élément CV non trouvé. Assurez-vous que la prévisualisation est activée."
  //       );
  //     }

  //     // Configuration du canvas
  //     const scale = options.quality === "high" ? 2 : 1.5;
  //     const canvas = await html2canvas.default(element, {
  //       scale,
  //       useCORS: true,
  //       allowTaint: true,
  //       backgroundColor: "#ffffff",
  //       logging: false,
  //       width: element.scrollWidth,
  //       height: element.scrollHeight,
  //       onclone: (clonedDoc) => {
  //         // S'assurer que les styles sont appliqués au clone
  //         const clonedElement = clonedDoc.getElementById("cv-preview");
  //         if (clonedElement) {
  //           clonedElement.style.transform = "none";
  //           clonedElement.style.position = "static";
  //         }
  //       },
  //     });

  //     // Vérifier que le canvas a été créé
  //     if (!canvas || canvas.width === 0 || canvas.height === 0) {
  //       throw new Error("Impossible de générer l'image du CV");
  //     }

  //     const imgData = canvas.toDataURL("image/png", 0.9);

  //     // Configuration du PDF
  //     const format = options.format.toLowerCase() as "a4" | "letter";
  //     const orientation = options.orientation === "portrait" ? "p" : "l";
  //     const pdf = new jsPDF.default({
  //       orientation,
  //       unit: "mm",
  //       format,
  //     });

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();

  //     // Calcul des dimensions de l'image
  //     const imgWidth = pdfWidth;
  //     const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  //     // Ajouter l'image au PDF
  //     if (imgHeight <= pdfHeight) {
  //       // L'image tient sur une page
  //       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //     } else {
  //       // L'image nécessite plusieurs pages
  //       let heightLeft = imgHeight;
  //       let position = 0;

  //       // Première page
  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pdfHeight;

  //       // Pages suivantes
  //       while (heightLeft > 0) {
  //         position -= pdfHeight;
  //         pdf.addPage();
  //         pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //         heightLeft -= pdfHeight;
  //       }
  //     }

  //     // Génération du nom de fichier
  //     const timestamp = new Date().toISOString().split("T")[0];
  //     const username = cvData.informations_personnelles.username || "Export";
  //     const fileName = options.filename || `CV_${username}_${timestamp}.pdf`;

  //     // Téléchargement du fichier
  //     pdf.save(fileName);
  //   } catch (error) {
  //     console.error("Erreur lors de l'export PDF:", error);

  //     let errorMessage = "Erreur lors de l'export PDF. ";

  //     if (error instanceof Error) {
  //       if (error.message.includes("CV non trouvé")) {
  //         errorMessage +=
  //           "Veuillez activer la prévisualisation avant d'exporter.";
  //       } else if (error.message.includes("Impossible de générer")) {
  //         errorMessage +=
  //           "Problème de génération de l'image. Réessayez dans quelques secondes.";
  //       } else {
  //         errorMessage += error.message;
  //       }
  //     } else {
  //       errorMessage += "Veuillez réessayer.";
  //     }

  //     alert(errorMessage);
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

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

      // Copier le contenu + styles de l'élément CV
      printFrame.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Export PDF</title>
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

      // Démarrer l'impression
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();

      // Nettoyer après impression
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    } catch (error) {
      console.error("Erreur d'export :", error);
      alert(
        "Erreur lors de l'export. Utilisez Ctrl+P pour lancer l'impression manuellement."
      );
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Créer votre CV
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Masquer" : "Prévisualiser"}
            </Button>
            <ExportOptions
              onExport={exportToPDF}
              isExporting={isExporting}
              disabled={!showPreview}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div
          className={`grid gap-6 ${
            showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1"
          }`}
        >
          {/* Formulaire d'édition */}

          <div className="space-y-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle>Choix du modèle</CardTitle>
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
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="hidden">
                      <Label htmlFor="models_cv_id">Id mODEL</Label>
                      <Input
                        id="model_cv_id"
                        placeholder="Ex: Développeur Full Stack"
                        value={cvData.models_cv_id}
                      />
                    </div>
                    <div className="hidden">
                      <Label htmlFor="users_id">Id USERS</Label>
                      <Input
                        id="users_id"
                        placeholder="Ex: Développeur Full Stack"
                        value={cvData.users_id}
                      />
                    </div>
                    <div>
                      <Label htmlFor="titre">Titre</Label>
                      <Input
                        id="titre"
                        placeholder="Ex: Développeur Full Stack"
                        value={cvData.titre}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            titre: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">
                        Description de votre profil
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Ex: Développeur Full Stack"
                        value={cvData.description}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Informations personnelles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Nom complet</Label>
                        <Input
                          id="username"
                          value={cvData.informations_personnelles.username}
                          onChange={(e) =>
                            setCvData((prev) => ({
                              ...prev,
                              informations_personnelles: {
                                ...prev.informations_personnelles,
                                username: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
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
                        />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                          id="telephone"
                          value={cvData.informations_personnelles.telephone}
                          onChange={(e) =>
                            setCvData((prev) => ({
                              ...prev,
                              informations_personnelles: {
                                ...prev.informations_personnelles,
                                telephone: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="adresse">Adresse</Label>
                      <Input
                        id="adresse"
                        value={cvData.informations_personnelles.adresse}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            informations_personnelles: {
                              ...prev.informations_personnelles,
                              adresse: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
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
                      />
                    </div>
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
/>


                    </div>
                  </CardContent>
                </Card>

                {/* Sections avec onglets */}
                <Card>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1">
                      <Tabs defaultValue="experiences" className="w-full">
                        <TabsList className="flex flex-col mt-5 md:flex-row card-tabsList card-gray-tabsList w-full border-gray-200">
                          <TabsTrigger
                            value="experiences"
                            className="w-full md:w-auto text-left md:text-center"
                          >
                            Expériences
                          </TabsTrigger>
                          <TabsTrigger
                            value="formations"
                            className="w-full md:w-auto text-left md:text-center"
                          >
                            Formations
                          </TabsTrigger>
                          <TabsTrigger
                            value="competences"
                            className="w-full md:w-auto text-left md:text-center"
                          >
                            Compétences
                          </TabsTrigger>
                          <TabsTrigger
                            value="langues"
                            className="w-full md:w-auto text-left md:text-center"
                          >
                            Langues
                          </TabsTrigger>
                          <TabsTrigger
                            value="centres_interet"
                            className="w-full md:w-auto text-left md:text-center"
                          >
                            Centres d'intérêt
                          </TabsTrigger>
                        </TabsList>

                        <div className="w-full card-tabsList">
                          {/* Expériences */}
                          <TabsContent value="experiences">
                            <Card>
                              <CardHeader className="flex md:flex-row  items-center justify-between">
                                <CardTitle>
                                  Expériences professionnelles
                                </CardTitle>
                                <Button
                                  type="button"
                                  onClick={addExperience}
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter
                                </Button>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                {cvData.experiences.map((exp) => (
                                  <div
                                    key={exp.id}
                                    className="border rounded-lg p-4 space-y-4"
                                  >
                                    <div className="flex justify-between items-start">
                                      <h4 className="font-medium">
                                        Expérience #
                                        {cvData.experiences.indexOf(exp) + 1}
                                      </h4>
                                      <Button
                                        className="px-4 py-2 bg-red-600 text-white rounded"
                                        onClick={() => removeExperience(exp.id)}
                                      >
                                        <Trash2
                                          className="h-7 w-7"
                                          color="white"
                                        />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Titre du poste</Label>
                                        <Input
                                          value={exp.titre_poste}
                                          onChange={(e) =>
                                            updateExperience(
                                              exp.id,
                                              "titre_poste",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: Développeur Frontend"
                                        />
                                      </div>
                                      <div>
                                        <Label>Entreprise</Label>
                                        <Input
                                          value={exp.nom_entreprise}
                                          onChange={(e) =>
                                            updateExperience(
                                              exp.id,
                                              "nom_entreprise",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: Google"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Date de début</Label>
                                        <Input
                                          type="date"
                                          value={exp.date_debut}
                                          onChange={(e) =>
                                            updateExperience(
                                              exp.id,
                                              "date_debut",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Date de fin</Label>
                                        <Input
                                          type="date"
                                          value={exp.date_fin}
                                          onChange={(e) =>
                                            updateExperience(
                                              exp.id,
                                              "date_fin",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="block">
                                        Vos missions
                                      </Label>

                                      {exp.missions.map((mission, index) => (
                                        <div
                                          key={mission.id}
                                          className="flex items-center gap-2 mb-2"
                                        >
                                          <Input
                                            className="flex-1"
                                            value={mission.missions_details}
                                            placeholder={`Mission ${index + 1}`}
                                            onChange={(e) =>
                                              updateMission(
                                                exp.id,
                                                mission.id,
                                                e.target.value
                                              )
                                            }
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
                                        className="px-3 py-1 bg-blue-600 text-white rounded"
                                        onClick={() =>
                                          addMissionToExperience(exp.id)
                                        }
                                      >
                                        Ajouter une mission
                                      </button>
                                    </div>

                                    {/* <div>
                                      <Label>Vos missions</Label>
                                      <Input
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
                                  </div>
                                ))}
                                {cvData.experiences.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>Aucune expérience ajoutée</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </TabsContent>

                          {/* Formations */}
                          <TabsContent value="formations">
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Formations</CardTitle>
                                <Button
                                  type="button"
                                  onClick={addFormation}
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter
                                </Button>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                {cvData.formations.map((formation) => (
                                  <div
                                    key={formation.id}
                                    className="border rounded-lg p-4 space-y-4"
                                  >
                                    <div className="flex justify-between items-start">
                                      <h4 className="font-medium">
                                        Formation #
                                        {cvData.formations.indexOf(formation) +
                                          1}
                                      </h4>
                                      <Button  
                                        className="px-4 py-2 bg-red-600 text-white rounded"
                                        onClick={() =>
                                          removeFormation(formation.id)
                                        }
                                      >
                                        <Trash2
                                          className="h-7 w-7"
                                          color="white"
                                        />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Diplôme</Label>
                                        <Input
                                          value={formation.diplome}
                                          onChange={(e) =>
                                            updateFormation(
                                              formation.id,
                                              "diplome",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: Master en Informatique"
                                        />
                                      </div>
                                      <div>
                                        <Label>Établissement</Label>
                                        <Input
                                          value={formation.nom_etablissement}
                                          onChange={(e) =>
                                            updateFormation(
                                              formation.id,
                                              "nom_etablissement",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: Université de Paris"
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Date de début</Label>
                                        <Input
                                          type="date"
                                          value={formation.date_debut}
                                          onChange={(e) =>
                                            updateFormation(
                                              formation.id,
                                              "date_debut",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Date de fin</Label>
                                        <Input
                                          type="date"
                                          value={formation.date_fin}
                                          onChange={(e) =>
                                            updateFormation(
                                              formation.id,
                                              "date_fin",
                                              e.target.value
                                            )
                                          }
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
                                {cvData.formations.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>Aucune formation ajoutée</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </TabsContent>

                          {/* Compétences */}
                          <TabsContent value="competences">
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Compétences</CardTitle>
                                <Button
                                  type="button"
                                  onClick={addCompetence}
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter
                                </Button>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid gap-4">
                                  {cvData.competences.map((comp) => (
                                    <div
                                      key={comp.id}
                                      className="flex items-center gap-4 p-3 border rounded-lg"
                                    >
                                      <div className="flex-1">
                                        <Input
                                          value={comp.nom_competence}
                                          onChange={(e) =>
                                            updateCompetence(
                                              comp.id,
                                              "nom_competence",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: JavaScript, React, Node.js"
                                        />
                                      </div>
                                      <div className="w-32">
                                        <Select
                                          value={comp.niveau}
                                          onValueChange={(value) =>
                                            updateCompetence(
                                              comp.id,
                                              "niveau",
                                              value
                                            )
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Débutant">
                                              Débutant
                                            </SelectItem>
                                            <SelectItem value="Intermédiaire">
                                              Intermédiaire
                                            </SelectItem>
                                            <SelectItem value="Avancé">
                                              Avancé
                                            </SelectItem>
                                            <SelectItem value="Expert">
                                              Expert
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <Button
                                        type="button"
                                        className="px-4 py-2 bg-red-600 text-white rounded"
                                        onClick={() =>
                                          removeCompetence(comp.id)
                                        }
                                      >
                                        <Trash2
                                          className="h-7 w-7"
                                          color="white"
                                        />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                                {cvData.competences.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>Aucune compétence ajoutée</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </TabsContent>

                          {/* Langues */}
                          <TabsContent value="langues">
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Langues</CardTitle>
                                <Button
                                  type="button"
                                  onClick={addLangue}
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter
                                </Button>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid gap-4">
                                  {cvData.langues.map((langue) => (
                                    <div
                                      key={langue.id}
                                      className="flex items-center gap-4 p-3 border rounded-lg"
                                    >
                                      <div className="flex-1">
                                        <Input
                                          value={langue.nom_langue}
                                          onChange={(e) =>
                                            updateLangue(
                                              langue.id,
                                              "nom_langue",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: Français, Anglais, Espagnol"
                                        />
                                      </div>
                                      <div className="w-32">
                                        <Select
                                          value={langue.niveau}
                                          onValueChange={(value) =>
                                            updateLangue(
                                              langue.id,
                                              "niveau",
                                              value
                                            )
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Débutant">
                                              Débutant
                                            </SelectItem>
                                            <SelectItem value="Intermédiaire">
                                              Intermédiaire
                                            </SelectItem>
                                            <SelectItem value="Avancé">
                                              Avancé
                                            </SelectItem>
                                            <SelectItem value="Natif">
                                              Natif
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <Button
                                        className="px-4 py-2 bg-red-600 text-white rounded"
                                        onClick={() => removeLangue(langue.id)}
                                      >
                                        <Trash2
                                          className="h-7 w-7"
                                          color="white"
                                        />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                                {cvData.langues.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>Aucune langue ajoutée</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </TabsContent>

                          {/* Centred d'interet */}
                          <TabsContent value="centres_interet">
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Centres d'intérêt</CardTitle>
                                <Button
                                  type="button"
                                  onClick={addCentreInteret}
                                  size="sm"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter
                                </Button>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid gap-4">
                                  {cvData.centres_interet.map((centre) => (
                                    <div
                                      key={centre.id}
                                      className="flex items-center gap-4 p-3 border rounded-lg"
                                    >
                                      <div className="flex-1">
                                        <Input
                                          value={centre.nom_centre_interet}
                                          onChange={(e) =>
                                            updateCentreInteret(
                                              centre.id,
                                              "nom_centre_interet",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: Voyages, Lecture, Natation"
                                        />
                                      </div>

                                      <Button
                                        className="px-4 py-2 bg-red-600 text-white rounded"
                                        onClick={() =>
                                          removeCentreInteret(centre.id)
                                        }
                                      >
                                        <Trash2
                                          className="h-7 w-7"
                                          color="white"
                                        />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                                {cvData.centres_interet.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>Aucun centre d'intérêt ajoutée</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </div>
                      </Tabs>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Enregistrer
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </form>
          </div>

          {/* Prévisualisation */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 lg:h-fit">
              {renderCVTemplate()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
