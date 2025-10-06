import Image from "next/image";

export default function ReadinessScorePage() {
  const progress: number = 73; 
  
  return (
    <section className="w-full h-full flex flex-col items-center justify-center pt-9 gap-4 readiness-score-layout layout">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h2 className="text-[#201161] text-5xl">Overall Readiness Score</h2>
        <p className="text-[#201161] text-3xl">{progress}/100</p>
        <div className="w-full max-w-6xl h-[60px] p-2 bg-white border-[6px] border-[#290D55] rounded-4xl relative">
          <div
            className="h-full bg-[#59427E] rounded-2xl"
            style={{ width: `${progress}%` }}
          ></div>
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${progress}% - 40px)` }} // 40px = half of rocket width to center
          >
            <Image
              src="/images/icons/rocket-man.png"
              alt="Rocket Man"
              width={80}
              height={60}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="grid grid-cols-2 gap-6 place-items-center">
          {/* Physical Score */}
          <div className="w-full max-w-xl flex flex-col items-center justify-center gap-3 text-center">
            <h2 className="text-[#1A123B] text-2xl">Physical Score</h2>
            <p className="text-[#1A123B] text-7xl">60</p>
            <div>
              <h3 className="font-semibold mb-2">
                Recommendations from Chakrulo AI
              </h3>
              <ul className="list-disc text-left space-y-2 px-6">
                <li>
                  Aim for consistency by maintaining a regular sleep schedule.
                </li>
                <li>
                  Build mental resilience by exploring stress reduction
                  techniques.
                </li>
                <li>
                  Foster social connection and self-care by scheduling
                  meaningful time with loved ones.
                </li>
              </ul>
            </div>
          </div>

          {/* Mental Score */}
          <div className="w-full max-w-xl flex flex-col items-center justify-center gap-3 text-center">
            <h2 className="text-[#1A123B] text-2xl">Mental Score</h2>
            <p className="text-[#1A123B] text-7xl">86</p>
            <div>
              <h3 className="font-semibold mb-2">
                Recommendations from Chakrulo AI
              </h3>
              <ul className="list-disc text-left space-y-2 px-6">
                <li>
                  Establish a consistent daily mindfulness practice.
                </li>
                <li>
                  Prioritize healthy boundaries and social connections.
                </li>
                <li>
                  Enhance well-being by ensuring adequate sleep hygiene and
                  regular, enjoyable physical activity.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
