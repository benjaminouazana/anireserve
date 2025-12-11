import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import "./sw-register";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://anireserve.com'),
  title: {
    default: "AniReserve - Réservation de Professionnels en Israël | Coiffeurs, Médecins, Esthétique",
    template: "%s | AniReserve - Réservations Pros Israël",
  },
  description: "Trouvez et réservez facilement des professionnels francophones en Israël. Coiffeurs, médecins, dentistes, esthéticiennes, ostéopathes et plus. Disponibilités en temps réel, avis vérifiés, paiement sécurisé.",
  keywords: [
    // Services
    "réservation professionnels israël",
    "coiffeur israël français",
    "médecin francophone israël",
    "dentiste tel aviv",
    "esthéticienne jérusalem",
    "ostéopathe netanya",
    "kinésithérapeute ashdod",
    // Locations
    "rendez-vous tel aviv",
    "booking jérusalem",
    "réservation netanya",
    "professionnels haifa",
    // Features
    "réservation en ligne",
    "prise de rendez-vous",
    "plateforme réservation",
    "communauté française israël",
    "avis clients vérifiés"
  ],
  authors: [{ name: "AniReserve", url: "https://anireserve.com" }],
  creator: "AniReserve",
  publisher: "AniReserve",

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://anireserve.com',
    siteName: 'AniReserve',
    title: 'AniReserve - Réservation de Professionnels en Israël',
    description: 'Trouvez et réservez des professionnels francophones en Israël. Coiffeurs, médecins, dentistes et plus. Simple, rapide, sécurisé.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AniReserve - Plateforme de réservation',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'AniReserve - Réservation Professionnels Israël',
    description: 'Trouvez et réservez des professionnels francophones en Israël',
    images: ['/og-image.jpg'],
    creator: '@anireserve',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: 'google-site-verification-code', // À remplacer
    // yandex: 'yandex-verification',
    // bing: 'bing-verification',
  },

  // Mobile
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2FB190" },
    { media: "(prefers-color-scheme: dark)", color: "#18223b" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AniReserve",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },


  // Alternate languages (pour le futur)
  alternates: {
    canonical: "/",
  },

  // Icons & Manifest
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-montserrat antialiased flex flex-col`}
        style={{
          minHeight: "100dvh",
          height: "100dvh",
          position: "fixed",
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden"
        }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ToastProvider>
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
