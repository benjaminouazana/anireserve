import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "AniReserve - La plateforme de réservation en Israël pour les Français",
    template: "%s | AniReserve",
  },
  description: "Trouvez et réservez facilement des professionnels en Israël. Coiffeurs, esthéticiennes, médecins et bien plus. Plateforme de réservation simple et sécurisée pour la communauté française en Israël.",
  keywords: ["réservation", "professionnels", "Israël", "français", "coiffeur", "esthétique", "médecin", "rendez-vous", "booking"],
  authors: [{ name: "AniReserve" }],
  creator: "AniReserve",
  publisher: "AniReserve",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-montserrat antialiased flex flex-col min-h-screen`}
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
