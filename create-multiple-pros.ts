import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const professionals = [
  {
    name: "Sophie Cohen",
    email: "sophie.cohen@example.com",
    password: "password123",
    city: "Tel Aviv",
    cities: "Tel Aviv,Ramat Gan,Herzliya",
    serviceType: "Coiffeur",
    subcategories: "Femme,Coloration,Mariée",
    description: "Coiffeuse experte en coupes modernes et colorations tendance. Spécialisée dans les mariages et événements.",
    languages: "fr",
    phone: "+972-50-123-4567",
    verified: true,
  },
  {
    name: "David Levy",
    email: "david.levy@example.com",
    password: "password123",
    city: "Jérusalem",
    cities: "Jérusalem,Bet Shemesh,Modiin",
    serviceType: "Coiffeur",
    subcategories: "Homme,Barbe",
    description: "Barbier traditionnel avec 15 ans d'expérience. Coupes classiques et modernes pour hommes.",
    languages: "fr",
    phone: "+972-50-234-5678",
    verified: true,
  },
  {
    name: "Sarah Ben-David",
    email: "sarah.bendavid@example.com",
    password: "password123",
    city: "Haïfa",
    cities: "Haïfa,Nazareth,Acre",
    serviceType: "Massage",
    subcategories: "Relaxant,Thérapeutique",
    description: "Masseuse thérapeutique certifiée. Spécialisée en massage suédois et deep tissue.",
    languages: "fr",
    phone: "+972-50-345-6789",
    verified: false,
  },
  {
    name: "Michael Ashkenazi",
    email: "michael.ashkenazi@example.com",
    password: "password123",
    city: "Netanya",
    cities: "Netanya,Herzliya,Ra'anana",
    serviceType: "Massage",
    subcategories: "Sportif,Relaxant",
    description: "Masseur sportif professionnel. Aide à la récupération et prévention des blessures.",
    languages: "fr",
    phone: "+972-50-456-7890",
    verified: true,
  },
  {
    name: "Rachel Mizrahi",
    email: "rachel.mizrahi@example.com",
    password: "password123",
    city: "Beer Sheva",
    cities: "Beer Sheva,Dimona,Yeruham",
    serviceType: "Esthéticienne",
    subcategories: "Soin visage,Épilation,Manucure",
    description: "Esthéticienne diplômée. Soins du visage, épilation et manucure. Produits naturels et bio.",
    languages: "fr",
    phone: "+972-50-567-8901",
    verified: true,
  },
  {
    name: "Jonathan Stern",
    email: "jonathan.stern@example.com",
    password: "password123",
    city: "Eilat",
    cities: "Eilat",
    serviceType: "Photographe",
    subcategories: "Mariage,Portrait,Événement",
    description: "Photographe professionnel spécialisé en mariages et événements. Style moderne et créatif.",
    languages: "fr",
    phone: "+972-50-678-9012",
    verified: true,
  },
  {
    name: "Esther Avraham",
    email: "esther.avraham@example.com",
    password: "password123",
    city: "Ashdod",
    cities: "Ashdod,Ashkelon",
    serviceType: "Maquilleur",
    subcategories: "Mariage,Événement,Editorial",
    description: "Maquilleuse professionnelle pour mariages et événements. Maquillage naturel et glamour.",
    languages: "fr",
    phone: "+972-50-789-0123",
    verified: false,
  },
  {
    name: "Avi Rosen",
    email: "avi.rosen@example.com",
    password: "password123",
    city: "Rishon LeZion",
    cities: "Rishon LeZion,Rehovot,Nes Ziona",
    serviceType: "Dentiste",
    subcategories: "Soin dentaire,Blanchiment,Orthodontie",
    description: "Dentiste avec cabinet moderne. Soins dentaires, blanchiment et orthodontie pour toute la famille.",
    languages: "fr",
    phone: "+972-50-890-1234",
    verified: true,
  },
  {
    name: "Miriam Goldstein",
    email: "miriam.goldstein@example.com",
    password: "password123",
    city: "Petah Tikva",
    cities: "Petah Tikva,Rosh HaAyin",
    serviceType: "Nutritionniste",
    subcategories: "Consultation,Suivi,Plan alimentaire",
    description: "Nutritionniste diplômée. Accompagnement personnalisé pour une alimentation saine et équilibrée.",
    languages: "fr",
    phone: "+972-50-901-2345",
    verified: true,
  },
  {
    name: "Yossi Katz",
    email: "yossi.katz@example.com",
    password: "password123",
    city: "Holon",
    cities: "Holon,Bat Yam",
    serviceType: "Coach sportif",
    subcategories: "Musculation,Cardio,Perte de poids",
    description: "Coach sportif certifié. Programmes d'entraînement personnalisés pour atteindre vos objectifs.",
    languages: "fr",
    phone: "+972-50-012-3456",
    verified: false,
  },
  {
    name: "Lea Shalom",
    email: "lea.shalom@example.com",
    password: "password123",
    city: "Bnei Brak",
    cities: "Bnei Brak,Ramat Gan",
    serviceType: "Coiffeur",
    subcategories: "Femme,Enfant",
    description: "Coiffeuse spécialisée en coupes pour femmes et enfants. Ambiance familiale et chaleureuse.",
    languages: "fr",
    phone: "+972-50-123-7890",
    verified: true,
  },
  {
    name: "Daniel Cohen",
    email: "daniel.cohen@example.com",
    password: "password123",
    city: "Givatayim",
    cities: "Givatayim,Ramat Gan",
    serviceType: "Psychologue",
    subcategories: "Thérapie individuelle,Thérapie de couple",
    description: "Psychologue clinicien. Accompagnement thérapeutique pour adultes et couples.",
    languages: "fr",
    phone: "+972-50-234-8901",
    verified: true,
  },
];

async function main() {
  console.log("🚀 Création de professionnels...\n");

  for (const proData of professionals) {
    try {
      // Vérifier si le professionnel existe déjà
      const existing = await prisma.professional.findUnique({
        where: { email: proData.email },
      });

      if (existing) {
        console.log(`⏭️  ${proData.name} existe déjà, ignoré.`);
        continue;
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(proData.password, 10);

      // Créer le professionnel
      const professional = await prisma.professional.create({
        data: {
          ...proData,
          password: hashedPassword,
        },
      });

      console.log(`✅ ${professional.name} créé (ID: ${professional.id})`);
    } catch (error) {
      console.error(`❌ Erreur pour ${proData.name}:`, error);
    }
  }

  console.log("\n✨ Terminé !");
}

main()
  .catch((e) => {
    console.error("Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });








