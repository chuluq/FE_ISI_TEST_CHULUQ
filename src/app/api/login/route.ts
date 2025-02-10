import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/schema";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = loginSchema.safeParse(data);

  if (parsed.success) {
    const payload = parsed.data;

    // Check user if exist
    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Username or password is wrong" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Username or password is wrong" },
        { status: 401 }
      );
    }

    await createSession(user.id, user.role);

    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.json(
      { message: "Invalid data", error: parsed.error },
      { status: 400 }
    );
  }
}
