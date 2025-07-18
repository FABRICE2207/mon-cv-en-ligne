import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"
import { Badge } from "@/components/ui/badge"

interface Template {
  id: number
  libelle: string
  images: string
  statut: string
}

export default function TemplateAddPage() {
  const [libelle, setLibelle] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [statut, setStatut] = useState("activé")
  const [templates, setTemplates] = useState<Template[]>([])

  // Charger les modèles existants
  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/models/all_modele_cv")
      setTemplates(response.data)
    } catch (error) {
      console.error("Erreur de récupération des modèles :", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!libelle || !imageFile) {
      alert("Veuillez remplir tous les champs.")
      return
    }

    const formData = new FormData()
    formData.append("libelle", libelle)
    formData.append("images", imageFile)
    formData.append("statut", statut)

    try {
      await axios.post("http://127.0.0.1:5000/api/models/add_model_cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert("Modèle ajouté avec succès !")
      setLibelle("")
      setImageFile(null)
      setPreview("")
      fetchTemplates() // refresh list
    } catch (error) {
      alert("Erreur lors de l'enregistrement.")
      console.error("Erreur API :", error)
    }
  }

  const toggleStatut = async (id: number, currentStatut: string) => {
    const newStatut = currentStatut === "activé" ? "désactivé" : "activé"
    try {
      await axios.put(`http://127.0.0.1:5000/api/models/update_statut/${id}`, {
        statut: newStatut,
      })
      fetchTemplates()
    } catch (error) {
      console.error("Erreur mise à jour du statut :", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-xl mx-auto mb-10">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Ajouter un modèle de CV</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {preview && (
              <div className="flex justify-center">
                <img src={preview} alt="Preview" className="max-h-40 rounded-md border" />
              </div>
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
              <Label htmlFor="image">Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <div>
              <Label htmlFor="statut">Statut</Label>
              <select
                id="statut"
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className="w-full mt-1 border rounded-md p-2"
              >
                <option value="activé">Activé</option>
                <option value="désactivé">Désactivé</option>
              </select>
            </div>

            <Button className="w-full" type="submit">
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Liste des modèles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold">{template.libelle}</h2>
              <img
                src={`http://127.0.0.1:5000/static/uploads/${template.images}`}
                alt={template.libelle}
                className="h-40 object-cover rounded border"
              />
              <div className="flex justify-between items-center">
                <Badge
                  className={
                    template.statut === "activé"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }
                >
                  {template.statut}
                </Badge>
                <Button
                  size="sm"
                  onClick={() => toggleStatut(template.id, template.statut)}
                >
                  {template.statut === "activé" ? "Désactiver" : "Activer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
