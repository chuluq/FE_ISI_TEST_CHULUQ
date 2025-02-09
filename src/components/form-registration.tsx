"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registrationSchema, UserSchema } from "@/lib/schema";

export type FormState = {
  message: string;
  user?: Omit<UserSchema, "password">;
  issues?: string[];
};

export const FormRegistration = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "LEAD",
    },
  });

  const onSubmit = async (values: UserSchema) => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="grid gap-2">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="border"
            {...register("username")}
          />
          {errors?.username && (
            <p className="px-1 text-xs text-red-600">
              {errors?.username.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <input type="email" className="border" {...register("email")} />
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
        <div className="grid gap-2">
          <label htmlFor="role">Role</label>
          <select id="role" className="p-2 rounded" {...register("role")}>
            <option value="LEAD">Lead</option>
            <option value="TEAM">Team</option>
          </select>
          {errors?.role && (
            <p className="px-1 text-xs text-red-600">{errors?.role.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-400 rounded text-white font-semibold px-2 py-1"
        >
          Register
        </button>
      </form>
    </>
  );
};
