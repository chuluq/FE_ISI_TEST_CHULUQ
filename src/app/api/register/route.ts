import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";
import { registrationSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = registrationSchema.safeParse(data);

  if (parsed.success) {
    const payload = parsed.data;

    // Check user if exist
    const userExist = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (userExist) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    try {
      payload.password = await bcrypt.hash(payload.password, 10);

      // Add data to the database
      const user = await prisma.user.create({
        data: payload,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          created_at: true,
        },
      });

      return NextResponse.json(
        { message: "User registered", data: user },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "Failed to create user" },
          { status: 400 }
        );
      }
      throw new Error("Failed to create user. Please try again!");
    }
  } else {
    return NextResponse.json(
      { message: "Invalid data", error: parsed.error },
      { status: 400 }
    );
  }
}
