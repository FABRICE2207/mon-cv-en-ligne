"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import TemplatesDemoPage from "./template-selector-admin";
import { api } from "@/axios.config";
import { templateComponents } from "@/components/cv-templates";
import { useRouter } from "next/navigation";
import { log } from "console";

interface Template {
  id: string;
  libelle: string;
  images: string;
}

type TemplateSelectorProps = {
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
  onTemplateSelect: (templateId: string, modeleId: number) => void;
  cvData: any;
  modelesId: number;
  onExport: (options: ExportOptions) => void;
};

export interface ExportOptions {
  format: "A4" | "Letter";
  orientation: "portrait" | "landscape";
  quality: "standard" | "high";
  includeColors: boolean;
  filename?: string;
}

export default function TemplateSelector({
  selectedTemplate,
  modelesId,
  onTemplateSelect,
  cvData,
  setSelectedTemplate,
  onExport,
}: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const { isAdmin, isClient, roles } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: "A4",
    orientation: "portrait",
    quality: "high",
    includeColors: true,
  });
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [allowedModels, setAllowedModels] = useState<number[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Vérifie si l'utilisateur est connecté et récupère son ID
  useEffect(() => {
    const fetchUserAndCVs = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        router.replace("/login");
        return;
      }

      try {
        // Vérifie token et récupère user
        const response = await api.get("/tokens/users", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const fetchedUserId = response.data.id;

        setToken(storedToken);
        setUserId(fetchedUserId);

        console.log("✅ User ID récupéré :", fetchedUserId);
      } catch (error) {
        console.error("❌ Token invalide ou erreur :", error);
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    fetchUserAndCVs();
  }, [router]);

  // Récupère les modèles autorisés pour l'utilisateur connecté
  useEffect(() => {
    const fetchAllowedModels = async () => {
      try {
        const res = await api.get(
          `/paiements/payments_success/${userId}/models_cv`
        );
        setAllowedModels(res.data.models_cv_ids || []);
        console.log("📌 Modèles autorisés :", res.data.models_cv_ids);
      } catch (error) {
        console.error("❌ Erreur récupération paiements :", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAllowedModels();
  }, [userId]);

  useEffect(() => {
    if (modelesId !== null) {
      console.log("modelesId mis à jour :", modelesId);
    }
  }, [modelesId]);


  // Affiche la liste des modèles de cv
  useEffect(() => {
    const fetchModelCv = async () => {
      try {
        const response = await api.get("/models/liste_model_cv_actives");
        const model_actives = response.data;

        setTemplates(model_actives); //
        // console.log("Model", model_actives);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des modèles de CV :",
          error
        );
      }
    };
    fetchModelCv();
  }, []);

  // Affiche l'image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleQuickExport = async () => {
    try {
      // Activer l'état de chargement
      setIsExporting(true);

      // 🔹 Lancer l’export
      await onExport(options);

      // 🔹 Simuler ou attendre le paiement réussi
      await new Promise((resolve) => setTimeout(resolve, 1500));

      
    } catch (error) {
      console.error("❌ Erreur lors de l'export :", error);
      // toast.error("Échec de l'export. Veuillez réessayer.");
    } finally {
      // Désactiver l'état de chargement et fermer la modal
      setIsExporting(false);
      setOpen(false);
    }
  };

// 👉 Quand on clique sur Imprimer → juste appeler handleQuickExport
const handleClickPrint = () => {
  handleQuickExport();
};
  return (
    <div className="space-y-2">
      {isClient && (
        <div className="relative w-full">
          {/* Boutons de navigation */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-950 hover:bg-blue-900 rounded-full shadow p-2"
          >
            <ChevronLeft className="w-5 h-5" color="white" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-950 hover:bg-blue-900 rounded-full shadow p-2"
          >
            <ChevronRight className="w-5 h-5" color="white" />
          </button>

          {/* Liste scrollable horizontalement */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide"
          >
            {templates.map((template) => {
              const templateKey = template.images.split(".")[0];
              const TemplateComponent = templateComponents[templateKey];

              return (
                <div
                  key={template.id}
                  className={`min-w-[160px] max-w-[160px] cursor-pointer transition-all duration-200 relative ${
                    selectedTemplate === String(template.id) ? "" : ""
                  }`}
                  onClick={() => {
                    onTemplateSelect(String(template.id), Number(template.id));
                    setPreviewTemplate(templateKey);
                    setSelectedTemplate(String(template.id));
                  }}
                >
                  <div className="border rounded-md p-2 h-full flex flex-col">
                    {/* Image avec loader */}
                    <div className="relative flex-1">
                      {selectedTemplate === String(template.id) && (
                        <div className="w-full">
                          <div className="absolute bg-blue-950 rounded-full p-1 flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded">
                          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/models/modele_cv/${template.images}`}
                        alt={`Modèle ${template.libelle}`}
                        className="w-full h-auto object-contain rounded border"
                        onLoad={() => setLoading(false)}
                        onError={() => setLoading(false)}
                      />
                    </div>

                    {/* Bouton Imprimer */}
                    {/* <div className="mt-2">
                      <button
                        onClick={handleQuickExport} // ✅ on passe la fonction, sans parenthèses
                        disabled={isExporting}
                        className="w-full bg-blue-950 text-white text-sm py-1 px-2 rounded hover:bg-blue-900 transition-colors"
                      >
                        {isExporting ? "Impression..." : "Imprimer"}
                      </button>
                    </div> */}
                    {loading ? (
                        <p className="text-gray-500 text-sm">Vérification du paiement...</p>
                      ) : allowedModels.includes(Number(template.id)) ? (
                        <div className="mt-2">
                          <button
                            onClick={handleQuickExport}
                            // disabled={isExporting}
                            className="w-full bg-blue-950 text-white text-sm py-1 px-2 rounded hover:bg-blue-900 transition-colors"
                          >
                            {isExporting ? "Impression..." : "Imprimer"}
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <button
                            disabled
                            className="w-full bg-gray-400 text-white text-sm py-1 px-2 rounded cursor-not-allowed"
                          >
                            Paiement requis
                          </button>
                        </div>
                      )}

                    {/* {loading ? (
                      <p className="text-gray-500 text-sm">
                        Vérification du paiement...
                      </p>
                    ) : allowedModels.includes(Number(template.id)) ? (
                      isExpired ? (
                        <button
                          onClick={handleQuickExport}
                          disabled={isExporting}
                          className="w-full bg-blue-950 text-white text-sm py-1 px-2 rounded hover:bg-blue-900 transition-colors"
                        >
                          {isExporting ? "Impression..." : "Imprimer"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-400 text-white text-sm py-1 px-2 rounded cursor-not-allowed"
                        >
                          Paiement requis
                        </button>
                      )
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white text-sm py-1 px-2 rounded cursor-not-allowed"
                      >
                        Paiement requis
                      </button>
                    )} */}
                    {/* {loading ? (
  <p className="text-gray-500 text-sm">
    Vérification du paiement...
  </p>
) : allowedModels.includes(Number(template.id)) ? (
  !isExpired ? ( // ✅ tant que ce n'est pas expiré, autoriser l'impression
    <button
      onClick={handleQuickExport}
      
      className="w-full bg-blue-950 text-white text-sm py-1 px-2 rounded hover:bg-blue-900 transition-colors"
    >
      {isExporting ? "Impression..." : "Imprimer"}
    </button>
  ) : (
    <button
      disabled
      className="w-full bg-gray-400 text-white text-sm py-1 px-2 rounded cursor-not-allowed"
    >
      Paiement requis
    </button>
  )
) : (
  <button
    disabled
    className="w-full bg-gray-400 text-white text-sm py-1 px-2 rounded cursor-not-allowed"
  >
    Paiement requis
  </button>
)} */}

{/* {loading ? (
  <p className="text-gray-500 text-sm">
    Vérification du paiement...
  </p>
) : allowedModels.includes(Number(template.id)) ? (
  isExpired ? ( // ✅ Si pas expiré → bouton Imprimer
    <button
      onClick={handleClickPrint}
      className="w-full bg-blue-950 text-white text-sm py-1 px-2 rounded hover:bg-blue-900 transition-colors"
    >
      {isExporting ? "Impression..." : "Imprimer"}
    </button>
  ) : (
    <button
      disabled
      className="w-full bg-gray-400 text-white text-sm py-1 px-2 rounded cursor-not-allowed"
    >
      Paiement requis
    </button>
  )
) : (
  <button
    disabled
    className="w-full bg-gray-400 text-white text-sm py-1 px-2 rounded cursor-not-allowed"
  >
    Paiement requis
  </button>
)} */}


                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isAdmin && <TemplatesDemoPage />}
    </div>
  );
}
