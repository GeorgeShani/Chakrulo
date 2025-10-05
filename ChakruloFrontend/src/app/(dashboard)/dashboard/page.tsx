"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Moon");

  const tabs = ["Moon", "Mars", "Microgravity", "Space Radiation"];
  const progress: number = 85;

  const exploreMore = () => { 
    window.open(
      "https://www.nasa.gov/mission/station/research-explorer/investigation",
      "_blank"
    );
  };

  return (
    <section className="w-full min-h-screen flex items-start justify-center pt-32 dashboard-home-layout layout">
      <div className="w-full max-w-7xl h-full max-h-[84%] grid grid-cols-[1fr_auto] gap-6">
        <div className="w-full h-full bg-[#d9d9d92b] rounded-4xl p-6 grid grid-cols-[auto_1fr] gap-4">
          <div className="w-[200px] h-full">
            <Image
              src="/images/illustrations/skeleton.png"
              alt="Skeleton"
              width={200}
              height={800}
            />
          </div>
          <div className="w-full h-full grid grid-rows-[auto_1fr_auto] gap-4">
            <div className="w-full h-[60px] grid grid-cols-4 gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full h-full rounded-xl font-semibold transition-all
                    ${
                      activeTab === tab
                        ? "bg-[rgba(56,44,90,0.9)] text-white"
                        : "bg-[#d9d9d9b8] hover:bg-[rgba(56,44,90,0.72)] text-[#290D55]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="w-full h-full bg-[#d9d9d9b8] rounded-xl flex flex-col items-start justify-center gap-6 p-6">
              {activeTab === "Moon" ? (
                <>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <h3 className="text-[#371817] text-[16px] font-semibold">
                      Musculoskeletal - More Severe Bone Density Loss & Atrophy
                    </h3>
                    <p className="text-[#210C41] text-[16px]">
                      Extremely reduced mechanical loading (less than Mars){" "}
                      <br />
                      High (Progressive loss)
                    </p>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <h3 className="text-[#371817] text-[16px] font-semibold">
                      Altered Balance & Spatial Orientation
                    </h3>
                    <p className="text-[#210C41] text-[16px]">
                      Vestibular system receives altered inputs <br />
                      Immediate/Moderate (Risk of "space motion sickness")
                    </p>
                  </div>
                </>
              ) : activeTab === "Mars" ? (
                <>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <h3 className="text-[#371817] text-[16px] font-semibold">
                      Musculoskeletal-Bone Density Loss & Weakness
                    </h3>
                    <p className="text-[#210C41] text-[16px]">
                      Reduced compressive load on bones (Antigravity muscles
                      weaken) <br /> High (Accelerates over long duration)
                    </p>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <h3 className="text-[#371817] text-[16px] font-semibold">
                      Torso/Cardio - Cardiovascular Deconditioning
                    </h3>
                    <p className="text-[#210C41] text-[16px]">
                      Reduced effort for heart/vessels against lower gravity{" "}
                      <br />
                      Moderate (Adapts over time)
                    </p>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <h3 className="text-[#371817] text-[16px] font-semibold">
                      Altered Balance & Spatial Orientation
                    </h3>
                    <p className="text-[#210C41] text-[16px]">
                      Body fluids shift upward, increasing intracranial pressure{" "}
                      <br />
                      High (Long-duration spaceflight is associated with SANS)
                    </p>
                  </div>
                </>
              ) : activeTab === "Microgravity" ? (
                <>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <h3 className="text-[#371817] text-[16px] font-semibold">
                      Head/CNS - Impaired Spatial Functions, Reduced Processing
                      Speed
                    </h3>
                    <p className="text-[#210C41] text-[16px]">
                      Unspecified neurological effects of 0g on learning <br />{" "}
                      Moderate (Observed effects on performance)
                    </p>
                  </div>
                </>
              ) : activeTab === "Space Radiation" ? (
                <>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <h3 className="text-[#371817] text-[16px] font-semibold">
                      Whole Body - Increased Lifetime Cancer Risk
                      (Carcinogenesis)
                    </h3>
                    <p className="text-[#210C41] text-[16px]">
                      Ionizing radiation damages DNA (GCRs) <br />
                      High (Cumulative over long duration/deep space)
                    </p>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <h3 className="text-[#371817] text-[16px] font-semibold">
                      Head/CNS - Cognitive Decline, Memory Loss
                    </h3>
                    <p className="text-[#210C41] text-[16px]">
                      HZE particles cause clustered damage to CNS information
                      molecules <br />
                      High (Long-term risk)
                    </p>
                  </div>
                  <div className="flex flex-col items-start justify-center gap-1">
                    <h3 className="text-[#371817] text-[16px] font-semibold">
                      Torso/General - Degenerative Tissue Effects (Cataracts,
                      Cardiovascular Issues)
                    </h3>
                    <p className="text-[#210C41] text-[16px]">
                      Radiation potentiates various degenerative diseases <br />
                      Moderate to High (Increases with exposure)
                    </p>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="w-full h-[40px]">
              <button
                onClick={exploreMore}
                className="w-full bg-[#D9D9D9] hover:bg-[#d9d9d972] px-6 py-3 rounded-2xl"
              >
                Explore More
              </button>
            </div>
          </div>
        </div>
        <div className="w-[320px] h-full grid grid-rows-2 gap-6">
          <div className="bg-[#d9d9d92b] w-full h-full rounded-4xl flex items-center justify-center">
            <Link
              href="https://www.spaceappschallenge.org/2025/challenges/build-a-space-biology-knowledge-engine/"
              target="_blank"
            >
              <Image
                src="/images/logos/nasa-space-apps.png"
                alt="Nasa Space Apps Challenge"
                className="rounded-2xl"
                width={240}
                height={100}
              />
            </Link>
          </div>
          <div className="bg-[#D9D9D92B] w-full h-full flex flex-col items-center justify-center gap-4 rounded-4xl">
            <h2 className="text-[#201161] text-2xl">Overall Readiness Score</h2>
            <p className="text-[#201161] text-xl">{progress}/100</p>
            <div className="w-[90%] max-w-6xl h-[40px] p-1 bg-white border-[6px] border-[#290D55] rounded-4xl relative">
              <div
                className="h-full bg-[#59427E] rounded-2xl"
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `calc(${progress}% - 40px)` }}
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
        </div>
      </div>
    </section>
  );
}
