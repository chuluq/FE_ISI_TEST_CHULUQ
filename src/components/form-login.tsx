"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginSchema } from "@/lib/schema";

export const FormLogin = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      router.push("/");
    }
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="border"
            {...register("email")}
          />
          {errors?.email && (
            <p className="px-1 text-xs text-red-600">{errors?.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="border"
            {...register("password")}
          />
          {errors?.password && (
            <p className="px-1 text-xs text-red-600">
              {errors?.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-400 rounded text-white font-semibold px-2 py-1"
        >
          Login
        </button>
      </form>
    </>
  );
};
