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
import {api} from "../../axios.config";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulation de l'authentification

    try {
  // Authentification via API
  const response = await api.post(`/login/users`, {
    email: formData.email,
    password: formData.password,
  });

  // Récupération du token depuis la réponse
  const token = response.data;

  // Stockage dans localStorage
  localStorage.setItem("token", token.access_token);

  // console.log("Token reçu:", token.access_token); // Debug

  await Swal.fire({
    title: "Connexion réussie",
    text: "Redirection en cours...",
    icon: "success",
    timer: 1000, // Ferme automatiquement après 1s
    showConfirmButton: false
  });

  // Redirection garantie
  router.push("/dashboard");
  router.refresh(); // Force le rafraîchissement du routeur

} catch (err) {
  if (axios.isAxiosError(err)) {
    const errorMessage = err.response?.data?.message 
      || err.message 
      || "Identifiants incorrects";
    
    // await Swal.fire({
    //   title: "Erreur",
    //   text: errorMessage,
    //   icon: "error"
    // });
    setError(errorMessage);
  }
} finally {
  setIsLoading(false);
}
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
        style={{
          backgroundImage:
            "url('https://www.istockphoto.com/photo/university-student-studying-with-laptop-in-bright-hallway-gm2167617586-587674783?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Ffr%2Fs%2Fphotos%2FHomme-noir-qui-%25C3%25A9crit&utm_medium=affiliate&utm_source=unsplash&utm_term=Homme+noir+qui+%C3%A9crit%3A%3A%3A')",
        }}
      ></div>

      {/* Contenu au-dessus */}
      <div className="relative z-10 w-full max-w-md">
        <Card>
          <CardHeader>
            {/* <Link href="/">Retour sur le site</Link> */}
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour accéder à vos CV
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
                <Label htmlFor="email">Email</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
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

              <Button
                type="submit"
                className="w-full bg-blue-950 hover:bg-blue-900"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link
                  href="/register"
                  className="text-blue-900 hover:underline"
                >
                  S'inscrire
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

}
