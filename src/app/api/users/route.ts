import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      role: "TEAM",
    },
  });

  if (!users) {
    return NextResponse.json({ message: "No users found" }, { status: 204 });
  }

  return NextResponse.json(
    { message: "User registered", data: users },
    { status: 200 }
  );
}
