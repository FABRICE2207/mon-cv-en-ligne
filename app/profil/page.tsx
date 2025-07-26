"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/header/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { api, apitoken } from "../../axios.config";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface UserData {
  username: string;
  email: string;
  // ajoutez d'autres champs si nécessaire
}


export default function Profil() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [formValid, setFormValid] = useState(false);
  const [userData, setUserData] = useState<UserData>({ 
  username: "",
  email: ""
});

  // Exemple avec validation spécifique par champ

  const isFormValid = useMemo(() => {
    return (
      userData.username.trim() !== '' &&
      validateEmail(userData.email)
    );
  }, [userData]);


  // Validation de l'email
  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setUserData(prev => ({
    ...prev,
    [name]: value
  }));
};

  useEffect(() => {
    const fetchUserAndCVs = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        router.replace("/login");
        return;
      }

      try {
        const response = await apitoken.get("/tokens/users", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const userDataResponse = response.data;
        setUserData(userDataResponse); // ⬅️ Important
        setToken(storedToken);

        console.log("User :", userDataResponse);
      } catch (error) {
        console.error(
          "Token invalide ou erreur lors de la récupération :",
          error
        );
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    fetchUserAndCVs();
  }, []);

  // Permet d'accepter un nombre variable d'arguments

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-4">
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profil</h2>

          <Card className="border border-gray-300">
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 gap-y-2 my-6">
                <div>
                  <label htmlFor="">Nom complet</label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                </div>
                <div>
                  <label htmlFor="">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                </div>
                <div>
                  <label htmlFor="">Mot de passe</label>
                  <input
                    type="password"
                    required
                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                </div>
                <div>
                  <label htmlFor="">Confirmation du mot de passe</label>
                  <input
                    type="password"
                    required
                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950"
                  />
                </div>
              </div>

              <div className="w-full  flex justify-end">
                <Button
                  className={cn(
                    "text-lg px-8 py-6 transition-colors duration-200",
                    isFormValid
                      ? "bg-blue-950 hover:bg-blue-900 text-white"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                  )}
                  disabled={!isFormValid}
                >
                  {isFormValid ? "Modifier" : "Modifier"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

