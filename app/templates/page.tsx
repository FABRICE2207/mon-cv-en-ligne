"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Users,
  Zap,
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
  MessageSquare,
  HelpCircle,
  LayoutTemplate,
  PenTool,
  Download,
  Share2,
  ArrowRight,
  BadgeCheck,
  Menu,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { api } from "@/axios.config";
import { useRef } from "react";


interface Template {
  id: string;
  libelle: string;
  images: string;
}

export default function page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


    const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

    // Affiche la liste des modèles de cv
    useEffect(() => {
      const fetchModelCv = async () => {
        try {
          const response = await api.get("/models/liste_model_cv_actives");
          const model_actives = response.data;
  
          setTemplates(model_actives); //
          console.log("Model", model_actives);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des modèles de CV :",
            error
          );
        }
      };
      fetchModelCv();
    }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Modèles", href: "/templates" },
    { name: "Exemples", href: "/examples" },
    { name: "Conseils", href: "/blog" },
    { name: "Tarifs", href: "/pricing" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md py-2"
            : "bg-white/95 backdrop-blur-sm py-4"
        } border-b`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-950" />
            <span className="text-2xl font-bold text-gray-900">
              <span className="text-blue-950">Mon CV en ligne</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-950 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="hover:bg-blue-950 hover:text-white"
              >
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-950 hover:bg-blue-900">
                Créer mon CV
              </Button>
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-950 py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <Link href="/login" className="hover:bg-blue-950">
                  <Button
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button
                    className="w-full bg-blue-950 hover:bg-blue-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Créer mon CV
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

        <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h1 className="inline-block text-3xl md:text-4xl text-blue-950 px-4 py-2 rounded-full font-bold mb-4">
              Nos modèles de CV
            </h1>
          </motion.div>

          {/* Liste des cv */}
          <div
            className="grid md:grid-cols-2 lg:grid-cols-5 gap-2 justify-center items-center"
          >
        {templates.length > 0 ? (
          templates.map((template) => (
            
            <div
              key={template.id}
              className="min-w-[150px] max-w-[250px] lg:max-w-[350px] flex-shrink-0 p-2 transition"
            >
              <h3 className="text-lg font-semibold text-center text-gray-800">
                {template.libelle}
              </h3>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/models/modele_cv/${template.images}`}
                alt={template.libelle}
                className="w-full object-cover rounded-lg mb-4"
              />
              
            </div>
          ))
        ) : (
          <p className="text-gray-500 ">Aucun modèle disponible.</p>
        )}
      </div>

          {/* <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="/exemple_cv.png"
                alt="Importance d'un bon CV"
                width={500}
                height={200}
                className="rounded-xl shadow-2xl border border-gray-200"
              />
            </motion.div>

            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-4 mt-1 flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-950" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Qu'est-ce qu'un CV ?
                      </h3>
                      <p className="text-gray-600">
                        Le Curriculum Vitae (CV) est un document synthétique
                        présentant votre parcours professionnel, vos compétences
                        et formations. C'est votre première opportunité de faire
                        bonne impression.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-4 mt-1 flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-950" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Pourquoi est-il crucial ?
                      </h3>
                      <p className="text-gray-600">
                        En Côte d'Ivoire, 90% des recruteurs éliminent les
                        candidats sur la base de leur CV avant même l'entretien.
                        Un CV bien conçu multiplie par 5 vos chances d'être
                        contacté.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-4 mt-1 flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-950" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Les attentes locales
                      </h3>
                      <p className="text-gray-600">
                        Les recruteurs ivoiriens privilégient les CV clairs,
                        structurés et mettant en avant les expériences
                        pertinentes pour le poste. La photo professionnelle est
                        souvent appréciée.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  )
}
