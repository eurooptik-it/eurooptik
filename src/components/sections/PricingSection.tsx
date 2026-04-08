"use client";

import { useMemo, useState } from "react";
import type { PricingTable } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { clinicLocations } from "@/lib/locations";

type Props = {
  data: PricingTable;
};

const baseFeatures = ["stabilire dioptrii", "tensiune oculară", "fund de ochi"];

const consultations = [
  {
    label: "Consultație Standard",
    priceKeys: ["consultatie-standard", "standard"],
    features: ["stabilire dioptrii", "tensiune oculară", "fund de ochi"],
    highlighted: [] as string[],
  },
  {
    label: "Consultație Complexă",
    priceKeys: ["consultatie-complexa", "consultatie-complexă", "complexa"],
    features: [
      "stabilire dioptrii",
      "tensiune oculară",
      "fund de ochi",
      "screening glaucom",
    ],
    highlighted: ["screening glaucom"],
  },
  {
    label: "Consultație Premium",
    priceKeys: ["consultatie-premium", "premium"],
    features: [
      "stabilire dioptrii",
      "tensiune oculară",
      "fund de ochi",
      "screening glaucom",
      "monitorizare cataractă",
    ],
    highlighted: ["screening glaucom", "monitorizare cataractă"],
  },
];

export function PricingSection({ data }: Props) {
  const availableLocations = Object.keys(data);
  const [activeLocation, setActiveLocation] = useState(
    availableLocations[0] ?? "bacau-clinica",
  );

  const activePrices = useMemo(() => data[activeLocation] ?? {}, [data, activeLocation]);

  return (
    <section id="pricing">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Tarife"
          title="Tarifele noastre"
          description="Selectați locația pentru a vedea prețurile consultațiilor disponibile în fiecare clinică."
        />

        {/* <div className="mb-8 flex flex-wrap gap-3">
          {clinicLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => setActiveLocation(location.id)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                activeLocation === location.id
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary"
              }`}
            >
              {location.name}
            </button>
          ))}
        </div> */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          
          {/* LEFT SIDE: Location Buttons */}
          <div className="flex flex-wrap gap-3">
            {clinicLocations.map((location) => (
              <button
                key={location.id}
                onClick={() => setActiveLocation(location.id)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                  activeLocation === location.id
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary"
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>

          {/* RIGHT SIDE: TBI Bank Promotional Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Long Text Button (Black text on Orange background) */}
            <a
              href="#sponsors" 
              className="rounded-full bg-[#ff7a00] border border-[#ff7a00] px-6 py-2 text-sm font-bold text-black transition hover:opacity-80"
            >
              Cumpără acum, plătește în 4 rate fără dobândă!
            </a>

            {/* Short Logo Button (White background for dark logo) */}
            <a
              href="#sponsors"
              className="flex h-[38px] items-center justify-center rounded-full bg-white px-5 border border-slate-200 transition hover:bg-slate-50 hover:border-slate-300"
            >
              <img src="/images/tbi-bank.png" alt="TBI Bank Logo" className="h-6" />
            </a>

          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {consultations.map((consultation) => {
            const price =
              consultation.priceKeys
                .map((key) => activePrices[key])
                .find((value) => typeof value !== "undefined") ?? null;
            return (
              <div key={consultation.label} className="card flex flex-col p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                {activeLocation.replace("-", " ")}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {consultation.label}
              </h3>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                    {price ? `RON ${price}` : "La cerere"}
              </p>
              <ul className="mt-4 space-y-2 text-base text-slate-600">
                {consultation.features.map((feature) => {
                  const isHighlighted = consultation.highlighted.includes(feature);
                  return (
                    <li
                      key={feature}
                      className={
                        isHighlighted
                          ? "font-semibold text-primary"
                          : ""
                      }
                    >
                      {isHighlighted ? "★" : "•"} {feature}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto pt-4">
                <a
                  href="#appointment"
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-base font-semibold text-slate-800 transition hover:border-primary hover:text-primary"
                >
                  Programează-te
                </a>
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

