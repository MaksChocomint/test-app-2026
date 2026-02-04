import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const petId = searchParams.get("petId");

    const appointments = await prisma.appointment.findMany({
      where: petId ? { petId } : undefined,
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
        vet: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}
