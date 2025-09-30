import { useState, useRef, useEffect } from "react";
import { User, LogOut, StoreIcon, ArrowLeft, Replace } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { api, apitoken } from "../../axios.config";
import { Button } from "../ui/button";

export default function Header() {
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const [userData, setUserData] = useState({ username: "" });

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

        console.log("User :", userDataResponse.username);
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

  // Se déconnecter
  const handleLogout = async () => {
    localStorage.removeItem("token");

    await Swal.fire({
      title: "Succès",
      text: "Déconnexion réussie.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    // Redirection sans retour arrière
    window.location.replace("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Si page est dashboard, cache le bouton de retour */}
          {typeof window !== "undefined" &&
            window.location.pathname !== "/dashboard" && (
              <Button
                className="text-white bg-blue-950 hover:bg-blue-900"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
          <h1 className="text-2xl font-bold text-blue-950">Mon cv en ligne</h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">{userData.username}</span>
          </div>

          {open && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border z-50">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => router.push("/profil")}
                >
                  Profil
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  onClick={handleLogout}
                >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
