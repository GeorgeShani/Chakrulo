"use client";
import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const { isSignedIn, isLoaded, user } = useUser();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const processOAuth = async () => {
      // Prevent multiple executions
      if (processing || !isLoaded) return;

      setProcessing(true);

      try {
        console.log("Processing OAuth callback...");

        // Complete the OAuth flow without automatic redirect
        await handleRedirectCallback({
          signInFallbackRedirectUrl: null, // Prevent automatic redirect
          signUpFallbackRedirectUrl: null,
          signInForceRedirectUrl: null,
          signUpForceRedirectUrl: null
        });

        console.log("OAuth callback completed");

        // Wait a bit for Clerk to update state
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error("OAuth callback error:", error);
        setError(error?.message || "Authentication failed");

        setTimeout(() => {
          router.push(
            `/sign-in?error=sso_failed&details=${encodeURIComponent(
              error?.message || "Unknown error"
            )}`
          );
        }, 2000);
      }
    };

    processOAuth();
  }, [isLoaded, processing, handleRedirectCallback]);

  // Wait for user to be available after OAuth completes
  useEffect(() => {
    const createUserAndRedirect = async () => {
      // Only proceed when everything is ready
      if (!isLoaded || !isSignedIn || !user || error) {
        return;
      }

      // Ensure user has required data
      if (!user.id || !user.primaryEmailAddress?.emailAddress) {
        console.log("User data not fully loaded yet...");
        return;
      }

      console.log("User is signed in! Creating database record...", {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      });

      try {
        await ensureUserInDatabase(user);
        console.log("User record created successfully, redirecting...");

        // Redirect to dashboard
        router.push("/dashboard/profile");
      } catch (err: any) {
        console.error("Failed to create user record:", err);
        setError("Failed to create user account");

        setTimeout(() => {
          router.push(
            `/sign-in?error=db_error&details=${encodeURIComponent(
              err?.message || "Failed to create user record"
            )}`
          );
        }, 2000);
      }
    };

    createUserAndRedirect();
  }, [isLoaded, isSignedIn, user, error, router]);

  // Timeout protection
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!error && !isSignedIn) {
        console.error("Authentication timeout");
        setError("Authentication took too long");
        router.push("/sign-in?error=timeout&details=Please try again");
      }
    }, 20000);

    return () => clearTimeout(timeout);
  }, [error, isSignedIn, router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <p className="text-red-600 text-lg font-medium mb-2">
            Authentication Error
          </p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <p className="text-gray-500 text-xs mb-4">
            Redirecting to sign-in page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#3b2069] mx-auto mb-4"></div>
        <p className="text-black text-2xl font-medium mb-2">
          {!isSignedIn
            ? "Authenticating..."
            : !user
            ? "Loading your account..."
            : "Setting up your account..."}
        </p>
        <p className="text-gray-600 text-sm">
          Please wait, this may take a moment
        </p>
      </div>
    </div>
  );
}

async function ensureUserInDatabase(clerkUser: any) {
  console.log("Ensuring user in database:", {
    clerkId: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
  });

  try {
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

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API response error:", errorText);

      // Check if user already exists
      if (
        res.status === 409 ||
        errorText.includes("already exists") ||
        errorText.includes("duplicate")
      ) {
        console.log("User already exists in database - this is OK");

        // Fetch existing user data
        const getUserRes = await fetch(`/api/users?clerk_id=${clerkUser.id}`);
        if (getUserRes.ok) {
          const existingUser = await getUserRes.json();
          console.log("Retrieved existing user:", existingUser.id);
          return existingUser;
        }

        return null;
      }

      throw new Error(`Failed to create user: ${errorText}`);
    }

    const user = await res.json();
    console.log("User created/found in database:", user.id);

    return user;
  } catch (err) {
    console.error("Error ensuring user in database:", err);
    throw err;
  }
}
