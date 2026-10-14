import { type Country } from "../models/Country.js";
export async function getCountryData() {
  //Attempt to get/reduce country array from country API
  const countryData = await fetchCountryData();
  if (countryData?.data?.objects)
    return reduceCountryArray(countryData.data.objects);

  console.error("Could not recieve API data, using fallback data");
  // @ts-expect-error fallback-data.js does not provide TypeScript declarations.
  const importedArray = await import("../../assets/fallback-data.js");
  return importedArray["default"];
}

async function fetchCountryData() {
  const response = await fetch(
    "https://countries-api-project.isaacjdeveloper.workers.dev/countries/v5?limit=100&offset=200",
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error("Could not get API data");
  }
  const jsonResponse = await response.json();
  return jsonResponse;
}

function reduceCountryArray(inputArray: Array<any>): Country[] {
  return inputArray.map((country: any) => {
    //Native Name
    const nativeNames = country["names"]?.["native"] ?? {};
    const firstNativeKey = Object.keys(nativeNames)[0];
    const nativeNameType = firstNativeKey
      ? (nativeNames[firstNativeKey] as Record<string, string> | undefined)
      : undefined;
    const firstTypeKey = nativeNameType ? Object.keys(nativeNameType)[0] : "";
    const nativeName =
      nativeNameType && firstTypeKey
        ? (nativeNameType[firstTypeKey] ?? "")
        : "";
    //Country Capital
    const capital: string = country["capitals"][0]?.name;
    //Country Currencies
    const currencies = country["currencies"].map(
      (currency: Record<string, string>) => currency?.name,
    );
    //Country Languages
    const languages = country["languages"].map(
      (language: Record<string, string>) => language?.name,
    );
    return {
      index: country["index"],
      name: country["names"]["common"],
      nativeName: nativeName,
      population: country["population"],
      region: country["region"],
      subregion: country["subregion"],
      capital: capital,
      tlds: country["tlds"],
      currencies: currencies,
      languages: languages,
      borders: country["borders"],
      code: country["codes"]["alpha_3"],
      flagUrl: country["flag"]["url_svg"],
    };
  });
}
