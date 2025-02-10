import { redirect } from "next/navigation";

import { ButtonLogout } from "@/components/button-logout";
import { FormTodo } from "@/components/form-todo";
import { Todos } from "@/components/todos";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function getAssignedTodos(userId: number) {
  try {
    return prisma.task.findMany({
      where: {
        assigned_to: userId,
      },
    });
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

async function getCreatedTodos(userId: number) {
  try {
    return prisma.task.findMany({
      where: {
        created_by: userId,
      },
    });
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.userId as number,
    },
  });

  if (!currentUser) {
    redirect("/login");
  }

  const teams = await prisma.user.findMany({
    where: {
      role: "TEAM",
    },
  });

  const assignedTodo = await getAssignedTodos(session.userId as number);
  const createdTodo = await getCreatedTodos(session.userId as number);
  const todos = currentUser?.role === "LEAD" ? createdTodo : assignedTodo;
  const isTeam = currentUser?.role === "TEAM";

  return (
    <section className="container mx-auto max-w-xl">
      <div className="py-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="font-bold uppercase text-3xl">Todo List</h1>
            <h4>
              You logged in as {currentUser?.username} ({currentUser?.role})
            </h4>
          </div>
          <ButtonLogout />
        </div>
        <div>
          {session?.role === "TEAM" ? null : (
            <FormTodo teams={teams} creator={currentUser?.id ?? 0} />
          )}
        </div>
        <div>
          <Todos todos={todos ?? []} teams={teams} isTeam={isTeam} />
        </div>
      </div>
    </section>
  );
}
