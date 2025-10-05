"use client";
import { Question } from "@/types/supabase/questions";
import { useState, useEffect, useRef } from "react";

type TabType = "physical" | "mental";

export default function QuestionnairePage() {
  const [activeTab, setActiveTab] = useState<TabType>("physical");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});
  const [expandedQuestions, setExpandedQuestions] = useState<{ [key: string]: boolean; }>({});
  const [importantNotePopup, setImportantNotePopup] = useState<boolean>(true);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [toggleLearnMore, setToggleLearnMore] = useState(false);

  const toggleLearnMoreVoid = () => {
    setToggleLearnMore(prev => !prev);
  };

  useEffect(() => {
    if (toggleLearnMore && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth", // optional for smooth scrolling
      });
    }
  }, [toggleLearnMore]);


  useEffect(() => {
    const getQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/questions/${activeTab}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Question[] = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getQuestions();
  }, [activeTab]);

  const handleFileUpload = (questionId: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    }

    setUploadedFiles((prev) => ({
      ...prev,
      [questionId]: file,
    }));
  };

  const handleRemoveFile = (questionId: string) => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[questionId];
      return newFiles;
    });

    if (fileInputRefs.current[questionId]) {
      fileInputRefs.current[questionId]!.value = "";
    }
  };

  const toggleQuestionDetails = (questionId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const saveQuestionnaireResults = async () => {};

  const moveToMentalQuestions = async () => {
    setActiveTab("mental");
  };

  const submitQuestionnaire = async () => { };

  if (importantNotePopup) {
    return (
      <section className="w-full h-full flex items-center justify-center pt-20 questionnaire-layout layout">
        <div className="bg-[#e0dae990] w-full max-w-5xl h-full max-h-[94%] rounded-4xl p-10 grid grid-rows-[1fr_auto] gap-6">
          <div className="w-full h-full overflow-hidden flex flex-col items-center justify-center text-center">
            <div
              ref={containerRef}
              className="w-full max-w-lg flex flex-col gap-7 overflow-y-auto scroll-bar-hide"
            >
              <h2 className="text-[#1D083D] text-3xl font-semibold">
                About This Questionnaire
              </h2>
              <p className="text-[#342748] text-lg">
                This questionnaire was created by our research team as part of
                the NASA Space Biology Challenge.
              </p>
              <p className="text-[#342748] text-lg">
                It’s based on NASA’s astronaut health and bioscience studies,
                which explore how spaceflight affects the brain, body, and
                overall well-being.
              </p>
              <p className="text-[#342748] text-lg">
                Our team — including a neuroscience PhD researcher and a public
                health organizer — designed it to connect insights from space
                biology and neuroscience with human health on Earth.
              </p>
              <button
                className="bg-[#F2E2E2] text-[#1D083D] font-bold px-6 py-3 rounded-3xl"
                onClick={toggleLearnMoreVoid}
              >
                Learn More
              </button>
              {toggleLearnMore && (
                <ul className="w-full flex flex-col items-start justify-center gap-2">
                  <li className="text-[#290D55] underline font-semibold">
                    <a href="https://www.nasa.gov/hrp" target="_blank">
                      NASA Human Research Program (HRP)
                    </a>
                  </li>
                  <li className="text-[#290D55] underline font-semibold">
                    <a
                      href="https://www.nasa.gov/wp-content/uploads/2024/01/human-health-and-performance.pdf"
                      target="_blank"
                    >
                      NASA Human Health & Performance Report (PDF)
                    </a>
                  </li>
                  <li className="text-[#290D55] underline font-semibold">
                    <a
                      href="https://academic.oup.com/nar/article/49/D1/D1515/5932845"
                      target="_blank"
                    >
                      NASA GeneLab: Space Omics Data
                    </a>
                  </li>
                  <li className="text-[#290D55] underline font-semibold">
                    <a
                      href="https://ntrs.nasa.gov/api/citations/20230000894/downloads/LFG506769NIH.pdf"
                      target="_blank"
                    >
                      NASA Twins Study Overview (PDF)
                    </a>
                  </li>
                  <li className="text-[#290D55] underline font-semibold">
                    <a href="https://arxiv.org/abs/2404.03363" target="_blank">
                      Space Physiology & Countermeasures (arXiv)
                    </a>
                  </li>
                  <li className="text-[#290D55] underline font-semibold">
                    <a
                      href="https://github.com/jgalazka/SB_publications/tree/main"
                      target="_blank"
                    >
                      A list of 608 full-text open-access Space Biology
                      publications
                    </a>
                  </li>
                  <li className="text-[#290D55] underline font-semibold">
                    <a
                      href="https://science.nasa.gov/biological-physical/data/"
                      target="_blank"
                    >
                      ASA Open Science Data Repository
                    </a>
                  </li>
                  <li className="text-[#290D55] underline font-semibold">
                    <a
                      href="https://public.ksc.nasa.gov/nslsl/"
                      target="_blank"
                    >
                      NASA Space Life Sciences Library
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-end">
            <button
              className="bg-[#59427E] rounded-3xl px-6 py-3 text-white hover:bg-[#290D55]"
              onClick={() => setImportantNotePopup(false)}
            >
              Start Questionnaire
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex items-center justify-center pt-20 questionnaire-layout layout">
      <div className="bg-[rgba(158,154,161,0.54)] w-full max-w-6xl h-[590px] rounded-3xl py-6 px-8 grid grid-rows-[auto_1fr_auto] gap-4">
        <div className="w-full grid grid-cols-2 bg-[rgba(21,3,53,0.26)] rounded-2xl px-6 py-3">
          <button
            onClick={() => setActiveTab("physical")}
            disabled={isLoading}
            className="w-full h-full flex items-center justify-center bg-[#E1E2EF] py-1 border-r border-r-[#290D55] rounded-l-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p
              className={`text-[#290D55] text-xl ${
                activeTab === "physical" ? "font-semibold" : "font-normal"
              }`}
            >
              Physical Health & Functional Capacity
            </p>
          </button>
          <button
            onClick={() => setActiveTab("mental")}
            disabled={isLoading}
            className="w-full h-full flex items-center justify-center bg-[#E1E2EF] py-1 border-l border-l-[#290D55] rounded-r-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p
              className={`text-[#290D55] text-xl ${
                activeTab === "mental" ? "font-semibold" : "font-normal"
              }`}
            >
              Mental Health & Cognitive Readiness
            </p>
          </button>
        </div>

        <div className="bg-[rgba(224,218,233,0.71)] w-full rounded-2xl p-6 overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-[#290D55] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#290D55] text-lg">Loading questions...</p>
            </div>
          ) : error ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#290D55"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-[#290D55] text-lg text-center">{error}</p>
              <button
                onClick={() => setActiveTab(activeTab)}
                className="bg-[#290D55] hover:bg-[#3e2e58] transition-all duration-300 ease-in-out rounded-2xl text-white text-base py-2 px-6"
              >
                Retry
              </button>
            </div>
          ) : questions.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <p className="text-[#290D55] text-lg text-center">
                No questions available for this category.
              </p>
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto scroll-bar">
              <div className="flex flex-col gap-4">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="w-[98%] bg-[rgba(217,217,217,0.67)] rounded-2xl px-6 py-3 flex flex-col gap-4"
                  >
                    <p className="text-[#290D55] text-xl font-semibold">
                      {question.question_text}
                    </p>
                    <div className="w-full flex flex-col items-start justify-center gap-2">
                      {question.response_options.map((option) => (
                        <label
                          key={option.id}
                          className="text-[#290D55] rounded-2xl flex items-center justify-start gap-2 cursor-pointer hover:text-[#3e2e58] transition-colors"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.id}
                            className="cursor-pointer"
                          />
                          {option.option_text}
                        </label>
                      ))}
                    </div>

                    {question.advanced_question_text &&
                      question.advanced_question_note && (
                        <>
                          <div className="w-full flex items-center justify-start">
                            <button
                              type="button"
                              onClick={() => toggleQuestionDetails(question.id)}
                              className="text-black flex items-center gap-1 hover:text-[#290D55] transition-all duration-300 ease-in-out"
                            >
                              {expandedQuestions[question.id] ? "Hide" : "View"}{" "}
                              Question Details
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-300 ${
                                  expandedQuestions[question.id]
                                    ? "rotate-180"
                                    : "rotate-0"
                                }`}
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </button>
                          </div>

                          {expandedQuestions[question.id] && (
                            <div className="w-full flex flex-col items-start justify-center gap-3 pt-2 border-t border-[#290D55]/20">
                              <p className="text-[#290D55] text-lg font-normal">
                                {question.advanced_question_text}
                              </p>
                              <p className="text-[#290D55] text-sm font-normal italic">
                                {question.advanced_question_note}
                              </p>

                              <input
                                ref={(el) => {
                                  fileInputRefs.current[question.id] = el;
                                }}
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(question.id, file);
                                }}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              />

                              {uploadedFiles[question.id] ? (
                                <div className="w-full border-2 rounded-xl border-[#290D55] bg-white/50 p-4">
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#290D55"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="flex-shrink-0"
                                      >
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                      </svg>
                                      <div className="min-w-0">
                                        <p className="text-[#290D55] font-medium truncate">
                                          {uploadedFiles[question.id].name}
                                        </p>
                                        <p className="text-[#290D55]/70 text-sm">
                                          {formatFileSize(
                                            uploadedFiles[question.id].size
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveFile(question.id)
                                      }
                                      className="flex-shrink-0 text-red-600 hover:text-red-700 transition-colors p-1"
                                      title="Remove file"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <line
                                          x1="18"
                                          y1="6"
                                          x2="6"
                                          y2="18"
                                        ></line>
                                        <line
                                          x1="6"
                                          y1="6"
                                          x2="18"
                                          y2="18"
                                        ></line>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    fileInputRefs.current[question.id]?.click()
                                  }
                                  className="w-full py-2 border-2 rounded-xl border-dashed border-[#290D55] hover:border-[#3e2e58] hover:bg-white/30 transition-all duration-300 ease-in-out cursor-pointer"
                                >
                                  <div className="w-full h-full py-4 flex flex-col items-center justify-center gap-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#290D55"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                      <polyline points="17 8 12 3 7 8"></polyline>
                                      <line
                                        x1="12"
                                        y1="3"
                                        x2="12"
                                        y2="15"
                                      ></line>
                                    </svg>
                                    <p className="text-[#290D55] text-sm font-normal">
                                      Click to upload your file here
                                    </p>
                                    <p className="text-[#290D55]/70 text-xs">
                                      PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                                    </p>
                                  </div>
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex items-center justify-between">
          <button
            disabled={isLoading || questions.length === 0}
            onClick={saveQuestionnaireResults}
            className="bg-[#EDE2FF91] hover:bg-[#ede2ff5f] transition-all duration-300 ease-in-out rounded-2xl text-[#290D55] text-xl py-1 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finish my questionnaire here and save my responses
          </button>
          {activeTab === "physical" && (
            <button
              onClick={moveToMentalQuestions}
              disabled={isLoading}
              className="bg-[#EDE2FF91] hover:bg-[#ede2ff5f] transition-all duration-300 ease-in-out rounded-2xl text-[#290D55] text-xl py-1 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Move to mental readiness
            </button>
          )}
          {activeTab === "mental" && (
            <button
              disabled={isLoading || questions.length === 0}
              onClick={submitQuestionnaire}
              className="bg-[#EDE2FF91] hover:bg-[#ede2ff5f] transition-all duration-300 ease-in-out rounded-2xl text-[#290D55] text-xl py-1 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calculate my readiness score
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
