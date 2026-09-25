import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, RotateCcw, Send } from "lucide-react";
import API, { apiError } from "../api";
import Nav from "../components/Nav";
import { useToast } from "../components/toast-context";

const SpeechRecognition =
  typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

const card = "card p-6 sm:p-8";
const input =
  "field";
const primaryBtn =
  "btn btn-primary btn-lg";

function scoreColor(score) {
  if (score >= 7) return "text-emerald-600";
  if (score >= 4) return "text-amber-600";
  return "text-red-600";
}

function firstUnanswered(questions) {
  const index = questions.findIndex((q) => !q.evaluation);
  return index === -1 ? questions.length - 1 : index;
}

function Setup({ onStart, onResume }) {
  const [form, setForm] = useState({
    role: "",
    job_description: "",
    interview_type: "mixed",
    difficulty: "medium",
    num_questions: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    API.get("/interview/history")
      .then((res) => setSessions(res.data.sessions || []))
      .catch(() => {});
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const start = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/interview/start", { ...form, num_questions: Number(form.num_questions) });
      onStart(res.data);
    } catch (err) {
      setError(apiError(err, "Could not start the interview"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <form onSubmit={start} className={`${card} lg:col-span-2 space-y-5`}>
        <div>
          <h1 className="text-4xl font-semibold md:text-5xl">Mock interview</h1>
          <p className="mt-3 text-graphite">
            Answer one question at a time, by typing or speaking, and get a score with feedback on each answer.
          </p>
        </div>

        <div>
          <label className="label mb-2">Role</label>
          <input
            required
            minLength={2}
            value={form.role}
            onChange={set("role")}
            placeholder="MERN stack developer"
            className={input}
          />
        </div>

        <div>
          <label className="label mb-2">
            Job description <span className="font-normal text-mute">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={form.job_description}
            onChange={set("job_description")}
            placeholder="Paste the job description for more targeted questions"
            className={`${input} resize-none`}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label mb-2">Type</label>
            <select value={form.interview_type} onChange={set("interview_type")} className={input}>
              <option value="mixed">Mixed</option>
              <option value="technical">Technical</option>
              <option value="hr">HR and behavioural</option>
            </select>
          </div>
          <div>
            <label className="label mb-2">Difficulty</label>
            <select value={form.difficulty} onChange={set("difficulty")} className={input}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="label mb-2">Questions</label>
            <select value={form.num_questions} onChange={set("num_questions")} className={input}>
              {[3, 5, 7, 10].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className={`${primaryBtn} w-full`}>
          {loading ? <><Loader2 size={18} className="animate-spin" /> Preparing questions...</> : "Start interview"}
        </button>
      </form>

      <div className={`${card} h-fit`}>
        <h2 className="mb-4 text-xl font-semibold">Past interviews</h2>
        {sessions.length === 0 && <p className="text-sm text-graphite">Your finished and in-progress interviews will show up here.</p>}
        <div className="space-y-2">
          {sessions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onResume(s.id)}
              className="w-full rounded-xl border border-line px-4 py-3 text-left transition-colors hover:border-ink"
            >
              <div className="flex justify-between gap-2">
                <span className="truncate font-semibold">{s.role}</span>
                <span className="shrink-0 font-display text-sm font-semibold">
                  {s.overall_score != null ? `${s.overall_score}%` : `${s.answered}/${s.total}`}
                </span>
              </div>
              <p className="mt-1 text-xs text-mute capitalize">
                {new Date(s.created_at + "Z").toLocaleDateString()}, {s.interview_type}, {s.difficulty}
                {s.readiness ? `, ${s.readiness}` : ", in progress"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Evaluation({ evaluation }) {
  return (
    <div className="dialog mt-6 space-y-4 border-t border-line pt-6">
      <div className="flex items-baseline gap-3">
        <span className={`shrink-0 font-display text-5xl font-semibold ${scoreColor(evaluation.score)}`}>{evaluation.score}<span className="text-xl text-mute">/10</span></span>
        <p className="text-graphite">{evaluation.feedback}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        {evaluation.strengths.length > 0 && (
          <div className="bg-emerald-50 rounded-xl p-4">
            <h4 className="mb-2 font-sans text-sm font-semibold tracking-normal text-emerald-800">Strengths</h4>
            <ul className="list-disc ml-4 space-y-1 text-emerald-900">
              {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
        {evaluation.improvements.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-4">
            <h4 className="mb-2 font-sans text-sm font-semibold tracking-normal text-amber-800">Improve</h4>
            <ul className="list-disc ml-4 space-y-1 text-amber-900">
              {evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>
      {evaluation.ideal_answer && (
        <div className="rounded-xl bg-ink p-4 text-sm text-white">
          <h4 className="mb-2 font-sans text-sm font-semibold tracking-normal">Model answer</h4>
          <p className="leading-6 text-white/80">{evaluation.ideal_answer}</p>
        </div>
      )}
    </div>
  );
}

function Interview({ session, setSession, onFinish }) {
  const [index, setIndex] = useState(() => firstUnanswered(session.questions));
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listening, setListening] = useState(false);
  const recognition = useRef(null);

  const question = session.questions[index];
  const isLast = index === session.questions.length - 1;

  useEffect(() => () => recognition.current?.stop(), []);

  const toggleMic = () => {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.continuous = true;
    rec.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) text += e.results[i][0].transcript;
      }
      if (text.trim()) setAnswer((prev) => `${prev} ${text.trim()}`.trim());
    };
    rec.onend = () => setListening(false);
    rec.start();
    recognition.current = rec;
    setListening(true);
  };

  const submit = async () => {
    recognition.current?.stop();
    setLoading(true);
    setError(null);
    try {
      const res = await API.post(`/interview/${session.id}/answer`, { index, answer });
      const questions = session.questions.map((q, i) =>
        i === index ? { ...q, answer, evaluation: res.data.evaluation } : q
      );
      setSession({
        ...session,
        questions,
        ...(res.data.completed && {
          status: "completed",
          overall_score: res.data.overall_score,
          readiness: res.data.readiness,
        }),
      });
    } catch (err) {
      setError(apiError(err, "Could not score your answer"));
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (session.status === "completed" && isLast) {
      onFinish();
      return;
    }
    setIndex(index + 1);
    setAnswer("");
  };

  return (
    <div className={`${card} max-w-3xl mx-auto`}>
      <div className="mb-3 flex items-center justify-between text-sm text-mute">
        <span>Question {index + 1} of {session.questions.length}</span>
        <span className="capitalize">{question.type}{question.topic ? `, ${question.topic}` : ""}</span>
      </div>
      <div className="mb-8 h-1 rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-ink transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${(100 * (index + (question.evaluation ? 1 : 0))) / session.questions.length}%` }}
        />
      </div>

      <h2 key={index} className="page-enter text-2xl leading-snug font-semibold sm:text-3xl">{question.question}</h2>

      {question.evaluation ? (
        <>
          {question.answer && (
            <p className="mt-4 rounded-xl bg-neutral-100 p-3 text-sm whitespace-pre-wrap text-graphite">{question.answer}</p>
          )}
          <Evaluation evaluation={question.evaluation} />
          <button type="button" onClick={next} className={`${primaryBtn} mt-6 w-full`}>
            {isLast ? "See results" : "Next question"}
          </button>
        </>
      ) : (
        <>
          <textarea
            rows={7}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={SpeechRecognition ? "Type your answer, or press Speak and answer out loud" : "Type your answer"}
            className={`${input} mt-6 resize-y`}
          />
          {error && <p role="alert" className="mt-3 text-sm font-medium text-red-600">{error}</p>}
          <div className="flex gap-3 mt-4">
            {SpeechRecognition && (
              <button
                type="button"
                onClick={toggleMic}
                className={`btn btn-lg ${
                  listening ? "bg-red-600 text-white animate-pulse" : "btn-secondary"
                }`}
              >
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
                {listening ? "Stop" : "Speak"}
              </button>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={loading || !answer.trim()}
              className={`${primaryBtn} flex-1`}
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Scoring...</> : <><Send size={16} /> Submit answer</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Summary({ session, onRestart }) {
  return (
    <div className={`${card} max-w-3xl mx-auto`}>
      <p className="text-sm text-mute capitalize">{session.role}, {session.interview_type}, {session.difficulty}</p>
      <div className="flex items-end gap-4 mt-2">
        <span className="font-display text-7xl leading-none font-semibold">
          {session.overall_score}%
        </span>
        <span className="mb-1 text-xl font-semibold text-graphite">{session.readiness}</span>
      </div>

      <div className="mt-8 space-y-3">
        {session.questions.map((q, i) => (
          <details key={i} className="rounded-xl border border-line p-4 transition-colors open:border-ink">
            <summary className="flex cursor-pointer justify-between gap-4">
              <span className="font-medium">{i + 1}. {q.question}</span>
              <span className={`shrink-0 font-display font-semibold ${scoreColor(q.evaluation?.score ?? 0)}`}>
                {q.evaluation?.score ?? "-"}/10
              </span>
            </summary>
            {q.evaluation && <Evaluation evaluation={q.evaluation} />}
          </details>
        ))}
      </div>

      <button type="button" onClick={onRestart} className={`${primaryBtn} mt-8 w-full`}>
        <RotateCcw size={16} /> Practise again
      </button>
    </div>
  );
}

export default function MockInterview() {
  const [session, setSession] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const toast = useToast();

  const resume = async (id) => {
    try {
      const res = await API.get(`/interview/${id}`);
      setSession(res.data);
      setShowSummary(res.data.status === "completed");
    } catch (err) {
      toast.error(apiError(err, "Could not open this interview."));
    }
  };

  const restart = () => {
    setSession(null);
    setShowSummary(false);
  };

  return (
    <div className="min-h-[100dvh]">
      <Nav />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        {!session && <Setup onStart={setSession} onResume={resume} />}
        {session && !showSummary && (
          <Interview key={session.id} session={session} setSession={setSession} onFinish={() => setShowSummary(true)} />
        )}
        {session && showSummary && <Summary session={session} onRestart={restart} />}
      </main>
    </div>
  );
}
