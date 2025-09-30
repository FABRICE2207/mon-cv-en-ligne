"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import TemplatesDemoPage from "./template-selector-admin";
import { api } from "@/axios.config";
import { templateComponents } from "@/components/cv-templates";

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
};

//

export default function TemplateSelector({
  selectedTemplate,
  modelesId,
  onTemplateSelect,
  cvData,
  setSelectedTemplate,
}: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const { isAdmin, isClient, roles } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

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
                    selectedTemplate === String(template.id)
                      ? ""
                      : ""
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
