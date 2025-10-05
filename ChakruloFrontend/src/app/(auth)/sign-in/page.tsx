"use client";
import { useState, useEffect } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const INITIAL_FORM_STATE: SignInFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

const OAUTH_STRATEGIES = {
  GOOGLE: "oauth_google" as const,
  APPLE: "oauth_apple" as const,
};

export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  const [formData, setFormData] = useState<SignInFormData>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (userLoaded && isSignedIn) {
      router.push("/dashboard/profile");
    }
  }, [isSignedIn, userLoaded, router]);

  // Handle error parameters from URL (e.g., from failed OAuth)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const errorDetails = searchParams.get("details");

    console.log("Sign-in page URL params:", {
      error: errorParam,
      details: errorDetails,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    if (errorParam === "sso_failed") {
      let errorMessage =
        "Social sign-in failed. Please try again or use email/password.";

      if (errorDetails) {
        errorMessage += ` Details: ${decodeURIComponent(errorDetails)}`;
      }

      setError(errorMessage);
    }
  }, [searchParams]);

  const updateFormField =
    (field: keyof SignInFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === "rememberMe" ? e.target.checked : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (error) setError("");
    };

  const validateForm = (): string | null => {
    const { email, password } = formData;

    if (!email.trim()) return "Email is required";
    if (!password) return "Password is required";

    return null;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || isSubmitting) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { email, password } = formData;

      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard/profile");
      } else if (result.status === "needs_first_factor") {
        // Handle MFA if enabled
        setError(
          "Two-factor authentication required. Please check your device."
        );
      } else if (result.status === "needs_identifier") {
        setError("Please verify your email address.");
      } else {
        setError("Sign-in incomplete. Please try again.");
      }
    } catch (err: any) {
      let errorMessage = "Sign-in failed. Please try again.";

      if (err?.errors?.[0]?.code === "form_identifier_not_found") {
        errorMessage = "No account found with this email address.";
      } else if (err?.errors?.[0]?.code === "form_password_incorrect") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err?.errors?.[0]?.longMessage) {
        errorMessage = err.errors[0].longMessage;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthSignIn = async (
    strategy: (typeof OAUTH_STRATEGIES)[keyof typeof OAUTH_STRATEGIES]
  ) => {
    if (!isLoaded || !signIn) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: "/dashboard/profile",
      });
    } catch (err: any) {
      console.error("OAuth sign-in error:", err);

      let errorMessage = "OAuth sign-in failed. Please try again.";

      if (err?.errors?.[0]?.longMessage) {
        errorMessage = err.errors[0].longMessage;
      }

      setError(errorMessage);
    }
  };

  const isFormDisabled = !isLoaded || isSubmitting;

  if (!userLoaded) {
    return (
      <section className="w-full h-full relative flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  // Don't render the form if user is signed in (redirect will happen)
  if (isSignedIn) {
    return null;
  }

  return (
    <section className="w-full min-h-screen relative flex items-center justify-center gap-5 px-4 py-8 md:py-0">
      {/* Illustration - Hidden on mobile and tablet */}
      <div className="hidden xl:flex flex-col relative w-[500px] h-[500px]">
        <Image
          src="/images/illustrations/Astronomy3.png"
          alt="Astronomy Illustration"
          fill
        />
      </div>

      <form
        onSubmit={handleSignIn}
        className="bg-[#FBF6FF]/40 w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[35%] max-w-[600px] px-4 sm:px-6 py-6 sm:py-8 rounded-4xl flex flex-col gap-4 sm:gap-6"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
          Sign In
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-xs sm:text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:gap-3">
          <fieldset className="flex flex-col gap-1.5 sm:gap-2">
            <label htmlFor="email" className="font-medium text-sm sm:text-base">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={updateFormField("email")}
              disabled={isFormDisabled}
              className="bg-[#D9D9D9]/80 h-10 sm:h-11 rounded-lg outline-none p-2.5 sm:p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              required
            />
          </fieldset>

          <fieldset className="flex flex-col gap-1.5 sm:gap-2">
            <label
              htmlFor="password"
              className="font-medium text-sm sm:text-base"
            >
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={updateFormField("password")}
                disabled={isFormDisabled}
                className="bg-[#D9D9D9]/80 h-10 sm:h-11 rounded-lg outline-none p-2.5 sm:p-3 pr-10 sm:pr-12 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full text-sm sm:text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isFormDisabled}
                className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <EyeOff size={18} className="sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </fieldset>

          {/* Remember me checkbox and forgot password link */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-1 sm:mt-2">
            <fieldset className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={updateFormField("rememberMe")}
                disabled={isFormDisabled}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3b2069] bg-gray-100 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label
                htmlFor="rememberMe"
                className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
              >
                Remember me
              </label>
            </fieldset>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={isFormDisabled}
            className="bg-[#3b2069] hover:bg-[#5a319f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl transition-colors font-medium text-sm sm:text-base"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex items-center w-full">
            <div className="flex-grow border-t border-black" />
            <span className="px-3 sm:px-4 font-medium text-xs sm:text-sm">
              Or continue with
            </span>
            <div className="flex-grow border-t border-black" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuthSignIn(OAUTH_STRATEGIES.APPLE)}
              disabled={!isLoaded}
              className="w-full bg-[#D7BEE1]/62 hover:bg-[#D7BEE1] disabled:opacity-50 disabled:cursor-not-allowed p-2.5 sm:p-3 rounded-4xl flex items-center justify-center gap-2 sm:gap-3 transition-colors text-sm sm:text-base"
            >
              <Image
                src="/images/logos/apple.png"
                width={20}
                height={20}
                alt="Apple Logo"
                className="sm:w-6 sm:h-6"
              />
              Apple
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn(OAUTH_STRATEGIES.GOOGLE)}
              disabled={!isLoaded}
              className="w-full bg-[#D7BEE1]/62 hover:bg-[#D7BEE1] disabled:opacity-50 disabled:cursor-not-allowed p-2.5 sm:p-3 rounded-4xl flex items-center justify-center gap-2 sm:gap-3 transition-colors text-sm sm:text-base"
            >
              <Image
                src="/images/logos/google.png"
                width={20}
                height={20}
                alt="Google Logo"
                className="sm:w-6 sm:h-6"
              />
              Google
            </button>
          </div>

          <p className="text-center text-black text-xs sm:text-sm md:text-base">
            Don&apos;t have an account?
            <Link
              href="/sign-up"
              className="text-[#3A2F0E] font-semibold ml-1 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
