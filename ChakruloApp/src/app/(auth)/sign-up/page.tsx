"use client";
import { useState, useEffect } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM_STATE: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const OAUTH_STRATEGIES = {
  GOOGLE: "oauth_google" as const,
  APPLE: "oauth_apple" as const,
};

export default function SignUpPage() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  // Redirect if user is already signed in
  useEffect(() => {
    if (userLoaded && isSignedIn) {
      router.push("/dashboard/profile");
    }
  }, [isSignedIn, userLoaded, router]);

  const updateFormField =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError("");
    };

  const validateForm = (): string | null => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.trim()) return "Email is required";
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password !== confirmPassword) return "Passwords do not match";

    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
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
      const { firstName, lastName, email, password } = formData;

      // Clerk sign up
      const result = await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        password,
      });

      if (result.status !== "complete") {
        setError("Please check your email to verify your account.");
        return;
      }

      await setActive({ session: result.createdSessionId });

      // Create user in DB
      await createUserInDatabase({
        clerk_id: result.createdUserId!,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
      });
      
      router.push("/dashboard/profile");
    } catch (err: any) {
      handleSignUpError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createUserInDatabase = async (userData: {
    clerk_id: string;
    first_name: string;
    last_name: string;
    email: string;
  }) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        console.error("Failed to create user in database");
        return null;
      }

      return await res.json();
    } catch (err) {
      console.error("Error creating user in database:", err);
      return null;
    }
  };

  const handleSignUpError = (err: any) => {
    console.error("Sign up error:", err);

    if (err?.errors?.[0]?.code === "form_identifier_exists") {
      setError(
        "An account with this email already exists. Please sign in instead."
      );
    } else if (err?.errors?.[0]?.longMessage) {
      setError(err.errors[0].longMessage);
    } else {
      setError("Sign up failed. Please try again.");
    }
  };


  const handleOAuthSignUp = async (
    strategy: (typeof OAUTH_STRATEGIES)[keyof typeof OAUTH_STRATEGIES]
  ) => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: "/dashboard/profile",
      });
    } catch (err: any) {
      console.error("OAuth error:", err);
      setError("Social sign up failed. Please try again.");
    }
  };

  const isFormDisabled = !isLoaded || isSubmitting;

  // Show loading state while checking authentication
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
    <section className="w-full min-h-screen relative flex flex-col-reverse xl:flex-row items-center justify-center gap-5 px-4 py-8 xl:py-0">
      <form
        onSubmit={handleSignUp}
        className="bg-[#FBF6FF]/40 w-full sm:w-[90%] md:w-[75%] lg:w-[65%] xl:w-[40%] max-w-[650px] px-4 sm:px-6 py-6 sm:py-8 rounded-4xl flex flex-col gap-4 sm:gap-6"
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">Sign Up</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-xs sm:text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <fieldset className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="firstName" className="font-medium text-sm sm:text-base">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={updateFormField("firstName")}
                disabled={isFormDisabled}
                className="bg-[#D9D9D9]/80 h-10 sm:h-11 rounded-lg outline-none p-2.5 sm:p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                required
              />
            </fieldset>
            <fieldset className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="lastName" className="font-medium text-sm sm:text-base">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={updateFormField("lastName")}
                disabled={isFormDisabled}
                className="bg-[#D9D9D9]/80 h-10 sm:h-11 rounded-lg outline-none p-2.5 sm:p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                required
              />
            </fieldset>
          </div>

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

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <fieldset className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="password" className="font-medium text-sm sm:text-base">
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
                  {showPassword ? <Eye size={18} className="sm:w-5 sm:h-5" /> : <EyeOff size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-1.5 sm:gap-2">
              <label htmlFor="confirmPassword" className="font-medium text-sm sm:text-base">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={updateFormField("confirmPassword")}
                  disabled={isFormDisabled}
                  className="bg-[#D9D9D9]/80 h-10 sm:h-11 rounded-lg outline-none p-2.5 sm:p-3 pr-10 sm:pr-12 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isFormDisabled}
                  className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <EyeOff size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={isFormDisabled}
            className="bg-[#3b2069] hover:bg-[#5a319f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl transition-colors font-medium text-sm sm:text-base"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <div className="flex items-center w-full">
            <div className="flex-grow border-t border-black"></div>
            <span className="px-3 sm:px-4 font-medium text-xs sm:text-sm">Or sign up with</span>
            <div className="flex-grow border-t border-black"></div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuthSignUp(OAUTH_STRATEGIES.APPLE)}
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
              onClick={() => handleOAuthSignUp(OAUTH_STRATEGIES.GOOGLE)}
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
            Already have an account?
            <Link
              href="/sign-in"
              className="text-[#3A2F0E] font-semibold ml-1 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>

      {/* Illustrations - Hidden on mobile and tablet */}
      <div className="hidden xl:flex flex-col">
        <Image
          src="/images/illustrations/Astronomy1.png"
          alt="Astronomy Illustration"
          width={371}
          height={307}
        />
        <Image
          src="/images/illustrations/Astronomy2.png"
          alt="Astronomy Illustration"
          width={290}
          height={349}
        />
      </div>
    </section>
  );
}