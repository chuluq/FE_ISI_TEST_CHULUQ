"use server";

import bcrypt from "bcrypt";

import { FormState } from "@/components/form-registration";

import prisma from "@/lib/prisma";
import { registrationSchema } from "@/lib/schema";

export const registerUser = async (
  prevState: FormState,
  formData: FormData
) => {
  const data = Object.fromEntries(formData);
  const parsed = registrationSchema.safeParse(data);

  if (parsed.success) {
    const user = parsed.data;

    const uniqueUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (uniqueUser) {
      return {
        message: "User already exists",
      };
    }

    user.password = await bcrypt.hash(user.password, 10);

    const response = await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  } else {
    return {
      message: "Invalid data",
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }
};
