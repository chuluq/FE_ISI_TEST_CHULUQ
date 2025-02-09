import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { registrationSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = registrationSchema.safeParse(data);

  if (parsed.success) {
    // Check user if exist
    const userExist = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (userExist) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    try {
      // Add data to the database
      const user = await prisma.user.create({
        data: parsed.data,
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
        console.error("failed to create user", JSON.stringify(error));
        return NextResponse.json(
          { message: "Failed to create user" },
          { status: 400 }
        );
      }
      console.error("Failed to create user", JSON.stringify(error));
      throw new Error("Failed to create user. Please try again!");
    }
  } else {
    return NextResponse.json(
      { message: "Invalid data", error: parsed.error },
      { status: 400 }
    );
  }
}
