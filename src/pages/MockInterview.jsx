import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, RotateCcw, Send } from "lucide-react";
import API, { apiError } from "../api";
import Nav from "../components/Nav";

const SpeechRecognition =
  typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

const card = "bg-white/85 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8";
const input =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-60 disabled:hover:scale-100";

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
          <h2 className="text-3xl font-bold text-gray-900">AI Mock Interview</h2>
          <p className="text-gray-500 mt-2">
            Answer one question at a time, by typing or speaking, and get a score with feedback on each answer.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
          <input
            required
            minLength={2}
            value={form.role}
            onChange={set("role")}
            placeholder="e.g. MERN Stack Developer"
            className={input}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job description <span className="font-normal text-gray-400">(optional)</span>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select value={form.interview_type} onChange={set("interview_type")} className={input}>
              <option value="mixed">Mixed</option>
              <option value="technical">Technical</option>
              <option value="hr">HR / Behavioural</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
            <select value={form.difficulty} onChange={set("difficulty")} className={input}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Questions</label>
            <select value={form.num_questions} onChange={set("num_questions")} className={input}>
              {[3, 5, 7, 10].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-red-600 bg-red-50 rounded-xl p-3 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className={`${primaryBtn} w-full`}>
          {loading ? <><Loader2 size={18} className="animate-spin" /> Preparing questions...</> : "Start interview"}
        </button>
      </form>

      <div className={`${card} h-fit`}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Past interviews</h3>
        {sessions.length === 0 && <p className="text-sm text-gray-500">No interviews yet.</p>}
        <div className="space-y-2">
          {sessions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onResume(s.id)}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:bg-indigo-50 transition"
            >
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-gray-800 truncate">{s.role}</span>
                <span className="text-sm font-bold text-indigo-600 shrink-0">
                  {s.overall_score != null ? `${s.overall_score}%` : `${s.answered}/${s.total}`}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(s.created_at + "Z").toLocaleDateString()} · {s.interview_type} · {s.difficulty}
                {s.readiness ? ` · ${s.readiness}` : " · in progress"}
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
    <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
      <div className="flex items-baseline gap-3">
        <span className={`text-4xl font-bold ${scoreColor(evaluation.score)}`}>{evaluation.score}/10</span>
        <p className="text-gray-700">{evaluation.feedback}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        {evaluation.strengths.length > 0 && (
          <div className="bg-emerald-50 rounded-xl p-4">
            <h4 className="font-semibold text-emerald-800 mb-2">Strengths</h4>
            <ul className="list-disc ml-4 space-y-1 text-emerald-900">
              {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
        {evaluation.improvements.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 mb-2">Improve</h4>
            <ul className="list-disc ml-4 space-y-1 text-amber-900">
              {evaluation.improvements.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>
      {evaluation.ideal_answer && (
        <div className="bg-indigo-50 rounded-xl p-4 text-sm">
          <h4 className="font-semibold text-indigo-800 mb-2">Model answer</h4>
          <p className="text-gray-800 leading-6">{evaluation.ideal_answer}</p>
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
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>Question {index + 1} of {session.questions.length}</span>
        <span className="capitalize">{question.type}{question.topic ? ` · ${question.topic}` : ""}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full mb-6">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
          style={{ width: `${(100 * (index + (question.evaluation ? 1 : 0))) / session.questions.length}%` }}
        />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">{question.question}</h2>

      {question.evaluation ? (
        <>
          {question.answer && (
            <p className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">{question.answer}</p>
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
            placeholder={SpeechRecognition ? "Type your answer, or press the mic and speak..." : "Type your answer..."}
            className={`${input} mt-6 resize-y`}
          />
          {error && <p className="text-red-600 bg-red-50 rounded-xl p-3 text-sm mt-3">{error}</p>}
          <div className="flex gap-3 mt-4">
            {SpeechRecognition && (
              <button
                type="button"
                onClick={toggleMic}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border font-semibold transition ${
                  listening ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
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
      <p className="text-sm text-gray-500">{session.role} · {session.interview_type} · {session.difficulty}</p>
      <div className="flex items-end gap-4 mt-2">
        <span className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {session.overall_score}%
        </span>
        <span className="text-xl font-semibold text-gray-700 mb-2">{session.readiness}</span>
      </div>

      <div className="mt-8 space-y-3">
        {session.questions.map((q, i) => (
          <details key={i} className="border border-gray-100 rounded-xl p-4">
            <summary className="cursor-pointer flex justify-between gap-4">
              <span className="text-gray-800 font-medium">{i + 1}. {q.question}</span>
              <span className={`font-bold shrink-0 ${scoreColor(q.evaluation?.score ?? 0)}`}>
                {q.evaluation?.score ?? "-"}/10
              </span>
            </summary>
            {q.evaluation && <Evaluation evaluation={q.evaluation} />}
          </details>
        ))}
      </div>

      <button type="button" onClick={onRestart} className={`${primaryBtn} mt-8 w-full`}>
        <RotateCcw size={16} /> Practice again
      </button>
    </div>
  );
}

export default function MockInterview() {
  const [session, setSession] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const resume = async (id) => {
    const res = await API.get(`/interview/${id}`);
    setSession(res.data);
    setShowSummary(res.data.status === "completed");
  };

  const restart = () => {
    setSession(null);
    setShowSummary(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Nav subtitle="Practice interviews with instant feedback" showBack backTo="/dashboard" centerTitle />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!session && <Setup onStart={setSession} onResume={resume} />}
        {session && !showSummary && (
          <Interview key={session.id} session={session} setSession={setSession} onFinish={() => setShowSummary(true)} />
        )}
        {session && showSummary && <Summary session={session} onRestart={restart} />}
      </div>
    </div>
  );
}
