import React from "react";

export default function PublicationsPage() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start pt-32 dashboard-home-layout layout">
      <div className="w-[90%] h-full grid grid-rows-[auto_1fr] gap-3 pb-8">
        <div className="w-full grid grid-cols-2 gap-3">
          <button className="bg-[rgba(41,13,85,0.57)] text-white rounded-2xl px-6 py-3">
            🧠 Mental Health & Cognitive Readiness
          </button>
          <button className="bg-[rgba(185,176,200,0.57)] text-white rounded-2xl px-6 py-3">
            💪 Physical Health & Functional Capacity
          </button>
        </div>
        <div className="w-full min-h-0 overflow-y-auto flex flex-col gap-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-full h-[70px] bg-[#d9d9d982] rounded-xl shadow-sm flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
