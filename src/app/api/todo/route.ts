import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { todoSchema, updateTodoSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = todoSchema.safeParse(data);

  if (parsed.success) {
    const payload = parsed.data;
    try {
      const task = await prisma.task.create({
        data: payload,
      });

      revalidatePath("/");

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

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const parsed = updateTodoSchema.safeParse(data);
  console.log("data", data);
  console.log("parsed", parsed);

  if (parsed.success) {
    const payload = parsed.data;
    try {
      const task = await prisma.task.update({
        where: {
          id: payload.id,
        },
        data: payload,
      });

      revalidatePath("/");

      return NextResponse.json(
        { message: "Task has been updated", data: task },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "Failed to update task" },
          { status: 400 }
        );
      }
      throw new Error("Failed to update task. Please try again!");
    }
  } else {
    return NextResponse.json(
      { message: "Invalid data", error: parsed.error },
      { status: 400 }
    );
  }
}
