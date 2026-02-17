// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         vgvgrbgbg
//       </main>
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema = règles de validation
const crisisAlertSchema = z.object({
  title: z
    .string()
    .min(3, "Titel moet minstens 3 karakters bevatten")
    .max(60, "Titel mag 60 karakters bevatten"),
  description: z
    .string()
    .min(10, "Beschrijving moet minstens 10 karakters bevatten")
    .max(500, "Beschrijving mag 500 karakters bevatten"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"], {
    required_error: "Kies een urgentie",
    invalid_type_error: "Kies een urgentie",
  }),
  email: z.string().email("Voer een geldig e-mailadres in"),
});

// TypeScript type depuis le schema
type CrisisAlertForm = z.infer<typeof crisisAlertSchema>;

export default function HomePage() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<CrisisAlertForm>({
    resolver: zodResolver(crisisAlertSchema),
    defaultValues: {
      title: "",
      description: "",
      urgency: "MEDIUM",
      email: "",
    },
    mode: "onBlur", // valide quand tu quittes le champ
  });

  const router = useRouter();

  const selectedUrgency = watch("urgency");

  const onSubmit = async (data: CrisisAlertForm) => {
    const params = new URLSearchParams({
      title: data.title,
      description: data.description,
      urgency: data.urgency,
      email: data.email,
    });
    setTimeout(() => {
      router.push(`/result?${params.toString()}`);
    }, 1000);
  };

  return (
    <main className="min-h-screen p-6 text-slate-900">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow text-slate-900">
        <h1 className="text-2xl font-semibold">Crisis Alert Form</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          {/* TITLE */}
          <div>
            <label className="mb-1 block text-sm font-medium">Titel</label>
            <input
              type="text"
              className={`w-full rounded-xl border p-3 outline-none text-slate-900 placeholder:text-slate-400 ${
                errors.title ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="bv. Wateroverlast in Antwerpen"
              {...register("title")}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Beschrijving
            </label>
            <textarea
              className={`w-full rounded-xl border p-3 outline-none ${
                errors.description ? "border-red-500" : "border-slate-300"
              }`}
              rows={4}
              placeholder="Beschrijf de situatie en wat burgers moeten doen..."
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* URGENCY */}
          <div>
            <label className="mb-1 block text-sm font-medium">Urgentie</label>
            <select
              className={`w-full rounded-xl border p-3 outline-none ${
                errors.urgency ? "border-red-500" : "border-slate-300"
              }`}
              {...register("urgency")}
            >
              <option value="LOW">Laag 🟢</option>
              <option value="MEDIUM">Middel 🟠</option>
              <option value="HIGH">Hoog 🔴 </option>
            </select>
            {errors.urgency && (
              <p className="mt-1 text-sm text-red-600">
                {errors.urgency.message}
              </p>
            )}
          </div>

          {/*  */}
          <div className="mt-2">
            {selectedUrgency === "HIGH" && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs text-white">
                Hoge urgentie
              </span>
            )}
            {selectedUrgency === "MEDIUM" && (
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white">
                Middel urgentie
              </span>
            )}
            {selectedUrgency === "LOW" && (
              <span className="rounded-full bg-green-600 px-3 py-1 text-xs text-white">
                Lage urgentie
              </span>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Contact e-mail
            </label>
            <input
              type="email"
              className={`w-full rounded-xl border p-3 outline-none text-slate-900 placeholder:text-slate-400 ${
                errors.email ? "border-red-500" : "border-slate-300"
              }`}
              placeholder="bv. info@civielshield.be"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-60"
          >
            {isSubmitting ? "Verzenden..." : "Verzenden"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/result")}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white disabled:opacity-60"
          >
            Bekijk alle alerts
          </button>

          {isSubmitSuccessful && (
            <p className="text-sm text-green-700">
              ✅ Formulier verzonden.Je wordt doorgestuurd....
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
