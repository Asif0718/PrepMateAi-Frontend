import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ExternalLink, MessagesSquare, PlayCircle, Printer } from "lucide-react";
import Nav from "../components/Nav";
import Reveal from "../components/Reveal";

/* ---------- parsing the model's markdown ---------- */

const LIST_RE = /^(?:[-*•]|(\d+)[.)])\s+(.*)$/;
const TABLE_SEPARATOR = /^\|[\s:|-]+\|$/;
const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+|\*[^*\s][^*]*\*)/g;

const strip = (s = "") => s.replace(/\*+/g, "").trim();
const slug = (s) => strip(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseBlocks(text) {
  const lines = text.split("\n").map((l) => l.trim());
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line || /^-{3,}$/.test(line)) {
      i++;
    } else if (line.startsWith("|")) {
      const rows = [];
      while (lines[i]?.startsWith("|")) rows.push(lines[i++]);
      const cells = rows
        .filter((r) => !TABLE_SEPARATOR.test(r))
        .map((r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      blocks.push({ type: "table", head: cells[0] || [], rows: cells.slice(1) });
    } else if (LIST_RE.test(line)) {
      const ordered = Boolean(line.match(LIST_RE)[1]);
      const items = [];
      let m;
      while ((m = lines[i]?.match(LIST_RE)) && Boolean(m[1]) === ordered) {
        items.push(m[2]);
        i++;
      }
      blocks.push({ type: "list", ordered, items });
    } else {
      const para = [];
      while (lines[i] && !lines[i].startsWith("|") && !LIST_RE.test(lines[i]) && !/^-{3,}$/.test(lines[i])) {
        para.push(lines[i++]);
      }
      blocks.push({ type: "text", text: para.join(" ") });
    }
  }
  return blocks;
}

function parseSections(guide) {
  return guide
    .split(/^###\s+/m)
    .filter((s) => s.trim())
    .map((chunk, index) => {
      const [first, ...rest] = chunk.split("\n");
      const title = strip(first).replace(/^\d+\.\s*/, "");
      const body = rest.join("\n");
      const t = title.toLowerCase();
      const kind =
        index === 0 || t.includes("summary")
          ? "summary"
          : t.includes("plan")
          ? "plan"
          : t.includes("resource") && !t.includes("bonus")
          ? "resources"
          : t.includes("question")
          ? "questions"
          : "generic";
      return { id: slug(title) || `section-${index}`, title, body, kind, blocks: parseBlocks(body) };
    });
}

function parsePlan(blocks) {
  const table = blocks.find((b) => b.type === "table" && /day/i.test(b.head[0] || ""));
  if (table) {
    return table.rows
      .map((r) => ({ day: Number(strip(r[0]).match(/\d+/)?.[0]), focus: strip(r[1]), detail: r.slice(2).join(" ") }))
      .filter((d) => d.day);
  }
  const days = [];
  for (const b of blocks) {
    for (const t of b.type === "list" ? b.items : b.type === "text" ? [b.text] : []) {
      const m = strip(t).match(/^Day\s*(\d+)\s*[:–—-]?\s*(.*)$/i);
      if (m) days.push({ day: Number(m[1]), focus: m[2], detail: "" });
    }
  }
  return days;
}

function parseResources(text) {
  const byDay = {};
  let current = null;
  let inWhy = false;
  for (const raw of text.split("\n")) {
    const line = raw.trim().replace(/^\*\*|\*\*$/g, "").trim();
    const day = line.match(/^Day\s*(\d+)\s*[–—:-]\s*(.+)$/i);
    let m;
    if (day) {
      current = byDay[Number(day[1])] = { topic: strip(day[2]), title: "", link: "", why: "" };
      inWhy = false;
    } else if (!current || !line || /^-{3,}$/.test(line)) {
      continue;
    } else if ((m = line.match(/^Best Resource:\s*(.+)$/i))) {
      current.title = m[1].replace(/[*“”"]/g, "").trim();
    } else if ((m = line.match(/^Link:\s*(https?:\/\/\S+)/i))) {
      current.link = m[1];
    } else if (/^Why\??:?$/i.test(line)) {
      inWhy = true;
    } else if ((m = line.match(/^Why\??:?\s+(.+)$/i))) {
      current.why = m[1];
    } else if (inWhy) {
      current.why += (current.why ? " " : "") + line;
    }
  }
  return byDay;
}

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7).toString(36);

/* ---------- rendering ---------- */

const prettyUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Inline({ text }) {
  return text.split(INLINE_RE).map((part, i) => {
    if (i % 2 === 0) return part;
    if (part.startsWith("**")) return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`")) {
      return <code key={i} className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[0.88em] text-ink">{part.slice(1, -1)}</code>;
    }
    const md = part.match(/^\[([^\]]+)\]\((.+)\)$/);
    const href = md ? md[2] : part.startsWith("http") ? part : null;
    if (href) {
      return (
        <a key={i} href={href} target="_blank" rel="noreferrer" className="break-all font-medium text-ink underline underline-offset-4">
          {md ? md[1] : prettyUrl(part)}
        </a>
      );
    }
    return <em key={i}>{part.slice(1, -1)}</em>;
  });
}

function SkillGroup({ item }) {
  const m = item.match(/^\*\*(.+?):?\*\*:?\s*(.+)$/);
  if (!m || !m[2].includes(",")) {
    return (
      <li className="flex gap-3">
        <span className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-ink" />
        <span><Inline text={item} /></span>
      </li>
    );
  }
  return (
    <li className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <span className="font-semibold text-ink">{strip(m[1])}</span>
      <span className="flex flex-wrap gap-1.5">
        {m[2].split(",").map((s) => (
          <span key={s} className="chip text-ink">{strip(s)}</span>
        ))}
      </span>
    </li>
  );
}

function Block({ block, kind }) {
  if (block.type === "text") {
    return <p className="max-w-[70ch] leading-7 text-graphite"><Inline text={block.text} /></p>;
  }

  if (block.type === "list" && block.ordered) {
    const questions = kind === "questions";
    return (
      <ol className={questions ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        {block.items.map((item, i) => (
          <li
            key={i}
            className={`flex gap-4 rounded-xl border border-line bg-white p-4 ${questions ? "items-start" : "items-center"}`}
          >
            <span className="w-7 shrink-0 font-display text-lg font-semibold text-mute">{i + 1}</span>
            <span className="leading-6"><Inline text={item} /></span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="space-y-4 text-graphite">
        {block.items.map((item, i) => <SkillGroup key={i} item={item} />)}
      </ul>
    );
  }

  if (block.head.length === 2) {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {block.rows.map((row, i) => {
          const asked = kind === "questions" ? row[1].split(/(?<=[?.])\s+(?=[A-Z])/).filter(Boolean) : null;
          return (
            <div key={i} className="rounded-xl border border-line bg-white p-5">
              <p className="font-semibold text-ink">{strip(row[0])}</p>
              {asked && asked.length > 1 ? (
                <ul className="mt-3 space-y-2 text-sm leading-6 text-graphite">
                  {asked.map((q, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-mute">Q{j + 1}</span>
                      <span><Inline text={q} /></span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm leading-6 text-graphite"><Inline text={row[1] || ""} /></p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white" data-lenis-prevent>
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-50 text-ink">
          <tr>{block.head.map((h, i) => <th key={i} className="px-4 py-3 font-semibold">{strip(h)}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line text-graphite">
          {block.rows.map((row, i) => (
            <tr key={i}>{row.map((c, j) => <td key={j} className="px-4 py-3 align-top"><Inline text={c} /></td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlanTimeline({ days, resources, done, onToggle }) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex flex-1 gap-1.5" aria-hidden>
          {days.map((d) => (
            <span
              key={d.day}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${done.includes(d.day) ? "bg-ink" : "bg-line"}`}
            />
          ))}
        </div>
        <p className="shrink-0 text-sm font-medium">
          {done.length} of {days.length} days done
        </p>
      </div>

      <ol className="space-y-4">
        {days.map((d, i) => {
          const isDone = done.includes(d.day);
          const res = resources[d.day];
          return (
            <Reveal
              as="li"
              key={d.day}
              index={Math.min(i, 4)}
              className={`grid gap-5 rounded-[20px] border p-5 transition-colors duration-300 sm:grid-cols-[5rem_1fr_auto] sm:p-6 ${
                isDone ? "border-line bg-neutral-50" : "border-line bg-white hover:border-graphite"
              }`}
            >
              <div className="flex items-baseline gap-2 sm:block">
                <span className="text-sm text-mute">Day</span>
                <span className={`block font-display text-5xl leading-none font-semibold ${isDone ? "text-mute" : "text-ink"}`}>
                  {d.day}
                </span>
              </div>

              <div className="min-w-0">
                <h3 className={`font-sans text-lg font-semibold tracking-normal ${isDone ? "text-mute line-through decoration-1" : ""}`}>
                  {d.focus || res?.topic}
                </h3>
                {d.detail && <p className="mt-2 max-w-[65ch] leading-7 text-graphite"><Inline text={d.detail} /></p>}

                {res?.link && (
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-4 flex items-start gap-3 rounded-xl bg-ink p-4 text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <PlayCircle size={22} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                    <span className="min-w-0">
                      <span className="block font-medium">{res.title || res.topic}</span>
                      {res.why && <span className="mt-1 block text-sm leading-6 text-white/65">{res.why}</span>}
                    </span>
                    <ExternalLink size={15} className="ml-auto mt-1 shrink-0 text-white/50 group-hover:text-white" />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => onToggle(d.day)}
                aria-pressed={isDone}
                className={`btn btn-sm self-start print:hidden ${isDone ? "btn-primary" : "btn-secondary"}`}
              >
                <Check size={14} className={isDone ? "dialog" : "opacity-40"} />
                {isDone ? "Done" : "Mark done"}
              </button>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}

function BonusResources({ blocks }) {
  const items = blocks.flatMap((b) => (b.type === "list" ? b.items : []));
  const rest = blocks.filter((b) => b.type !== "list");
  return (
    <div className="space-y-4">
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => {
          const [name, ...desc] = item.split(/\s+[–—-]\s+/);
          const url = item.match(/https?:\/\/[^\s)]+/)?.[0];
          const Tag = url ? "a" : "div";
          return (
            <li key={i}>
              <Tag
                {...(url && { href: url, target: "_blank", rel: "noreferrer" })}
                className={`flex h-full items-start justify-between gap-3 rounded-xl border border-line bg-white p-4 ${
                  url ? "transition-colors hover:border-ink" : ""
                }`}
              >
                <span>
                  <span className="block font-semibold">{strip(name)}</span>
                  {desc.length > 0 && (
                    <span className="mt-1 block text-sm text-graphite">{strip(desc.join(" - ").replace(/\(?https?:\/\/[^\s)]+\)?/, ""))}</span>
                  )}
                </span>
                {url && <ExternalLink size={15} className="mt-1 shrink-0 text-mute" />}
              </Tag>
            </li>
          );
        })}
      </ul>
      {rest.map((b, i) => <Block key={i} block={b} kind="generic" />)}
    </div>
  );
}

/* ---------- page ---------- */

function PreparationGuide() {
  const guide = localStorage.getItem("preparationGuide") || "";
  const sections = useMemo(() => parseSections(guide), [guide]);

  const summary = sections.find((s) => s.kind === "summary");
  const planSection = sections.find((s) => s.kind === "plan");
  const resourceSection = sections.find((s) => s.kind === "resources");
  const days = useMemo(() => (planSection ? parsePlan(planSection.blocks) : []), [planSection]);
  const resources = useMemo(() => (resourceSection ? parseResources(resourceSection.body) : {}), [resourceSection]);
  const mergeResources = days.length > 0 && Object.keys(resources).length > 0;

  const role = sections.map((s) => s.title.match(/\(([^)]+)\)/)?.[1]).find(Boolean);
  const visible = sections.filter((s) => s !== summary && !(mergeResources && s === resourceSection));

  const storageKey = `prep-progress:${hash(guide)}`;
  const [done, setDone] = useState(() => JSON.parse(localStorage.getItem(storageKey) || "[]"));
  const [active, setActive] = useState(visible[0]?.id);

  const toggleDay = (day) => {
    const next = done.includes(day) ? done.filter((d) => d !== day) : [...done, day];
    setDone(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    document.querySelectorAll("[data-guide-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (!sections.length) {
    return (
      <div className="min-h-[100dvh]">
        <Nav />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="card p-10 text-center">
            <p className="text-lg font-semibold">No guide yet</p>
            <p className="mt-2 text-graphite">Upload your resume on the dashboard to generate one.</p>
            <Link to="/dashboard" className="btn btn-primary mt-6">Go to dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh]">
      <div className="print:hidden">
        <Nav />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <header className="max-w-4xl">
          <h1 className="text-4xl leading-[1.05] font-semibold md:text-6xl">
            {role ? `Your prep plan for ${role}` : "Your preparation guide"}
          </h1>
          {summary && (
            <div className="mt-6 space-y-4 text-lg leading-8 text-graphite md:text-xl md:leading-9">
              {summary.blocks.map((b, i) => <Block key={i} block={b} kind="summary" />)}
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3 print:hidden">
            {days.length > 0 && <a href="#plan" className="btn btn-primary">Start the 7-day plan</a>}
            <Link
              to="/mock-interview"
              state={{ role: role || "", jobDescription: localStorage.getItem("preparationJobDescription") || "" }}
              className="btn btn-secondary"
            >
              <MessagesSquare size={16} /> Practise in a mock interview
            </Link>
            <button type="button" onClick={() => window.print()} className="btn btn-ghost">
              <Printer size={16} /> Save as PDF
            </button>
          </div>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[14rem_1fr]">
          <nav aria-label="Guide sections" className="hidden lg:block print:hidden">
            <ul className="sticky top-24 space-y-1 border-l border-line">
              {visible.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.kind === "plan" ? "plan" : s.id}`}
                    className={`-ml-px flex items-center justify-between gap-2 border-l-2 py-1.5 pr-2 pl-4 text-sm transition-colors ${
                      active === (s.kind === "plan" ? "plan" : s.id)
                        ? "border-ink font-medium text-ink"
                        : "border-transparent text-mute hover:text-ink"
                    }`}
                  >
                    {s.title}
                    {s.kind === "plan" && days.length > 0 && (
                      <span className="text-xs text-mute">{done.length}/{days.length}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-16">
            {visible.map((s) => (
              <section
                key={s.id}
                id={s.kind === "plan" ? "plan" : s.id}
                data-guide-section
                className="scroll-mt-24"
              >
                <Reveal as="h2" className="mb-6 text-3xl font-semibold md:text-4xl">
                  {s.title}
                </Reveal>
                {s.kind === "plan" && days.length > 0 ? (
                  <PlanTimeline days={days} resources={mergeResources ? resources : {}} done={done} onToggle={toggleDay} />
                ) : /bonus/i.test(s.title) ? (
                  <BonusResources blocks={s.blocks} />
                ) : (
                  <Reveal className="space-y-5">
                    {s.blocks.map((b, i) => <Block key={i} block={b} kind={s.kind} />)}
                  </Reveal>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PreparationGuide;
