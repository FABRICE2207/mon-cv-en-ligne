"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, X, Camera, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiImg } from "@/axios.config"
import Swal from "sweetalert2"

interface PhotoUploadProps {
  photo:  string | File;
  onPhotoChange: (filename: string) => void;
}

export default function PhotoUpload({ photo, onPhotoChange }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const [photos, setPhotos] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string | null>(null) 

// const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const files = e.target.files;
//   if (files && files.length > 0) {
//     const file = files[0];
//     setPhotos(file);

//     // Aperçu immédiat
//     const previewUrl = URL.createObjectURL(file);
//     setPreview(previewUrl); // pour affichage immédiat dans le template (state `preview` à définir)

//     console.log("📸 Nom de l'image sélectionnée :", file.name);

//     // Upload vers API Flask
//     const formData = new FormData();
//     formData.append("photos", file);

//     try {
//       const res = await apiImg.post("/cv/photo_user_cv", formData);

//       if (res.data?.filename) {
//         // Stocke seulement le nom du fichier dans le cvData
//         onPhotoChange(res.data.filename); // tu mets à jour cvData.informations_personnelles.photos
//       }
//     } catch (error) {
//       console.error("Erreur d'upload :", error);
//     }
//   }
// };

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0];

    const imageURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = imageURL;

    img.onload = async () => {
      // ✅ Vérifie la taille minimale exigée
      if (img.width < 1280 || img.height < 1280) {
        Swal.fire({
          icon: "warning",
          title: "Image trop petite ou grande",
          text: "L'image doit avoir une taille minimale de 1280x1280 pixels.",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      // ✅ Si tout est bon, continue
      setPhotos(file);
      setPreview(imageURL);
      console.log("📸 Image sélectionnée :", file.name, `(${img.width}x${img.height})`);

      const resizedFile = await resizeImage(file, 1280, 1280);
      const formData = new FormData();
      formData.append("photos", resizedFile);

      try {
        const res = await apiImg.post("/cv/photo_user_cv", formData);
        if (res.data?.filename) {
          onPhotoChange(res.data.filename);
        }
      } catch (error) {
        console.error("Erreur d'upload :", error);
      }
    };

    img.onerror = () => {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors du chargement de l'image. Veuillez réessayer.",
        confirmButtonColor: "#3085d6",
      });
    };
  }
};

// Fonction de redimensionnement via canvas
const resizeImage = (file: File, width: number, height: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Contexte canvas non disponible");

      // Redimensionne l'image pour remplir exactement 1280x1280 (peut être déformée)
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, { type: file.type });
          resolve(resizedFile);
        } else {
          reject("Impossible de convertir en blob");
        }
      }, file.type);
    };

    img.onerror = (err) => reject("Erreur de chargement de l'image");
  });
};


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  // const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files
  //   if (files && files.length > 0) {
  //     handleFileSelect(files[0])
  //   }
  // }

  const handleRemovePhoto = async () => {
  if (photo) { 
    // Supprime le fichier de l'API
    await apiImg.delete(`/cv/delete_photo/${photo}`);
  }
  onPhotoChange("");
  if (fileInputRef.current) fileInputRef.current.value = "";
};


  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <Label>Photo de profil</Label>

      {photo ? (
        // Affichage de la photo sélectionnée
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 mt-2 justify-center items-center">
              <div className="relative mt-3">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Photo de profil"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-center text-gray-600 mb-2">
                  Photo de profil ajoutée
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleButtonClick}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Changer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Zone de drop pour ajouter une photo
        <Card
          className={`border  transition-colors cursor-pointer w-full ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          // onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleButtonClick}
        >
          <CardContent className="p-9 text-center">
            <div className="space-y-6">
              {/* <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div> */}
              <div>
                {/* <p className="text-lg font-medium text-gray-900 mb-1">
                  Ajouter une photo
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Glissez-déposez une image ou cliquez pour sélectionner
                </p> */}
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choisir une image
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                La photo doit être de format JPEG, JPG, PNG de taille 1280x1280
                pixels.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="mb-2 hidden"
      />

      {/* {photo && (
        <img
          src={`/cv/modele_cv/${photo}`}
          alt="Photo de profil"
          className="w-24 h-24 rounded-full object-cover"
        />
      )} */}

      {/* {photo && (
        <img
          src={`/cv/modele_cv/${photo}`}
          alt="Photo de profil"
          className="w-24 h-24 rounded-full object-cover"
        />
      )} */}
    </div>
  );
}
