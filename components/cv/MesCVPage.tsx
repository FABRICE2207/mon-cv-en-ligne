"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import { api, apitoken } from "../../axios.config";

interface CV {
  id: number;
  created_at: string;
  cvData?: {
    titre?: string;
    images: string;
    informations_personnelles?: {
      username?: string;
      email?: string;
    };
  };
}

export default function CvListDisplay() {
  const [cvList, setCvList] = useState<CV[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const effectExecuted = useRef(false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true); // 👈 État de chargement

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        router.replace("/login");
        return;
      }

      try {
        const response = await apitoken.get("/tokens/users", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const userId = response.data.id;
        setToken(storedToken);

        const cvResponse = await api.get(`/cv/liste_cv/user/${userId}`);
        setCvList(cvResponse.data);
        console.log("Date de création", cvResponse.data.created_at);
      } catch (error) {
        console.error("Erreur:", error);
        localStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setIsLoading(false); // 👈 Fin du chargement
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return <div className="text-center p-4">Chargement...</div>; // ou un spinner
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">
            Liste de vos cv crées
          </h2>
           <Card className="mt-2">
      <CardContent>
        {!cvList || cvList.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Aucun CV pour le moment
            </h4>
            <p className="text-gray-600 mb-4">
              Créez votre premier CV pour commencer à construire votre profil
              professionnel
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
            {cvList.map((cv) => (
              <Card
                key={cv.id}
                className="shadow-sm hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/models/image_cv/${cv.id}`}
                    alt={`CV ${cv.cvData?.titre}`}
                    className="w-full object-cover rounded-md mb-4"
                    onError={(e) =>
                      (e.currentTarget.src = "/default-template.png")
                    }
                  />
                  <h3 className="text-xl font-semibold uppercase">
                    {cv.cvData?.titre || "Sans titre"}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Crée le
                    {new Date(cv.created_at).toLocaleString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>

                  <Link href={`/cv/${cv.id}`}>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 shadow-lg hover:shadow-blue-500/40 transition-all">Voir CV</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
    </div>
   
  );
}
