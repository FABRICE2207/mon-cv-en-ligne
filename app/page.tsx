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

export default function HomePage() {
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
    { name: "Modèles", href: "/templates" },
    { name: "Exemples", href: "/examples" },
    { name: "Conseils", href: "/blog" },
    { name: "Tarifs", href: "/pricing" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header amélioré avec menu */}
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

      {/* Hero Section améliorée */}
      {/* Hero Section Centrée */}
      <section className="relative py-24 md:py-32 bg-blue-950  ">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                CV professionnel <br /> en 5 minutes
              </h1>

              <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
                Des modèles optimisés pour le marché ivoirien. Augmentez vos
                chances d'être recruté par les meilleures entreprises d'Abidjan.
              </p>

              <div className="flex flex-col sm:flex-row mr-5 gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="border bg-transparent hover:bg-white hover:text-blue-950 border-white text-lg px-8 py-6"
                  >
                    Créer mon CV gratuitement{" "}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 border-gray-300 text-blue-950"
                  >
                    Voir les modèles
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 4 }}
              className="max-w-3xl mx-auto text-center"
            >
              <img
                src="/mes-appareils.png"
                alt="Ordinateur"
                width={700}
                height={475}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nouvelle section : L'importance du CV */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h1 className="inline-block text-3xl md:text-4xl text-blue-950 px-4 py-2 rounded-full font-bold mb-4">
              Savoir-faire
            </h1>
            <p className="font-medium text-gray-600 mb-6">
              Le CV : Votre passeport professionnel
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="/cv-importance.jpg"
                alt="Importance d'un bon CV"
                className="rounded-xl shadow-2xl border border-gray-200 w-full"
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
          </div>
        </div>
      </section>

      {/* Fonctionnalités en grille améliorée */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-blue-100 text-blue-950 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Fonctionnalités
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout pour votre recherche d'emploi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils conçus pour le marché du travail ivoirien
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <LayoutTemplate className="h-10 w-10 text-blue-950" />,
                title: "Modèles professionnels",
                description:
                  "Choisissez parmi des dizaines de modèles adaptés aux attentes des recruteurs ivoiriens",
                color: "bg-blue-50",
              },
              {
                icon: <PenTool className="h-10 w-10 text-green-600" />,
                title: "Éditeur intuitif",
                description:
                  "Personnalisez chaque détail de votre CV en quelques clics",
                color: "bg-green-50",
              },
              {
                icon: <Check className="h-10 w-10 text-purple-600" />,
                title: "Conseils experts",
                description:
                  "Des suggestions pour améliorer votre CV selon votre secteur",
                color: "bg-purple-50",
              },
              {
                icon: <Download className="h-10 w-10 text-orange-600" />,
                title: "Téléchargement PDF",
                description:
                  "Export haute qualité pour impression ou envoi par email",
                color: "bg-orange-50",
              },
              {
                icon: <Share2 className="h-10 w-10 text-red-600" />,
                title: "Lien partageable",
                description: "Partagez votre CV en ligne avec un lien unique",
                color: "bg-red-50",
              },
              {
                icon: <FileText className="h-10 w-10 text-indigo-600" />,
                title: "Exemples de contenu",
                description:
                  "Inspirez-vous de modèles rédigés pour chaque métier",
                color: "bg-indigo-50",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all group">
                  <CardHeader>
                    <div
                      className={`${feature.color} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section modèle de CV avec animation */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Modèles adaptés au marché ivoirien
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des designs modernes qui correspondent aux attentes des recruteurs
              locaux
            </p>
          </motion.div>

          <div className="relative w-95">
      {/* Boutons gauche/droite */}
      <div className="flex justify-end gap-2 mb-4">
 <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-950 hover:bg-blue-900 rounded-full shadow p-2"
          >
            <ChevronLeft className="w-5 h-5" color="white" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-950 hover:bg-blue-900 rounded-full shadow p-2"
          >
            <ChevronRight className="w-5 h-5" color="white" />
          </button>
      </div>

      {/* Contenu scrollable horizontalement */}
      <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide"
          >
        {templates.length > 0 ? (
          templates.map((template) => (
            <div
              key={template.id}
              className="min-w-[150px] max-w-[250px] lg:max-w-[350px] flex-shrink-0 p-2 transition"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/models/modele_cv/${template.images}`}
                alt={template.libelle}
                className="w-full object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-center text-gray-800">
                {template.libelle}
              </h3>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun modèle disponible.</p>
        )}
      </div>
    </div>

          <div className="text-center">
            <Link href="/templates">
              <Button variant="outline" size="lg" className="text-lg group">
                Voir tous les modèles
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Témoignages avec animation améliorée */}
      <section className="py-20 bg-blue-950 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              Témoignages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ils ont trouvé un emploi avec CVPro CI
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Découvrez les réussites de nos utilisateurs en Côte d'Ivoire
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Koffi A.",
                position: "Responsable Logistique",
                company: "SDV CI",
                testimonial:
                  "Mon CV a retenu l'attention de plusieurs entreprises. J'ai signé un CDI 2 semaines après l'avoir mis en ligne.",
                rating: 5,
                delay: 0.1,
              },
              {
                name: "Aminata C.",
                position: "Chef de Projet Digital",
                company: "MTN Côte d'Ivoire",
                testimonial:
                  "Les recruteurs ont particulièrement apprécié la clarté et le design professionnel de mon CV.",
                rating: 5,
                delay: 0.2,
              },
              {
                name: "Jean-Paul Y.",
                position: "Ingénieur Systèmes",
                company: "Orange CI",
                testimonial:
                  "L'optimisation pour les systèmes ATS m'a permis d'être contacté par plusieurs cabinets de recrutement.",
                rating: 4,
                delay: 0.3,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: testimonial.delay }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white transition-colors">
                  <CardHeader>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-300 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-lg mb-6 italic">
                      "{testimonial.testimonial}"
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-blue-950">
                      {testimonial.position} • {testimonial.company}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section création rapide avec étapes animées */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="inline-block bg-blue-100 text-blue-950 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  Processus simple
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Créez votre CV en 5 minutes
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Notre outil intuitif vous guide pas à pas pour créer un CV qui
                  vous représente parfaitement.
                </p>

                <div className="space-y-6">
                  {[
                    "Sélectionnez un modèle adapté à votre secteur",
                    "Remplissez vos informations personnelles",
                    "Ajoutez vos expériences et formations",
                    "Personnalisez les couleurs et polices",
                    "Téléchargez ou partagez en un clic",
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <div className="bg-blue-100 p-1 rounded-full mr-4 mt-1 flex-shrink-0">
                        <Check className="h-5 w-5 text-blue-950" />
                      </div>
                      <span className="text-lg text-gray-700">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
                <img
                  src="/cv-editor-screenshot.jpg"
                  alt="Éditeur de CV"
                  className="relative rounded-xl shadow-xl border border-gray-200"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Nouvelle section : Abonnements Premium */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-blue-100 text-blue-950 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Premium
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Passez à la vitesse supérieure
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nos abonnements vous donnent accès à des fonctionnalités
              exclusives
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "0 FCFA",
                description: "Parfait pour commencer",
                features: [
                  "3 modèles de base",
                  "1 téléchargement/mois",
                  "CV partageable",
                  "Conseils de base",
                ],
                cta: "Commencer gratuitement",
                popular: false,
                color: "border-gray-200",
              },
              {
                name: "Pro",
                price: "5 000 FCFA/mois",
                description: "Le plus populaire",
                features: [
                  "20+ modèles premium",
                  "Téléchargements illimités",
                  "Lettre de motivation",
                  "Analyse experte",
                  "Statistiques de vue",
                ],
                cta: "Essai 7 jours",
                popular: true,
                color: "border-blue-500",
              },
              {
                name: "Entreprise",
                price: "30 000 FCFA/mois",
                description: "Pour les recruteurs",
                features: [
                  "Tous les modèles Pro",
                  "Gestion multi-CV",
                  "Collaboration d'équipe",
                  "Support prioritaire",
                  "Branding personnalisé",
                ],
                cta: "Contactez-nous",
                popular: false,
                color: "border-purple-500",
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className={`h-full border-2 ${plan.color} ${
                    plan.popular
                      ? "shadow-lg ring-1 ring-blue-500"
                      : "shadow-sm"
                  } transition-all flex flex-col`}
                >
                  <CardHeader>
                    {plan.popular && (
                      <span className="bg-blue-950 text-white text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">
                        Le plus choisi
                      </span>
                    )}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold my-4">{plan.price}</div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Button
                      size="lg"
                      className={`w-full ${
                        plan.popular
                          ? "bg-blue-950 hover:bg-blue-900"
                          : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Newsletter */}
          {/* <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Restez informé</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Recevez nos conseils emploi et offres spéciales directement dans votre boîte mail
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Votre email professionnel" 
              className="flex-grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="bg-blue-950 hover:bg-blue-900 whitespace-nowrap">
              S'abonner <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Nous ne partagerons jamais votre email. Désabonnez-vous à tout moment.
          </p>
        </div>
      </motion.div> */}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-blue-100 text-blue-950 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Questions fréquentes
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Vous avez des questions ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous avons les réponses pour vous aider à créer le CV parfait
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Est-ce vraiment gratuit ?",
                answer:
                  "Oui, vous pouvez créer et télécharger votre CV gratuitement. Nous proposons également des options premium avec des fonctionnalités avancées.",
              },
              {
                question: "Mes données sont-elles sécurisées ?",
                answer:
                  "Absolument. Nous utilisons un chiffrement de pointe et ne partageons jamais vos informations avec des tiers.",
              },
              {
                question: "Puis-je modifier mon CV plus tard ?",
                answer:
                  "Oui, vous pouvez revenir à tout moment pour mettre à jour votre CV. Vos modifications sont sauvegardées automatiquement.",
              },
              {
                question: "Y a-t-il des modèles en français ?",
                answer:
                  "Tous nos modèles sont disponibles en français et adaptés aux standards des recruteurs ivoiriens.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg flex items-center">
                      <HelpCircle className="h-5 w-5 text-blue-950 mr-3" />
                      {item.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 pl-8">
                      {item.answer}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final amélioré */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à booster votre carrière ?
            </h2>
            <p className="text-xl mb-8 mx-auto">
              Rejoignez des milliers de professionnels ivoiriens qui utilisent
              CVPro CI pour leur recherche d'emploi
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-950 hover:bg-gray-100 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Commencer maintenant
                </Button>
              </Link>
              <Link href="/templates">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Voir les modèles
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer amélioré */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">CVPro CI</span>
              </div>
              <p className="text-gray-400 mb-6">
                La solution de création de CV la plus utilisée en Côte d'Ivoire
                pour décrocher le job de vos rêves.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "linkedin", "instagram"].map(
                  (social) => (
                    <Link
                      key={social}
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                        {/* Icône sociale ici */}
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Produit</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/templates"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Modèles de CV
                  </Link>
                </li>
                <li>
                  <Link
                    href="/examples"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Exemples de CV
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Fonctionnalités
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Ressources</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Conseils emploi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Centre d'aide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} CVPro CI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
