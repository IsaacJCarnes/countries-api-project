const lightModeIcon = document.getElementById("light-mode-icon");
const lightModeButton = document.getElementById("light-mode-button");
//Filter
const filterSearchInput = document.getElementById("filter-search");
const filterRegionInput = document.getElementById("filter-region");
//List
const countryList = document.getElementById("country-list");
//Details
const detailsModal = document.querySelector<HTMLDetailsElement>("details");
const detailsBackButton = document.getElementById("details-back");
const detailsImage = document.querySelector<HTMLImageElement>("#details-image");
const detailsName = document.getElementById("details-name");
const detailsNative = document.getElementById("details-native");
const detailsPopulation = document.getElementById("details-population");
const detailsRegion = document.getElementById("details-region");
const detailsSubregion = document.getElementById("details-subregion");
const detailsCapital = document.getElementById("details-capital");
const detailsTlds = document.getElementById("details-tlds");
const detailsCurrencies = document.getElementById("details-currencies");
const detailsLanguages = document.getElementById("details-languages");
const detailsBorders = document.getElementById("details-borders");

type country = {
  index: number;
  name: string;
  nativeName: string;
  population: number;
  region: string;
  subregion: string;
  capital: string;
  tlds: string;
  currencies: string[];
  languages: string[];
  borders: string[];
  code: string;
  flagUrl: string;
};
let countryArray: country[] = [];

//Toggle light/dark mode on button click
validateListener(lightModeButton, "click", () => {
  lightModeIcon?.classList.toggle("fa-regular");
  document.body.classList.toggle("dark-mode");
});
//Toggle details page on back button click
validateListener(detailsBackButton, "click", () => {
  if (detailsModal) {
    detailsModal.open = !detailsModal.open;
  }
});
validateListener(detailsBorders, "click", (e) => {
  if (e.target instanceof HTMLElement) {
    if (e.target.tagName !== "BUTTON") return;
    populateDetailsPage(Number(e.target.dataset.index));
  }
});

async function onStartup() {
  lightModeIcon?.classList.toggle("fa-regular");
  document.body.classList.toggle("dark-mode");

  //Attempt to get/reduce country array from country API
  const countryData = await getCountryData();
  if (countryData?.data?.objects)
    countryArray = reduceCountryArray(countryData.data.objects);
  //If country array is still empty (failure result), assign country array to fallback data
  if (countryArray.length === 0) {
    console.error("Could not recieve API data, using fallback data");
    // @ts-expect-error fallback-data.js does not provide TypeScript declarations.
    const importedArray: Array = await import("../assets/fallback-data.js");
    countryArray = importedArray['default'];
  }
  //Add index to country array for later lookups
  countryArray.forEach((country, index) => (country.index = index));

  populateDetailsPage(1);
  if (detailsModal) {
    detailsModal.open = true;
  }
}

onStartup();

function populateDetailsPage(index: number) {
  const country = countryArray[index];
  if (!country) {
    throw new Error("Requested index outside array bounds");
  }

  if (detailsImage) detailsImage.src = country.flagUrl;
  if (detailsName) detailsName.textContent = country.name;
  if (detailsNative) detailsNative.textContent = country.nativeName;
  if (detailsPopulation)
    detailsPopulation.textContent = country.population.toLocaleString("en-US");
  if (detailsRegion) detailsRegion.textContent = country.region;
  if (detailsSubregion) detailsSubregion.textContent = country.subregion;
  if (detailsCapital) detailsCapital.textContent = country.capital;
  if (detailsTlds) detailsTlds.textContent = country.tlds;
  if (detailsCurrencies)
    detailsCurrencies.textContent = prettifyArray(country.currencies);
  if (detailsLanguages)
    detailsLanguages.textContent = prettifyArray(country.languages);
  const borderCountries = countryArray.filter((borderCountry) =>
    country.borders.includes(borderCountry.code),
  );
  if (detailsBorders) {
    detailsBorders.textContent = "";
    borderCountries.forEach((borderCountry) => {
      let borderButton = document.createElement("button");
      borderButton.classList.add("basicButton");
      borderButton.dataset.index = "" + borderCountry.index;
      borderButton.textContent = borderCountry.name;
      detailsBorders.appendChild(borderButton);
    });
  }
}

function reduceCountryArray(inputArray: Array<any>): country[] {
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

async function getCountryData() {
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

//validateListener ensures the target HTMLElement exists before adding the event listener
type eventTrigger = "click"; //| "input"
function validateListener(
  target: HTMLElement | null,
  eventType: eventTrigger,
  callback: (e: Event) => void,
) {
  if (target) {
    target.addEventListener(eventType, callback);
  }
}

//Turns an array into a comma and space seperated string
function prettifyArray(array: Array<any>): string {
  return array.reduce((prevVal, curVal, currentIndex) =>
    currentIndex == 0 ? curVal : prevVal + ", " + curVal,
  );
}
