import { Link } from "react-router-dom";
import { BellRing, Check, Mic, Plus } from "lucide-react";
import Reveal from "../components/Reveal";

const HEADLINE = "Walk into placement season ready.";

const STEPS = [
  ["Upload your resume", "Add a PDF and paste the job description you are aiming for."],
  [
    "Follow a 7-day plan",
    "See your skill gaps, likely questions and a day-by-day plan with a learning resource for each day. Tick days off as you go.",
  ],
  [
    "Practise the interview",
    "Answer technical and HR questions by voice or text. Each answer is scored with feedback and a stronger sample answer.",
  ],
  [
    "Find jobs that fit",
    "Search live listings with a match score for each one, or save a search and get new matches shortlisted every morning.",
  ],
  [
    "Apply in minutes",
    "Tailor your resume to the job's keywords and get a cover letter, recruiter message and application answers in one click.",
  ],
  [
    "Track every application",
    "Move jobs from shortlisted to offer and get an email before interviews and when a follow-up is due.",
  ],
];

const ALERTS = [
  ["Frontend Developer", "82%"],
  ["React Engineer", "74%"],
];

const STAGES = [
  ["Applied", 6],
  ["Interview", 2],
  ["Offer", 1],
];

function Home() {
  return (
    <div className="overflow-x-clip">
      <header className="sticky top-0 z-50 border-b border-line/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-display text-xl font-semibold">
            PrepMate
          </Link>
          <nav className="hidden gap-8 text-sm text-graphite md:flex">
            <a href="#features" className="transition-colors hover:text-ink">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-ink">How it works</a>
          </nav>
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Create account</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
        <div>
          <h1 className="text-5xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            {HEADLINE.split(" ").map((word, i) => (
              <span key={i} className="rise-line mr-[0.22em]">
                <span style={{ "--i": i }}>{word}</span>
              </span>
            ))}
          </h1>
          <p
            className="page-enter mt-7 max-w-md text-lg leading-relaxed text-graphite"
            style={{ animationDelay: "450ms" }}
          >
            Turn your resume and a job description into a prep plan, mock interviews and a tracked job search.
          </p>
          <div className="page-enter mt-9 flex flex-wrap gap-3" style={{ animationDelay: "550ms" }}>
            <Link to="/register" className="btn btn-primary btn-lg">Create account</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Sign in</Link>
          </div>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-neutral-200 lg:aspect-[4/5]">
          <div className="settle size-full">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=75"
              alt="Students preparing together at a laptop"
              fetchPriority="high"
              className="drift size-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
        <Reveal as="h2" className="max-w-2xl text-4xl leading-[1.05] font-semibold md:text-5xl">
          Everything between your resume and the offer letter.
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <Reveal className="flex flex-col justify-between gap-10 rounded-[20px] bg-ink p-8 text-white md:col-span-4 md:p-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Mock interviews</h3>
              <Mic size={22} className="text-white/60" />
            </div>
            <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-end">
              <p className="font-display text-7xl leading-none font-semibold md:text-8xl">
                7<span className="text-3xl text-white/50">/10</span>
              </p>
              <p className="max-w-sm text-white/70">
                Every answer gets a score, what worked, what to improve and a stronger sample answer.
              </p>
            </div>
          </Reveal>

          <Reveal index={1} className="card flex flex-col gap-6 p-8 md:col-span-2">
            <h3 className="text-2xl font-semibold">Job matching</h3>
            <p className="text-graphite">Each listing shows how well your skills fit it.</p>
            <div className="mt-auto flex flex-wrap gap-2">
              <span className="chip chip-ink">68% match</span>
              <span className="chip"><Check size={12} /> React</span>
              <span className="chip"><Check size={12} /> SQL</span>
              <span className="chip"><Plus size={12} /> Docker</span>
            </div>
          </Reveal>

          <Reveal index={2} className="flex flex-col gap-6 rounded-[20px] bg-neutral-100 p-8 md:col-span-2">
            <h3 className="text-2xl font-semibold">Preparation guide</h3>
            <ol className="mt-auto space-y-3 text-sm">
              {["Revise REST and auth basics", "Build one project feature", "Practise SQL joins"].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="w-12 shrink-0 font-display font-semibold whitespace-nowrap">Day {i + 1}</span>
                  <span className="text-graphite">{t}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal index={3} className="card flex flex-col gap-8 p-8 md:col-span-4 md:p-10">
            <div>
              <h3 className="text-2xl font-semibold">Application tracker</h3>
              <p className="mt-2 max-w-md text-graphite">
                Drag applications between stages and get an email when a follow-up is due.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {STAGES.map(([stage, count]) => (
                <div key={stage} className="rounded-xl border border-line p-4">
                  <p className="text-sm text-mute">{stage}</p>
                  <p className="mt-1 font-display text-3xl font-semibold">{count}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal index={4} className="flex flex-col gap-6 rounded-[20px] bg-neutral-100 p-8 md:col-span-3 md:p-10">
            <div>
              <h3 className="text-2xl font-semibold">Tailored applications</h3>
              <p className="mt-2 max-w-md text-graphite">
                Match your resume to each job's keywords, then get everything you need to apply.
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              {["ATS keywords", "Cover letter", "Recruiter message", "Application answers"].map((t) => (
                <span key={t} className="chip bg-white"><Check size={12} /> {t}</span>
              ))}
            </div>
          </Reveal>

          <Reveal index={5} className="flex flex-col gap-6 rounded-[20px] bg-ink p-8 text-white md:col-span-3 md:p-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Daily job alerts</h3>
              <BellRing size={22} className="text-white/60" />
            </div>
            <p className="max-w-md text-white/70">
              New matches for your saved searches are shortlisted and emailed to you every morning.
            </p>
            <ul className="mt-auto space-y-2">
              {ALERTS.map(([role, score]) => (
                <li key={role} className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm">
                  <span>{role}</span>
                  <span className="font-display font-semibold">{score} match</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal as="h2" className="text-4xl leading-[1.05] font-semibold md:text-5xl">
              How it works
            </Reveal>
            <Reveal as="p" index={1} className="mt-5 max-w-sm text-lg text-white/60">
              Six steps from a blank page to an offer.
            </Reveal>
          </div>

          <ol>
            {STEPS.map(([title, body], i) => (
              <Reveal
                as="li"
                key={title}
                className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-white/15 py-10 first:border-t-0 first:pt-0 md:grid-cols-[5rem_1fr]"
              >
                <span className="font-display text-4xl font-semibold text-white/35 md:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-2xl font-semibold md:text-3xl">{title}</h3>
                  <p className="mt-3 max-w-md text-white/60">{body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
        <div className="grow-in flex flex-col items-start gap-8 rounded-[20px] border border-line p-8 md:flex-row md:items-center md:justify-between md:p-14">
          <h2 className="max-w-xl text-4xl leading-[1.05] font-semibold md:text-5xl">
            Start preparing for your next interview.
          </h2>
          <Link to="/register" className="btn btn-primary btn-lg shrink-0">Create account</Link>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-mute sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 PrepMate AI</p>
          <p>Built by Shaik Mahammed Asif</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
