import { ButtonLogout } from "@/components/button-logout";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  const currentUser = await prisma.user.findUnique({
    where: {
      id: session?.userId as number,
    },
  });
  // const users = await prisma.user.findMany();

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
          {!session || session?.role === "TEAM" ? null : (
            <form action="" className="flex gap-2">
              <input
                type="text"
                placeholder="Add new task"
                className="border p-2 w-full rounded"
                disabled={!session || session?.role === "TEAM"}
              />
              <button
                disabled={!session || session?.role === "TEAM"}
                className="bg-blue-400 rounded px-4 py-2 font-semibold uppercase text-white"
              >
                Add
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
