import { EXPO_PUBLIC_COUNTRY_API } from "@/config";
import { useEffect, useState } from "react";

const useAllCountries = () => {
  const [countries, setCountries] = useState<
    { name: string; codeNumber: string; flag: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(EXPO_PUBLIC_COUNTRY_API);
        const data = await response.json();

        const formattedCountries = data
          .map((country: any) => ({
            name: country.name.common,
            codeNumber: country.idd?.root
              ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
              : "N/A",
            flag: country.flags?.svg || "",
          }))
          .filter((country: { codeNumber: string }) => country.codeNumber !== "N/A");

        const uniqueCountries = formattedCountries.reduce((acc: any, current: { codeNumber: string }) => {
          if (!acc.some((item: { codeNumber: string }) => item.codeNumber === current.codeNumber)) {
            acc.push(current);
          }
          return acc;
        }, [] as typeof formattedCountries);

        setCountries(uniqueCountries);
      } catch (err) {
        console.log(err)
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};

export default useAllCountries;