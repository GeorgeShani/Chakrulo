"use client";
import React, { useState } from "react";

const publications = [
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Coping with Boredom/Routine",
    title:
      "The Effect of spaceflight on mouse olfactory bulb volume, neurogenesis, and cell death indicates the protective effect of novel environment.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4152162/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Conflict Resolution",
    title:
      "Influence of social isolation during prolonged simulated weightlessness by hindlimb unloading",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6753329/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Balance",
    title: "Bone remodeling is regulated by inner ear vestibular signals",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6615562/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Endurance",
    title:
      "Muscle atrophy phenotype gene expression during spaceflight is linked to a metabolic crosstalk in both the liver and the muscle in mice.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9576569/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Strength",
    title:
      "NemaFlex: a microfluidics-based technology for standardized measurement of muscular strength of C. elegans.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6057834/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Back & Joint Health",
    title:
      "Back pain in space and post-flight spine injury: Mechanisms and countermeasure development",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6339989/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Emergency Reaction",
    title:
      "Overexpression of catalase in mitochondria mitigates changes in hippocampal cytokine expression following simulated microgravity and isolation.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8260663/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Motivation/Apathy",
    title:
      "Reanalysis of the Mars500 experiment reveals common gut microbiome alterations in astronauts induced by long-duration confinement",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8099722/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Fine Motor Dexterity",
    title:
      "Spatially resolved multiomics on the neuronal effects induced by spaceflight in mice",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166911/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Attention/Vigilance",
    title: "Effects of spaceflight on the brain",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12031868/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Team Role Flexibility",
    title:
      "From the bench to exploration medicine: NASA life sciences translational research for human exploration and habitation missions.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5460236/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Decision-Making Under Ambiguity",
    title:
      "From the bench to exploration medicine: NASA life sciences translational research for human exploration and habitation missions.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5460236/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Motion Sickness Severity",
    title:
      "Adaptive Changes in the Vestibular System of Land Snail to a 30-Day Spaceflight and Readaptation on Return to Earth",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5672023/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Relationship Management",
    title:
      "Ethical considerations for the age of non-governmental space exploration",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166968/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Group Tolerance",
    title:
      "Crewmember microbiome may influence microbial composition of ISS habitable surfaces",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7190111/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Recovery",
    title:
      "Adaptation to full weight-bearing following disuse in rats: The impact of biological sex on musculoskeletal recovery",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10926278/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Stress Management",
    title:
      "Exposure of Bacillus subtilis to low pressure (5 kilopascals) induces several global regulons, including those involved in the SigB-mediated general stress response",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4135744/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Sense of Humor",
    title:
      "Ethical considerations for the age of non-governmental space exploration",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166968/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Skin/Dermatological History",
    title:
      "Transcriptomics analysis reveals molecular alterations underpinning spaceflight dermatology.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166967/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Dental Health Status",
    title: "Microgravity alters the expression of salivary proteins",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6981245/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Previous Injury Limitation",
    title:
      "Back pain in space and post-flight spine injury: Mechanisms and countermeasure development",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6339989/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Vestibular System",
    title:
      "Functional changes in the snail statocyst system elicited by microgravity",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3066201/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Multitasking",
    title:
      "Spatially resolved multiomics on the neuronal effects induced by spaceflight in mice",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166911/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Vision",
    title:
      "Evidence of spaceflight-induced adverse effects on photoreceptors and retinal function in the mouse eye.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10138634/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Night Vision",
    title:
      "Impact of Spaceflight and Artificial Gravity on the Mouse Retina: Biochemical and Proteomic Analysis.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6165321/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Tolerance for Isolation",
    title:
      "Influence of social isolation during prolonged simulated weightlessness by hindlimb unloading",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6753329/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Response to Error",
    title: "Mice in Bion-M 1 space mission: training and selection",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4136787/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Hearing",
    title: "Spatial and temporal characteristics of vestibular convergence",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3166430/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Task Reaction Speed",
    title:
      "The effect of spaceflight on the gravity-sensing auxin gradient of roots: GFP reporter gene microscopy on orbit.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5515520/",
  },
  {
    domain: "🧠 Mental Health & Cognitive Readiness",
    category: "Adaptability",
    title:
      "Spaceflight transcriptomes: unique responses to a novel environment.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10712242/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Heart Health",
    title:
      "Apollo Lunar Astronauts Show Higher Cardiovascular Disease Mortality: Possible Deep Space Radiation Effects on the Vascular Endothelium",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4964660/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Lungs & Breathing",
    title:
      "Cytoskeleton structure and total methylation of mouse cardiac and lung tissue during space flight.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5955502/",
  },
  {
    domain: "💪 Physical Health & Functional Capacity",
    category: "Metabolic Health",
    title:
      "Type 2 diabetes alters bone and marrow blood flow and vascular control mechanisms in the ZDF rat.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4379453/",
  },
];

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
