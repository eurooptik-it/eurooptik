import Link from "next/link";
import Image from "next/image";
import { clinicLocations, footerLinks } from "@/lib/locations";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/eurooptikbacau/?locale=ro_RO",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/eurooptik_bacau/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/eurooptik.ro/posts/?feedView=all",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z" />
      </svg>
    ),
  },
];

const legalLinks = [
  {
    label: "Termeni și condiții",
    href: "/termeni-si-conditii",
  },
  {
    label: "Politica de confidențialitate",
    href: "/politica-de-confidentialitate",
  },
];

const anpcBadges = [
  {
    label: "ANPC - Soluționarea alternativă a litigiilor",
    imageSrc: "/images/anpc/SAL.png",
    imageWidth: 250,
    imageHeight: 58,
    href: "https://reclamatiisal.anpc.ro/",
  },
  {
    label: "Soluționarea online a litigiilor",
    imageSrc: "/images/anpc/SOL.png",
    imageWidth: 250,
    imageHeight: 58,
    href: "https://consumer-redress.ec.europa.eu/site-relocation_en?event=main.home2.show&lng=RO",
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/60">
      <div className="flex flex-wrap items-center justify-center gap-8 bg-secondary/15 px-6 py-8 text-center md:gap-16">
        <h2 className="text-2xl font-normal tracking-wide text-slate-800 md:text-4xl">
          Vă mai așteptăm la noi!
        </h2>
        <Link
          href="#appointment"
          className="inline-flex items-center rounded-md bg-primary px-12 py-3 text-lg font-medium text-white transition hover:scale-105 hover:bg-[#0f5c53] hover:shadow-lg"
        >
          Programează-te online
        </Link>
      </div>

      <div className="px-[6rem] py-14 max-md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-0">
          <div className="flex flex-col gap-1 text-left">
            {clinicLocations.map((location) => (
              <div key={location.id} className="text-base leading-relaxed text-slate-700 md:text-lg">
                <span className="text-lg font-bold text-slate-900 md:text-xl">
                  {location.name}
                </span>
                <br />
                {location.schedule}
                <br />
                {location.address}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-6 md:items-end">
            <nav className="flex h-full flex-col justify-between gap-2 md:items-end">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-slate-900 transition hover:text-primary md:text-right md:text-xl"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex gap-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-slate-800 transition hover:-translate-y-0.5 hover:bg-primary hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-10 text-center">
        <Image
          src="/images/logo-small.png"
          alt="Eurooptik logo"
          width={600}
          height={120}
          className="mx-auto h-auto w-full max-w-[600px]"
        />
      </div>

      <div className="border-y border-slate-200/80 bg-white/85 px-[6rem] py-6 backdrop-blur-sm max-md:px-6">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-center gap-4 lg:flex-nowrap lg:justify-center lg:gap-3">
          <div className="flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm sm:px-6">
            {legalLinks.map((link) => (
              <Link
                key={`strip-${link.href}`}
                href={link.href}
                className="whitespace-nowrap text-sm font-semibold text-slate-800 underline-offset-4 transition hover:text-primary hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden h-8 w-px bg-slate-300/80 lg:block" />

          <div className="flex w-full flex-nowrap items-center justify-center gap-2 lg:w-auto lg:flex-nowrap">
            {anpcBadges.map((badge) => (
              <a
                key={`strip-${badge.href}`}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[60px] w-[46vw] min-w-[150px] max-w-[220px] items-center justify-center rounded-xl border border-[#d9d9e3] bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:h-[66px] sm:w-[210px]"
                aria-label={badge.label}
              >
                <Image
                  src={badge.imageSrc}
                  alt={badge.label}
                  width={badge.imageWidth}
                  height={badge.imageHeight}
                  className="h-[40px] w-auto max-w-[90%] object-contain sm:h-[46px] sm:max-w-[200px]"
                />
              </a>
            ))}
          </div>

          <div className="hidden h-8 w-px bg-slate-300/80 lg:block" />

          <p className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-[11px] leading-relaxed text-slate-500 shadow-sm">
            SC Eurooptik SRL, CIF 8951958, J2015000609041
          </p>
        </div>
      </div>
    </footer>
  );
}
