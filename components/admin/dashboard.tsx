import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, apiImg } from "@/axios.config";
import Swal from "sweetalert2";
import { number } from "framer-motion";
import ReactPaginate from "react-paginate";
import { Menu } from "lucide-react"; // Icône burger
import DashboardStats from "../statistic";


type Modele = {
  id: number;
  libelle: string;
  images: string;
  statut: "Activé" | "Désactivé";
};

export default function DashbaordAdmin() {
  const [libelle, setLibelle] = useState("");
  const [images, setImages] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [statut, setStatut] = useState("");
  const [modeles, setModeles] = useState<any[]>([]);
  const [modelesStatut, setModelesStatut] = useState(null);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [paiementsData, setPaiementsData] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUserP, setSelectedUserP] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageP, setCurrentPageP] = useState(0);
  
  // Pagination utilisateurs
  const itemsPerPage = 5;
  const pageCount = Math.ceil(usersData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentUsers = usersData.slice(offset, offset + itemsPerPage);

  // Pagination paiements
  const itemsPerPageP = 5;
  const offsetP = currentPageP * itemsPerPageP;
  const currentPaiement = paiementsData.slice(offsetP, offsetP + itemsPerPageP);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handlePageClickP = ({ selected }: { selected: number }) => {
    setCurrentPageP(selected);
  };

  useEffect(() => {
    fetchTemplates();
    fetchUsers();
    fetchPaiements();
  }, []);

  // Liste des modèles de cv
  const fetchTemplates = async () => {
  try {
    const res = await api.get("models/liste_model_cv");

    // Ajouter un délai de 2 secondes avant d'afficher les données
    setTimeout(() => {
      setModeles(res.data);
      // console.log(res.data);
    }, 2000);
  } catch (error) {
    console.error("Erreur récupération des modèles :", error);
  }
};


  // Liste des utilisateurs
  const fetchUsers = async () => {
    const res = await api.get("users/liste_users");
    setUsersData(res.data);
    // console.log("Liste users", res.data);
  };

  // Liste des utilisateurs
  const fetchPaiements = async () => {
    const res = await api.get("paiements/liste_paiement");
    setPaiementsData(res.data);
    console.log("Liste des paiements", res.data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImages(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!libelle || !statut || !images) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const formData = new FormData();
    formData.append("libelle", libelle);
    formData.append("images", images);
    formData.append("statut", statut);

    // console.log(formData);

    setLibelle("");
    setImages(null);
    setPreview("");
    setStatut("");

    try {
      const response = await apiImg.post("/models/add_model_cv", formData);
      alert("Modèle enregistré avec succès !");
      // console.log("Réponse API :", response.data);
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
      console.error("Erreur API :", error);
    }
  };

  // Mettre à jour le statut du modèle
  const updateStatutModele = async (id: number) => {
    try {
      const response = await api.put(`models/update_statut_modeles/${id}`);

      const nouveauStatut = response.data.statut;

      console.log("Statut", nouveauStatut);

      // Mise à jour immédiate du tableau modeles
      setModeles((prevModeles) =>
        prevModeles.map((modele) =>
          modele.id === id ? { ...modele, statut: nouveauStatut } : modele
        )
      );
    } catch (error) {
      let message = "Erreur inconnue";

      if (error instanceof Error) {
        message = error.message;
      }

      // Si tu veux accéder à error.response (Axios), fais un cast :
      const err = error as any;
      message = err.response?.data?.message || err.message || "Erreur inconnue";

      Swal.fire("Erreur", message, "error");
    }
  };

  // const toggleStatut = async (id: number, currentStatut: string) => {
  //   const newStatut = currentStatut === "activé" ? "désactivé" : "activé"
  //   await axios.put(`http://127.0.0.1:5000/api/models/update_statut/${id}`, {
  //     statut: newStatut,
  //   })
  //   fetchTemplates()
  // }

  return (
    <div className="mx-2">
      <Tabs defaultValue="stat">
        <TabsList className="flex gap-4 justify-center mb-6  bg-blue-950  text-white px-8 py-6">
          <TabsTrigger value="stat">Statistiques</TabsTrigger>
          <TabsTrigger value="ajout">Ajouter un modèle</TabsTrigger>
          <TabsTrigger value="liste">Liste des modèles de cv</TabsTrigger>
          <TabsTrigger value="users">Liste des utilisateurs</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
        </TabsList>

        {/* --- STATISTIQUES --- */}
        <TabsContent value="stat">
          <DashboardStats />
        </TabsContent>

        {/* --- AJOUT --- */}
        <TabsContent value="ajout">
          <Card className="max-w-xl mx-auto">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-bold text-center">
                Ajouter un modèle
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-32 mx-auto rounded border"
                  />
                )}

                <div>
                  <Label htmlFor="libelle">Nom du modèle</Label>
                  <input
                    id="libelle"
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    required
                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 "
                  />
                </div>

                <div>
                  <Label htmlFor="images">Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 "
                  />
                </div>

                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <select
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                    required
                    className="w-full p-2 rounded border  focus:bg-white border-gray-300 focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 "
                  >
                    <option>Choisir un statut</option>
                    <option value="Activé">Activé</option>
                    <option value="Désactivé">Désactivé</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-950 hover:bg-blue-900"
                >
                  Enregistrer
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- LISTE DES MODÈLES --- */}
        <TabsContent value="liste">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-2">
            {modeles.map((tpl: any) => (
              <Card key={tpl.id}>
                <CardContent className="p-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{tpl.libelle}</h3>
                  <div
                    className={`text-white text-sm font-medium px-2 rounded-full inline-block
                      ${tpl.statut === "Activé" ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {tpl.statut}
                  </div>
                  </div>

                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/models/modele_cv/${tpl.images}`}
                    alt={`Modèle ${tpl.libelle}`}
                    className="w-full object-cover rounded"
                  />

                  <div className="flex justify-between items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`text-white ${
                        tpl.statut === "Activé"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                      onClick={() => updateStatutModele(tpl.id)}
                    >
                      {tpl.statut === "Activé" ? "Désactivé" : "Activé"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- LISTE UTILISATEURS --- */}
        <TabsContent value="users">
          <div className="space-y-4">
            <Card className="overflow-x-auto shadow-sm">
              <h2 className="text-xl font-bold ml-4">Liste des utilisateurs</h2>
              <span className="font-bold ml-4">
                Total: {usersData.length} utilisateurs
              </span>

              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Nom et prénom
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Créé le
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Modifié le
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user: any) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-100 cursor-pointer transition"
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-4 py-3 font-medium">{user.username}</td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(user.created_at).toLocaleString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(user.updated_at).toLocaleString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-blue-600 underline">
                        Voir
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <ReactPaginate
                previousLabel={"← Précédent"}
                nextLabel={"Suivant →"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName="flex items-center space-x-2"
                pageClassName="px-3 py-1 border rounded-md hover:bg-gray-100"
                activeClassName="bg-blue-950 text-white"
                previousClassName="px-3 py-1 border rounded-md hover:bg-gray-100"
                nextClassName="px-3 py-1 border rounded-md hover:bg-gray-100"
                disabledClassName="opacity-50 pointer-events-none"
              />
            </div>
          </div>
        </TabsContent>

        {/* --- Paiements --- */}
        <TabsContent value="paiements">
          <div className="space-y-4">
            <Card className="overflow-x-auto shadow-sm">
              <h2 className="text-xl font-bold ml-4">Liste des paiements</h2>
              <span className="font-bold ml-4">
                Total: {paiementsData.length} paiements
              </span>

              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Nom et prénom
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Modèle du cv
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Montant (FCFA)
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      ID de transaction
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Créé le
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Modifié le
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPaiement.map((paiment: any) => (
                    <tr
                      key={paiment.id}
                      className="hover:bg-slate-100 cursor-pointer transition"
                      onClick={() => setSelectedUserP(paiment)}
                    >
                      <td className="px-4 py-3 font-medium">
                        {paiment.users.username}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {paiment.models_cv.libelle}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {paiment.amount}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {paiment.transaction_id}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium
                            ${
                              paiment.status === "PENDING"
                                ? "bg-yellow-500 text-white"
                                : paiment.status === "SUCCESS"
                                ? "bg-green-500 text-white"
                                : paiment.status === "FAILED"
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {paiment.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {new Date(paiment.created_at).toLocaleString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(paiment.updated_at).toLocaleString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-blue-600 underline">
                        Voir
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <ReactPaginate
                previousLabel={"← Précédent"}
                nextLabel={"Suivant →"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClickP}
                containerClassName="flex items-center space-x-2"
                pageClassName="px-3 py-1 border rounded-md hover:bg-gray-100"
                activeClassName="bg-blue-950 text-white"
                previousClassName="px-3 py-1 border rounded-md hover:bg-gray-100"
                nextClassName="px-3 py-1 border rounded-md hover:bg-gray-100"
                disabledClassName="opacity-50 pointer-events-none"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
