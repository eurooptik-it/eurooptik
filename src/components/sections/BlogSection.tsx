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
  const [leftColumnHeight, setLeftColumnHeight] = useState<number | null>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const listColumnRef = useRef<HTMLDivElement | null>(null);
  const articleContentRef = useRef<HTMLDivElement | null>(null);

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

  const collapsedHeight = leftColumnHeight ?? undefined;
  const articleViewportHeight =
    typeof collapsedHeight === "number" ? Math.max(collapsedHeight - 48, 180) : undefined;
  const canExpand =
    typeof articleViewportHeight === "number" && contentHeight > articleViewportHeight + 24;

  return (
    <section id="blog">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Blog medical"
          title="Blog - Articole medicale"
          description="Selectați categoria pentru a citi articolele medicale scrise de doctorii noștri pentru fiecare dintre specialitățile oferite de clinica noastră."
        />

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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

        <div className="grid items-start gap-5 md:grid-cols-[1.2fr_1fr]">
          <div ref={listColumnRef} className="space-y-3">
            {visibleArticles.map((article) => (
              <button
                key={article.slug}
                onClick={() => setActiveSlug(article.slug)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition hover:border-primary ${
                  article.slug === activeSlug
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  {article.serviceName}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {article.title}
                </h3>
                {article.doctors.length > 0 && (
                  <p className="mt-2 text-base text-slate-500">
                    {article.doctors.join(", ")}
                  </p>
                )}
              </button>
            ))}
            {filteredArticles.length > 4 && (
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="w-full rounded-full border border-[#ffd5ea] bg-white px-4 py-2 text-sm font-semibold text-[#e4007f] transition hover:border-[#f7a6cf]"
              >
                {showAll ? "Ascunde articole" : "Vezi mai multe articole"}
              </button>
            )}
          </div>

          <div
            className="card flex flex-col p-6"
            style={!isExpanded && collapsedHeight ? { maxHeight: collapsedHeight } : undefined}
          >
            {activeArticle ? (
              <>
                <div
                  className="relative overflow-hidden"
                  style={!isExpanded && articleViewportHeight ? { maxHeight: articleViewportHeight } : undefined}
                >
                  <div ref={articleContentRef} className="space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                      {activeArticle.serviceName}
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      {activeArticle.title}
                    </h3>
                    {activeArticle.doctors.length > 0 && (
                      <p className="mt-2 text-sm text-slate-500">
                        de {activeArticle.doctors.join(", ")}
                      </p>
                    )}
                    <div className="space-y-3 text-base leading-relaxed text-slate-700">
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

