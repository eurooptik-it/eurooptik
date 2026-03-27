"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { BlogArticle } from "@/lib/types";
import { contentfulRichTextOptions } from "@/lib/contentfulRichTextOptions";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = {
  data: BlogArticle[];
};

export function BlogSection({ data }: Props) {
  const [query, setQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState(data[0]?.slug ?? "");
  const [showAll, setShowAll] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [leftColumnHeight, setLeftColumnHeight] = useState<number | null>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const listColumnRef = useRef<HTMLDivElement | null>(null);
  const articleContentRef = useRef<HTMLDivElement | null>(null);
  const articleCardRef = useRef<HTMLDivElement | null>(null);

  const handleSelectArticle = (slug: string) => {
    setActiveSlug(slug);

    if (window.matchMedia("(max-width: 767px)").matches) {
      requestAnimationFrame(() => {
        const cardTop = articleCardRef.current?.getBoundingClientRect().top;
        if (typeof cardTop !== "number") return;

        const headerOffset = 92;
        const targetY = window.scrollY + cardTop - headerOffset;
        window.scrollTo({
          top: Math.max(targetY, 0),
          behavior: "smooth",
        });
      });
    }
  };

  const filteredArticles = useMemo(() => {
    if (!query) return data;
    const lower = query.toLowerCase();
    return data.filter(
      (article) =>
        article.title.toLowerCase().includes(lower) ||
        article.serviceName.toLowerCase().includes(lower) ||
        article.doctors.some((doctor) => doctor.toLowerCase().includes(lower)),
    );
  }, [data, query]);

  const orderedArticles = useMemo(() => {
    if (!filteredArticles.length) return [];
    const activeIndex = filteredArticles.findIndex(
      (article) => article.slug === activeSlug,
    );

    if (activeIndex <= 0) {
      return filteredArticles;
    }

    return [
      filteredArticles[activeIndex],
      ...filteredArticles.slice(0, activeIndex),
      ...filteredArticles.slice(activeIndex + 1),
    ];
  }, [filteredArticles, activeSlug]);

  const visibleArticles = showAll ? orderedArticles : orderedArticles.slice(0, 4);

  const activeArticle =
    orderedArticles.find((article) => article.slug === activeSlug) ??
    visibleArticles[0] ??
    orderedArticles[0];

  useEffect(() => {
    if (!orderedArticles.length) return;
    const exists = orderedArticles.some((article) => article.slug === activeSlug);
    if (!exists) {
      setActiveSlug(orderedArticles[0].slug);
    }
  }, [orderedArticles, activeSlug]);

  useEffect(() => {
    setIsExpanded(false);
  }, [activeSlug, query, showAll]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!listColumnRef.current) return;

    const element = listColumnRef.current;
    const updateHeight = () => {
      setLeftColumnHeight(element.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [visibleArticles.length, showAll]);

  useEffect(() => {
    if (!articleContentRef.current) return;

    const element = articleContentRef.current;
    const updateHeight = () => {
      setContentHeight(element.scrollHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, [activeArticle]);

  useEffect(() => {
    const handler = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      if (!slug) return;
      const exists = data.find((article) => article.slug === slug);
      if (!exists) return;
      setShowAll(true);
      setActiveSlug(slug);
      document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("select-article", handler as EventListener);
    return () => window.removeEventListener("select-article", handler as EventListener);
  }, [data]);

  useEffect(() => {
    const handleOpenArticle = (event: CustomEvent<string>) => {
      const slug = event.detail;
      if (slug) {
        setActiveSlug(slug);
      }
    };
    window.addEventListener("open-article", handleOpenArticle as EventListener);
    return () => window.removeEventListener("open-article", handleOpenArticle as EventListener);
  }, []);

  const collapsedHeight = isDesktop ? leftColumnHeight ?? undefined : undefined;
  const articleViewportHeight = isDesktop
    ? typeof collapsedHeight === "number"
      ? Math.max(collapsedHeight - 48, 180)
      : 260
    : 320;
  const canExpand = contentHeight > articleViewportHeight + 24;

  return (
    <section id="blog">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Blog medical"
          title="Blog - Articole medicale"
          description="Selectați categoria pentru a citi articolele medicale scrise de doctorii noștri pentru fiecare dintre specialitățile oferite de clinica noastră."
        />

        <div className="mx-auto mb-6 flex w-full max-w-[44rem] flex-col gap-3 md:max-w-none md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            placeholder="Caută după serviciu sau medic..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-full border border-slate-200 px-4 py-2 text-base outline-none focus:border-primary md:w-80"
          />
          <p className="text-base text-slate-500">
            {filteredArticles.length} articole disponibile
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-[44rem] items-start gap-5 md:max-w-none md:grid-cols-[1.2fr_1fr]">
          <div ref={listColumnRef} className="mx-auto w-full min-w-0 max-w-[44rem] space-y-3 overflow-x-hidden md:max-w-none">
            {visibleArticles.map((article) => (
              <button
                key={article.slug}
                onClick={() => handleSelectArticle(article.slug)}
                className={`mx-auto block min-w-0 w-full max-w-full overflow-hidden rounded-2xl border px-4 py-4 text-left whitespace-normal transition hover:border-primary ${
                  article.slug === activeSlug
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="break-words [overflow-wrap:anywhere] [word-break:break-word] text-[11px] font-semibold uppercase tracking-[0.12em] text-primary sm:text-xs sm:tracking-[0.3em]">
                  {article.serviceName}
                </p>
                <h3 className="mt-2 break-words [overflow-wrap:anywhere] [word-break:break-word] text-base font-semibold text-slate-900 sm:text-lg">
                  {article.title}
                </h3>
                {article.doctors.length > 0 && (
                  <p className="mt-2 break-words [overflow-wrap:anywhere] [word-break:break-word] text-sm text-slate-500 sm:text-base">
                    {article.doctors.join(", ")}
                  </p>
                )}
              </button>
            ))}
            {filteredArticles.length > 4 && (
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="mx-auto block w-full rounded-full border border-[#ffd5ea] bg-white px-4 py-2 text-sm font-semibold text-[#e4007f] transition hover:border-[#f7a6cf]"
              >
                {showAll ? "Ascunde articole" : "Vezi mai multe articole"}
              </button>
            )}
          </div>

          <div
            ref={articleCardRef}
            className="card mx-auto flex w-full min-w-0 max-w-[44rem] flex-col p-6 md:max-w-none"
            style={!isExpanded && collapsedHeight ? { maxHeight: collapsedHeight } : undefined}
          >
            {activeArticle ? (
              <>
                <div
                  className="relative overflow-hidden"
                  style={!isExpanded && articleViewportHeight ? { maxHeight: articleViewportHeight } : undefined}
                >
                  <div ref={articleContentRef} className="min-w-0 space-y-4">
                    <p className="break-words [overflow-wrap:anywhere] [word-break:break-word] text-sm font-semibold uppercase tracking-[0.16em] sm:tracking-[0.3em] text-primary">
                      {activeArticle.serviceName}
                    </p>
                    <h3 className="break-words [overflow-wrap:anywhere] [word-break:break-word] text-2xl font-semibold text-slate-900">
                      {activeArticle.title}
                    </h3>
                    {activeArticle.doctors.length > 0 && (
                      <p className="mt-2 break-words [overflow-wrap:anywhere] [word-break:break-word] text-sm text-slate-500">
                        de {activeArticle.doctors.join(", ")}
                      </p>
                    )}
                    <div className="space-y-3 break-words text-base leading-relaxed text-slate-700 [&_a]:break-words [&_a]:underline-offset-4 [&_a]:hover:underline">
                      {activeArticle.content
                        ? documentToReactComponents(
                            activeArticle.content,
                            contentfulRichTextOptions,
                          )
                        : "Conținut indisponibil pentru moment."}
                    </div>
                  </div>
                </div>
                {canExpand && (
                  <button
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="mt-4 inline-flex items-center self-start rounded-full border border-[#ffd5ea] px-4 py-2 text-sm font-semibold text-[#e4007f]"
                  >
                    {isExpanded ? "↑ Restrânge" : "↓ Extinde"}
                  </button>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Selectează un articol pentru a-l citi aici.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

