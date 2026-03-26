"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { TeamPayload } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: TeamPayload;
};

const roleTranslations: Record<string, string> = {
  doctor: "Medic",
  "asistenta-medicala": "Asistentă",
  infirmiera: "Infirmieră",
  consilier: "Consilier",
  manager: "Manager",
  optometrist: "Optometrist",
};

export function TeamSection({ data }: Props) {
  const [filter, setFilter] = useState("all");
  const [slide, setSlide] = useState(0);

  const filteredMembers = useMemo(() => {
    if (filter === "all") return data.members;
    return data.members.filter((member) => member.categories.includes(filter));
  }, [data.members, filter]);

  const groups = useMemo(() => {
    const chunkSize = 3;
    const result: typeof filteredMembers[] = [];

    for (let i = 0; i < filteredMembers.length; i += chunkSize) {
      result.push(filteredMembers.slice(i, i + chunkSize));
    }

    return result;
  }, [filteredMembers]);

  useEffect(() => {
    setSlide(0);
  }, [filter]);

  const visibleMembers = groups[slide] ?? [];

  return (
    <section id="team">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Echipă"
          title="Echipa noastră"
          description="Selectați orașul pentru a vedea echipa noastră de profesioniști din fiecare locație."
        />

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              filter === "all"
                ? "border-primary bg-primary text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary"
            }`}
          >
            Toată echipa
          </button>
          {data.locations.map((location) => (
            <button
              key={location.filterId}
              onClick={() => setFilter(location.filterId)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                filter === location.filterId
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary"
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleMembers.map((member) => (
            <div
              key={member.name}
              className="card-animated flex h-full min-h-[460px] flex-col overflow-hidden p-6 text-center"
            >
              <div className="relative mx-auto h-60 w-60 flex-shrink-0 overflow-hidden bg-accent">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="160px"
                  className="object-cover object-[center_15%] transition duration-500 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col space-y-2 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                  {roleTranslations[member.type] ?? member.type}
                </p>
                <h3 className="min-h-[56px] text-xl font-semibold text-slate-900">
                  {member.name}
                </h3>
                {member.specializations.length > 0 ? (
                  <ul className="min-h-[72px] space-y-1 text-base text-slate-600">
                    {member.specializations.slice(0, 2).map((spec) => (
                      <li key={spec}>• {spec}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="min-h-[72px]" />
                )}
              </div>
            </div>
          ))}
        </div>

        {groups.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setSlide((prev) => Math.max(prev - 1, 0))}
              disabled={slide === 0}
              className="rounded-full border border-[#ffd5ea] px-4 py-2 text-sm font-semibold text-[#e4007f] disabled:opacity-30"
            >
              ←
            </button>
            <div className="flex gap-2">
              {groups.map((_, idx) => (
                <button
                  key={`team-dot-${idx}`}
                  onClick={() => setSlide(idx)}
                  className={`h-2.5 w-2.5 rounded-full ${
                    slide === idx ? "bg-[#e4007f]" : "bg-[#ffd5ea]"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setSlide((prev) => Math.min(prev + 1, groups.length - 1))}
              disabled={slide === groups.length - 1}
              className="rounded-full border border-[#ffd5ea] px-4 py-2 text-sm font-semibold text-[#e4007f] disabled:opacity-30"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

