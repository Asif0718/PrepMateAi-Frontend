import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Reveal from "../components/Reveal";

const URL_RE = /(https?:\/\/[^\s)]+)/g;

const linkify = (text) =>
  text.split(URL_RE).map((part, i) =>
    i % 2 ? (
      <a key={i} href={part} target="_blank" rel="noreferrer" className="break-all underline underline-offset-4 hover:text-ink">
        {part}
      </a>
    ) : (
      part.replaceAll("**", "")
    )
  );

function Section({ section, index }) {
  const lines = section.trim().split("\n");
  const title = lines[0].replaceAll("**", "");

  return (
    <Reveal as="section" className="card p-6 md:p-8">
      <div className="flex items-baseline gap-4 border-b border-line pb-4">
        <span className="font-display text-sm font-semibold text-mute">{String(index + 1).padStart(2, "0")}</span>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>

      <div className="mt-5 space-y-3 leading-7 text-graphite">
        {lines.slice(1).map((line, i) => {
          const clean = line.trim();
          if (!clean) return null;

          if (/^[-*]\s/.test(clean)) {
            return (
              <p key={i} className="flex gap-3">
                <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-ink" />
                <span>{linkify(clean.slice(2))}</span>
              </p>
            );
          }
          if (/^\d+\./.test(clean) || clean.startsWith("**")) {
            return (
              <p key={i} className="pt-2 font-semibold text-ink">
                {linkify(clean)}
              </p>
            );
          }
          return <p key={i}>{linkify(clean)}</p>;
        })}
      </div>
    </Reveal>
  );
}

function PreparationGuide() {
  const guide = localStorage.getItem("preparationGuide");
  const sections = guide ? guide.split(/###\s+/).filter((s) => s.trim()) : [];

  return (
    <div className="min-h-[100dvh]">
      <Nav />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
        <h1 className="text-4xl font-semibold md:text-5xl">Your preparation guide</h1>
        <p className="mt-3 text-lg text-graphite">Built from your resume and the job description.</p>

        {sections.length ? (
          <div className="mt-10 space-y-6">
            {sections.map((section, i) => (
              <Section key={i} section={section} index={i} />
            ))}
          </div>
        ) : (
          <div className="card mt-10 p-10 text-center">
            <p className="text-lg font-semibold">No guide yet</p>
            <p className="mt-2 text-graphite">Upload your resume on the dashboard to generate one.</p>
            <Link to="/dashboard" className="btn btn-primary mt-6">Go to dashboard</Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default PreparationGuide;
