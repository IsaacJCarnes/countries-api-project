import { type Country } from "../models/Country.js";
export async function getCountryData() {
  try {
    //Attempt to get/reduce country array from country API
    let countryArray:Array<Object> = [];
    const countryData1 = await fetchCountryData(100, 0);
    if (countryData1?.data?.objects)
      countryArray = countryArray.concat(countryData1.data.objects)
    const countryData2 = await fetchCountryData(100, 100);
    if (countryData2?.data?.objects)
      countryArray = countryArray.concat(countryData2.data.objects)
    const countryData3 = await fetchCountryData(100, 200);
    if (countryData3?.data?.objects)
      countryArray = countryArray.concat(countryData3.data.objects)    
    return reduceCountryArray(countryArray);
  } catch (e){
    console.error(e);
    // @ts-expect-error fallback-data.js does not provide TypeScript declarations.
    const importedArray = await import("../../assets/fallback-data.js");
    return importedArray["default"];
  }
}

async function fetchCountryData(limit: number, offset: number) {
  try {
    const response = await fetch(
      `https://countries-api-project.isaacjdeveloper.workers.dev/countries/v5?limit=${limit}&offset=${offset}`,
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
  } catch {
    throw new Error("Could not recieve API data, using fallback data");
  }
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
