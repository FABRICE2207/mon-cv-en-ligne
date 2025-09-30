"use client";

import type React from "react";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { api } from "../../axios.config";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setIsLoading(false);
      return;
    }

    try {
      // Appel API avec Axios
      const response = await api.post("/users/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Debug: Affiche la réponse complète en log (en développement seulement)
      if (process.env.NODE_ENV === "development") {
        console.log("API Response:", {
          status: response.status,
          data: response.data,
          headers: response.headers,
          config: {
            url: response.config.url,
            method: response.config.method,
          },
        });
      }

      // Notification de succès avec SweetAlert
      await Swal.fire({
        title: "Inscription réussie !",
        text: response.data.message || "Votre compte a été créé avec succès",
        icon: "success",
        // confirmButtonColor: "#2563eb", // Bleu pour correspondre à votre thème
        // confirmButtonText: "Continuer",
        timer: 5000, // Ferme automatiquement après 5s
        showConfirmButton: false,
      });

      // Redirection vers le login
      router.push("/login");
    } catch (err) {
      let errorMessage = "Une erreur est survenue lors de l'inscription";

      // Gestion des erreurs spécifiques de l'API
      if (axios.isAxiosError(err) && (err as any).response) {
        errorMessage = (err as any).response.data.message || errorMessage;
      }

      // Notification d'erreur avec SweetAlert
      await Swal.fire({
        title: "Erreur",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#2563eb",
      });

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Créer un compte</CardTitle>
            <CardDescription>
              Inscrivez-vous pour commencer à créer vos CV professionnels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <input
                  id="username"
                  placeholder="Yao Kan Francine"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="yaokan@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 "
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 "
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmation du mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 "
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Masquer" : "Afficher"} le mot de
                      passe
                    </span>
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-950 hover:bg-blue-900"
                disabled={isLoading}
              >
                {isLoading ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-blue-950 hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
