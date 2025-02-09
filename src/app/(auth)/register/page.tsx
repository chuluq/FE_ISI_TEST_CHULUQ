import { FormRegistration } from "@/components/form-registration";

export default async function Register() {
  return (
    <section className="container mx-auto max-w-xl">
      <div className="py-8 space-y-2">
        <h1 className="text-center font-bold uppercase">Register User</h1>
        <FormRegistration />
      </div>
    </section>
  );
}
