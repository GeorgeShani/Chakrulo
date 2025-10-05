import type { Country } from "@/types/country";

export async function getCountries(): Promise<Country[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags"
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch countries: ${res.status}`);
  }

  const countries: Country[] = await res.json();
  return countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
}
