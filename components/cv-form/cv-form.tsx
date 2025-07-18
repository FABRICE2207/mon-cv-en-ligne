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
import ModerneTemplate from "@/components/cv-templates/moderne-template";
import ClassiqueTemplate from "@/components/cv-templates/classique-template";
import PhotoUpload from "@/components/photo-upload";
import { api, apitoken } from '@/axios.config';


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
    id: string;
    titre_poste: string;
    nom_entreprise: string;
    date_debut: string;
    date_fin: string;
    description: string;
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

export default function CreateCVPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [token, setToken] = useState<string | null>(null)
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
      photo: "",
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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login");
    } else {
      console.log("Infos users:", storedToken);

      // Vérification du token côté serveur et récupération des données utilisateur
      apitoken.get('/tokens/users', {
        headers: { Authorization: `Bearer ${storedToken}` }
      }).then(response => {
        const userData = response.data;
        setToken(userData);

        setUser(userData);
        // Pré-remplir avec les données utilisateur
        setCvData((prev) => ({
          ...prev,
          informations_personnelles: {
            ...prev.informations_personnelles,
            email: userData.email,
            username: userData.username?.split(" ")[1] || "",
          },
        }));
      }).catch(error => {
        console.error("Token invalide:", error);
        localStorage.removeItem("token");
        router.replace("/login");
      });
    }
  }, [router]);

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      titre_poste: "",
      nom_entreprise: "",
      date_debut: "",
      date_fin: "",
      description: "",
    };
    setCvData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
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
      centres_interet: prev.centres_interet.filter((centre) => centre.id !== id),
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
      const fileName =
        options.filename || `CV_${username}_${timestamp}.pdf`;

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

  const renderCVTemplate = () => {
    const templateProps = {
      cvData,
      exportMode: false,
      includeColors: true,
    };

    switch (cvData.modele) {
      case "moderne":
        return <ModerneTemplate {...templateProps} />;
      case "professionnel":
        return <ClassiqueTemplate {...templateProps} />;
      // case "creatif":
      //   return <CreatifTemplate {...templateProps} />;
      // case "minimaliste":
      //   return <ModerneTemplate {...templateProps} />; // Use moderne as fallback for now
      // case "professionnel":
      //   return <ClassiqueTemplate {...templateProps} />; // Use classique as fallback for now
      // case "tech":
      //   return <ModerneTemplate {...templateProps} />; // Use moderne as fallback for now
      // default:
      //   return <ModerneTemplate {...templateProps} />;
    }
  };

  // Affiche la liste des modèles de cv
 useEffect(() => {
    const fetchModelCv = async () => {
      try {
        const response = await api.get("/models/liste_model_cv_actives");
        const model_actives = response.data;
        console.log(model_actives);
      } catch (error) {
        console.error("Erreur lors de la récupération des modèles de CV :", error);
      }
    };
    fetchModelCv();
  }, []);
  

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
            <Button>Enregistrer</Button>
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
                  selectedTemplate={cvData.modele}
                  onTemplateSelect={(templateId) =>
                    setCvData((prev) => ({ ...prev, modele: templateId }))
                  }
                  cvData={cvData}
                />
              </CardContent>
            </Card>

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
                      setCvData((prev) => ({ ...prev, titre: e.target.value }))
                    }
                  />
                </div>
                
              </CardContent>
            </Card>

           
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
