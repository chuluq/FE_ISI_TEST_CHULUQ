import { redirect } from "next/navigation";

import { ButtonLogout } from "@/components/button-logout";
import { FormTodo } from "@/components/form-todo";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

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

  const teams = await prisma.user.findMany({
    where: {
      role: "TEAM",
    },
  });

  return (
    <section className="container mx-auto max-w-xl">
      <div className="py-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="font-bold uppercase text-3xl">Todo List</h1>
            <h4>
              You logged in as {currentUser?.username} ({currentUser?.role})
            </h4>
          </div>
          <ButtonLogout />
        </div>
        <div className="mt-8">
          {session?.role === "TEAM" ? null : (
            <FormTodo teams={teams} creator={currentUser?.id ?? 0} />
          )}
        </div>
      </div>
    </section>
  );
}
