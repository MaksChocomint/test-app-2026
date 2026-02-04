import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const petId = searchParams.get("petId");

    const where = petId ? { petId } : undefined;

    const medicalRecords = await prisma.medicalRecord.findMany({
      where,
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
        vet: true,
        appointment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(medicalRecords);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical records" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const appointmentId = body.appointmentId?.trim() || null;

    if (appointmentId) {
      const existingAppointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!existingAppointment) {
        return NextResponse.json(
          { error: "Запись на прием с указанным ID не найдена" },
          { status: 404 },
        );
      }

      const existingRecord = await prisma.medicalRecord.findUnique({
        where: { appointmentId },
      });

      if (existingRecord) {
        return NextResponse.json(
          { error: "Медицинская запись для этого приема уже существует" },
          { status: 400 },
        );
      }
    }

    if (
      !body.complaints ||
      !body.examination ||
      !body.diagnosis ||
      !body.petId ||
      !body.vetId
    ) {
      return NextResponse.json(
        {
          error:
            "Отсутствуют обязательные поля: жалобы, осмотр, диагноз, питомец, ветеринар",
        },
        { status: 400 },
      );
    }

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        complaints: body.complaints,
        examination: body.examination,
        diagnosis: body.diagnosis,
        treatment: body.treatment || null,
        recommendations: body.recommendations || null,
        petId: body.petId,
        vetId: body.vetId,
        appointmentId: appointmentId,
      },
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
        vet: true,
        appointment: appointmentId ? true : undefined,
      },
    });

    return NextResponse.json(medicalRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating medical record:", error);
  }
}
