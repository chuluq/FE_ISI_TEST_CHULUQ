import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { todoSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = todoSchema.safeParse(data);

  if (parsed.success) {
    const payload = parsed.data;
    try {
      const task = await prisma.task.create({
        data: payload,
      });

      return NextResponse.json(
        { message: "Task created", data: task },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "Failed to create task" },
          { status: 400 }
        );
      }
      throw new Error("Failed to create task. Please try again!");
    }
  } else {
    return NextResponse.json(
      { message: "Invalid data", error: parsed.error },
      { status: 400 }
    );
  }
}
