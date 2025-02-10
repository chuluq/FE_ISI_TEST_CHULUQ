import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.userId as number,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "No user found" }, { status: 204 });
  }

  return NextResponse.json(
    { message: "Current user", data: user },
    { status: 200 }
  );
}
