"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, X, Camera, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiImg } from "@/axios.config"

interface PhotoUploadProps {
  photo:  string;
  onPhotoChange: (filename: string) => void;
}

export default function PhotoUpload({ photo, onPhotoChange }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const [photos, setPhotos] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string | null>(null) 

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    setPhotos(file);

    // Aperçu immédiat
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl); // pour affichage immédiat dans le template (state `preview` à définir)

    console.log("📸 Nom de l'image sélectionnée :", file.name);

    // Upload vers API Flask
    const formData = new FormData();
    formData.append("photos", file);

    try {
      const res = await apiImg.post("/cv/photo_user_cv", formData);

      if (res.data?.filename) {
        // Stocke seulement le nom du fichier dans le cvData
        onPhotoChange(res.data.filename); // tu mets à jour cvData.informations_personnelles.photos
      }
    } catch (error) {
      console.error("Erreur d'upload :", error);
    }
  }
};

  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault()
  //   setIsDragging(false)

  //   const files = Array.from(e.dataTransfer.files)
  //   if (files.length > 0) {
  //     handleFileSelect(files[0])
  //   }
  // }

//   const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const files = e.target.files;
//   if (files && files.length > 0) {
//     const file = files[0];

//     // Aperçu immédiat
//     const previewUrl = URL.createObjectURL(file);
//     setPreview(previewUrl); // pour affichage immédiat dans le template (state `preview` à définir)

//     // Upload vers API Flask
//     const formData = new FormData();
//     formData.append("photo", file);

//     try {
//       const res = await api.post(
//         "http://localhost:5000/api/upload_photo",
//         formData);

//       if (res.data?.filename) {
//         // Stocke seulement le nom du fichier dans le cvData
//         onPhotoChange(res.data.filename); // tu mets à jour cvData.informations_personnelles.photos
//       }
//     } catch (error) {
//       console.error("Erreur d'upload :", error);
//     }
//   }
// };


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
    <div className="space-y-4">
      <Label>Photo de profil</Label>

      {photo ? (
        // Affichage de la photo sélectionnée
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Photo de profil"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Photo de profil ajoutée
                </p>
                <div className="flex gap-2">
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
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          // onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleButtonClick}
        >
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  Ajouter une photo
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Glissez-déposez une image ou cliquez pour sélectionner
                </p>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choisir une image
                </Button>
              </div>
              <p className="text-xs text-gray-500">JPG, PNG jusqu'à 5MB</p>
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
    </div>
  );
}
