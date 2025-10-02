import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Mon CV en ligne - Créez et imprimer votre CV facilement",
  description: "Créez votre CV en ligne, personnalisez-le avec des modèles modernes et postulez avec facilité.",
  keywords: [
    "CV en ligne",
    "cv",
    "création CV",
    "modèles CV",
    "curriculum vitae",
    "création de CV",
    "modèles de CV",
    "CV professionnel",
    "CV moderne",
    "CV créatif",
    "CV simple",
    "CV design",
    "générateur de CV",
    "éditeur de CV",
    "téléchargement de CV",
    "impression de CV",
  ],
  authors: [
    { name: "DJILX CI", url: "http://https://djilx.ci/" }
  ],
  creator: "DJILX CI",
  publisher: "DJILX CI",
  metadataBase: new URL("http://https://djilx.ci/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mon CV en ligne - Créez et imprimer votre CV facilement",
    description: "Créez votre CV en ligne, personnalisez-le avec des modèles modernes et postulez avec facilité.",
    url: "https://votresite.com",
    siteName: "Mon CV en ligne",
    images: [
      {
        url: "https://votresite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mon CV en ligne"
      }
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon CV en ligne - Créez et partagez votre CV facilement",
    description: "Créez votre CV en ligne, personnalisez-le avec des modèles modernes et postulez avec facilité.",
    site: "@VotreTwitter",
    creator: "@VotreTwitter",
    images: ["https://votresite.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
