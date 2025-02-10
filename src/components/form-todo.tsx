"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { todoSchema } from "@/lib/schema";

interface FormTodoProps {
  teams: {
    id: number;
    username: string;
    email: string;
    role: string;
  }[];
  creator: number;
}

export const FormTodo = ({ teams, creator }: FormTodoProps) => {
  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      status: "NOT_STARTED",
      created_by: creator,
    },
  });

  const onSubmit = async (values: z.infer<typeof todoSchema>) => {
    try {
      await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      form.reset();
    }
  };

  return (
    <>
      <h1 className="text-xl mb-4 capitalize font-medium">Add new task</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="coding"
          className="border p-2 w-full rounded"
          {...form.register("title")}
        />
        {form.formState.errors?.title && (
          <p className="px-1 text-xs text-red-600">
            {form.formState.errors?.title.message}
          </p>
        )}
        <div className="grid gap-2">
          <div className="flex gap-2 items-center">
            <label htmlFor="member">Choose a member</label>
            <select
              value={form.watch("assigned_to")}
              onChange={(e) =>
                form.setValue("assigned_to", parseInt(e.target.value))
              }
              className="flex-1 px-4 py-2 bg-slate-200 rounded"
            >
              {teams.map((user) => (
                <option value={user.id} key={user.email}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          {form.formState.errors?.assigned_to && (
            <p className="px-1 text-xs text-red-600">
              {form.formState.errors?.assigned_to.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-400 rounded px-4 py-2 font-semibold uppercase text-white"
        >
          Add
        </button>
      </form>
    </>
  );
};
