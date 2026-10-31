import { useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Landmark,
  Palette,
  Route,
} from "lucide-react";
import type { TextPack } from "@/shared/types/home.types";

type Props = {
  text: TextPack;
};

export function RickshawStory({ text }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      aria-labelledby="rickshaw-story-title"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-emerald-100/90 bg-white shadow-xl shadow-slate-900/[0.04]">
        <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-sky-100/60 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:p-12">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800 sm:text-sm">
              <Palette className="size-4" aria-hidden="true" />
              {text.storyEyebrow}
            </p>
            <h2
              id="rickshaw-story-title"
              className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]"
            >
              {text.storyTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {text.storyLead}
            </p>

            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="rickshaw-story-details"
              onClick={() => setExpanded((current) => !current)}
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
            >
              {expanded ? text.storyReadLess : text.storyReadMore}
              <ChevronDown
                className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 p-6 text-white shadow-lg shadow-emerald-950/15 sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 -z-10 size-44 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-2 top-0 -z-10 size-28 rounded-full border border-white/[0.08]" />
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-xl bg-white/10 text-emerald-100 ring-1 ring-white/15">
                <Route className="size-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-emerald-100">
                {text.storyBadge}
              </p>
            </div>
            <p className="mt-6 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
              “{text.storyQuote}”
            </p>
            <p className="mt-4 text-sm leading-6 text-emerald-50/80 sm:text-base sm:leading-7">
              {text.storyQuoteDesc}
            </p>
            <div className="mt-7 flex items-center gap-2 border-t border-white/15 pt-5 text-xs font-medium text-emerald-100/80 sm:text-sm">
              <Landmark className="size-4 shrink-0" aria-hidden="true" />
              <span>{text.storyUnescoLabel}</span>
            </div>
          </div>

          <div
            id="rickshaw-story-details"
            hidden={!expanded}
            className="lg:col-span-2"
          >
            <div className="grid gap-4 border-t border-slate-200 pt-6 text-sm leading-7 text-slate-600 sm:grid-cols-2 sm:gap-6 sm:text-base">
              <p>{text.storyParagraph1}</p>
              <p>{text.storyParagraph2}</p>
            </div>
            <div className="mt-7">
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                {text.storySourceHeading}
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                <li>
                  <a
                    href="https://ich.unesco.org/en/RL/rickshaws-and-rickshaw-painting-in-dhaka-01589"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full min-h-24 items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                  >
                    <span>
                      <span className="block font-semibold text-slate-900">
                        {text.storyUnescoLabel}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-slate-600">
                        {text.storyUnescoContext}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="mt-0.5 size-4 shrink-0 text-emerald-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.worldbank.org/en/topic/transport/overview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full min-h-24 items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                  >
                    <span>
                      <span className="block font-semibold text-slate-900">
                        {text.storyWorldBankLabel}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-slate-600">
                        {text.storyWorldBankContext}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="mt-0.5 size-4 shrink-0 text-emerald-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
