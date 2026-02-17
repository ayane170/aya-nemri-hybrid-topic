"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type AlertItem = {
  title: string;
  description: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "";
  email: string;
  createdAt: string;
};

export default function ResultPage() {
  const searchParams = useSearchParams();

  const newAlert: AlertItem = useMemo(
    () => ({
      title: searchParams.get("title") ?? "",
      description: searchParams.get("description") ?? "",
      urgency: (searchParams.get("urgency") as AlertItem["urgency"]) ?? "",
      email: searchParams.get("email") ?? "",
      createdAt: new Date().toISOString(),
    }),
    [searchParams],
  );

  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("civielshield_alerts");
    const list: AlertItem[] = stored ? JSON.parse(stored) : [];

    // ajoute seulement si on a vraiment reçu des données
    const hasData =
      newAlert.title ||
      newAlert.description ||
      newAlert.urgency ||
      newAlert.email;

    if (!hasData) {
      setAlerts(list);
      return;
    }

    // évite d’ajouter deux fois si tu refresh la page
    const alreadyExists = list.some(
      (a) =>
        a.title === newAlert.title &&
        a.description === newAlert.description &&
        a.urgency === newAlert.urgency &&
        a.email === newAlert.email,
    );

    const updated = alreadyExists ? list : [newAlert, ...list];

    localStorage.setItem("civielshield_alerts", JSON.stringify(updated));
    setAlerts(updated);
  }, [newAlert]);

  const clearAll = () => {
    localStorage.removeItem("civielshield_alerts");
    setAlerts([]);
  };

  const badgeClass = (u: AlertItem["urgency"]) =>
    u === "HIGH"
      ? "bg-red-600"
      : u === "MEDIUM"
        ? "bg-orange-500"
        : u === "LOW"
          ? "bg-green-600"
          : "bg-slate-400";

  return (
    <main className="min-h-screen p-6 text-slate-900">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">✅ Alert opgeslagen</h1>
          <p className="mt-2 text-sm text-slate-600">
            Je kan meerdere alerts aanmaken. Ze worden lokaal opgeslagen
            (localStorage).
          </p>

          <div className="mt-4 flex gap-3">
            <a
              href="/"
              className="rounded-xl bg-slate-900 px-4 py-3 text-white"
            >
              Nieuwe alert maken
            </a>
            <button
              onClick={clearAll}
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              Alles wissen
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">📌 Alerts history</h2>

          {alerts.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">Nog geen alerts.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {alerts.map((a, idx) => (
                <li
                  key={idx}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{a.title || "—"}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs text-white ${badgeClass(a.urgency)}`}
                    >
                      {a.urgency || "—"}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {a.description || "—"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {a.email || "—"} • {new Date(a.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
