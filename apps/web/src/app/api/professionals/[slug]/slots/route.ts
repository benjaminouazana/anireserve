import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "La date est requise" },
        { status: 400 }
      );
    }

    const professional = await prisma.professional.findUnique({
      where: { slug },
      select: {
        availability: true,
        breakStart: true,
        breakEnd: true,
        bookings: {
          where: {
            status: { not: "cancelled" },
            startTime: {
              gte: new Date(`${date}T00:00:00`),
              lt: new Date(`${date}T23:59:59`),
            },
          },
        },
      },
    });

    if (!professional) {
      return NextResponse.json(
        { error: "Professionnel introuvable" },
        { status: 404 }
      );
    }

    // Parser les disponibilités
    let availability: any = {
      monday: { enabled: true, start: "09:00", end: "18:00" },
      tuesday: { enabled: true, start: "09:00", end: "18:00" },
      wednesday: { enabled: true, start: "09:00", end: "18:00" },
      thursday: { enabled: true, start: "09:00", end: "18:00" },
      friday: { enabled: true, start: "09:00", end: "18:00" },
      saturday: { enabled: false, start: "09:00", end: "18:00" },
      sunday: { enabled: false, start: "09:00", end: "18:00" },
      slotDuration: 30,
      breakStart: "12:00",
      breakEnd: "13:00",
    };

    if (professional.availability) {
      try {
        availability = { ...availability, ...JSON.parse(professional.availability) };
      } catch (e) {
        console.error("Erreur parsing availability", e);
      }
    }

    if (professional.breakStart) availability.breakStart = professional.breakStart;
    if (professional.breakEnd) availability.breakEnd = professional.breakEnd;

    // Obtenir le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayKey = dayNames[dayOfWeek] as keyof typeof availability;

    const daySchedule = availability[dayKey];
    if (!daySchedule || !daySchedule.enabled) {
      return NextResponse.json({ availableSlots: [] });
    }

    // Générer les créneaux disponibles au format "HH:MM-HH:MM"
    const slots: string[] = [];
    const [startHour, startMin] = daySchedule.start.split(":").map(Number);
    const [endHour, endMin] = daySchedule.end.split(":").map(Number);
    const [breakStartHour, breakStartMin] = availability.breakStart.split(":").map(Number);
    const [breakEndHour, breakEndMin] = availability.breakEnd.split(":").map(Number);
    const slotDuration = availability.slotDuration || 30;

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      // Calculer l'heure de fin du créneau
      let endSlotHour = currentHour;
      let endSlotMin = currentMin + slotDuration;
      if (endSlotMin >= 60) {
        endSlotMin -= 60;
        endSlotHour += 1;
      }

      // Vérifier que le créneau complet ne dépasse pas la fin de journée
      if (endSlotHour > endHour || (endSlotHour === endHour && endSlotMin > endMin)) {
        break;
      }

      const startTimeStr = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
      const endTimeStr = `${String(endSlotHour).padStart(2, "0")}:${String(endSlotMin).padStart(2, "0")}`;
      const slotStr = `${startTimeStr}-${endTimeStr}`;

      // Vérifier si c'est pendant la pause
      const isDuringBreak =
        (currentHour > breakStartHour ||
          (currentHour === breakStartHour && currentMin >= breakStartMin)) &&
        (currentHour < breakEndHour ||
          (currentHour === breakEndHour && currentMin < breakEndMin));

      // Vérifier si le créneau chevauche avec une réservation existante
      const isBooked = professional.bookings.some((booking) => {
        // Exclure les réservations annulées
        if (booking.status === "cancelled") return false;
        
        // Utiliser UTC pour éviter les problèmes de timezone
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        // Créer les dates en UTC pour la comparaison
        const slotStart = new Date(`${date}T${startTimeStr}:00Z`);
        const slotEnd = new Date(`${date}T${endTimeStr}:00Z`);
        
        // Vérifier chevauchement (inclut les réservations en attente et confirmées)
        return (
          (slotStart >= bookingStart && slotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotStart <= bookingStart && slotEnd >= bookingEnd)
        );
      });

      if (!isDuringBreak && !isBooked) {
        slots.push(slotStr);
      }

      // Avancer de la durée du créneau
      currentMin += slotDuration;
      if (currentMin >= 60) {
        currentMin -= 60;
        currentHour += 1;
      }
    }

    const response = NextResponse.json({ availableSlots: slots });
    // Cache pour 10 secondes (les créneaux changent souvent)
    response.headers.set("Cache-Control", "public, s-maxage=10, stale-while-revalidate=30");
    return response;
  } catch (error: any) {
    console.error("Erreur API /api/professionals/[id]/slots:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des créneaux" },
      { status: 500 }
    );
  }
}

