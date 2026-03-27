"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Acasă", href: "#hero" },
  { label: "Servicii", href: "#services" },
  { label: "Tarife", href: "#pricing" },
  { label: "Echipă", href: "#team" },
  { label: "Reels", href: "#reels" },
  { label: "Blog", href: "#blog" },
  { label: "Parteneri", href: "#sponsors" },
  { label: "Contact", href: "#locations" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/eurooptikbacau/?locale=ro_RO",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/eurooptik_bacau/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
      </svg>
    ),
  },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-[#fdfafc]/95 backdrop-blur-xl">
      <div className="relative mx-auto flex w-full items-center justify-between px-[6rem] py-3 max-md:px-6 md:py-4">
        <Link href="#hero" className="flex items-center gap-4">
          <Image
            src="/images/logo-small.png"
            alt="Eurooptik logo"
            width={130}
            height={36}
            priority
            className="hidden h-9 w-auto sm:block"
          />
          <Image
            src="/images/logo-small.png"
            alt="Eurooptik logo"
            width={110}
            height={30}
            priority
            className="sm:hidden"
          />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 rounded-full border border-rose-50 bg-white/90 px-5 py-2 shadow-sm lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-semibold text-slate-600 transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 text-slate-700 transition hover:bg-primary hover:text-white"
            >
              {social.icon}
            </a>
          ))}
          <Link
            href="#appointment"
            className="rounded-full bg-primary px-6 py-2.5 text-base font-semibold text-white shadow-lg shadow-primary/40 transition hover:bg-primary-strong"
          >
            Programări online
          </Link>
        </div>

        <button
          className="rounded-full border border-rose-200 p-2 text-rose-500 lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Open navigation"
        >
          <span className="block h-0.5 w-5 bg-rose-500" />
          <span className="mt-1 block h-0.5 w-5 bg-rose-500" />
          <span className="mt-1 block h-0.5 w-5 bg-rose-500" />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-semibold text-slate-800"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#appointment"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-primary px-5 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-strong"
            >
              Programează-te
            </Link>
            <div className="mt-2 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={`mobile-${social.label}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 text-slate-700 transition hover:bg-primary hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

