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
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchTemplates();
    // fetchUsers()
  }, []);

  const fetchTemplates = async () => {
    const res = await api.get("models/liste_model_cv");
    setModeles(res.data);
    console.log(res.data);
  };

  // const fetchUsers = async () => {
  //   const res = await axios.get("http://127.0.0.1:5000/api/users")
  //   setUsers(res.data)
  // }

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

    console.log(formData);

    setLibelle("");
    setImages(null);
    setPreview("");
    setStatut("");

    try {
      const response = await apiImg.post("/models/add_model_cv", formData);
      alert("Modèle enregistré avec succès !");
      console.log("Réponse API :", response.data);
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
    <div className="p-2">
      <Tabs defaultValue="ajout">
        <TabsList className="flex gap-4 justify-center mb-6  bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 shadow-lg hover:shadow-blue-500/40 transition-all">
          <TabsTrigger value="ajout">Ajouter un modèle</TabsTrigger>
          <TabsTrigger value="liste">Liste des modèles de cv</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="user-info">Mon profil</TabsTrigger>
        </TabsList>

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
                  <Input
                    id="libelle"
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="images">Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <select
                    className="w-full border rounded p-2"
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                  >
                    <option>Choisir un statut</option>
                    <option value="Activé">Activé</option>
                    <option value="Désactivé">Désactivé</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
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
                  <h3 className="font-semibold">{tpl.libelle}</h3>

                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/models/modele_cv/${tpl.images}`}
                    alt={`Modèle ${tpl.libelle}`}
                    className="w-full object-cover rounded"
                  />

                  <div className="flex justify-between items-center space-x-2">
                            <div
          className={`text-white text-sm font-medium px-2 rounded-full inline-block
            ${tpl.statut === "Activé" ? "bg-green-500" : "bg-red-500"}`}
        >
          {tpl.statut}
        </div>


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
            <h2 className="text-xl font-bold mb-4">Utilisateurs</h2>
            {users.map((user: any) => (
              <Card
                key={user.id}
                className="p-4 cursor-pointer hover:bg-slate-100"
                onClick={() => setSelectedUser(user)}
              >
                <p className="font-semibold">{user.nom}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- INFOS UTILISATEUR --- */}
        <TabsContent value="user-info">
          {selectedUser ? (
            <Card className="max-w-md mx-auto p-4 space-y-2">
              <h2 className="text-lg font-bold">Informations utilisateur</h2>
              <p>
                <strong>Nom :</strong> {selectedUser.nom}
              </p>
              <p>
                <strong>Email :</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Téléphone :</strong> {selectedUser.telephone}
              </p>
              <p>
                <strong>Adresse :</strong> {selectedUser.adresse}
              </p>
            </Card>
          ) : (
            <p className="text-center text-gray-500">
              Aucun utilisateur sélectionné.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
