"use client";
import { useState, useEffect, useRef } from "react";
import { Question, QuestionnaireResponse } from "@/types/supabase/questions";
import { Submission } from "@/types/supabase/submission";
import { User } from "@/types/supabase/user";
import { useAuth } from "@clerk/nextjs";
import {
  buildGeminiPrompt,
  calculateReadinessScore,
  calculateOverallReadinessScore,
  formatRecommendations,
} from "@/utils";

type TabType = "physical" | "mental";

export default function QuestionnairePage() {
  const [activeTab, setActiveTab] = useState<TabType>("physical");
  const [physicalQuestions, setPhysicalQuestions] = useState<Question[]>([]);
  const [mentalQuestions, setMentalQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>(
    {}
  );
  const [expandedQuestions, setExpandedQuestions] = useState<{
    [key: string]: boolean;
  }>({});
  const [importantNotePopup, setImportantNotePopup] = useState<boolean>(true);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [userId, setUserId] = useState<string>("");
  const { userId: clerkId } = useAuth();

  // Store responses for each tab
  const [physicalResponses, setPhysicalResponses] = useState<
    QuestionnaireResponse[]
  >([]);
  const [mentalResponses, setMentalResponses] = useState<
    QuestionnaireResponse[]
  >([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});

  const [toggleLearnMore, setToggleLearnMore] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggleLearnMoreVoid = () => {
    setToggleLearnMore((prev) => !prev);
  };

  useEffect(() => {
    if (!clerkId) return;

    const getUser = async () => {
      try {
        const response = await fetch(`/api/users/${clerkId}`);
        const user: User = (await response.json()) as User;
        setUserId(user.id);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    getUser();
  }, [clerkId]);

  useEffect(() => {
    if (!userId) return;

    const awaitForSubmission = async () => {
      try {
        const result = await getOrCreateSubmission(userId);
        setSubmission(result);
      } catch (err) {
        console.error("Error in getOrCreateSubmission:", err);
      }
    };

    awaitForSubmission();
  }, [userId]);

  // Load saved responses when submission is available
  useEffect(() => {
    if (
      !submission ||
      !submission.responses ||
      submission.responses.length === 0
    )
      return;

    const loadSavedResponses = async () => {
      try {
        // Separate responses by question type
        const physicalResponses: QuestionnaireResponse[] = [];
        const mentalResponses: QuestionnaireResponse[] = [];
        const newSelectedAnswers: { [key: string]: string } = {};
        const newUploadedFiles: { [key: string]: File } = {};

        // Process responses and load files
        for (const response of submission.responses) {
          let uploadedFile: File | undefined = undefined;

          // Load file if URL exists
          if (response.uploaded_file_url) {
            const file = await loadFileFromUrl(
              response.uploaded_file_url,
              response.question_id
            );
            if (file) {
              uploadedFile = file;
              newUploadedFiles[response.question_id] = file;
            }
          }

          const questionnaireResponse: QuestionnaireResponse = {
            questionId: response.question_id,
            questionText: response.question_text,
            selectedOptionId: response.response_option_id,
            selectedOptionText: response.response_option_text,
            selectedOptionValue: parseFloat(response.response_option_value),
            uploadedFile,
          };

          // Determine if it's physical or mental based on question type
          if (
            response.question_type ===
            "💪 Physical Health & Functional Capacity"
          ) {
            physicalResponses.push(questionnaireResponse);
          } else if (
            response.question_type === "🧠 Mental Health & Cognitive Readiness"
          ) {
            mentalResponses.push(questionnaireResponse);
          }

          // Set selected answers for radio buttons
          newSelectedAnswers[response.question_id] =
            response.response_option_id;
        }

        // Update state with loaded responses
        setPhysicalResponses(physicalResponses);
        setMentalResponses(mentalResponses);
        setSelectedAnswers(newSelectedAnswers);
        setUploadedFiles(newUploadedFiles);

        console.log("Loaded saved responses:", {
          physical: physicalResponses.length,
          mental: mentalResponses.length,
          total: submission.responses.length,
          files: Object.keys(newUploadedFiles).length,
        });
      } catch (error) {
        console.error("Error loading saved responses:", error);
      } finally {
        // Turn off loading after all saved responses are processed (or failed)
        setIsLoading(false);
      }
    };

    loadSavedResponses();
  }, [submission]);

  useEffect(() => {
    if (toggleLearnMore && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [toggleLearnMore]);

  // Fetch both physical and mental questions on mount
  useEffect(() => {
    const getAllQuestions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [physicalRes, mentalRes] = await Promise.all([
          fetch("/api/questions/physical"),
          fetch("/api/questions/mental"),
        ]);

        if (!physicalRes.ok || !mentalRes.ok) {
          throw new Error("Failed to fetch questions");
        }

        const physicalData: Question[] = await physicalRes.json();
        const mentalData: Question[] = await mentalRes.json();

        setPhysicalQuestions(physicalData);
        setMentalQuestions(mentalData);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Please try again.");
        setIsLoading(false);
      }
    };

    getAllQuestions();
  }, []);

  // Turn off loading only after questions are loaded and saved responses are processed
  useEffect(() => {
    if (
      physicalQuestions.length > 0 &&
      mentalQuestions.length > 0 &&
      submission
    ) {
      // If there are no saved responses, turn off loading immediately
      if (!submission.responses || submission.responses.length === 0) {
        setIsLoading(false);
      }
      // If there are saved responses, loading will be turned off in the loadSavedResponses function
    }
  }, [physicalQuestions, mentalQuestions, submission]);

  // Get current questions based on active tab
  const currentQuestions =
    activeTab === "physical" ? physicalQuestions : mentalQuestions;

  const getOrCreateSubmission = async (userId: string): Promise<Submission> => {
    if (!userId) throw new Error("userId is required");

    // First, try to get existing in-progress submission
    const res = await fetch(`/api/submissions/${userId}`);
    if (res.ok) return await res.json();
    
    // If no in-progress submission exists (404), create a new one
    if (res.status === 404) {
      const createRes = await fetch(`/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!createRes.ok) {
        const error = await createRes.json();
        throw new Error(error.error || "Failed to create submission");
      }

      return await createRes.json();
    }

    // Handle other errors
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch submission");
  };

  const buildGeminiPromptFromResponses = (
    category: "physical" | "mental"
  ): string => {
    const responses =
      category === "physical" ? physicalResponses : mentalResponses;
    const questions =
      category === "physical" ? physicalQuestions : mentalQuestions;

    if (responses.length === 0) {
      throw new Error(`No ${category} responses available`);
    }

    const simplifiedQuestions = responses.map((response) => {
      const question = questions.find((q) => q.id === response.questionId);
      return {
        domain: question?.domain || "Unknown",
        question: response.questionText,
        answer: response.selectedOptionText,
        score: response.selectedOptionValue,
      };
    });

    return buildGeminiPrompt(category, simplifiedQuestions);
  };

  const handleAnswerChange = (
    questionId: string,
    questionText: string,
    optionId: string,
    optionText: string,
    optionValue: number
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    const response: QuestionnaireResponse = {
      questionId,
      questionText,
      selectedOptionId: optionId,
      selectedOptionText: optionText,
      selectedOptionValue: optionValue,
      uploadedFile: uploadedFiles[questionId],
    };

    if (activeTab === "physical") {
      setPhysicalResponses((prev) => {
        const filtered = prev.filter((r) => r.questionId !== questionId);
        return [...filtered, response];
      });
    } else {
      setMentalResponses((prev) => {
        const filtered = prev.filter((r) => r.questionId !== questionId);
        return [...filtered, response];
      });
    }
  };

  const handleFileUpload = (questionId: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    }

    setUploadedFiles((prev) => ({
      ...prev,
      [questionId]: file,
    }));

    // Update the response with file info
    const currentResponses =
      activeTab === "physical" ? physicalResponses : mentalResponses;
    const existingResponse = currentResponses.find(
      (r) => r.questionId === questionId
    );

    if (existingResponse) {
      const updatedResponse = {
        ...existingResponse,
        uploadedFile: file,
      };

      if (activeTab === "physical") {
        setPhysicalResponses((prev) =>
          prev.map((r) => (r.questionId === questionId ? updatedResponse : r))
        );
      } else {
        setMentalResponses((prev) =>
          prev.map((r) => (r.questionId === questionId ? updatedResponse : r))
        );
      }
    }
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

    // Remove file info from response
    const updateResponses = (responses: QuestionnaireResponse[]) =>
      responses.map((r) => {
        if (r.questionId === questionId) {
          const { uploadedFile, ...rest } = r;
          return rest;
        }
        return r;
      });

    if (activeTab === "physical") {
      setPhysicalResponses(updateResponses);
    } else {
      setMentalResponses(updateResponses);
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

  const saveQuestionnaireResults = async () => {
    if (!submission) {
      alert("No submission found. Please try again.");
      return;
    }

    try {
      setIsSaving(true);

      // Save all responses (both physical and mental)
      const allResponses = [...physicalResponses, ...mentalResponses];

      for (const response of allResponses) {
        // First, handle file upload if there's an uploaded file
        let uploadedFileUrl: string | null = null;

        if (response.uploadedFile) {
          const formData = new FormData();
          formData.append("submission_id", submission.id);
          formData.append("question_id", response.questionId);
          formData.append("response_option_id", response.selectedOptionId);
          formData.append("uploaded_file", response.uploadedFile);

          const uploadResponse = await fetch(
            "/api/submissions/responses/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            uploadedFileUrl = uploadResult.uploadedFileUrl;
          } else {
            console.error(
              "Failed to upload file for question:",
              response.questionId
            );
          }
        }

        // Save the response
        const responseData = {
          submission_id: submission.id,
          question_id: response.questionId,
          response_option_id: response.selectedOptionId,
          uploaded_file_url: uploadedFileUrl,
        };

        const saveResponse = await fetch("/api/submissions/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(responseData),
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          throw new Error(errorData.error || "Failed to save response");
        }
      }

      alert(
        `Questionnaire saved successfully!\n\nPhysical: ${
          physicalResponses.length
        } responses\nMental: ${mentalResponses.length} responses\nFiles: ${
          Object.keys(uploadedFiles).length
        }`
      );
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      alert(
        `Failed to save questionnaire: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const saveResponsesSilently = async (): Promise<void> => {
    if (!submission) {
      throw new Error("No submission found. Please try again.");
    }

    // Save all responses (both physical and mental)
    const allResponses = [...physicalResponses, ...mentalResponses];

    for (const response of allResponses) {
      // First, handle file upload if there's an uploaded file
      let uploadedFileUrl: string | null = null;

      if (response.uploadedFile) {
        const formData = new FormData();
        formData.append("submission_id", submission.id);
        formData.append("question_id", response.questionId);
        formData.append("response_option_id", response.selectedOptionId);
        formData.append("uploaded_file", response.uploadedFile);

        const uploadResponse = await fetch(
          "/api/submissions/responses/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          uploadedFileUrl = uploadResult.uploadedFileUrl;
        } else {
          console.error(
            "Failed to upload file for question:",
            response.questionId
          );
        }
      }

      // Save the response
      const responseData = {
        submission_id: submission.id,
        question_id: response.questionId,
        response_option_id: response.selectedOptionId,
        uploaded_file_url: uploadedFileUrl,
      };

      const saveResponse = await fetch("/api/submissions/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(responseData),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || "Failed to save response");
      }
    }
  };

  const moveToMentalQuestions = () => {
    setActiveTab("mental");
  };

  const submitQuestionnaire = async () => {
    const totalResponses = physicalResponses.length + mentalResponses.length;

    if (totalResponses === 0) {
      alert("Please answer at least one question before submitting.");
      return;
    }

    if (!submission) {
      alert("No submission found. Please try again.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Save all responses silently (without user alerts)
      await saveResponsesSilently();

      // Generate AI recommendations and scores using Gemini
      let physicalRecommendations: string[] = [];
      let mentalRecommendations: string[] = [];
      let physicalScore = 0;
      let mentalScore = 0;

      try {
        // Generate physical health recommendations
        if (physicalResponses.length > 0) {
          const physicalPrompt = buildGeminiPromptFromResponses("physical");
          const physicalResponse = await fetch("/api/gemini", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: physicalPrompt }),
          });

          if (physicalResponse.ok) {
            const physicalData = await physicalResponse.json();
            physicalRecommendations = formatRecommendations(physicalData.text);
            physicalScore = calculateReadinessScore(
              "physical",
              physicalResponses
            );
          }
        }

        // Generate mental health recommendations
        if (mentalResponses.length > 0) {
          const mentalPrompt = buildGeminiPromptFromResponses("mental");
          const mentalResponse = await fetch("/api/gemini", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: mentalPrompt }),
          });

          if (mentalResponse.ok) {
            const mentalData = await mentalResponse.json();
            mentalRecommendations = formatRecommendations(mentalData.text);
            mentalScore = calculateReadinessScore("mental", mentalResponses);
          }
        }
      } catch (aiError) {
        console.error("Error generating AI recommendations:", aiError);
        // Fallback to simple calculation if AI fails
        physicalScore = calculateReadinessScore("physical", physicalResponses);
        mentalScore = calculateReadinessScore("mental", mentalResponses);
        physicalRecommendations = [
          "Please consult with a healthcare professional for personalized recommendations.",
        ];
        mentalRecommendations = [
          "Please consult with a mental health professional for personalized recommendations.",
        ];
      }

      // Calculate overall readiness score
      const overallScore = calculateOverallReadinessScore(
        physicalScore,
        mentalScore
      );

      // Update submission with scores and recommendations
      const updateData = {
        completed_at: new Date().toISOString(),
        status: "completed" as const,
        physical_health_score: physicalScore,
        mental_health_score: mentalScore,
        overall_readiness_score: overallScore,
        physical_health_recommendations: physicalRecommendations,
        mental_health_recommendations: mentalRecommendations,
      };

      const updateResponse = await fetch(`/api/submissions/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update submission");
      }

      alert(
        `Questionnaire submitted successfully!\nYou can now view your readiness score and recommendations.`
      );

      // Redirect to readiness score page
      window.location.href = "/dashboard/readiness-score";
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      alert(
        `Failed to submit questionnaire: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadFileFromUrl = async (
    url: string,
    questionId: string
  ): Promise<File | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;

      const blob = await response.blob();
      const fileName = url.split("/").pop() || `file_${questionId}`;

      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error("Error loading file:", error);
      return null;
    }
  };

  if (importantNotePopup) {
    return (
      <section className="w-full h-full flex items-center justify-center pt-20 questionnaire-layout layout">
        <div className="bg-[#e0dae990] w-full max-w-5xl h-full max-h-[80dvh] rounded-4xl p-8 grid grid-rows-[1fr_auto] gap-6">
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
                It's based on NASA's astronaut health and bioscience studies,
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
      <div className="bg-[rgba(158,154,161,0.54)] w-full max-w-6xl h-[80dvh] rounded-3xl py-6 px-8 grid grid-rows-[auto_1fr_auto] gap-4">
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
                onClick={() => window.location.reload()}
                className="bg-[#290D55] hover:bg-[#3e2e58] transition-all duration-300 ease-in-out rounded-2xl text-white text-base py-2 px-6"
              >
                Retry
              </button>
            </div>
          ) : currentQuestions.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <p className="text-[#290D55] text-lg text-center">
                No questions available for this category.
              </p>
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto scroll-bar">
              <div className="flex flex-col gap-4">
                {currentQuestions.map((question) => (
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
                            checked={selectedAnswers[question.id] === option.id}
                            onChange={() =>
                              handleAnswerChange(
                                question.id,
                                question.question_text,
                                option.id,
                                option.option_text,
                                option.option_value
                              )
                            }
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
            disabled={
              isLoading ||
              isSaving ||
              isSubmitting ||
              (physicalQuestions.length === 0 && mentalQuestions.length === 0)
            }
            onClick={saveQuestionnaireResults}
            className="bg-[#EDE2FF91] hover:bg-[#ede2ff5f] transition-all duration-300 ease-in-out rounded-2xl text-[#290D55] text-xl py-1 px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving && (
              <div className="w-5 h-5 border-2 border-[#290D55] border-t-transparent rounded-full animate-spin"></div>
            )}
            Finish my questionnaire here and save my responses
          </button>
          {activeTab === "physical" && (
            <button
              onClick={moveToMentalQuestions}
              disabled={isLoading || isSaving || isSubmitting}
              className="bg-[#EDE2FF91] hover:bg-[#ede2ff5f] transition-all duration-300 ease-in-out rounded-2xl text-[#290D55] text-xl py-1 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Move to mental readiness
            </button>
          )}
          {activeTab === "mental" && (
            <button
              disabled={
                isLoading ||
                isSaving ||
                isSubmitting ||
                (physicalQuestions.length === 0 && mentalQuestions.length === 0)
              }
              onClick={submitQuestionnaire}
              className="bg-[#EDE2FF91] hover:bg-[#ede2ff5f] transition-all duration-300 ease-in-out rounded-2xl text-[#290D55] text-xl py-1 px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <div className="w-5 h-5 border-2 border-[#290D55] border-t-transparent rounded-full animate-spin"></div>
              )}
              Calculate my readiness score
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
