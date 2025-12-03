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
  title: {
    default: "AniReserve - Réservation professionnels en Israël",
    template: "%s | AniReserve",
  },
  description: "Trouvez et réservez des professionnels en Israël. Coiffeurs, esthéticiennes, médecins. Plateforme simple pour les Français.",
  keywords: ["réservation", "professionnels", "Israël", "français", "coiffeur", "esthétique", "médecin", "rendez-vous", "booking"],
  authors: [{ name: "AniReserve" }],
  creator: "AniReserve",
  publisher: "AniReserve",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: "AniReserve - La plateforme de réservation en Israël pour les Français",
    description: "Trouvez et réservez facilement des professionnels en Israël. Plateforme de réservation simple et sécurisée.",
    siteName: "AniReserve",
  },
  twitter: {
    card: "summary_large_image",
    title: "AniReserve - La plateforme de réservation en Israël",
    description: "Trouvez et réservez facilement des professionnels en Israël.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    // Pas d'icônes pour éviter les erreurs 404
    // Le logo est géré par le composant Logo en texte uniquement
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
          minHeight: "100vh",
          minHeight: "100dvh",
          height: "100vh",
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
