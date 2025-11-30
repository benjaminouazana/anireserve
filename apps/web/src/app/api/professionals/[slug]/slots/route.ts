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
    type TimeSlot = { start: string; end: string };
    type DaySchedule = { enabled: boolean; slots?: TimeSlot[]; start?: string; end?: string };
    
    let availability: Record<string, DaySchedule | number | string> = {
      monday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
      tuesday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
      wednesday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
      thursday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
      friday: { enabled: true, slots: [{ start: "09:00", end: "18:00" }] },
      saturday: { enabled: false, slots: [{ start: "09:00", end: "18:00" }] },
      sunday: { enabled: false, slots: [{ start: "09:00", end: "18:00" }] },
      slotDuration: 30,
      breakStart: "12:00",
      breakEnd: "13:00",
    };

    if (professional.availability) {
      try {
        const parsed = JSON.parse(professional.availability);
        // Convertir l'ancien format (start/end) au nouveau format (slots[])
        Object.keys(parsed).forEach((key) => {
          if (key === "slotDuration" || key === "breakStart" || key === "breakEnd") {
            availability[key] = parsed[key];
          } else {
            const dayData = parsed[key];
            if (dayData) {
              if (dayData.slots && Array.isArray(dayData.slots)) {
                // Nouveau format avec slots[]
                availability[key] = dayData;
              } else if (dayData.start && dayData.end) {
                // Ancien format : convertir en nouveau format
                availability[key] = {
                  enabled: dayData.enabled || false,
                  slots: [{ start: dayData.start, end: dayData.end }],
                };
              }
            }
          }
        });
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
    const dayKey = dayNames[dayOfWeek];

    const daySchedule = availability[dayKey] as DaySchedule;
    if (!daySchedule || !daySchedule.enabled) {
      return NextResponse.json({ slots: [] });
    }

    // Récupérer les tranches horaires du jour
    let timeSlots: TimeSlot[] = [];
    if (daySchedule.slots && Array.isArray(daySchedule.slots)) {
      // Nouveau format avec slots[]
      timeSlots = daySchedule.slots;
    } else if (daySchedule.start && daySchedule.end) {
      // Ancien format : convertir en nouveau format
      timeSlots = [{ start: daySchedule.start, end: daySchedule.end }];
    }
    
    if (timeSlots.length === 0) {
      return NextResponse.json({ slots: [] });
    }

    const slotDuration = (availability.slotDuration as number) || 30;
    const breakStart = (availability.breakStart as string) || "12:00";
    const breakEnd = (availability.breakEnd as string) || "13:00";
    const [breakStartHour, breakStartMin] = breakStart.split(":").map(Number);
    const [breakEndHour, breakEndMin] = breakEnd.split(":").map(Number);

    // Générer les créneaux disponibles pour toutes les tranches horaires
    const slots: string[] = [];

    for (const timeSlot of timeSlots) {
      const [startHour, startMin] = timeSlot.start.split(":").map(Number);
      const [endHour, endMin] = timeSlot.end.split(":").map(Number);

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

        // Vérifier que le créneau complet ne dépasse pas la fin de la tranche
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
    }

    const response = NextResponse.json({ slots });
    // Cache pour 10 secondes (les créneaux changent souvent)
    response.headers.set("Cache-Control", "public, s-maxage=10, stale-while-revalidate=30");
    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur API /api/professionals/[slug]/slots:", errorMessage);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des créneaux" },
      { status: 500 }
    );
  }
}

