import Link from "next/link";

import { FormLogin } from "@/components/form-login";

export default function Login() {
  return (
    <section className="container mx-auto max-w-xl">
      <div className="py-8 space-y-2">
        <h1 className="text-center font-bold uppercase">Login</h1>
        <FormLogin />
        <div className="flex gap-1">
          <p className="text-sm">Don&apos;t have an account?</p>
          <Link
            href="/register"
            className="text-sm hover:underline text-blue-500 font-bold"
          >
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}
