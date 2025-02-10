import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const ButtonLogout = () => {
  return (
    <button
      onClick={async () => {
        "use server";
        await deleteSession();
        redirect("/login");
      }}
      className="bg-red-400 px-4 py-2 rounded text-white font-semibold"
    >
      Logout
    </button>
  );
};
