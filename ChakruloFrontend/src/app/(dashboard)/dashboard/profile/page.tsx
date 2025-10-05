"use client";
import type { Country } from "@/types/country";
import type { User } from "@/types/supabase/user";
import { SignOutButton } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCountries } from "@/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

type FormData = {
  firstName: string;
  lastName: string;
  weight: string;
  weightUnit: string;
  height: string;
  heightUnit: string;
  averageSleepTime: string;
  dateOfBirth: string;
  biologicalSex: string;
  country: Country | null;
  gender: string | null;
  profileImageFile: File | null;
  profileImageUrl: string | null;
  profileImagePreview: string | null;
};

export default function ProfilePage() {
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Keyboard navigation states
  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(-1);
  const [highlightedGenderIndex, setHighlightedGenderIndex] = useState(-1);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    weight: "",
    weightUnit: "",
    height: "",
    heightUnit: "",
    averageSleepTime: "",
    dateOfBirth: "",
    biologicalSex: "",
    country: null,
    gender: null,
    profileImageFile: null,
    profileImageUrl: null,
    profileImagePreview: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const countryListRef = useRef<HTMLUListElement>(null);
  const genderListRef = useRef<HTMLUListElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);

  const genders: string[] = [
    "Male",
    "Female",
    "Non-Binary",
    "Transgender",
    "Other",
    "Prefer Not to Say",
  ];

  const { userId: clerkId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!clerkId) return;

    const getUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${clerkId}`);
        const user: User = await response.json();
        setIsLoading(false);
        const matchedCountry =
          countries.find(
            (c) => c.name.common.toLowerCase() === user.country?.toLowerCase()
          ) || null;

        setFormData({
          firstName: user.first_name,
          lastName: user.last_name,
          weight: user.weight?.toString() || "",
          weightUnit: user.weight_unit || "",
          height: user.height?.toString() || "",
          heightUnit: user.height_unit || "",
          averageSleepTime: user.sleep_time?.toString() || "",
          dateOfBirth: user.birth_date?.toString() || "",
          biologicalSex: user.biological_sex || "",
          country: matchedCountry || null,
          gender: user.gender || null,
          profileImageUrl: user.profile_picture_url || null,
          profileImagePreview: null,
          profileImageFile: null,
        });

        setSelectedCountry(matchedCountry);
        if (user.gender) setSelectedGender(user.gender);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [clerkId, countries]);

  useEffect(() => {
    const getAllCountries = async () => {
      try {
        const allCountries = await getCountries();
        setCountries(allCountries);
      } catch (err) {
        console.error((err as Error).message);
      }
    };

    getAllCountries();
  }, []);

  // Reset highlighted index when dropdown opens
  useEffect(() => {
    if (showCountryDropdown) {
      setHighlightedCountryIndex(-1);
      setTimeout(() => countrySearchRef.current?.focus(), 0);
    }
  }, [showCountryDropdown]);

  useEffect(() => {
    if (showGenderDropdown) {
      setHighlightedGenderIndex(-1);
    }
  }, [showGenderDropdown]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedCountryIndex >= 0 && countryListRef.current) {
      const items = countryListRef.current.querySelectorAll("li");
      items[highlightedCountryIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedCountryIndex]);

  useEffect(() => {
    if (highlightedGenderIndex >= 0 && genderListRef.current) {
      const items = genderListRef.current.querySelectorAll("li");
      items[highlightedGenderIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedGenderIndex]);

  // Unit conversion functions
  const kgToLb = (kg: number): number => kg * 2.20462;
  const lbToKg = (lb: number): number => lb / 2.20462;
  const cmToFt = (cm: number): number => cm / 30.48;
  const ftToCm = (ft: number): number => ft * 30.48;

  const handleWeightUnitToggle = () => {
    if (formData.weight) {
      const currentWeight = parseFloat(formData.weight);
      if (!isNaN(currentWeight)) {
        const convertedWeight =
          weightUnit === "kg" ? kgToLb(currentWeight) : lbToKg(currentWeight);
        setFormData((prev) => ({
          ...prev,
          weight: convertedWeight.toFixed(1),
          weightUnit,
        }));
      }
    }
    setWeightUnit((prev) => (prev === "kg" ? "lb" : "kg"));
  };

  const handleHeightUnitToggle = () => {
    if (formData.height) {
      const currentHeight = parseFloat(formData.height);
      if (!isNaN(currentHeight)) {
        const convertedHeight =
          heightUnit === "cm" ? cmToFt(currentHeight) : ftToCm(currentHeight);
        setFormData((prev) => ({
          ...prev,
          height: convertedHeight.toFixed(1),
          heightUnit,
        }));
      }
    }
    setHeightUnit((prev) => (prev === "cm" ? "ft" : "cm"));
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setFormData((prev) => ({ ...prev, country }));
    setShowCountryDropdown(false);
    setSearchQuery("");
    setHighlightedCountryIndex(-1);
  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setFormData((prev) => ({ ...prev, gender }));
    setShowGenderDropdown(false);
    setHighlightedGenderIndex(-1);
  };

  // Keyboard navigation for country dropdown
  const handleCountryKeyDown = (e: React.KeyboardEvent) => {
    const filteredList = filteredCountries;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedCountryIndex((prev) =>
        prev < filteredList.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedCountryIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && highlightedCountryIndex >= 0) {
      e.preventDefault();
      handleCountrySelect(filteredList[highlightedCountryIndex]);
    } else if (e.key === "Escape") {
      setShowCountryDropdown(false);
      setSearchQuery("");
    }
  };

  // Keyboard navigation for gender dropdown
  const handleGenderKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedGenderIndex((prev) =>
        prev < genders.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedGenderIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && highlightedGenderIndex >= 0) {
      e.preventDefault();
      handleGenderSelect(genders[highlightedGenderIndex]);
    } else if (e.key === "Escape") {
      setShowGenderDropdown(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImagePreview(imageUrl);
        setFormData((prev) => ({
          ...prev,
          profileImageFile: file,
          profileImagePreview: imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;

    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        biologicalSex: id.charAt(0).toUpperCase() + id.slice(1),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("Please enter your first and last name");
      return;
    }

    if (!formData.dateOfBirth) {
      alert("Please select your date of birth");
      return;
    }

    if (!formData.biologicalSex) {
      alert("Please select your biological sex");
      return;
    }

    setIsSaving(true);

    try {
      let profileImageUrl = formData.profileImagePreview;

      if (formData.profileImageFile) {
        // Upload new profile image if selected
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.profileImageFile);
        uploadFormData.append("bucket", "chakrulo-storage-bucket");
        uploadFormData.append(
          "path",
          `profile-pictures/${clerkId}/${formData.profileImageFile.name}`
        );

        const response = await fetch("/api/users/profile-picture", {
          method: "POST",
          body: uploadFormData,
        });

        const result = await response.json();

        if (result.success) {
          profileImageUrl = result.url;
        } else {
          throw new Error(result.error);
        }
      }

      const updateResponse = await fetch(`/api/users/${clerkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          weight_unit: weightUnit,
          height: formData.height ? parseFloat(formData.height) : null,
          height_unit: heightUnit,
          sleep_time: formData.averageSleepTime
            ? parseFloat(formData.averageSleepTime)
            : null,
          birth_date: formData.dateOfBirth,
          biological_sex: formData.biologicalSex,
          country: selectedCountry?.name.common || null,
          gender: selectedGender,
          profile_picture_url: profileImageUrl ?? null,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      console.log("Profile saved successfully");

      setIsSaving(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving profile:", error);
      setIsSaving(false);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleCloseModal = () => {
    router.push("/dashboard/questionnaire");
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <section className="w-full h-screen flex items-center justify-center pt-24 profile-layout layout">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#290D55] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#290D55] text-xl">Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="w-full h-full flex flex-col items-center justify-center pt-24 profile-layout layout">
        <div className="grid grid-cols-[1fr_auto] gap-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-56 h-56 rounded-3xl bg-[#D9D9D9] overflow-hidden">
              {formData.profileImageUrl ? (
                <img
                  src={formData.profileImageUrl}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              ) : profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src="/images/illustrations/profile-picture-placeholder.png"
                  alt="Profile Picture Placeholder"
                  width={224}
                  height={224}
                />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#57407b] hover:bg-[#3e2e58] transition-all duration-300 ease-in-out rounded-3xl py-3 px-4 text-white text-2xl"
            >
              {profileImagePreview ? "Change picture" : "Add your picture here"}
            </button>
          </div>
          <div className="min-w-xl flex flex-col gap-6">
            <div className="grid grid-cols-[1fr_auto] justify-center gap-4">
              <div className="bg-[rgba(217,217,217,0.63)] grid grid-cols-2 rounded-2xl py-3 px-4 gap-2">
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="text-[#290D55] text-2xl w-full text-center bg-transparent outline-none placeholder:text-[#290D55] placeholder:opacity-70"
                />
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="text-[#290D55] text-2xl w-full text-center bg-transparent outline-none placeholder:text-[#290D55] placeholder:opacity-70"
                />
              </div>
              <SignOutButton>
                <button
                  type="button"
                  className="px-8 py-3 bg-[#f45f5f] hover:bg-red-500 text-white rounded-2xl"
                >
                  Sign Out
                </button>
              </SignOutButton>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-2 gap-3"
            >
              <div className="col-span-2 grid grid-cols-3 gap-4">
                <fieldset className="flex flex-col items-start justify-center gap-3">
                  <div className="w-full flex items-center justify-between">
                    <label htmlFor="weight" className="text-[#290D55] text-2xl">
                      Weight ({weightUnit.toUpperCase()})
                    </label>
                    <button
                      type="button"
                      onClick={handleWeightUnitToggle}
                      className="text-[#290D55] hover:text-[#3e2e58] text-sm font-semibold transition-colors"
                    >
                      Convert to {weightUnit === "kg" ? "LB" : "KG"}
                    </button>
                  </div>
                  <input
                    type="number"
                    id="weight"
                    min={0}
                    step="0.1"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="bg-[rgba(217,217,217,0.63)] rounded-2xl w-full py-3 px-4 outline-none text-[#290D55]"
                  />
                </fieldset>
                <fieldset className="flex flex-col items-start justify-center gap-3">
                  <div className="w-full flex items-center justify-between">
                    <label htmlFor="height" className="text-[#290D55] text-2xl">
                      Height ({heightUnit.toUpperCase()})
                    </label>
                    <button
                      type="button"
                      onClick={handleHeightUnitToggle}
                      className="text-[#290D55] hover:text-[#3e2e58] text-sm font-semibold transition-colors"
                    >
                      Convert to {heightUnit === "cm" ? "FT" : "CM"}
                    </button>
                  </div>
                  <input
                    type="number"
                    id="height"
                    min={0}
                    step="0.1"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="bg-[rgba(217,217,217,0.63)] rounded-2xl w-full py-3 px-4 outline-none text-[#290D55]"
                  />
                </fieldset>
                <fieldset className="flex flex-col items-start justify-center gap-3">
                  <label
                    htmlFor="averageSleepTime"
                    className="text-[#290D55] text-2xl text-center"
                  >
                    Average Sleep Time
                  </label>
                  <input
                    type="number"
                    id="averageSleepTime"
                    min={0}
                    max={24}
                    step="0.5"
                    value={formData.averageSleepTime}
                    onChange={handleInputChange}
                    className="bg-[rgba(217,217,217,0.63)] rounded-2xl w-full py-3 px-4 outline-none text-[#290D55]"
                  />
                </fieldset>
              </div>
              <fieldset className="flex flex-col items-start justify-center gap-3">
                <label
                  htmlFor="dateOfBirth"
                  className="text-[#290D55] text-2xl text-center"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  lang="en-GB"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="bg-[rgba(217,217,217,0.63)] rounded-2xl w-full py-3 px-4 outline-none text-[#290D55]"
                />
              </fieldset>
              <fieldset className="flex flex-col items-start justify-center gap-3">
                <h5 className="text-[#290D55] text-2xl text-center">
                  Biological Sex
                </h5>
                <div className="bg-[rgba(217,217,217,0.63)] flex gap-3 rounded-2xl w-full py-3 px-4 outline-none text-[#290D55]">
                  <label
                    htmlFor="male"
                    className="inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Male
                    <input
                      type="radio"
                      id="male"
                      name="biologicalSex"
                      checked={formData.biologicalSex === "Male"}
                      onChange={handleInputChange}
                      className="cursor-pointer"
                    />
                  </label>
                  <label
                    htmlFor="female"
                    className="inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Female
                    <input
                      type="radio"
                      id="female"
                      name="biologicalSex"
                      checked={formData.biologicalSex === "Female"}
                      onChange={handleInputChange}
                      className="cursor-pointer"
                    />
                  </label>
                </div>
              </fieldset>
              <fieldset className="flex flex-col relative items-start justify-center gap-3">
                <label
                  htmlFor="country"
                  className="text-[#290D55] text-2xl text-center"
                >
                  Country of Origin
                </label>
                <button
                  id="country"
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="bg-[rgba(217,217,217,0.63)] rounded-2xl w-full flex items-center justify-between py-3 px-4 outline-none text-[#290D55]"
                >
                  <div className="flex items-center gap-2">
                    {selectedCountry && (
                      <div className="w-9 h-6 rounded-sm flex-shrink-0">
                        <img
                          src={selectedCountry.flags.svg}
                          alt={selectedCountry.flags.alt}
                          className="w-full h-full rounded-sm object-cover"
                        />
                      </div>
                    )}
                    {selectedCountry ? selectedCountry.name.common : ""}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`cursor-pointer transition-transform duration-300 flex-shrink-0 ${
                      showCountryDropdown ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path
                      d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
                      stroke="#290D55"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {showCountryDropdown && (
                  <div
                    className="w-full h-[120px] overflow-hidden p-2 rounded-2xl bg-[rgba(217,217,217,0.63)] absolute top-[98px] z-20"
                    onKeyDown={handleCountryKeyDown}
                  >
                    <input
                      ref={countrySearchRef}
                      type="text"
                      placeholder="Search country..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleCountryKeyDown}
                      className="w-full px-4 py-2 mb-2 rounded-xl outline-none text-[#290D55] bg-[#e0e0e0]"
                    />
                    <ul
                      ref={countryListRef}
                      className="w-[98%] h-[calc(100%-48px)] overflow-y-auto scroll-bar flex flex-col gap-2"
                    >
                      {filteredCountries.map((country, index) => (
                        <li
                          key={index}
                          onClick={() => handleCountrySelect(country)}
                          className={`w-[98%] px-4 py-3 flex items-center justify-start gap-2 bg-white-300 rounded-xl transition-all duration-200 ease-in-out hover:bg-[#290D55] hover:text-[#e0e0e0] cursor-pointer ${
                            index === highlightedCountryIndex
                              ? "bg-[#290D55] text-[#e0e0e0]"
                              : ""
                          }`}
                        >
                          <div className="w-10 h-6 rounded-sm">
                            <img
                              src={country.flags.svg}
                              alt={country.flags.alt}
                              className="w-full h-full rounded-sm object-cover"
                            />
                          </div>
                          <span className="truncate w-full">
                            {country.name.common}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </fieldset>
              <fieldset className="flex flex-col items-start justify-center gap-3 relative">
                <label
                  htmlFor="gender"
                  className="text-[#290D55] text-2xl text-center"
                >
                  Gender
                </label>
                <button
                  id="gender"
                  type="button"
                  onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                  onKeyDown={
                    showGenderDropdown ? handleGenderKeyDown : undefined
                  }
                  className="bg-[rgba(217,217,217,0.63)] rounded-2xl w-full flex items-center justify-between py-3 px-4 outline-none text-[#290D55]"
                >
                  <div className="flex items-center gap-2">
                    {selectedGender ?? ""}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`cursor-pointer transition-transform duration-300 flex-shrink-0 ${
                      showGenderDropdown ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path
                      d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
                      stroke="#290D55"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {showGenderDropdown && (
                  <div className="w-full h-[120px] overflow-hidden p-2 rounded-2xl bg-[rgba(217,217,217,0.63)] absolute top-[98px] z-20">
                    <ul
                      ref={genderListRef}
                      className="w-[98%] h-full overflow-y-auto scroll-bar flex flex-col gap-1"
                    >
                      {genders.map((gender, index) => (
                        <li
                          key={index}
                          onClick={() => handleGenderSelect(gender)}
                          className={`w-[98%] px-4 py-3 flex items-center justify-start gap-2 bg-white-300 rounded-xl transition-all duration-200 ease-in-out hover:bg-[#290D55] hover:text-[#e0e0e0] cursor-pointer ${
                            index === highlightedGenderIndex
                              ? "bg-[#290D55] text-[#e0e0e0]"
                              : ""
                          }`}
                        >
                          <span className="truncate w-full">{gender}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </fieldset>
              <div className="col-span-2 w-full flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="min-w-48 bg-[#57407b] hover:bg-[#3e2e58] transition-all duration-300 ease-in-out rounded-3xl py-3 px-4 text-white text-2xl"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[#ffffff53] flex items-center justify-center z-50 p-4">
          <div className="bg-[#8A79A6] border border-[#4D2092] rounded-3xl p-8 max-w-xl w-full shadow-2xl transform transition-all flex flex-col gap-6">
            <div className="flex items-center justify-center gap-6">
              <div className="w-28 h-28 flex items-center justify-center">
                <Image
                  src="/images/icons/rocket.png"
                  alt="Rocket"
                  width={256}
                  height={256}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-[rgba(41,13,85,0.69)] text-center">
                  Profile Saved Successfully!
                </h2>
                <p className="text-[rgba(41,13,85,0.69)] text-center text-lg">
                  You have successfully saved your profile. <br />
                  Now let's do a questionnaire.
                </p>
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-[#A1A1C1] hover:bg-[#b4b4d3] transition-all duration-300 ease-in-out rounded-2xl py-2 px-6 text-black text-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
