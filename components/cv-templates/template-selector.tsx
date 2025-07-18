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
        console.log("Model", model_actives);
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
    <div className="space-y-6">
      <div>
        <p className="text-lg font-normal mb-2">
          {" "}
          Sélectionnez le design qui correspond le mieux à votre profil
        </p>
      </div>

      {isClient && (
        <div className="relative w-full">
          {/* Boutons de navigation */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Liste scrollable horizontalement */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-8 py-4 scrollbar-hide"
          >
            {templates.map((template) => {
              const templateKey = template.images.split(".")[0];
              const TemplateComponent = templateComponents[templateKey];

              return (
                <div
                  key={template.id}
                  className={`min-w-[250px] max-w-[250px] cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedTemplate === template.id
                      ? "ring-2 ring-blue-500 shadow-lg p-2"
                      : ""
                  }`}
                  onClick={() => {
                    onTemplateSelect(String(template.id), Number(template.id));
                    setPreviewTemplate(templateKey);
                    setSelectedTemplate(String(template.id));
                  }}
                >
                  <div className="border rounded-md p-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold py-2">{template.libelle}</p>

                      {selectedTemplate === template.id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="relative w-full">
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/models/modele_cv/${template.images}`}
                        alt={`Modèle ${template.libelle}`}
                        className="w-full object-cover rounded-md"
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
