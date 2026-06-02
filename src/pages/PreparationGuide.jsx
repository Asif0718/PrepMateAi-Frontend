import Nav from "../components/Nav";

function PreparationGuide() {
  const guide = localStorage.getItem("preparationGuide");

  const formatGuide = (text) => {
    if (!text) return null;

    const sections = text.split(/###\s+/).filter(Boolean);

    return sections.map((section, index) => {
      const lines = section.trim().split("\n");
      const title = lines[0];
      const content = lines.slice(1).join("\n");
  
      

      return (
        <div
          key={index}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 hover:shadow-2xl transition"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-5 border-b pb-3">
            {title}
          </h3>

          <div className="space-y-3 text-gray-700 leading-7">
            {content.split("\n").map((line, i) => {
              const cleanLine = line.trim();

              if (!cleanLine) return null;

              if (cleanLine.startsWith("-")) {
                return (
                  <li
                    key={i}
                    className="ml-5 list-disc text-gray-700 bg-indigo-50/60 px-4 py-2 rounded-xl"
                  >
                    {cleanLine.replace("-", "").trim()}
                  </li>
                );
              }

              if (/^\d+\./.test(cleanLine)) {
                return (
                  <p
                    key={i}
                    className="font-semibold text-indigo-700 bg-indigo-50 px-4 py-3 rounded-xl"
                  >
                    {cleanLine}
                  </p>
                );
              }

              if (cleanLine.startsWith("**")) {
                return (
                  <p
                    key={i}
                    className="font-bold text-purple-700 bg-purple-50 px-4 py-3 rounded-xl"
                  >
                    {cleanLine.replaceAll("**", "")}
                  </p>
                );
              }

              return (
                <p key={i} className="text-gray-600">
                  {cleanLine}
                </p>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Nav
  subtitle="Your AI preparation roadmap"
  showBack={true}
  backTo="/dashboard"
  centerTitle={true}
/>

      <div className="max-w-7xl mx-auto px-6 pt-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Personalized Preparation Guide
        </h1>
        <p className="text-gray-500 mt-3">
          Based on your resume and job description
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {guide ? (
          <div className="space-y-8">{formatGuide(guide)}</div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <p className="text-gray-600">
              No preparation guide found. Please upload resume again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreparationGuide;