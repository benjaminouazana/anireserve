import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "La date est requise" },
        { status: 400 }
      );
    }

    const professional = await prisma.professional.findUnique({
      where: { id: parseInt(params.id) },
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

    // Générer les créneaux disponibles
    const slots: string[] = [];
    const [startHour, startMin] = daySchedule.start.split(":").map(Number);
    const [endHour, endMin] = daySchedule.end.split(":").map(Number);
    const [breakStartHour, breakStartMin] = availability.breakStart.split(":").map(Number);
    const [breakEndHour, breakEndMin] = availability.breakEnd.split(":").map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const timeStr = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;

      // Vérifier si c'est pendant la pause
      const isDuringBreak =
        (currentHour > breakStartHour ||
          (currentHour === breakStartHour && currentMin >= breakStartMin)) &&
        (currentHour < breakEndHour ||
          (currentHour === breakEndHour && currentMin < breakEndMin));

      // Vérifier si le créneau est déjà réservé
      const isBooked = professional.bookings.some((booking) => {
        const bookingStart = new Date(booking.startTime);
        const bookingHour = bookingStart.getHours();
        const bookingMin = bookingStart.getMinutes();
        return bookingHour === currentHour && bookingMin === currentMin;
      });

      if (!isDuringBreak && !isBooked) {
        slots.push(timeStr);
      }

      // Avancer de la durée du créneau
      currentMin += availability.slotDuration;
      if (currentMin >= 60) {
        currentMin -= 60;
        currentHour += 1;
      }
    }

    return NextResponse.json({ availableSlots: slots });
  } catch (error: any) {
    console.error("Erreur API /api/professionals/[id]/slots:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de la récupération des créneaux" },
      { status: 500 }
    );
  }
}

