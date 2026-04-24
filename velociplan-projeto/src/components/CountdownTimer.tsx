"use client";

import { useEffect, useState } from "react";

const DEADLINE = new Date("2026-04-23T23:59:59Z"); // fim do dia 23 abr, meia-noite Portugal (UTC+1)

function getTimeLeft() {
  const diff = DEADLINE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)     / 1_000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// variant="inline" — fits inside a sentence in the announcement bar
// variant="grid"   — four labeled boxes for the bottom CTA
export default function CountdownTimer({ variant = "inline" }: { variant?: "inline" | "grid" }) {
  const [t, setT] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!t) return null;

  if (variant === "inline") {
    return (
      <span className="font-mono font-bold text-amber-400 tabular-nums">
        {pad(t.hours)}:{pad(t.minutes)}:{pad(t.seconds)}
      </span>
    );
  }

  const units = [
    { label: "HORAS", value: t.hours },
    { label: "MIN",   value: t.minutes },
    { label: "SEG",   value: t.seconds },
  ];

  return (
    <div className="flex gap-3 justify-center">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="bg-white/8 border border-amber-500/25 rounded-lg px-3 py-2.5 min-w-[3.25rem]">
            <span className="font-mono font-bold text-2xl text-white tabular-nums leading-none">
              {pad(value)}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5 tracking-widest">{label}</p>
        </div>
      ))}
    </div>
  );
}
