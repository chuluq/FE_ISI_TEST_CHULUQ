import { FormLogin } from "@/components/form-login";

export default function Login() {
  return (
    <section className="container mx-auto max-w-xl">
      <div className="py-8 space-y-2">
        <h1 className="text-center font-bold uppercase">Login</h1>
        <FormLogin />
      </div>
    </section>
  );
}
