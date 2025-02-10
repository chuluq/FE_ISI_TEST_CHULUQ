"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { updateTodoSchema } from "@/lib/schema";

type StatusType = "NOT_STARTED" | "ON_PROGRESS" | "DONE" | "REJECT";

type Todo = {
  id: number;
  title: string;
  description?: string | null;
  status: StatusType;
  created_by: number;
  assigned_to: number;
  created_at: Date;
  updated_at: Date;
};

interface TodosProps {
  todos: Todo[];
}

export const Todos = ({ todos }: TodosProps) => {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof updateTodoSchema>>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      description: "",
      status: "NOT_STARTED",
    },
  });

  const onEditTask = (todo: Todo) => {
    setValue("id", todo.id);
    setValue("title", todo.title);
    setValue("description", todo.description ?? "");
    setValue("created_by", todo.created_by);
    setValue("assigned_to", todo.assigned_to);
    setValue("status", todo.status);

    setOpenModal(true);
  };

  const onSubmit = async (values: z.infer<typeof updateTodoSchema>) => {
    try {
      setLoading(true);

      await fetch("/api/todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
    } catch (error) {
      console.error(JSON.stringify(error));
    } finally {
      reset();
      setLoading(false);
      setOpenModal(false);
      router.refresh();
    }
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading &&
        todos.map((todo) => (
          <div key={todo.id} className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-xl">{todo.title}</h3>
              <p>{todo.description}</p>
            </div>
            <div className="flex space-x-2">
              <span
                className={cn(
                  "p-2 font-medium text-sm rounded",
                  todo.status.includes("NOT_STARTED") && "bg-slate-300",
                  todo.status.includes("ON_PROGRESS") && "bg-blue-300",
                  todo.status.includes("DONE") && "bg-green-300",
                  todo.status.includes("REJECT") && "bg-red-300"
                )}
              >
                {todo.status}
              </span>
              <button
                onClick={() => onEditTask(todo)}
                disabled={loading}
                className="bg-yellow-400 p-2 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      {/* Modal */}
      <div
        className={cn(
          "fixed inset-0 items-center justify-center bg-black/50",
          openModal ? "flex" : "hidden"
        )}
      >
        <div className="bg-white p-6 rounded shadow-lg w-1/2 lg:w-1/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Data</h2>
            <button
              onClick={() => {
                reset();
                setOpenModal(false);
              }}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="border p-2 rounded"
                {...register("description")}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Status</label>
              <select
                id="status"
                value={watch("status")}
                onChange={(e) => {
                  if (
                    ["NOT_STARTED", "ON_PROGRESS", "DONE", "REJECT"].includes(
                      e.target.value
                    )
                  ) {
                    setValue("status", e.target.value as StatusType);
                  }
                }}
                className="flex-1 px-4 py-2 bg-slate-200 rounded"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="ON_PROGRESS">On Progress</option>
                <option value="DONE">Done</option>
                <option value="REJECT">Reject</option>
              </select>
              {errors?.status && (
                <p className="px-1 text-xs text-red-600">
                  {errors?.status.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-400 rounded px-4 py-2 font-semibold uppercase text-white flex items-center gap-2"
            >
              {loading && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  className="animate-spin"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 1 1-6.219-8.56"
                  ></path>
                </svg>
              )}
              Edit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
