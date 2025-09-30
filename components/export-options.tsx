"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Settings } from "lucide-react";
import axios from "axios";
import { api, apitoken } from "@/axios.config";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface ExportOptionsProps {
  onExport: (options: ExportOptions) => void;
  isExporting: boolean;
  disabled?: boolean;
  modelesId: number | null;
}

export interface ExportOptions {
  format: "A4" | "Letter";
  orientation: "portrait" | "landscape";
  quality: "standard" | "high";
  includeColors: boolean;
  filename?: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  // ajoutez d'autres champs si nécessaire
}

export default function ExportOptions({
  onExport,
  isExporting,
  disabled,
  modelesId,
}: ExportOptionsProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: "A4",
    orientation: "portrait",
    quality: "high",
    includeColors: true,
  });
  const [open, setOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  const handleExport = () => {
    onExport(options);
    setOpen(false);
  };

  const handleQuickExport = () => {
    onExport(options);

    // Après paiement réussi -> télécharger
    console.log("Paiement validé ✅ Téléchargement en cours...");

    // setIsExporting(false);
    setOpen(false);
  };

  useEffect(() => {
    const fetchUserAndCVs = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        router.replace("/login");
        return;
      }

      try {
        // Vérification du token et récupération de l'utilisateur
        const response = await apitoken.get("/tokens/users", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const fetchedUserId = response.data.id;

        setToken(storedToken);
        setUserId(fetchedUserId);

        console.log("User ID récupéré :", fetchedUserId);
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
  }, [router]);

  // Gestion du paiement et redirection vers l'URL de paiement
  const handlePayment = async () => {
  try {
    setIsPaying(true);

    // console.log("Modele ID:", modelesId);
    // console.log("User ID:", userId);

    // Appel API Flask pour initier le paiement
    const paiementResponse = await apitoken.post("/paiements/payments_init", {
      montant: 100,
      users_id: userId,
      models_cv_id: modelesId,
    });

    if (paiementResponse.status !== 201) {
      throw new Error("Échec de l'initialisation du paiement");
    }

    const paiementData = paiementResponse.data;

    // Vérifie que le backend renvoie bien l’URL
    if (paiementData?.data?.payment_url) {
      window.location.href = paiementData.data.payment_url;
    } else {
      throw new Error("Lien de paiement introuvable");
    }

  } catch (error: any) {
    console.error("Erreur paiement :", error.response?.data || error.message);
    alert("Le paiement a échoué ❌");
  } finally {
    // 👉 Simuler un délai de traitement (exemple)
    setTimeout(() => {
      setIsPaying(false);
      setOpen(false);
      handleQuickExport(); // téléchargement après succès
    }, 2000);
  }
};


  return (
    <div className="flex items-center space-x-2">
      {/* Quick Export Button */}
      {/* <Button
        onClick={handleQuickExport}
        disabled={isExporting || disabled}
        className="flex items-center space-x-2 w-full bg-blue-950 hover:bg-blue-00 text-white"
      >
        <Download className="h-4 w-full" />
        <span>{isExporting ? "Chargement..." : "Télécharger"}</span>
      </Button> */}
      <Button
        onClick={() => setOpen(true)}
        disabled={isExporting || disabled}
        className="flex items-center space-x-2 w-full bg-blue-950 hover:bg-blue-800 text-white"
      >
        <Download className="h-4 w-4" />
        <span>{isExporting ? "Chargement..." : "Télécharger"}</span>
      </Button>

      {/* Popup Paiement */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le paiement</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            Pour télécharger un cv, un paiement de <strong>1000 FCFA</strong>{" "}
            est requis.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPaying}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Annuler
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isPaying}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPaying ? "Paiement en cours..." : "Payer et Télécharger"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
