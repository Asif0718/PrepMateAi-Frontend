import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-indigo-600">
          PrepMate AI
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h1 className="text-6xl font-bold text-gray-900 leading-tight">
          Your AI-Powered
          <span className="text-indigo-600"> Placement Assistant</span>
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your resume, receive personalized preparation guides,
          discover relevant jobs, track applications, and prepare smarter
          with AI.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-indigo-700"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl text-lg hover:bg-indigo-50"
          >
            Login
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-3">
              Resume Analysis
            </h3>
            <p className="text-gray-600">
              Upload your resume and get AI-powered insights.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-3">
              Preparation Guide
            </h3>
            <p className="text-gray-600">
              Personalized roadmap for interviews and placements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-3">
              Job Recommendations
            </h3>
            <p className="text-gray-600">
              Discover relevant opportunities based on your profile.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-xl mb-3">
              Application Tracking
            </h3>
            <p className="text-gray-600">
              Track all your applied jobs in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Coming Soon 🚀
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-6 rounded-2xl">
            ATS Resume Analyzer
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl">
            LangGraph Multi-Agent Workflows
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl">
            RAG-based Interview Preparation
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500">
        © 2026 PrepMate AI • Built by Shaik Mahammed Asif
      </footer>
    </div>
  );
}

export default Home;