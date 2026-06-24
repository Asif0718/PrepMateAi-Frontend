import { useNavigate } from "react-router-dom";
import {
  Brain,
  FileText,
  Briefcase,
  BarChart3,
  Rocket,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Resume Analysis",
      description:
        "AI-powered resume review with detailed insights and ATS optimization.",
      icon: <FileText className="w-8 h-8 text-indigo-400" />,
    },
    {
      title: "Preparation Guide",
      description:
        "Personalized interview roadmap based on your skills and target role.",
      icon: <Brain className="w-8 h-8 text-purple-400" />,
    },
    {
      title: "Job Recommendations",
      description:
        "Discover relevant opportunities tailored to your profile.",
      icon: <Briefcase className="w-8 h-8 text-pink-400" />,
    },
    {
      title: "Application Tracking",
      description:
        "Track all your applications and stay organized effortlessly.",
      icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-white overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full"></div>
      <div className="absolute right-0 top-20 w-[400px] h-[400px] bg-purple-600/20 blur-[150px] rounded-full"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0B1020]/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          <h1 className="text-3xl font-bold">
            <span className="text-indigo-500">Prep</span>
            <span className="text-purple-400">Mate AI</span>
          </h1>

          <div className="hidden md:flex gap-10 text-gray-300">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#about" className="hover:text-white">
              About
            </a>
            <a href="#future" className="hover:text-white">
              Guides
            </a>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-xl border border-white/20 hover:bg-white/10"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition"
            >
              Get Started 🚀
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">
              AI-Powered Placement Prep
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            Get <span className="text-indigo-500">Placement Ready</span>
            <br />
            in Record Time 🚀
          </h1>

          <p className="mt-8 text-xl text-gray-400 leading-relaxed">
            Upload your resume, generate personalized preparation guides,
            discover jobs, and prepare smarter with AI.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:scale-105 transition"
            >
              Start Your Journey →
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/10"
            >
              Get AI Assessment ✨
            </button>
          </div>

          <div className="flex gap-10 mt-12">
          <div>
              <h2 className="text-4xl font-bold text-indigo-400">
                AI
              </h2>
              <p className="text-gray-400">Powered Guidance</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-green-400">
                4+
              </h2>
              <p className="text-gray-400">Core Features</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-purple-400">
                24/7
              </h2>
              <p className="text-gray-400">Career Assistant</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="students"
            className="rounded-3xl shadow-2xl border border-white/10"
          />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-8 py-20"
      >
        <h2 className="text-5xl font-bold text-center mb-5">
          Features That Actually Work
        </h2>

        <p className="text-center text-gray-400 max-w-3xl mx-auto mb-16">
          Smart AI-driven tools designed to accelerate your placement
          journey.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:-translate-y-2 hover:border-indigo-500 transition duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section
        id="future"
        className="max-w-6xl mx-auto px-8 py-20"
      >
        <h2 className="text-5xl font-bold text-center mb-12">
          Coming Soon 🚀
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8">
            ATS Resume Analyzer
          </div>

          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8">
            LangGraph Multi-Agent Workflows
          </div>

          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8">
            RAG-based Interview Preparation
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-400">
        © 2026 PrepMate AI • Built by Shaik Mahammed Asif
      </footer>
    </div>
  );
}

export default Home;