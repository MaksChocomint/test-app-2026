import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeOwner = searchParams.get("include") === "owner";

    const pets = await prisma.pet.findMany({
      include: includeOwner
        ? {
            owner: true,
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pets" },
      { status: 500 },
    );
  }
}
