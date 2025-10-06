"use client";
import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const { isSignedIn, isLoaded, user } = useUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!isLoaded) return;

        // Already signed in → redirect
        if (isSignedIn) {
          await ensureUserInDatabase(user);
          router.push("/dashboard/profile");
          return;
        }

        // Validate OAuth params
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        if (!code && !state)
          throw new Error("Missing required OAuth parameters");

        // Exchange code with Clerk
        const urlParams = Object.fromEntries(searchParams.entries());
        await handleRedirectCallback({
          redirectUrl: window.location.href,
          ...urlParams,
        });

        // After callback, Clerk user is available
        if (user) {
          await ensureUserInDatabase(user);
        }

        router.push("/dashboard/profile");
      } catch (error: any) {
        console.error("SSO callback error:", error);
        handleErrorRedirect(error);
      } finally {
        setIsProcessing(false);
      }
    };

    // Timeout to avoid infinite spinner
    const timeout = setTimeout(() => {
      if (isProcessing) {
        console.error("SSO callback timeout");
        router.push("/sign-in?error=sso_timeout");
      }
    }, 15000);

    handleCallback();
    return () => clearTimeout(timeout);
  }, [
    handleRedirectCallback,
    router,
    searchParams,
    isLoaded,
    isSignedIn,
    isProcessing,
    user,
  ]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3b2069] mx-auto mb-4"></div>
        <p className="text-black text-2xl font-medium mb-2">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}

async function ensureUserInDatabase(clerkUser: any) {
  try {
    // Try creating user in DB
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_id: clerkUser.id,
        first_name: clerkUser.firstName || "",
        last_name: clerkUser.lastName || "",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
      }),
    });

    // If user already exists, backend can just return existing user
    if (!res.ok) {
      console.error("Failed to create/find user in database");
      return null;
    }

    const user = await res.json();

    // Ensure AI conversation exists
    await createAIConversation(user.id);

    return user;
  } catch (err) {
    console.error("Error ensuring user in database:", err);
    return null;
  }
}

async function createAIConversation(userId: string) {
  try {
    const res = await fetch("/api/conversations/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "ai", user_id: userId }),
    });

    if (!res.ok) {
      console.error("Failed to create AI conversation");
    }
  } catch (err) {
    console.error("Error creating AI conversation:", err);
  }
}

function handleErrorRedirect(error: any) {
  let errorMessage = "Authentication failed";
  let errorDetails = error?.message || "Unknown error occurred";

  if (error?.message?.includes("OAuth")) {
    errorMessage = "OAuth authentication failed";
  } else if (error?.message?.includes("token")) {
    errorMessage = "Invalid authentication token";
  } else if (error?.message?.includes("expired")) {
    errorMessage = "Authentication session expired";
  }

  const errorParams = new URLSearchParams({
    error: "sso_failed",
    message: errorMessage,
    details: errorDetails,
  });

  window.location.href = `/sign-in?${errorParams.toString()}`;
}
