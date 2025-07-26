"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Plus,
  User,
  LogOut,
  Trash2,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { api, apitoken } from "../../axios.config";
import useAuth from "@/hooks/useAuth";
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
import ExportOptions, {
  type ExportOptions as ExportOptionsType,
} from "@/components/export-options";
import TemplateSelector from "@/components/cv-templates/template-selector";
import ModerneTemplate from "@/components/cv-templates/moderne-template";
import  TemplateSelectAdmin from "@/components/cv-templates/template-selector-admin";
import DashbaordAdmin from "@/components/admin/dashboard";
import CvListDisplay from "@/components/cv/MesCVPage";
import Swal from "sweetalert2";
import Header from "@/components/header/header";

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [nbreCv, setNbreCv] = useState<string | null>(null);
  const { isAdmin, isClient, roles } = useAuth();


  const router = useRouter();

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
      photos: string;
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
      description: string;
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
      description: string;
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

  useEffect(() => {
  const fetchUserAndCVs = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.replace("/login");
      return;
    }

    try {
      // Vérification du token et récupération de l'utilisateur
      const response = await apitoken.get("/tokens/users", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const userId = response.data.id;
      setToken(storedToken);

      const cvResponse = await api.get(`/cv/liste_cv/user/${userId}`);
      setNbreCv(cvResponse.data);      

    } catch (error) {
      console.error("Token invalide ou erreur lors de la récupération :", error);
      localStorage.removeItem("token");
      router.replace("/login");
    }
  };

  fetchUserAndCVs();
}, []);

  // Example default cvData, replace with actual data as needed
  const defaultCVData = {
    titre: "",
    informations_personnelles: {
      description: "",
      username: "",
      email: "",
      telephone: "",
      adresse: "",
      linkedin: "",
      photos: "",
      nom: "",
      prenom: "",
      github: "",
      // Ajoutez d'autres champs si nécessaire
    },
    experiences: [],
    formations: [],
    competences: [],
    resume: "",
    langues: [],
  };

  const renderCVTemplate = () => {
    const templateProps = {
      roles,
      isAdmin,
      isClient,
      token,
      cvData: defaultCVData, // Add cvData prop here
    };

    switch (roles) {
      case "admin":
        return <ModerneTemplate {...templateProps} />;
    }
  };

  const [user, setUser] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [cvData, setCvData] = useState<CVData>({
    titre: "",
    modele: "moderne",
    informations_personnelles: {
      description: "",
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


  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      titre_poste: "",
      nom_entreprise: "",
      date_debut: "",
      date_fin: "",
      missions: [
        {
          id: "",
          missions_details: "",
        },
      ],
    };
    setCvData((prev) => ({
      ...prev,
      experiences: [...prev.experiences || [], newExp],
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

  const addFormation = () => {
    const newFormation = {
      id: Date.now().toString(),
      diplome: "",
      nom_etablissement: "",
      date_debut: "",
      date_fin: "",
      description: "",
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
      // Import dynamique des bibliothèques
      const [html2canvas, jsPDF] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const element = document.getElementById("cv-preview");
      if (!element) {
        throw new Error(
          "Élément CV non trouvé. Assurez-vous que la prévisualisation est activée."
        );
      }

      // Attendre que toutes les images soient chargées
      const images = element.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            // Timeout après 10 secondes
            setTimeout(reject, 10000);
          });
        })
      );

      // Configuration du canvas
      const scale = options.quality === "high" ? 2 : 1.5;
      const canvas = await html2canvas.default(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          // S'assurer que les styles sont appliqués au clone
          const clonedElement = clonedDoc.getElementById("cv-preview");
          if (clonedElement) {
            clonedElement.style.transform = "none";
            clonedElement.style.position = "static";
          }
        },
      });

      // Vérifier que le canvas a été créé
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Impossible de générer l'image du CV");
      }

      const imgData = canvas.toDataURL("image/png", 0.9);

      // Configuration du PDF
      const format = options.format.toLowerCase() as "a4" | "letter";
      const orientation = options.orientation === "portrait" ? "p" : "l";
      const pdf = new jsPDF.default({
        orientation,
        unit: "mm",
        format,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calcul des dimensions de l'image
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Ajouter l'image au PDF
      if (imgHeight <= pdfHeight) {
        // L'image tient sur une page
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        // L'image nécessite plusieurs pages
        let heightLeft = imgHeight;
        let position = 0;

        // Première page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Pages suivantes
        while (heightLeft > 0) {
          position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }
      // Génération du nom de fichier
      const timestamp = new Date().toISOString().split("T")[0];
      const username = cvData.informations_personnelles.username || "Export";
      const fileName = options.filename || `CV_${username}_${timestamp}.pdf`;

      // Téléchargement du fichier
      pdf.save(fileName);

      console.log("PDF exporté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);

      let errorMessage = "Erreur lors de l'export PDF. ";

      if (error instanceof Error) {
        if (error.message.includes("CV non trouvé")) {
          errorMessage +=
            "Veuillez activer la prévisualisation avant d'exporter.";
        } else if (error.message.includes("Impossible de générer")) {
          errorMessage +=
            "Problème de génération de l'image. Réessayez dans quelques secondes.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += "Veuillez réessayer.";
      }

      alert(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 py-4">
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h2>
          {/* {isClient && (
            <p className="text-gray-600">
              Gérez vos CV et créez-en de nouveaux
            </p>
          )} */}
        </div>

        {/* Quick Actions */}
        {isClient && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            <Card className="border border-gray-300 hover:border-blue-950">
              <CardHeader className="text-center">
                <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <CardTitle>Créer un nouveau CV</CardTitle>
                <CardDescription>
                  Commencez avec un modèle professionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/cv/create">
                  <Button className="w-full bg-blue-950 hover:bg-blue-900 text-lg px-8 py-6">
                    Créer un CV
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border border-gray-300 hover:border-blue-950">
              {nbreCv ? (
                <CardHeader>
                  <CardTitle>
                    <FileText className="h-28 w-28 text-gray-300 mx-auto mb-4" />
                    <div className="mx-auto mb-4 w-full text-center">
                      {nbreCv?.length} CV crées
                    </div>
                  </CardTitle>
                </CardHeader>
              ) : (
                <CardContent>
                  <p className="text-sm text-gray-600">
                    <FileText className="h-28 w-28 text-gray-300 mx-auto mb-4" />
                    Vous n'avez pas encore créé de CV. Commencez dès maintenant
                    !
                  </p>
                </CardContent>
              )}
            </Card>

            <Card className="border border-gray-300 hover:border-blue-950">
              <CardHeader>
                <CardTitle>Modèles disponibles</CardTitle>
                <CardDescription>5 modèles professionnels</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Choisissez parmi nos modèles adaptés à votre secteur
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Liste des cv user = client */}
        {isClient && <CvListDisplay />}

        {/* Recent CVs */}
        {isAdmin && (
          <div>
            {/* Dashboard Admin */}
            <DashbaordAdmin />

            {/* <Card>
              <CardHeader>
                <CardTitle>Choix du modèle</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateSelectAdmin />
              </CardContent>
            </Card> */}

            {isClient && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titre">Titre du CV</Label>
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

                      <div>
                        <Label htmlFor="username">Nom complet</Label>
                        <Textarea
                          id="description"
                          placeholder="Décrivez brièvement votre profil professionnel"
                          value={cvData.informations_personnelles.description}
                          onChange={(e) =>
                            setCvData((prev) => ({
                              ...prev,
                              description: e.target.value,
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
                      {/* <PhotoUpload
                                          photo={cvData.informations_personnelles.photo}
                                          onPhotoChange={(photo) =>
                                            setCvData((prev) => ({
                                              ...prev,
                                              informations_personnelles: {
                                                ...prev.informations_personnelles,
                                                photo,
                                              },
                                            }))
                                          }
                                        /> */}
                    </div>
                  </CardContent>
                </Card>

                {/* Sections avec onglets */}
                <Card>
                  <CardContent className="space-y-4">
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
                                <Button onClick={addExperience} size="sm">
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
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeExperience(exp.id)}
                                      >
                                        <Trash2
                                          className="h-4 w-4"
                                          color="red"
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
                                    <div>
                                      <Label>Description</Label>
                                      <Textarea
                                        value={
                                          exp.missions[0]?.missions_details
                                        }
                                        onChange={(e) =>
                                          updateExperience(
                                            exp.id,
                                            "missions",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Décrivez vos différentes missions"
                                      />
                                    </div>
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
                                <Button onClick={addFormation} size="sm">
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
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeFormation(formation.id)
                                        }
                                      >
                                        <Trash2
                                          className="h-4 w-4"
                                          color="red"
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
                                    <div>
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
                                    </div>
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
                                <Button onClick={addCompetence} size="sm">
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
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeCompetence(comp.id)
                                        }
                                      >
                                        <Trash2
                                          className="h-4 w-4"
                                          color="red"
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
                                <Button onClick={addLangue} size="sm">
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
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLangue(langue.id)}
                                      >
                                        <Trash2
                                          className="h-4 w-4"
                                          color="red"
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
                                <Button onClick={addCentreInteret} size="sm">
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
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeCentreInteret(centre.id)
                                        }
                                      >
                                        <Trash2
                                          className="h-4 w-4"
                                          color="red"
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
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
