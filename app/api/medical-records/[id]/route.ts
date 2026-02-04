import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
        vet: true,
        appointment: true,
      },
    });

    if (!medicalRecord) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(medicalRecord);
  } catch (error) {
    console.error("Error fetching medical record:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical record" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.medicalRecord.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Medical record deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting medical record:", error);
    return NextResponse.json(
      { error: "Failed to delete medical record" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const medicalRecord = await prisma.medicalRecord.update({
      where: { id },
      data: {
        complaints: body.complaints,
        examination: body.examination,
        diagnosis: body.diagnosis,
        treatment: body.treatment,
        recommendations: body.recommendations,
      },
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
        vet: true,
        appointment: true,
      },
    });

    return NextResponse.json(medicalRecord);
  } catch (error) {
    console.error("Error updating medical record:", error);
    return NextResponse.json(
      { error: "Failed to update medical record" },
      { status: 500 },
    );
  }
}
