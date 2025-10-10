"use client";
import { Submission } from "@/types/supabase/submission";
import { User } from "@/types/supabase/user";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

export default function ReadinessScorePage() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const { userId: clerkId } = useAuth();

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
        setIsLoading(true);
        const result = await getSubmission(userId);
        setSubmission(result);
      } catch (err) {
        console.error("Error in getSubmission:", err);
      } finally {
        setIsLoading(false);
      }
    };

    awaitForSubmission();
  }, [userId]);

  const getSubmission = async (userId: string): Promise<Submission | null> => {
    if (!userId) throw new Error("userId is required");

    try {
      const res = await fetch(`/api/submissions/${userId}`);
      if (res.ok) return await res.json();

      if (res.status === 404) {
        return null; // No submission found
      }

      // Unexpected error
      const err = await res.json();
      throw new Error(err.error || "Failed to fetch submission");
    } catch (err) {
      console.error("getSubmission error:", err);
      throw err;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center pt-9 gap-8 readiness-score-layout layout">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-28 h-28 border-6 border-[#201161] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#201161] text-2xl text-center">
            Loading the result of your questionnaire submission...
          </p>
        </div>
      </section>
    );
  }

  // No submission found
  if (!submission) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center pt-9 gap-8 readiness-score-layout layout">
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <h2 className="text-[#201161] text-5xl">No Submission Found</h2>
          <p className="text-[#201161] text-2xl">
            Please complete the questionnaire first to see your readiness score.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex flex-col items-center justify-center pt-9 gap-8 readiness-score-layout layout">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h2 className="text-[#201161] text-5xl">Overall Readiness Score</h2>
        <p className="text-[#201161] text-3xl">
          {submission.overall_readiness_score}/100
        </p>
        <div className="w-full max-w-6xl h-[56px] p-2 bg-white border-[6px] border-[#290D55] rounded-4xl relative">
          <div
            className="h-full bg-[#59427E] rounded-2xl"
            style={{ width: `${submission.overall_readiness_score}%` }}
          ></div>
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: `calc(${submission.overall_readiness_score}% - 40px)`,
            }} // 40px = half of rocket width to center
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
            <p className="text-[#1A123B] text-7xl">
              {submission.physical_health_score}
            </p>
            <div>
              <h3 className="font-semibold mb-2">
                Recommendations from Chakrulo AI
              </h3>
              <ul className="list-disc text-left space-y-2 px-6">
                {submission.physical_health_recommendations.map(
                  (recommendation) => (
                    <li key={recommendation}>{recommendation}</li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Mental Score */}
          <div className="w-full max-w-xl flex flex-col items-center justify-center gap-3 text-center">
            <h2 className="text-[#1A123B] text-2xl">Mental Score</h2>
            <p className="text-[#1A123B] text-7xl">
              {submission.mental_health_score}
            </p>
            <div>
              <h3 className="font-semibold mb-2">
                Recommendations from Chakrulo AI
              </h3>
              <ul className="list-disc text-left space-y-2 px-6">
                {submission.mental_health_recommendations.map(
                  (recommendation) => (
                    <li key={recommendation}>{recommendation}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
