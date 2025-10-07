"use client";
import React, { useState } from "react";
import { publications } from "@/constants";

export default function PublicationsPage() {
  const [selectedDomain, setSelectedDomain] = useState("all");

  const filteredPublications =
    selectedDomain === "all"
      ? publications
      : publications.filter((pub) => pub.domain === selectedDomain);

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start pt-32 dashboard-home-layout layout">
      <div className="w-[90%] h-[calc(100vh-8rem)] flex flex-col gap-3 pb-8">
        <div className="w-full grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedDomain("all")}
            className={`${
              selectedDomain === "all"
                ? "bg-[rgba(41,13,85,0.57)]"
                : "bg-[rgba(185,176,200,0.57)]"
            } text-white rounded-2xl px-6 py-3 transition-colors`}
          >
            All Publications
          </button>
          <button
            onClick={() =>
              setSelectedDomain("🧠 Mental Health & Cognitive Readiness")
            }
            className={`${
              selectedDomain === "🧠 Mental Health & Cognitive Readiness"
                ? "bg-[rgba(41,13,85,0.57)]"
                : "bg-[rgba(185,176,200,0.57)]"
            } text-white rounded-2xl px-6 py-3 transition-colors`}
          >
            🧠 Mental Health & Cognitive Readiness
          </button>
          <button
            onClick={() =>
              setSelectedDomain("💪 Physical Health & Functional Capacity")
            }
            className={`${
              selectedDomain === "💪 Physical Health & Functional Capacity"
                ? "bg-[rgba(41,13,85,0.57)]"
                : "bg-[rgba(185,176,200,0.57)]"
            } text-white rounded-2xl px-6 py-3 transition-colors`}
          >
            💪 Physical Health & Functional Capacity
          </button>
        </div>

        <div className="w-full h-full overflow-y-auto scroll-bar">
          <div className="flex flex-col gap-4">
            {filteredPublications.map((pub, i) => (
              <a
                key={i}
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[99%] bg-[rgba(217,217,217,0.67)] rounded-2xl px-6 py-4 flex flex-col gap-2 hover:bg-[rgba(217,217,217,0.85)] transition-colors"
              >
                <p className="text-[#290D55] text-lg font-semibold">
                  {pub.category}
                </p>
                <p className="text-[#290D55] text-base">{pub.title}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
